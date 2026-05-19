const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const HOST = "aliexpress-datahub.p.rapidapi.com";

export interface AliProduct {
  itemId: string;
  title: string;
  sales: string;
  price: number;
  image: string;
  itemUrl: string;
  averageStarRate: number;
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
  return items.map((entry: any): AliProduct => ({
    itemId: entry.item.itemId,
    title: entry.item.title,
    sales: entry.item.sales ?? "0",
    price: entry.item.sku?.def?.promotionPrice ?? 0,
    image: "https:" + (entry.item.image ?? ""),
    itemUrl: "https:" + (entry.item.itemUrl ?? ""),
    averageStarRate: entry.item.averageStarRate ?? 0,
  }));
}
