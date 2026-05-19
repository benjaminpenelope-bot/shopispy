export async function countFacebookAds(_keyword: string, _country = "FR"): Promise<number> {
  return 0;
}

// Convertit le nombre de pubs en score de saturation (0-100)
// 0 pubs = 0 (niche vierge), 500+ pubs = 100 (saturé)
export function adCountToSaturation(adCount: number): number {
  if (adCount === 0) return 5;
  const raw = Math.min(100, Math.log10(adCount + 1) / Math.log10(500) * 100);
  return Math.round(raw);
}
