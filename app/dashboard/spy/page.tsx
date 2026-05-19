import { ShopifySpy } from "@/components/dashboard/ShopifySpy";

export default function SpyPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <span className="section-tag">Shopify Spy</span>
        <h1 className="font-heading font-extrabold text-3xl text-ink mt-3">
          Analyser une boutique
        </h1>
        <p className="text-text-muted text-sm">
          Entre l'URL d'une boutique Shopify pour obtenir ses produits, scores de saturation et une analyse IA complète.
        </p>
      </div>
      <ShopifySpy />
    </div>
  );
}
