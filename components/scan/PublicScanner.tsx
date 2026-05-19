"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

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

export function PublicScanner() {
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

  return (
    <div className="space-y-5">
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
            onClick={analyze}
            disabled={state === "loading" || !url.trim()}
            className="btn-neon px-5 py-2.5 text-sm flex-shrink-0 rounded-lg flex items-center gap-2"
          >
            {state === "loading" ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin" />
                Scan…
              </>
            ) : "🔍 Scanner"}
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
          {/* Overview — toujours visible */}
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-mono text-[0.6rem] text-[#52525b] tracking-wider mb-0.5">BOUTIQUE ANALYSÉE</p>
                <p className="font-heading font-bold text-white text-sm truncate max-w-xs">{result.url}</p>
              </div>
              {result.aiAnalysis && (
                <ScoreGauge score={result.aiAnalysis.score_boutique} label="Score potentiel" size={100} />
              )}
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Produits", val: result.productCount.toString(), icon: "📦" },
                { label: "Prix moyen", val: `${result.avgPrice}€`, icon: "💰" },
                { label: "Prix min", val: `${result.minPrice}€`, icon: "⬇️" },
                { label: "Saturation niche", val: result.nicheSaturation != null ? `${result.nicheSaturation}/100` : "N/A", icon: "📊", sub: result.nicheAdCount ? `${result.nicheAdCount} pubs FB` : undefined },
              ].map(({ label, val, icon, sub }: { label: string; val: string; icon: string; sub?: string }) => (
                <div key={label} className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-3 text-center">
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

          {/* 2 premiers produits — visibles */}
          {result.topProducts.slice(0, 2).map(p => (
            <div key={p.id} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl overflow-hidden flex">
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.title} className="w-20 h-20 object-cover flex-shrink-0" />
              )}
              <div className="p-4 flex-1 space-y-2 min-w-0">
                <p className="font-heading font-bold text-sm text-white leading-snug line-clamp-2">{p.title}</p>
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-primary">{formatPrice(p.price)}</span>
                  {p.adCount !== null && (
                    <span className="font-mono text-[0.65rem] text-[#52525b]">{p.adCount} pubs FB</span>
                  )}
                </div>
                {p.saturation_score !== null && p.adCount !== null && (
                  <ScoreBar score={p.saturation_score} label={`Saturation — "${p.adKeyword}"`} colorMode="saturation" />
                )}
              </div>
            </div>
          ))}

          {/* Reste — bloqué avec CTA */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* Contenu flou en arrière-plan */}
            <div className="pointer-events-none select-none blur-sm opacity-40 space-y-4 p-1">
              {/* Faux produits 3-4 */}
              {result.topProducts.slice(2, 4).map(p => (
                <div key={p.id} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl overflow-hidden flex">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="w-20 h-20 object-cover flex-shrink-0" />
                  )}
                  <div className="p-4 flex-1 space-y-2">
                    <p className="font-bold text-sm text-white line-clamp-1">{p.title}</p>
                    <div className="h-2 bg-[#222] rounded w-2/3" />
                    <div className="h-2 bg-[#222] rounded w-1/2" />
                  </div>
                </div>
              ))}

              {/* Fausse analyse IA */}
              {result.aiAnalysis && (
                <div className="bg-[#0d1a0f] border border-primary/20 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span>✨</span>
                    <span className="text-xs font-mono text-primary uppercase tracking-wider">Analyse IA complète</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#1a2a1a] rounded w-3/4" />
                    <div className="h-3 bg-[#1a2a1a] rounded w-full" />
                    <div className="h-3 bg-[#1a2a1a] rounded w-5/6" />
                    <div className="h-3 bg-[#1a2a1a] rounded w-2/3" />
                  </div>
                </div>
              )}
            </div>

            {/* Overlay CTA */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent px-6 text-center space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-xl mx-auto">🔓</div>
                <p className="font-heading font-bold text-white text-lg">
                  {result.topProducts.length - 2} produits + analyse IA débloqués
                </p>
                <p className="text-[#71717a] text-sm max-w-xs mx-auto">
                  Crée un compte gratuit pour voir l'analyse complète, les opportunités et le conseil IA.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/login">
                  <button className="btn-neon px-6 py-3 text-sm font-bold">
                    Créer un compte gratuit →
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-6 py-3 text-sm font-medium text-[#71717a] border border-[#222] rounded-xl hover:border-[#333] hover:text-white transition-all">
                    Se connecter
                  </button>
                </Link>
              </div>
              <p className="font-mono text-[0.65rem] text-[#3f3f46]">Gratuit · Aucune carte requise</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
