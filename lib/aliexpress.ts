const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const HOST = "aliexpress-datahub.p.rapidapi.com";

export interface AliProduct {
  itemId: string;
  title: string;
  sales: string;
  salesInt: number;
  price: number;
  image: string;
  itemUrl: string;
  averageStarRate: number;
}

export interface AliSupplier {
  itemId: string;
  title: string;
  salesInt: number;
  price: number;
  image: string;
  itemUrl: string;
  rating: number;
}

function parseSales(raw: string): number {
  if (!raw) return 0;
  const s = raw.toLowerCase().replace(/[+ ,]/g, "");
  if (s.includes("k")) return Math.round(parseFloat(s) * 1000);
  if (s.includes("m")) return Math.round(parseFloat(s) * 1_000_000);
  return parseInt(s, 10) || 0;
}

export async function searchAliExpress(query: string, page = 1): Promise<AliProduct[]> {
  const url = `https://${HOST}/item_search_2?q=${encodeURIComponent(query)}&page=${page}`;
  const res = await fetch(url, {
    headers: {
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": HOST,
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const items = data?.result?.resultList ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return items.map((entry: any): AliProduct => {
    const salesRaw = entry.item.sales ?? "0";
    return {
      itemId: entry.item.itemId,
      title: entry.item.title,
      sales: salesRaw,
      salesInt: parseSales(salesRaw),
      price: entry.item.sku?.def?.promotionPrice ?? 0,
      image: "https:" + (entry.item.image ?? ""),
      itemUrl: "https:" + (entry.item.itemUrl ?? ""),
      averageStarRate: entry.item.averageStarRate ?? 0,
    };
  });
}

/** Search AliExpress for a product keyword and return the best supplier match. */
export async function findSupplier(keyword: string): Promise<AliSupplier | null> {
  if (!RAPIDAPI_KEY) return null;
  try {
    const results = await Promise.race([
      searchAliExpress(keyword),
      new Promise<null>((_, r) => setTimeout(() => r(null), 6000)),
    ]);
    if (!results) return null;

    // Pick first result with a valid price
    const match = results.find(p => p.price > 0);
    if (!match) return null;

    return {
      itemId: match.itemId,
      title: match.title,
      salesInt: match.salesInt,
      price: match.price,
      image: match.image,
      itemUrl: match.itemUrl,
      rating: match.averageStarRate,
    };
  } catch {
    return null;
  }
}

/**
 * Compute an opportunity score (0–100) based on real supplier data.
 *
 * Breakdown:
 *  - Margin (0–40 pts): (shopifyPrice - aliPrice) / shopifyPrice
 *  - Demand  (0–30 pts): AliExpress sales volume
 *  - Quality (0–15 pts): AliExpress seller rating
 *  - Price range (0–15 pts): Shopify price in dropshipping sweet spot
 *
 * Falls back to a heuristic capped at 45 when no supplier is found.
 */
export function computeOpportunityScore(
  shopifyPrice: number,
  supplier: AliSupplier | null,
  variantCount: number,
  hasProductType: boolean,
): number {
  if (!supplier) {
    // Heuristic fallback
    const priceOk = shopifyPrice >= 15 && shopifyPrice <= 100 ? 20 : 5;
    const variantOk = variantCount <= 5 ? 15 : variantCount <= 10 ? 8 : 3;
    const typeOk = hasProductType ? 10 : 0;
    return Math.min(45, priceOk + variantOk + typeOk);
  }

  // Margin score (0–40)
  const margin = supplier.price > 0 && shopifyPrice > 0
    ? (shopifyPrice - supplier.price) / shopifyPrice
    : -1;
  const marginScore =
    margin >= 0.70 ? 40 :
    margin >= 0.55 ? 32 :
    margin >= 0.40 ? 22 :
    margin >= 0.20 ? 12 :
    margin >= 0    ? 5  : 0;

  // Demand score (0–30)
  const demandScore =
    supplier.salesInt >= 50_000 ? 30 :
    supplier.salesInt >= 10_000 ? 25 :
    supplier.salesInt >= 2_000  ? 18 :
    supplier.salesInt >= 300    ? 10 :
    supplier.salesInt > 0       ? 5  : 0;

  // Quality score (0–15)
  const qualityScore =
    supplier.rating >= 4.7 ? 15 :
    supplier.rating >= 4.4 ? 11 :
    supplier.rating >= 4.0 ? 7  :
    supplier.rating >= 3.5 ? 3  : 0;

  // Price attractiveness (0–15)
  const priceScore =
    shopifyPrice >= 25 && shopifyPrice <= 80  ? 15 :
    shopifyPrice >= 80 && shopifyPrice <= 150 ? 10 :
    shopifyPrice >= 15 && shopifyPrice <  25  ? 8  :
    shopifyPrice > 150                        ? 5  : 0;

  return Math.min(100, marginScore + demandScore + qualityScore + priceScore);
}
