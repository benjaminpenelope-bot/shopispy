import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { Button } from "@/components/ui/Button";
import { formatPrice, saturationLabel, trendLabel } from "@/lib/utils";
import type { Product } from "@/types";

const EMOJIS: Record<string, string> = {
  "Déco chambre": "🌅",
  "Accessoires tech": "📱",
  "Lifestyle & hydratation": "🥤",
  "Beauté & skincare": "💆",
  "Sport & mobilité": "🚴",
  "Cuisine & kawaii": "🍞",
};

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const satLabel = saturationLabel(product.saturation_score);
  const trLabel = trendLabel(product.trend_score);
  const emoji = EMOJIS[product.niche] ?? "📦";

  const trendColor =
    product.trend_score >= 70 ? "text-primary" :
    product.trend_score >= 45 ? "text-[#f59e0b]" :
    "text-danger";

  return (
    <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-glow-sm transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="h-36 bg-[#0d0d0d] flex items-center justify-center text-5xl relative overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.title} className="h-full w-full object-cover opacity-80" />
        ) : (
          <span className="group-hover:scale-110 transition-transform duration-300">{emoji}</span>
        )}
        <div className={`absolute top-3 right-3 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#111111] border border-[#222] ${trendColor}`}>
          {trLabel}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-heading font-bold text-sm text-white leading-snug line-clamp-2">{product.title}</h3>
          <p className="text-[#52525b] text-xs mt-0.5 font-mono">{product.niche}</p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {product.tags.slice(0, 3).map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </div>

        <div className="space-y-2.5">
          <ScoreBar score={product.saturation_score} label={`Saturation — ${satLabel}`} colorMode="saturation" />
          <ScoreBar score={product.trend_score} label={`Tendance — ${trLabel}`} colorMode="trend" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a] mt-auto">
          <div>
            <div className="font-heading font-bold text-primary text-base">{formatPrice(product.price, product.currency)}</div>
            <div className="text-[0.65rem] text-[#52525b] font-mono">~{product.monthly_orders_estimate.toLocaleString("fr-FR")} cmd/mois</div>
          </div>
          <Link href={`/dashboard/clone/${product.id}`}>
            <Button size="sm">✨ Générer</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
