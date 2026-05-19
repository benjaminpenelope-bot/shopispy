import type { AliProduct } from "./aliexpress";

// Score de saturation : basé sur le volume de ventes moyen des concurrents
// + nombre de résultats (proxy de concurrence)
export function calcSaturationScore(products: AliProduct[]): number {
  if (products.length === 0) return 50;
  const avgSales = products.reduce((s, p) => s + parseInt(p.sales || "0"), 0) / products.length;
  // Échelle logarithmique : 0 ventes = 0, 50k ventes = 100
  const raw = Math.min(100, Math.log10(avgSales + 1) / Math.log10(50000) * 100);
  return Math.round(raw);
}

// Score de tendance : le produit principal a beaucoup de ventes ET bonne note
export function calcTrendScore(product: AliProduct, allProducts: AliProduct[]): number {
  const sales = parseInt(product.sales || "0");
  const maxSales = Math.max(...allProducts.map(p => parseInt(p.sales || "0")));
  const salesRatio = maxSales > 0 ? sales / maxSales : 0;
  const starBonus = ((product.averageStarRate - 3) / 2) * 10; // +/-10 pts selon rating
  const raw = Math.min(100, Math.max(0, salesRatio * 90 + starBonus + 10));
  return Math.round(raw);
}

// Dériver la niche depuis le titre (fallback simple)
export function inferNiche(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("dog") || t.includes("chien") || t.includes("pet") || t.includes("puppy")) return "Animaux & chien";
  if (t.includes("cat") || t.includes("chat") || t.includes("kitten")) return "Animaux & chat";
  if (t.includes("yoga") || t.includes("fitness") || t.includes("gym") || t.includes("sport")) return "Fitness & yoga";
  if (t.includes("baby") || t.includes("bébé") || t.includes("infant")) return "Bébé & puériculture";
  if (t.includes("kitchen") || t.includes("cook") || t.includes("cuisine") || t.includes("food")) return "Cuisine & kitchen";
  if (t.includes("garden") || t.includes("plant") || t.includes("jardin")) return "Jardin & plantes";
  if (t.includes("office") || t.includes("desk") || t.includes("bureau")) return "Bureau & productivité";
  if (t.includes("travel") || t.includes("bag") || t.includes("luggage") || t.includes("voyage")) return "Voyage & bagages";
  if (t.includes("beauty") || t.includes("skin") || t.includes("makeup") || t.includes("beauté")) return "Beauté & skincare";
  if (t.includes("phone") || t.includes("tech") || t.includes("gadget") || t.includes("wireless")) return "Tech & gadgets";
  if (t.includes("light") || t.includes("lamp") || t.includes("led") || t.includes("lampe")) return "Déco chambre";
  return "Lifestyle & autres";
}

// Génère des tags depuis le titre
export function inferTags(product: AliProduct, satScore: number, trendScore: number): string[] {
  const tags: string[] = [];
  if (satScore < 25) tags.push("opportunité");
  else if (satScore > 65) tags.push("saturé");
  else tags.push("compétitif");
  if (trendScore > 85) tags.push("viral TikTok");
  else if (trendScore > 70) tags.push("tendance");
  if (parseInt(product.sales || "0") > 5000) tags.push("best-seller");
  if (product.price < 20) tags.push("prix impulsif");
  if (product.averageStarRate >= 4.7) tags.push("très bien noté");
  return tags.slice(0, 3);
}
