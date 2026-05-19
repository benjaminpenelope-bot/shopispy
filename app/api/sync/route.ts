import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { searchAliExpress } from "@/lib/aliexpress";
import { calcTrendScore, inferNiche, inferTags } from "@/lib/scoring";
import { countFacebookAds, adCountToSaturation } from "@/lib/facebook-ads";

const NICHES = [
  { query: "dog harness leash", fbQuery: "harnais chien", niche: "Animaux & chien" },
  { query: "cat collar led", fbQuery: "collier chat", niche: "Animaux & chat" },
  { query: "yoga mat fitness", fbQuery: "tapis yoga", niche: "Fitness & yoga" },
  { query: "resistance bands gym", fbQuery: "bandes résistance fitness", niche: "Fitness & yoga" },
  { query: "baby night light", fbQuery: "veilleuse bébé", niche: "Bébé & puériculture" },
  { query: "kitchen gadget cooking", fbQuery: "gadget cuisine", niche: "Cuisine & kitchen" },
  { query: "plant pot indoor", fbQuery: "pot plante intérieur", niche: "Jardin & plantes" },
  { query: "desk organizer office", fbQuery: "organisateur bureau", niche: "Bureau & productivité" },
  { query: "travel bag luggage", fbQuery: "sac voyage", niche: "Voyage & bagages" },
  { query: "makeup mirror led", fbQuery: "miroir maquillage led", niche: "Beauté & skincare" },
  { query: "phone holder wireless", fbQuery: "support téléphone", niche: "Tech & gadgets" },
  { query: "led lamp projector room", fbQuery: "lampe led projecteur chambre", niche: "Déco chambre" },
  { query: "water bottle stainless", fbQuery: "gourde inox", niche: "Lifestyle & hydratation" },
  { query: "nail art tools beauty", fbQuery: "nail art ongles", niche: "Beauté & skincare" },
  { query: "car phone mount", fbQuery: "support téléphone voiture", niche: "Tech & gadgets" },
];

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let inserted = 0;

  for (const { query, fbQuery, niche } of NICHES) {
    try {
      // 1. AliExpress → produits + volumes
      const products = await searchAliExpress(query);
      if (products.length === 0) continue;

      // 2. Facebook Ads → score saturation réel
      const adCount = await countFacebookAds(fbQuery);
      const satScore = adCountToSaturation(adCount);

      for (const p of products.slice(0, 5)) {
        if (!p.itemId || !p.title || p.price <= 0) continue;

        const trendScore = calcTrendScore(p, products);
        const tags = inferTags(p, satScore, trendScore);

        const record = {
          aliexpress_id: p.itemId,
          title: p.title.slice(0, 120),
          niche: niche || inferNiche(p.title),
          price: p.price,
          currency: "EUR",
          saturation_score: satScore,
          trend_score: trendScore,
          monthly_orders_estimate: parseInt(p.sales || "0"),
          image_url: p.image,
          store_url: p.itemUrl,
          tags,
          ad_count: adCount,
          last_synced_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("products")
          .upsert(record, { onConflict: "aliexpress_id" });

        if (!error) inserted++;
      }

      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.error(`Sync error for "${query}":`, err);
    }
  }

  return NextResponse.json({ ok: true, inserted, niches: NICHES.length });
}
