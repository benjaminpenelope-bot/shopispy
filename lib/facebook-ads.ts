const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const HOST = "facebook-ads-library-scraper-api.p.rapidapi.com";

export async function countFacebookAds(keyword: string, country = "FR"): Promise<number> {
  try {
    const url = `https://${HOST}/search/ads?query=${encodeURIComponent(keyword)}&country=${country}&status=ACTIVE&limit=1`;
    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": HOST,
      },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data?.searchResultsCount ?? 0;
  } catch {
    return 0;
  }
}

// Convertit le nombre de pubs en score de saturation (0-100)
// 0 pubs = 0 (niche vierge), 500+ pubs = 100 (saturé)
export function adCountToSaturation(adCount: number): number {
  if (adCount === 0) return 5;
  const raw = Math.min(100, Math.log10(adCount + 1) / Math.log10(500) * 100);
  return Math.round(raw);
}
