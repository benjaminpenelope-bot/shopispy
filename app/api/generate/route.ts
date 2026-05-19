import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";


const SYSTEM_PROMPT = `Tu es un expert en e-commerce et copywriting francophone spécialisé Shopify.
Génère une fiche produit complète et optimisée en JSON strict sans commentaires.
Réponds UNIQUEMENT avec du JSON valide, aucun texte avant ou après.`;

function buildUserPrompt(product: Product): string {
  return `
Produit : ${product.title}
Niche : ${product.niche}
Prix actuel : ${product.price}€
Tags : ${product.tags.join(", ")}
Score tendance : ${product.trend_score}/100
Score saturation : ${product.saturation_score}/100

Génère le JSON suivant :
{
  "hook": "accroche percutante (<12 mots)",
  "title": "titre produit optimisé SEO et conversion",
  "description": "description produit engageante 150-200 mots",
  "bullet_points": ["bénéfice 1", "bénéfice 2", "bénéfice 3", "bénéfice 4", "bénéfice 5"],
  "target_audience": "description précise de la cible client",
  "ad_angle": "angle publicitaire principal pour TikTok/Meta Ads",
  "seo_keywords": ["kw1", "kw2", "kw3", "kw4", "kw5", "kw6", "kw7", "kw8", "kw9", "kw10"],
  "suggested_price": <nombre décimal>,
  "suggested_price_rationale": "justification du prix suggéré en 1 phrase"
}`;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { product } = (await request.json()) as { product: Product };

  if (!process.env.OPENAI_API_KEY) {
    // Mode démo sans clé API
    const demo = {
      hook: "La lampe qui transforme ta chambre en coucher de soleil.",
      title: `${product.title} — Ambiance Cinématique pour Ta Chambre`,
      description: `Transforme ton espace en quelques secondes avec la ${product.title}. Conçue pour les passionnés d'ambiance et de bien-être, cette lampe projette des dégradés chauds qui imitent parfaitement un coucher de soleil. Idéale pour les sessions photo, les soirées détente ou simplement pour changer d'atmosphère sans effort. Compatible avec toutes les prises standard, livraison rapide. Offre-toi ou offre un vrai changement de décor.`,
      bullet_points: [
        "✦ Crée une ambiance coucher de soleil en 3 secondes",
        "✦ 16 modes de couleur réglables via télécommande",
        "✦ Rotation 360° pour une projection optimale",
        "✦ Compatible chambre, salon, bureau",
        "✦ Idéal cadeau : packaging premium inclus",
      ],
      target_audience:
        "Femmes et hommes 18-34 ans, amateurs de déco tendance, actifs sur TikTok et Instagram, budget moyen 20-50€.",
      ad_angle:
        "POV : tu arrives chez toi après une longue journée et ta chambre te ressemble enfin. [avant/après avec musique lo-fi]",
      seo_keywords: [
        "lampe sunset",
        "lampe led chambre",
        "lampe coucher de soleil",
        "déco chambre tendance",
        "lampe ambiance",
        "projecteur led",
        "lampe tiktok",
        "idée déco chambre",
        "cadeau original femme",
        "lampe esthétique",
      ],
      suggested_price: 39.9,
      suggested_price_rationale:
        "Prix positionné 14% au-dessus du marché pour signaler la qualité perçue tout en restant sous le seuil psychologique de 40€.",
    };
    return NextResponse.json(demo);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(product) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(content);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Generate error:", msg);
    return NextResponse.json(
      { error: `Erreur de génération : ${msg}` },
      { status: 500 }
    );
  }
}
