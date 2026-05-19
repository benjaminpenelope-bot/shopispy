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

const TREND_COLORS = {
  high: { bg: "bg-[#ecfdf5]", text: "text-[#059669]", border: "border-[#a7f3d0]" },
  mid: { bg: "bg-[#fffbeb]", text: "text-[#d97706]", border: "border-[#fde68a]" },
  low: { bg: "bg-[#fef2f2]", text: "text-danger", border: "border-[#fecaca]" },
};

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const satLabel = saturationLabel(product.saturation_score);
  const trLabel = trendLabel(product.trend_score);
  const emoji = EMOJIS[product.niche] ?? "📦";
  const trendStyle =
    product.trend_score >= 70 ? TREND_COLORS.high :
    product.trend_score >= 45 ? TREND_COLORS.mid :
    TREND_COLORS.low;

  const satBadgeVariant =
    product.saturation_score >= 70 ? "danger" :
    product.saturation_score >= 40 ? "warning" :
    "success";

  return (
    <div className="bg-white rounded-xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image / placeholder */}
      <div className="h-36 bg-gradient-to-br from-bg-blue to-[#f5f3ff] flex items-center justify-center text-5xl relative overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </span>
        )}
        {/* Trend badge */}
        <div className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${trendStyle.bg} ${trendStyle.text} ${trendStyle.border}`}>
          {trLabel}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Header */}
        <div>
          <h3 className="font-heading font-bold text-sm text-ink leading-snug line-clamp-2">
            {product.title}
          </h3>
          <p className="text-text-muted text-xs mt-0.5">{product.niche}</p>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {product.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        {/* Scores */}
        <div className="space-y-2.5">
          <ScoreBar
            score={product.saturation_score}
            label={`Saturation — ${satLabel}`}
            colorMode="saturation"
          />
          <ScoreBar
            score={product.trend_score}
            label={`Tendance — ${trLabel}`}
            colorMode="trend"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
          <div>
            <div className="font-heading font-bold text-primary text-base">
              {formatPrice(product.price, product.currency)}
            </div>
            <div className="text-[0.65rem] text-text-muted">
              ~{product.monthly_orders_estimate.toLocaleString("fr-FR")} cmd/mois
            </div>
          </div>
          <Link href={`/dashboard/clone/${product.id}`}>
            <Button size="sm">
              ✨ Cloner
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
