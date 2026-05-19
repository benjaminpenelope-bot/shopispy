// ─── App signatures ────────────────────────────────────────────────────────
const APP_SIGNATURES: { name: string; pattern: RegExp }[] = [
  // Email / SMS
  { name: "Klaviyo",       pattern: /klaviyo\.com/i },
  { name: "Omnisend",      pattern: /omnisend\.com/i },
  { name: "Privy",         pattern: /privy\.com/i },
  { name: "Mailchimp",     pattern: /chimpstatic\.com|mailchimp\.com/i },
  { name: "Postscript",    pattern: /postscript\.io/i },
  { name: "SMSBump",       pattern: /smsbump\.com/i },
  { name: "Brevo",         pattern: /brevo\.com|sendinblue\.com/i },
  // Reviews
  { name: "Judge.me",      pattern: /judge\.me/i },
  { name: "Loox",          pattern: /loox\.io/i },
  { name: "Yotpo",         pattern: /yotpo\.com/i },
  { name: "Stamped.io",    pattern: /stamped\.io/i },
  { name: "Okendo",        pattern: /okendo\.io/i },
  { name: "Ali Reviews",   pattern: /alireviews\.io/i },
  // Upsell / CRO
  { name: "ReConvert",     pattern: /reconvert\.com/i },
  { name: "Zipify OCU",    pattern: /zipify\.com/i },
  { name: "Bold Upsell",   pattern: /boldcommerce\.com/i },
  { name: "Candy Rack",    pattern: /candyrack\.com/i },
  { name: "Frequently Bought Together", pattern: /frequently-bought-together/i },
  // Page builders
  { name: "PageFly",       pattern: /pagefly\.io/i },
  { name: "GemPages",      pattern: /gempages\.net/i },
  { name: "Shogun",        pattern: /getshogun\.com|shogunapp\.com/i },
  { name: "Zipify Pages",  pattern: /pages\.zipify\.com/i },
  // Chat / Support
  { name: "Tidio",         pattern: /tidio\.co/i },
  { name: "Gorgias",       pattern: /gorgias\.com/i },
  { name: "Zendesk",       pattern: /zdassets\.com|zendesk\.com/i },
  { name: "Intercom",      pattern: /intercomcdn\.com|intercom\.io/i },
  { name: "Drift",         pattern: /drift\.com/i },
  // Analytics / Heatmaps
  { name: "Hotjar",        pattern: /hotjar\.com/i },
  { name: "Lucky Orange",  pattern: /luckyorange\.com/i },
  { name: "Microsoft Clarity", pattern: /clarity\.ms/i },
  // Pixels / Tracking
  { name: "Facebook Pixel", pattern: /connect\.facebook\.net/i },
  { name: "TikTok Pixel",  pattern: /analytics\.tiktok\.com/i },
  { name: "Pinterest",     pattern: /ct\.pinterest\.com/i },
  { name: "Snapchat Pixel", pattern: /sc-static\.net/i },
  { name: "Google Ads",    pattern: /googleadservices\.com/i },
  // Loyalty / Referral
  { name: "Smile.io",      pattern: /smile\.io/i },
  { name: "LoyaltyLion",   pattern: /loyaltylion\.com/i },
  { name: "ReferralCandy", pattern: /referralcandy\.com/i },
  // Other
  { name: "Aftership",     pattern: /aftership\.com/i },
  { name: "LimeSpot",      pattern: /limespot\.io/i },
  { name: "Back In Stock", pattern: /backinstock\.org/i },
  { name: "Wheelio",       pattern: /wheelio\.com/i },
  { name: "Spin-a-Sale",   pattern: /spinasale\.com/i },
  { name: "Growave",       pattern: /growave\.io/i },
  { name: "Recart",        pattern: /recart\.com/i },
  { name: "Tracktor",      pattern: /tracktor\.in/i },
];

