import { Suspense } from "react";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

async function ProductGrid({ query }: { query: string }) {
  const supabase = await createClient();

  let dbQuery = supabase
    .from("products")
    .select("*")
    .order("trend_score", { ascending: false })
    .limit(50);

  if (query) {
    dbQuery = dbQuery.or(
      `title.ilike.%${query}%,niche.ilike.%${query}%`
    );
  }

  const { data: products, error } = await dbQuery;

  if (error || !products || products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-card py-24 text-center space-y-3">
        <div className="text-5xl">🔍</div>
        <p className="font-heading font-bold text-xl text-ink">Aucun résultat</p>
        <p className="text-text-muted text-sm max-w-xs mx-auto">
          Essaie avec une autre niche ou un autre mot-clé produit.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q ?? "";

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="space-y-1">
        <span className="section-tag">Recherche produit</span>
        <h1 className="font-heading font-extrabold text-3xl text-ink mt-3">
          Explorer les niches
        </h1>
        <p className="text-text-muted text-sm">
          {query
            ? `Résultats pour "${query}"`
            : "Saisis une niche ou un produit pour démarrer l'analyse."}
        </p>
      </div>

      <Suspense fallback={null}>
        <SearchBar initialQuery={query} />
      </Suspense>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-muted">
            Triés par score de tendance
          </span>
          <div className="flex gap-2">
            {["Tendance ↓", "Saturation ↑", "Prix ↑"].map((sort) => (
              <button
                key={sort}
                className="text-xs font-medium text-text-muted bg-white border border-border px-3 py-1.5 rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                {sort}
              </button>
            ))}
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-border h-80 animate-pulse" />
              ))}
            </div>
          }
        >
          <ProductGrid query={query} />
        </Suspense>
      </div>
    </div>
  );
}
