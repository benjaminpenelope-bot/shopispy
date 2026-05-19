"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { formatPrice } from "@/lib/utils";

type SpyResult = {
  url: string;
  productCount: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  topTags: string[];
  nicheSaturation?: number;
  nicheAdCount?: number;
  topProducts: {
    id: number;
    title: string;
    price: number;
    image: string | null;
    adCount: number | null;
    saturation_score: number | null;
    adKeyword: string | null;
    handle: string;
    productType: string;
    tags: string[];
  }[];
  aiAnalysis: {
    niche_principale: string;
    positionnement: string;
    points_forts: string[];
    opportunites: string[];
    produit_a_surveiller: string;
    conseil_principal: string;
    score_boutique: number;
  } | null;
};

type State = "idle" | "loading" | "done" | "error";

const EXAMPLE_STORES = [
  "gymshark.com",
  "allbirds.com",
  "colourpop.com",
];

export function ShopifySpy() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<SpyResult | null>(null);
  const [error, setError] = useState("");

  async function analyze(targetUrl?: string) {
    const query = (targetUrl ?? url).trim();
    if (!query) return;
    if (targetUrl) setUrl(targetUrl);
    setState("loading");
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/spy-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: query }),
      });
      const text = await res.text();
      if (!text) throw new Error("Le serveur n'a pas répondu. Réessaie dans quelques secondes.");
      const data = JSON.parse(text);
      if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
      setState("error");
    }
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Input */}
      <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5 space-y-3">
        <div className="flex gap-2 p-1.5 bg-[#111111] border border-[#2a2a2a] rounded-xl focus-within:border-primary/50 focus-within:shadow-glow-sm transition-all">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && analyze()}
            placeholder="https://boutique.myshopify.com"
            className="flex-1 bg-transparent border-none px-3 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:outline-none"
          />
          <button
            onClick={() => analyze()}
            disabled={state === "loading" || !url.trim()}
            className="btn-neon px-5 py-2.5 text-sm flex-shrink-0 rounded-lg flex items-center gap-2"
          >
            {state === "loading" ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin" />
                Scan…
              </>
            ) : "🔍 Analyser"}
          </button>
        </div>
        <p className="text-[0.65rem] text-[#52525b] font-mono text-center tracking-wide">
          Détection Shopify • Analyse marketing • Fiche produit IA
        </p>
      </div>

      {/* Erreur */}
      {state === "error" && (
        <div className="bg-[#1a0808] border border-danger/30 rounded-xl p-4">
          <p className="text-sm text-danger font-medium">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {state === "idle" && (
        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/20 flex items-center justify-center text-2xl mx-auto">
            🕵️
          </div>
          <div className="space-y-2">
            <p className="font-heading font-bold text-white text-lg">Prêt à espionner</p>
            <p className="text-[#52525b] text-sm max-w-sm mx-auto">
              Entre l'URL d'une boutique Shopify pour obtenir ses produits, scores de saturation et une analyse IA complète.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-mono text-[0.6rem] text-[#3f3f46] tracking-wider uppercase">Exemples</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_STORES.map(s => (
                <button
                  key={s}
                  onClick={() => analyze(s)}
                  className="px-3 py-1.5 bg-[#111] border border-[#222] rounded-lg text-xs text-[#71717a] font-mono hover:border-primary/30 hover:text-primary transition-all active:scale-[0.97]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skeleton */}
      {state === "loading" && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl h-28 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#111] animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
            </div>
          ))}
          <p className="text-center text-[#52525b] text-xs font-mono animate-pulse">
            Analyse en cours… ~10 secondes
          </p>
        </div>
      )}

      {/* Résultats */}
      {state === "done" && result && (
        <div className="space-y-4">
          {/* Overview */}
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-mono text-[0.6rem] text-[#52525b] tracking-wider mb-0.5">BOUTIQUE ANALYSÉE</p>
                <p className="font-heading font-bold text-white text-sm truncate max-w-xs">{result.url}</p>
                {result.aiAnalysis && (
                  <p className="text-xs text-[#52525b] mt-0.5">{result.aiAnalysis.niche_principale}</p>
                )}
              </div>
              {result.aiAnalysis && (
                <ScoreGauge score={result.aiAnalysis.score_boutique} label="Score potentiel" size={110} />
              )}
            </div>

            {/* Métriques — surface élevée pour valeurs importantes */}
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Produits", val: result.productCount.toString(), icon: "📦" },
                { label: "Prix moyen", val: `${result.avgPrice}€`, icon: "💰" },
                { label: "Prix min", val: `${result.minPrice}€`, icon: "⬇️" },
                { label: "Saturation niche", val: result.nicheSaturation != null ? `${result.nicheSaturation}/100` : "N/A", icon: "📊", sub: result.nicheAdCount ? `${result.nicheAdCount} pubs FB` : undefined },
              ].map(({ label, val, icon, sub }: { label: string; val: string; icon: string; sub?: string }) => (
                <div key={label} className="bg-[#161616] border border-[#222] rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="font-heading font-bold text-primary text-base">{val}</div>
                  <div className="font-mono text-[0.6rem] text-[#52525b] mt-0.5 tracking-wide">{label}</div>
                  {sub && <div className="font-mono text-[0.55rem] text-[#3f3f46] mt-0.5">{sub}</div>}
                </div>
              ))}
            </div>

            {result.topTags.length > 0 && (
              <div className="px-5 pb-4 flex gap-2 flex-wrap">
                {result.topTags.map(tag => <Badge key={tag}>{tag}</Badge>)}
              </div>
            )}
          </div>

          {/* Top produits */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-base text-white">Top produits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.topProducts.map(p => (
                <div key={p.id} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl overflow-hidden flex hover:border-[#2a2a2a] transition-colors group">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="w-20 h-20 object-cover flex-shrink-0" />
                  )}
                  <div className="p-4 flex-1 space-y-2 min-w-0">
                    <p className="font-heading font-bold text-sm text-white leading-snug line-clamp-2">{p.title}</p>
                    <div className="flex items-center justify-between">
                      {/* Prix sur surface surélevée */}
                      <span className="font-heading font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-md text-sm">{formatPrice(p.price)}</span>
                      {p.adCount !== null && (
                        <span className="font-mono text-[0.65rem] text-[#52525b]">{p.adCount} pubs FB</span>
                      )}
                    </div>
                    {p.saturation_score !== null && p.adCount !== null && (
                      <ScoreBar score={p.saturation_score} label={`"${p.adKeyword}"`} colorMode="saturation" />
                    )}
                    {p.tags.length > 0 && (
                      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {p.tags.map(t => <Badge key={t}>{t}</Badge>)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analyse IA */}
          {result.aiAnalysis && (
            <div className="bg-[#0d1a0f] border border-primary/20 rounded-2xl p-5 space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-xs text-primary uppercase tracking-wider">Analyse IA</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="font-mono text-[0.6rem] text-[#52525b] uppercase tracking-wider">Positionnement</p>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">{result.aiAnalysis.positionnement}</p>
                </div>
                {/* Produit à surveiller — surface élevée */}
                <div className="bg-[#111] border border-primary/15 rounded-xl p-3 space-y-1">
                  <p className="font-mono text-[0.6rem] text-primary uppercase tracking-wider">Produit à surveiller</p>
                  <p className="text-sm font-heading font-bold text-white">{result.aiAnalysis.produit_a_surveiller}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-[0.6rem] text-[#52525b] uppercase tracking-wider mb-2">Points forts</p>
                  <ul className="space-y-1.5">
                    {result.aiAnalysis.points_forts.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                        <span className="text-primary mt-0.5 flex-shrink-0 text-xs">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[0.6rem] text-[#52525b] uppercase tracking-wider mb-2">Opportunités</p>
                  <ul className="space-y-1.5">
                    {result.aiAnalysis.opportunites.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                        <span className="text-[#f59e0b] mt-0.5 flex-shrink-0 text-xs">→</span>{o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Conseil — surface la plus élevée car c'est l'info clé */}
              <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4">
                <p className="font-mono text-[0.6rem] text-[#52525b] uppercase tracking-wider mb-1.5">Conseil principal</p>
                <p className="text-sm text-white leading-relaxed">{result.aiAnalysis.conseil_principal}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