// ─── Theme detection ────────────────────────────────────────────────────────
export function detectTheme(html: string): string | null {
  // Shopify.theme = { "name": "..." } — most stores
  const m1 = html.match(/Shopify\.theme\s*=\s*\{[^}]*["']name["']\s*:\s*["']([^"']+)["']/);
  if (m1) return m1[1];

  // window.Shopify.theme
  const m2 = html.match(/window\.Shopify\.theme\s*=\s*\{[^}]*["']name["']\s*:\s*["']([^"']+)["']/);
  if (m2) return m2[1];

  // meta[name="theme-id"] or similar in head
  const m3 = html.match(/["']theme_name["']\s*:\s*["']([^"']+)["']/);
  if (m3) return m3[1];

  return null;
}

// ─── Apps detection ─────────────────────────────────────────────────────────
export function detectApps(html: string): string[] {
  return APP_SIGNATURES
    .filter(({ pattern }) => pattern.test(html))
    .map(({ name }) => name);
}

// ─── Best sellers ────────────────────────────────────────────────────────────
const BEST_SELLER_SLUGS = [
  "best-sellers",
  "bestsellers",
  "best-selling",
  "best-seller",
  "top-products",
  "top-sellers",
  "popular",
  "meilleures-ventes",
  "les-plus-vendus",
];

export async function fetchBestSellers(baseUrl: string): Promise<any[]> {
  for (const slug of BEST_SELLER_SLUGS) {
    try {
      const res = await fetch(`${baseUrl}/collections/${slug}/products.json?limit=10`, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.products?.length > 0) return data.products;
    } catch {
      continue;
    }
  }
  return [];
}

// ─── Traffic (SimilarWeb via RapidAPI) ──────────────────────────────────────
export type TrafficData = {
  monthlyVisits: number | null;
  topCountries: { country: string; countryCode: string; share: number }[];
  trafficSources: {
    direct: number;
    search: number;
    social: number;
    email: number;
    paid: number;
    referral: number;
  } | null;
  globalRank: number | null;
};

export async function fetchTraffic(domain: string): Promise<TrafficData | null> {
  const key = process.env.SIMILARWEB_RAPIDAPI_KEY;
  if (!key) return null;

  try {
    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const url = `https://similarweb.p.rapidapi.com/v1/similar-rank?domain=${encodeURIComponent(cleanDomain)}`;
    const res = await Promise.race([
      fetch(url, {
        headers: {
          "X-RapidAPI-Key": key,
          "X-RapidAPI-Host": "similarweb.p.rapidapi.com",
        },
      }),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error("timeout")), 6000)),
    ]);
    if (!res || !(res instanceof Response) || !res.ok) return null;

    const raw = await res.json();

    // SimilarWeb response shape
    const visits = raw?.SimilarityRank?.Site?.EstimatedMonthlyVisits
      ?? raw?.EstimatedMonthlyVisits
      ?? null;

    const globalRank = raw?.SimilarityRank?.Rank ?? null;

    const topCountries = (raw?.TopCountryShares ?? [])
      .slice(0, 5)
      .map((c: any) => ({
        country: c.Country ?? c.country ?? "",
        countryCode: c.CountryCode ?? c.countryCode ?? "",
        share: Math.round((c.Value ?? c.share ?? 0) * 100),
      }));

    const src = raw?.TrafficSources ?? null;
    const trafficSources = src ? {
      direct:   Math.round((src.Direct   ?? 0) * 100),
      search:   Math.round((src.Search   ?? 0) * 100),
      social:   Math.round((src.SocialNetworks ?? src.Social ?? 0) * 100),
      email:    Math.round((src.Mail     ?? src.Email ?? 0) * 100),
      paid:     Math.round((src.PaidReferrals ?? src.Paid ?? 0) * 100),
      referral: Math.round((src.Referrals ?? src.Referral ?? 0) * 100),
    } : null;

    return { monthlyVisits: visits, topCountries, trafficSources, globalRank };
  } catch {
    return null;
  }
}
