"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

type SpyResult = {
  url: string;
  productCount: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  topTags: string[];
  topProducts: {
    id: number;
    title: string;
    price: number;
    image: string | null;
    adCount: number | null;
    saturation_score: number | null;
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

export function ShopifySpy() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<SpyResult | null>(null);
  const [error, setError] = useState("");

  async function analyze() {
    if (!url.trim()) return;
    setState("loading");
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/spy-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
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

  const scoreColor = (s: number) =>
    s < 30 ? "text-success" : s < 60 ? "text-[#d97706]" : "text-danger";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Input */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-ink">URL de la boutique Shopify</p>
          <p className="text-xs text-text-muted">Ex: https://gymshark.com ou gymshark.myshopify.com</p>
        </div>
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && analyze()}
            placeholder="https://boutique.myshopify.com"
            className="flex-1 px-4 py-3 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <Button
            onClick={analyze}
            disabled={state === "loading" || !url.trim()}
            className="px-6 flex-shrink-0"
          >
            {state === "loading" ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyse…
              </span>
            ) : "🔍 Analyser"}
          </Button>
        </div>
      </div>

      {/* Erreur */}
      {state === "error" && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4">
          <p className="text-sm text-danger font-medium">{error}</p>
        </div>
      )}

      {/* Skeleton */}
      {state === "loading" && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border h-32 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-bg-soft via-[#e0e7ff]/40 to-bg-soft animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
            </div>
          ))}
        </div>
      )}

      {/* Résultats */}
      {state === "done" && result && (
        <div className="space-y-5">
          {/* Overview */}
          <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="bg-gradient-to-r from-bg-blue to-[#f5f3ff] px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Boutique analysée</span>
                <p className="font-heading font-bold text-ink mt-0.5 text-sm truncate max-w-xs">{result.url}</p>
              </div>
              {result.aiAnalysis && (
                <div className="text-center">
                  <div className={`font-heading font-extrabold text-3xl ${scoreColor(100 - result.aiAnalysis.score_boutique)}`}>
                    {result.aiAnalysis.score_boutique}/100
                  </div>
                  <div className="text-[0.65rem] text-text-muted">Score potentiel</div>
                </div>
              )}
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Produits", val: result.productCount.toString(), icon: "📦" },
                { label: "Prix moyen", val: `${result.avgPrice}€`, icon: "💰" },
                { label: "Prix min", val: `${result.minPrice}€`, icon: "⬇️" },
                { label: "Prix max", val: `${result.maxPrice}€`, icon: "⬆️" },
              ].map(({ label, val, icon }) => (
                <div key={label} className="bg-bg-soft rounded-xl p-3 border border-border text-center">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="font-heading font-bold text-primary text-lg">{val}</div>
                  <div className="text-xs text-text-muted">{label}</div>
                </div>
              ))}
            </div>
            {result.topTags.length > 0 && (
              <div className="px-6 pb-5 flex gap-2 flex-wrap">
                {result.topTags.map(tag => <Badge key={tag}>{tag}</Badge>)}
              </div>
            )}
          </div>

          {/* IA Analysis */}
          {result.aiAnalysis && (
            <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-2xl p-6 space-y-5 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <span className="text-xs font-semibold text-[#a5b4fc] uppercase tracking-wider">Analyse IA</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[0.65rem] text-[#a5b4fc] uppercase tracking-wider font-semibold">Niche principale</p>
                  <p className="font-heading font-bold text-lg text-white">{result.aiAnalysis.niche_principale}</p>
                  <p className="text-sm text-[#c7d2fe] leading-relaxed">{result.aiAnalysis.positionnement}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[0.65rem] text-[#a5b4fc] uppercase tracking-wider font-semibold">Produit à surveiller</p>
                  <div className="bg-white/10 rounded-xl px-3 py-2">
                    <p className="text-sm font-semibold text-white">{result.aiAnalysis.produit_a_surveiller}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[0.65rem] text-[#a5b4fc] uppercase tracking-wider font-semibold mb-2">Points forts</p>
                  <ul className="space-y-1.5">
                    {result.aiAnalysis.points_forts.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#e0e7ff]">
                        <span className="text-[#a5b4fc] mt-0.5">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[0.65rem] text-[#a5b4fc] uppercase tracking-wider font-semibold mb-2">Opportunités</p>
                  <ul className="space-y-1.5">
                    {result.aiAnalysis.opportunites.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#e0e7ff]">
                        <span className="text-[#fbbf24] mt-0.5">→</span>{o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-[0.65rem] text-[#a5b4fc] uppercase tracking-wider font-semibold mb-1">Conseil principal</p>
                <p className="text-sm text-[#e0e7ff] leading-relaxed">{result.aiAnalysis.conseil_principal}</p>
              </div>
            </div>
          )}

          {/* Top produits */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-lg text-ink">Top produits de la boutique</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.topProducts.map(p => (
                <div key={p.id} className="bg-white rounded-xl border border-border shadow-card overflow-hidden flex gap-0">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="w-24 h-24 object-cover flex-shrink-0" />
                  )}
                  <div className="p-4 flex-1 space-y-2 min-w-0">
                    <p className="font-heading font-bold text-sm text-ink leading-snug line-clamp-2">{p.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-primary text-base">{formatPrice(p.price)}</span>
                      {p.adCount !== null && (
                        <span className="text-xs text-text-muted">{p.adCount} pubs FB actives</span>
                      )}
                    </div>
                    {p.saturation_score !== null && (
                      <ScoreBar score={p.saturation_score} label="Saturation" colorMode="saturation" />
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
        </div>
      )}
    </div>
  );
}
