"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const NICHES = [
  "Déco maison", "Gadgets tech", "Accessoires mode", "Sport & fitness",
  "Beauté", "Animaux", "Gaming", "Cuisine", "Bébé", "Jardinage",
];

interface Props {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = "" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const search = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      router.push(`/dashboard/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(query);
        }}
        className="flex gap-2"
      >
        <div className="flex-1 flex items-center bg-white border-2 border-border rounded-xl px-4 py-3 gap-3 focus-within:border-primary focus-within:shadow-glow-sm transition-all">
          <span className="text-text-light text-lg flex-shrink-0">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cherche une niche, un mot-clé produit…"
            className="flex-1 !border-none !shadow-none !bg-transparent !rounded-none font-sans text-sm text-ink focus:!ring-0 p-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); search(""); }}
              className="text-text-light hover:text-ink transition-colors text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm px-6 rounded-xl shadow-glow-sm hover:shadow-glow hover:brightness-105 transition-all hover:-translate-y-px"
        >
          Analyser
        </button>
      </form>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-text-muted font-medium">Niches rapides :</span>
        {NICHES.map((niche) => (
          <button
            key={niche}
            onClick={() => {
              setQuery(niche);
              search(niche);
            }}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              query === niche
                ? "bg-bg-blue text-primary border-[#c7d2fe]"
                : "bg-white text-text-muted border-border hover:border-primary hover:text-primary hover:bg-bg-blue"
            }`}
          >
            {niche}
          </button>
        ))}
      </div>
    </div>
  );
}
