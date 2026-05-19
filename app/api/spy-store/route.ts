import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adCountToSaturation } from "@/lib/facebook-ads";
import { incrementUsage } from "@/lib/usage";
import { detectTheme, detectApps, fetchBestSellers, fetchTraffic, fetchSimilarSites, type ThemeInfo } from "@/lib/shopify-intel";
import { findSupplier, computeOpportunityScore, type AliSupplier } from "@/lib/aliexpress";

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

  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: "URL manquante" }, { status: 400 });

  const baseUrl = normalizeShopifyUrl(url);

  // 1. Produits publics
  let products: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/products.json?limit=250`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    products = data.products ?? [];
  } catch {
    return NextResponse.json(
      { error: "Impossible d'accéder à cette boutique. Vérifie que l'URL est correcte et que c'est bien une boutique Shopify." },
      { status: 422 }
    );
  }

  if (products.length === 0) {
    return NextResponse.json({ error: "Aucun produit trouvé sur cette boutique." }, { status: 422 });
  }

  // 2. Stats produits
  const prices = products.map(p => parseFloat(p.variants?.[0]?.price ?? "0")).filter(p => p > 0);
  const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const isInternalTag = (t: string) =>
    t.startsWith("__") || t.includes(":") || t.startsWith("_") || t.length > 60;

  const allTags = products.flatMap(p =>
    parseTags(p.tags ?? "").map(t => t.toLowerCase()).filter(t => !isInternalTag(t))
  );
  const tagCount: Record<string, number> = {};
  allTags.forEach(t => { tagCount[t] = (tagCount[t] ?? 0) + 1; });
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

  const productTypes = [...new Set(products.map(p => p.product_type).filter(Boolean))].slice(0, 5);
  const topProducts = products.slice(0, 6);

  // 3. Analyse HTML + fournisseurs AliExpress — en parallèle
  const aliKeywords = topProducts.map(p => buildAdKeyword(p));
  const [htmlResult, bestSellersRaw, trafficData, similarSites, supplierResults] = await Promise.all([
    // Fetch homepage pour thème et apps
    (async (): Promise<{ theme: ThemeInfo | null; apps: string[] }> => {
      try {
        const res = await fetch(baseUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return { theme: null, apps: [] };
        const html = await res.text();
        return { theme: detectTheme(html), apps: detectApps(html) };
      } catch {
        return { theme: null, apps: [] };
      }
    })(),
    fetchBestSellers(baseUrl),
    fetchTraffic(baseUrl.replace(/^https?:\/\//, "")),
    fetchSimilarSites(baseUrl.replace(/^https?:\/\//, "")),
    // AliExpress suppliers for each top product (parallel, non-blocking)
    Promise.all(aliKeywords.map(kw => findSupplier(kw))),
  ]);

  const { theme, apps } = htmlResult;

  // Best sellers : si trouvés via collection, sinon premiers produits
  const bestSellersData = bestSellersRaw.length > 0 ? bestSellersRaw : products.slice(0, 6);
  const bestSellers = bestSellersData.slice(0, 6).map(p => ({
    id: p.id,
    title: p.title,
    price: parseFloat(p.variants?.[0]?.price ?? "0"),
    image: p.images?.[0]?.src ?? null,
    handle: p.handle,
    productType: p.product_type ?? "",
    tags: parseTags(p.tags ?? "").slice(0, 3),
    fromCollection: bestSellersRaw.length > 0,
  }));

  // 4. Saturation niche (FB désactivé → 0) + score d'opportunité AliExpress
  const suppliers = supplierResults as (AliSupplier | null)[];
  const topProductsWithAds = topProducts.map((p, i) => {
    const keyword = buildAdKeyword(p);
    const price = parseFloat(p.variants?.[0]?.price ?? "0");
    const image = p.images?.[0]?.src ?? null;
    const variantCount = p.variants?.length ?? 1;
    const supplier = suppliers[i] ?? null;

    const opportunityScore = computeOpportunityScore(
      price,
      supplier,
      variantCount,
      Boolean(p.product_type?.trim()),
    );

    // Compute margin if supplier found
    const margin = supplier && price > 0 && supplier.price > 0
      ? Math.round((price - supplier.price) / price * 100)
      : null;

    return {
      id: p.id,
      title: p.title,
      price,
      image,
      adCount: null,
      saturation_score: null,
      adKeyword: keyword,
      handle: p.handle,
      productType: p.product_type,
      tags: parseTags(p.tags ?? "").slice(0, 3),
      opportunityScore,
      supplier: supplier ? {
        price: supplier.price,
        salesInt: supplier.salesInt,
        rating: supplier.rating,
        itemUrl: supplier.itemUrl,
        margin,
      } : null,
    };
  });

  const nicheKeyword = topTags[0] ?? productTypes[0] ?? "";
  const nicheSaturation = adCountToSaturation(0);
  const nicheAdCount = 0;

  // 5. Analyse IA enrichie
  let aiAnalysis = null;
  if (process.env.OPENAI_API_KEY) {
    try {
      const productSummary = topProducts.slice(0, 8).map(p =>
        `- ${p.title} | Type: ${p.product_type || "N/A"} | Prix: ${p.variants?.[0]?.price}€`
      ).join("\n");

      const bestSellersSummary = bestSellers.length > 0
        ? `\nBEST SELLERS (${bestSellersRaw.length > 0 ? "collection officielle" : "premiers produits"}) :\n` +
          bestSellers.map(p => `- ${p.title} | ${p.price}€`).join("\n")
        : "";

      const techSummary = [
        theme ? `Thème Shopify : ${theme.displayName}${theme.category === "premium" ? " (premium)" : theme.category === "free" ? " (gratuit)" : " (sur mesure)"}` : "",
        apps.length > 0 ? `Apps détectées : ${apps.join(", ")}` : "Aucune app détectée",
        trafficData?.monthlyVisits ? `Trafic mensuel estimé : ${trafficData.monthlyVisits.toLocaleString("fr")} visites` : "",
        trafficData?.globalRank ? `Classement mondial : #${trafficData.globalRank.toLocaleString("fr")}` : "",
        trafficData?.topCountries?.length
          ? `Top pays : ${trafficData.topCountries.map(c => `${c.country} ${c.share}%`).join(", ")}`
          : "",
        trafficData?.trafficSources
          ? `Sources trafic — Direct: ${trafficData.trafficSources.direct}% | Search: ${trafficData.trafficSources.search}% | Social: ${trafficData.trafficSources.social}% | Paid: ${trafficData.trafficSources.paid}%`
          : "",
      ].filter(Boolean).join("\n");

      const prompt = `Tu es un expert en e-commerce dropshipping francophone. Analyse cette boutique Shopify avec des données réelles.

DONNÉES DE LA BOUTIQUE
URL : ${baseUrl}
Nombre de produits : ${products.length}
Types de produits : ${productTypes.join(", ") || "non renseignés"}
Prix moyen : ${avgPrice.toFixed(2)}€ | min: ${minPrice}€ | max: ${maxPrice}€
Tags principaux : ${topTags.join(", ")}

STACK TECHNIQUE :
${techSummary || "Non disponible"}

TOP PRODUITS :
${productSummary}
${bestSellersSummary}

GRILLE DE SCORING (score_boutique) :
- 0-30 : Niche très saturée ou boutique peu viable
- 31-55 : Opportunités ciblées, positionnement différencié nécessaire
- 56-75 : Bonne opportunité, marché accessible
- 76-100 : Niche peu exploitée, fort potentiel

Base ton score sur : la cohérence du catalogue, la gamme de prix (marges dropshipping), le potentiel de différenciation, et le niveau de sophistication de la stack tech (apps = budget marketing = boutique sérieuse).

Réponds UNIQUEMENT en JSON valide :
{
  "niche_principale": "la niche principale",
  "positionnement": "positionnement marché en 1 phrase",
  "points_forts": ["point fort 1", "point fort 2", "point fort 3"],
  "opportunites": ["opportunité actionnable 1", "opportunité actionnable 2"],
  "produit_a_surveiller": "titre exact du produit le plus intéressant",
  "conseil_principal": "conseil concret et actionnable en 2 phrases maximum",
  "score_boutique": <nombre entre 0 et 100>
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

  if (user) {
    await incrementUsage(user.id, "spy_scans");
    // Save to scan history (fire and forget)
    supabase.from("scan_history").insert({
      user_id: user.id,
      url: baseUrl,
      product_count: products.length,
      avg_price: Math.round(avgPrice * 100) / 100,
      niche: aiAnalysis?.niche_principale ?? null,
      score: aiAnalysis?.score_boutique ?? null,
      theme_name: theme?.displayName ?? null,
      theme_category: theme?.category ?? null,
    }).then(() => {});
  }

  const payload = {
    url: baseUrl,
    productCount: products.length,
    avgPrice: Math.round(avgPrice * 100) / 100,
    minPrice,
    maxPrice,
    topTags,
    nicheSaturation,
    nicheAdCount,
    topProducts: topProductsWithAds,
    bestSellers,
    bestSellersFromCollection: bestSellersRaw.length > 0,
    theme,
    detectedApps: apps,
    traffic: trafficData,
    similarSites,
    aiAnalysis,
  };

  return NextResponse.json(payload);
}
