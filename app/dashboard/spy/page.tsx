import { ShopifySpy } from "@/components/dashboard/ShopifySpy";

export default async function SpyPage({ searchParams }: { searchParams: Promise<{ url?: string }> }) {
  const { url } = await searchParams;
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <span className="section-tag">Shopify Spy</span>
        <h1 className="font-heading font-extrabold text-3xl text-white mt-3">
          Analyser une boutique
        </h1>
        <p className="text-[#52525b] text-sm">
          Entre l'URL d'une boutique Shopify pour obtenir ses produits, thème, apps, trafic et une analyse IA complète.
        </p>
      </div>
      <ShopifySpy initialUrl={url} />
    </div>
  );
}
