import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { countFacebookAds, adCountToSaturation } from "@/lib/facebook-ads";

function parseTags(tags: string | string[]): string[] {
  if (Array.isArray(tags)) return tags.map(t => t.trim()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map(t => t.trim()).filter(Boolean);
  return [];
}

function normalizeShopifyUrl(input: string): string {
  let url = input.trim().toLowerCase();
  if (!url.startsWith("http")) url = "https://" + url;
  // Retire le chemin pour garder juste le domaine
  try {
    const u = new URL(url);
    return u.origin;
  } catch {
    return url;
  }
}

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: "URL manquante" }, { status: 400 });

  const baseUrl = normalizeShopifyUrl(url);

  // 1. Fetch les produits publics de la boutique
  let products: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/products.json?limit=250`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    products = data.products ?? [];
  } catch (err) {
    return NextResponse.json(
      { error: "Impossible d'accéder à cette boutique. Vérifie que l'URL est correcte et que c'est bien une boutique Shopify." },
      { status: 422 }
    );
  }

  if (products.length === 0) {
    return NextResponse.json({ error: "Aucun produit trouvé sur cette boutique." }, { status: 422 });
  }

  // 2. Analyser les produits
  const prices = products.map(p => parseFloat(p.variants?.[0]?.price ?? "0")).filter(p => p > 0);
  const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Tags les plus fréquents → niches détectées
  const allTags = products.flatMap(p => parseTags(p.tags ?? "").map(t => t.toLowerCase()));
  const tagCount: Record<string, number> = {};
  allTags.forEach(t => { tagCount[t] = (tagCount[t] ?? 0) + 1; });
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

  // Top 6 produits (les premiers = mis en avant)
  const topProducts = products.slice(0, 6);

  // 3. Facebook Ads sur les 3 premiers produits (avec timeout global de 8s)
  const topProductsWithAds = await Promise.all(
    topProducts.map(async (p, i) => {
      const keyword = p.title.split(" ").slice(0, 4).join(" ");
      const adCount = i < 3 ? await Promise.race([
        countFacebookAds(keyword),
        new Promise<number>(res => setTimeout(() => res(0), 5000)),
      ]) : 0;
      const satScore = i < 3 ? adCountToSaturation(adCount as number) : null;
      const price = parseFloat(p.variants?.[0]?.price ?? "0");
      const image = p.images?.[0]?.src ?? null;
      return {
        id: p.id,
        title: p.title,
        price,
        image,
        adCount: i < 3 ? adCount : null,
        saturation_score: satScore,
        handle: p.handle,
        productType: p.product_type,
        tags: parseTags(p.tags ?? "").slice(0, 3),
      };
    })
  );

  // 4. Analyse IA de la boutique
  let aiAnalysis = null;
  if (process.env.OPENAI_API_KEY) {
    try {
      const productSummary = topProducts.slice(0, 8).map(p =>
        `- ${p.title} (${p.variants?.[0]?.price}€)`
      ).join("\n");

      const prompt = `Tu es un expert en e-commerce dropshipping francophone.
Analyse cette boutique Shopify et donne des insights stratégiques en JSON strict.

Boutique : ${baseUrl}
Nombre de produits : ${products.length}
Prix moyen : ${avgPrice.toFixed(2)}€ (min: ${minPrice}€, max: ${maxPrice}€)
Tags principaux : ${topTags.join(", ")}
Top produits :
${productSummary}

Réponds UNIQUEMENT en JSON valide :
{
  "niche_principale": "la niche principale de cette boutique",
  "positionnement": "positionnement marché en 1 phrase",
  "points_forts": ["point fort 1", "point fort 2", "point fort 3"],
  "opportunites": ["opportunité 1", "opportunité 2"],
  "produit_a_surveiller": "titre du produit le plus intéressant à analyser",
  "conseil_principal": "conseil actionnable principal en 2 phrases",
  "score_boutique": <nombre entre 0 et 100 représentant le potentiel de la boutique>
}`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        aiAnalysis = JSON.parse(data.choices[0].message.content);
      }
    } catch {
      aiAnalysis = null;
    }
  }

  return NextResponse.json({
    url: baseUrl,
    productCount: products.length,
    avgPrice: Math.round(avgPrice * 100) / 100,
    minPrice,
    maxPrice,
    topTags,
    topProducts: topProductsWithAds,
    aiAnalysis,
  });
}
