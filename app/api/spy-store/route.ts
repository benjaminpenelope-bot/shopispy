import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { countFacebookAds, adCountToSaturation } from "@/lib/facebook-ads";
import { incrementUsage } from "@/lib/usage";

function parseTags(tags: string | string[]): string[] {
  if (Array.isArray(tags)) return tags.map(t => t.trim()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map(t => t.trim()).filter(Boolean);
  return [];
}

function normalizeShopifyUrl(input: string): string {
  let url = input.trim().toLowerCase();
  if (!url.startsWith("http")) url = "https://" + url;
  try {
    const u = new URL(url);
    return u.origin;
  } catch {
    return url;
  }
}

// Construit un keyword pertinent pour la recherche Facebook Ads
function buildAdKeyword(product: any): string {
  if (product.product_type?.trim()) return product.product_type.trim();
  const tags = parseTags(product.tags ?? "");
  if (tags.length > 0) return tags[0];
  return product.title.split(" ").slice(0, 3).join(" ");
}

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Auth optionnelle — scan public autorisé, quota tracké si connecté

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

  const allTags = products.flatMap(p => parseTags(p.tags ?? "").map(t => t.toLowerCase()));
  const tagCount: Record<string, number> = {};
  allTags.forEach(t => { tagCount[t] = (tagCount[t] ?? 0) + 1; });
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

  // Types produits détectés
  const productTypes = [...new Set(products.map(p => p.product_type).filter(Boolean))].slice(0, 5);

  const topProducts = products.slice(0, 6);

  // 3. Facebook Ads sur les 3 premiers produits avec keyword pertinent
  const topProductsWithAds = await Promise.all(
    topProducts.map(async (p, i) => {
      const keyword = buildAdKeyword(p);
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
        adKeyword: i < 3 ? keyword : null,
        handle: p.handle,
        productType: p.product_type,
        tags: parseTags(p.tags ?? "").slice(0, 3),
      };
    })
  );

  // Score de saturation global basé sur la niche principale
  const nicheKeyword = topTags[0] ?? productTypes[0] ?? "";
  const nicheAdCount = nicheKeyword ? await Promise.race([
    countFacebookAds(nicheKeyword),
    new Promise<number>(res => setTimeout(() => res(0), 5000)),
  ]) : 0;
  const nicheSaturation = adCountToSaturation(nicheAdCount as number);

  // 4. Analyse IA avec données enrichies
  let aiAnalysis = null;
  if (process.env.OPENAI_API_KEY) {
    try {
      const productSummary = topProducts.slice(0, 8).map(p => {
        const keyword = buildAdKeyword(p);
        return `- ${p.title} | Type: ${p.product_type || "N/A"} | Prix: ${p.variants?.[0]?.price}€`;
      }).join("\n");

      const adData = topProductsWithAds.slice(0, 3).map(p =>
        `- "${p.adKeyword}": ${p.adCount} annonces FB actives → saturation ${p.saturation_score}/100`
      ).join("\n");

      const prompt = `Tu es un expert en e-commerce dropshipping francophone. Analyse cette boutique Shopify avec des données réelles.

DONNÉES DE LA BOUTIQUE
URL : ${baseUrl}
Nombre de produits : ${products.length}
Types de produits : ${productTypes.join(", ") || "non renseignés"}
Prix moyen : ${avgPrice.toFixed(2)}€ | min: ${minPrice}€ | max: ${maxPrice}€
Tags principaux : ${topTags.join(", ")}
Saturation de la niche "${nicheKeyword}" : ${nicheSaturation}/100 (basé sur ${nicheAdCount} annonces FB actives en France)

TOP PRODUITS :
${productSummary}

SATURATION PAR PRODUIT (annonces Facebook Ads actives en France) :
${adData}

GRILLE DE SCORING (score_boutique) :
- 0-30 : Niche très saturée ou boutique peu viable pour le dropshipping
- 31-55 : Opportunités ciblées, positionnement différencié nécessaire
- 56-75 : Bonne opportunité, marché accessible avec la bonne approche
- 76-100 : Niche peu exploitée, fort potentiel de croissance

Base ton score sur : la saturation réelle de la niche (donnée ci-dessus), la cohérence du catalogue, la gamme de prix (marges dropshipping possibles), et le potentiel de différenciation.

Réponds UNIQUEMENT en JSON valide :
{
  "niche_principale": "la niche principale de cette boutique",
  "positionnement": "positionnement marché en 1 phrase",
  "points_forts": ["point fort 1", "point fort 2", "point fort 3"],
  "opportunites": ["opportunité actionnable 1", "opportunité actionnable 2"],
  "produit_a_surveiller": "titre exact du produit le plus intéressant",
  "conseil_principal": "conseil concret et actionnable en 2 phrases maximum",
  "score_boutique": <nombre entre 0 et 100 selon la grille ci-dessus>
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
          temperature: 0.4,
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

  // Incrémenter quota si connecté
  if (user) await incrementUsage(user.id, "spy_scans");

  return NextResponse.json({
    url: baseUrl,
    productCount: products.length,
    avgPrice: Math.round(avgPrice * 100) / 100,
    minPrice,
    maxPrice,
    topTags,
    nicheSaturation,
    nicheAdCount,
    topProducts: topProductsWithAds,
    aiAnalysis,
  });
}
