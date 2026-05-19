import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

export function saturationLabel(score: number): string {
  if (score >= 80) return "Saturé";
  if (score >= 50) return "Compétitif";
  if (score >= 25) return "Opportunité";
  return "Vierge";
}

export function trendLabel(score: number): string {
  if (score >= 80) return "Explosive";
  if (score >= 60) return "En hausse";
  if (score >= 40) return "Stable";
  return "En baisse";
}
