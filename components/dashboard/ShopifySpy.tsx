"use client";
import { useState, useEffect } from "react";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { formatPrice } from "@/lib/utils";
import { APP_LINKS } from "@/lib/shopify-intel";

type Product = {
  id: number;
  title: string;
  price: number;
  image: string | null;
  handle: string;
  productType: string;
  tags: string[];
};

type SpyProduct = Product & {
  adCount: number | null;
  saturation_score: number | null;
  adKeyword: string | null;
  opportunityScore: number;
};

type SimilarSite = {
  domain: string;
  title: string;
  visits: number | null;
  globalRank: number | null;
  topCountry: string | null;
  favicon: string | null;
};

type BestSeller = Product & { fromCollection: boolean };

type TrafficData = {
  monthlyVisits: number | null;
  globalRank: number | null;
  topCountries: { country: string; countryCode: string; share: number }[];
  trafficSources: {
    direct: number; search: number; social: number;
    email: number; paid: number; referral: number;
  } | null;
  engagement: { bounceRate: number; pagesPerVisit: number; timeOnSite: number } | null;
};

type SpyResult = {
  url: string;
  productCount: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  topTags: string[];
  nicheSaturation?: number;
  nicheAdCount?: number;
  topProducts: SpyProduct[];
  bestSellers: BestSeller[];
  bestSellersFromCollection: boolean;
  theme: { rawName: string; displayName: string; category: "free" | "premium" | "custom" } | null;
  detectedApps: string[];
  traffic: TrafficData | null;
  similarSites: SimilarSite[];
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

const EXAMPLE_STORES = ["gymshark.com", "allbirds.com", "colourpop.com"];

function formatVisits(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function ShopifySpy({ initialUrl }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<SpyResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialUrl) analyze(initialUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          Thème • Apps • Best sellers • Trafic • Analyse IA
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
              Entre l'URL d'une boutique Shopify pour obtenir ses best sellers, thème, apps, trafic et une analyse IA complète.
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
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl h-28 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#111] animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
            </div>
          ))}
          <p className="text-center text-[#52525b] text-xs font-mono animate-pulse">
            Analyse en cours… thème · apps · best sellers · IA
          </p>
        </div>
      )}

      {/* Résultats */}
      {state === "done" && result && (
        <div className="space-y-4">

          {/* ── Overview ── */}
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
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Produits", val: result.productCount.toString(), icon: "📦" },
                { label: "Prix moyen", val: `${result.avgPrice}€`, icon: "💰" },
                { label: "Prix min", val: `${result.minPrice}€`, icon: "⬇️" },
                { label: "Prix max", val: `${result.maxPrice}€`, icon: "⬆️" },
              ].map(({ label, val, icon }) => (
                <div key={label} className="bg-[#161616] border border-[#222] rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="font-heading font-bold text-primary text-base">{val}</div>
                  <div className="font-mono text-[0.6rem] text-[#52525b] mt-0.5 tracking-wide">{label}</div>
                </div>
              ))}
            </div>
            {result.topTags.length > 0 && (
              <div className="px-5 pb-4 flex gap-2 flex-wrap">
                {result.topTags.map(tag => (
                  <span key={tag} className="font-mono text-[0.65rem] text-[#71717a] bg-[#161616] border border-[#222] px-2.5 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Trafic ── */}
          {result.traffic && (
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#1a1a1a] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <p className="font-mono text-[0.6rem] text-[#52525b] tracking-wider uppercase">Trafic mensuel estimé</p>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {result.traffic.monthlyVisits && (
                  <div className="bg-[#161616] border border-[#222] rounded-xl p-3 text-center col-span-1">
                    <div className="text-lg mb-1">👁️</div>
                    <div className="font-heading font-bold text-primary text-base">{formatVisits(result.traffic.monthlyVisits)}</div>
                    <div className="font-mono text-[0.6rem] text-[#52525b] mt-0.5 tracking-wide">Visites/mois</div>
                  </div>
                )}
                {result.traffic.globalRank && (
                  <div className="bg-[#161616] border border-[#222] rounded-xl p-3 text-center">
                    <div className="text-lg mb-1">🌐</div>
                    <div className="font-heading font-bold text-primary text-base">#{result.traffic.globalRank.toLocaleString("fr")}</div>
                    <div className="font-mono text-[0.6rem] text-[#52525b] mt-0.5 tracking-wide">Rang mondial</div>
                  </div>
                )}
                {result.traffic.engagement && (
                  <>
                    <div className="bg-[#161616] border border-[#222] rounded-xl p-3 text-center">
                      <div className="text-lg mb-1">📄</div>
                      <div className="font-heading font-bold text-primary text-base">{result.traffic.engagement.pagesPerVisit}</div>
                      <div className="font-mono text-[0.6rem] text-[#52525b] mt-0.5 tracking-wide">Pages/visite</div>
                    </div>
                    <div className="bg-[#161616] border border-[#222] rounded-xl p-3 text-center">
                      <div className="text-lg mb-1">⏱️</div>
                      <div className="font-heading font-bold text-primary text-base">{Math.floor(result.traffic.engagement.timeOnSite / 60)}m{result.traffic.engagement.timeOnSite % 60}s</div>
                      <div className="font-mono text-[0.6rem] text-[#52525b] mt-0.5 tracking-wide">Durée moy.</div>
                    </div>
                  </>
                )}
                {result.traffic.topCountries.slice(0, 2).map(c => (
                  <div key={c.country} className="bg-[#161616] border border-[#222] rounded-xl p-3 text-center">
                    <div className="text-lg mb-1">📍</div>
                    <div className="font-heading font-bold text-white text-base">{c.share}%</div>
                    <div className="font-mono text-[0.6rem] text-[#52525b] mt-0.5 tracking-wide truncate">{c.country}</div>
                  </div>
                ))}
              </div>

              {/* Sources de trafic */}
              {result.traffic.trafficSources && (
                <div className="px-4 pb-4 space-y-2">
                  <p className="font-mono text-[0.6rem] text-[#3f3f46] tracking-wider uppercase mb-3">Sources de trafic</p>
                  {(
                    [
                      { label: "Direct",   val: result.traffic.trafficSources.direct,   color: "#00ff87" },
                      { label: "Search",   val: result.traffic.trafficSources.search,   color: "#00e5ff" },
                      { label: "Social",   val: result.traffic.trafficSources.social,   color: "#a78bfa" },
                      { label: "Paid",     val: result.traffic.trafficSources.paid,     color: "#f59e0b" },
                      { label: "Referral", val: result.traffic.trafficSources.referral, color: "#71717a" },
                    ] as const
                  ).filter(s => s.val > 0).map(({ label, val, color }) => (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-mono text-xs text-[#52525b]">{label}</span>
                        <span className="font-mono text-xs font-semibold" style={{ color }}>{val}%</span>
                      </div>
                      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${val}%`, background: color }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Top pays détail */}
              {result.traffic.topCountries.length > 2 && (
                <div className="px-4 pb-4">
                  <p className="font-mono text-[0.6rem] text-[#3f3f46] tracking-wider uppercase mb-2">Répartition géo</p>
                  <div className="flex flex-wrap gap-2">
                    {result.traffic.topCountries.map(c => (
                      <span key={c.country} className="bg-[#161616] border border-[#222] text-xs text-[#a1a1aa] font-mono px-2.5 py-1 rounded-lg">
                        {c.country} · {c.share}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Thème + Apps ── */}
          {(result.theme || result.detectedApps.length > 0) && (
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <p className="font-mono text-[0.6rem] text-[#52525b] tracking-wider uppercase">Stack technique</p>
              </div>

              {result.theme && (
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎨</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-heading font-bold text-white text-sm">{result.theme.displayName}</p>
                    <span className={`font-mono text-[0.6rem] px-2 py-0.5 rounded-full border tracking-wider ${
                      result.theme.category === "free"
                        ? "text-[#52525b] border-[#2a2a2a] bg-[#161616]"
                        : result.theme.category === "premium"
                        ? "text-[#f59e0b] border-[#f59e0b]/20 bg-[#f59e0b]/8"
                        : "text-primary border-primary/20 bg-primary/8"
                    }`}>
                      {result.theme.category === "free" ? "GRATUIT" : result.theme.category === "premium" ? "PREMIUM" : "SUR MESURE"}
                    </span>
                  </div>
                </div>
              )}

              {result.detectedApps.length > 0 && (
                <div>
                  <p className="font-mono text-[0.6rem] text-[#52525b] tracking-wider mb-2">
                    APPS DÉTECTÉES ({result.detectedApps.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.detectedApps.map(app => {
                      const link = APP_LINKS[app];
                      return link ? (
                        <a
                          key={app}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#161616] border border-[#222] text-xs text-[#a1a1aa] font-mono px-2.5 py-1 rounded-lg hover:border-primary/30 hover:text-primary transition-colors flex items-center gap-1"
                        >
                          {app}
                          <span className="text-[0.6rem] opacity-50">↗</span>
                        </a>
                      ) : (
                        <span key={app} className="bg-[#161616] border border-[#222] text-xs text-[#a1a1aa] font-mono px-2.5 py-1 rounded-lg">
                          {app}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Best sellers ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-base text-white">
                {result.bestSellersFromCollection ? "Best sellers" : "Top produits"}
              </h3>
              {result.bestSellersFromCollection && (
                <span className="font-mono text-[0.6rem] text-primary bg-primary/8 border border-primary/20 px-2 py-0.5 rounded-full tracking-wider">
                  COLLECTION OFFICIELLE
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.bestSellers.map(p => (
                <div key={p.id} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl overflow-hidden flex hover:border-[#2a2a2a] transition-colors">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="w-20 h-20 object-cover flex-shrink-0" />
                  )}
                  <div className="p-4 flex-1 space-y-2 min-w-0">
                    <p className="font-heading font-bold text-sm text-white leading-snug line-clamp-2">{p.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-md text-sm">{formatPrice(p.price)}</span>
                      {p.productType && (
                        <span className="font-mono text-[0.65rem] text-[#52525b] truncate ml-2">{p.productType}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Score d'opportunité produit ── */}
          {result.topProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-white">Score d'opportunité</h3>
                <span className="font-mono text-[0.6rem] text-[#52525b] bg-[#161616] border border-[#222] px-2 py-0.5 rounded-full tracking-wider">PRODUITS</span>
              </div>
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl overflow-hidden">
                {[...result.topProducts]
                  .sort((a, b) => b.opportunityScore - a.opportunityScore)
                  .slice(0, 6)
                  .map((p, i) => {
                    const color = p.opportunityScore >= 80 ? "#00ff87" : p.opportunityScore >= 50 ? "#f59e0b" : "#71717a";
                    return (
                      <div key={p.id} className={`flex items-center gap-4 px-4 py-3 ${i < result.topProducts.length - 1 ? "border-b border-[#161616]" : ""}`}>
                        <span className="font-mono text-[0.65rem] text-[#3f3f46] w-4 flex-shrink-0">#{i + 1}</span>
                        {p.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 opacity-80" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white font-medium truncate">{p.title}</p>
                          <p className="text-[0.65rem] text-[#52525b] font-mono">{p.price > 0 ? `${p.price}€` : "—"}{p.productType ? ` · ${p.productType}` : ""}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-16 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${p.opportunityScore}%`, background: color }} />
                          </div>
                          <span className="font-mono text-xs font-bold w-8 text-right" style={{ color }}>{p.opportunityScore}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ── Tous les produits avec saturation ── */}
          {result.topProducts.some(p => p.saturation_score !== null) && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-base text-white">Saturation par produit</h3>
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-4 space-y-3">
                {result.topProducts.filter(p => p.saturation_score !== null).map(p => (
                  <ScoreBar
                    key={p.id}
                    score={p.saturation_score!}
                    label={`${p.title.slice(0, 40)}${p.title.length > 40 ? "…" : ""} — "${p.adKeyword}"`}
                    colorMode="saturation"
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Boutiques similaires ── */}
          {result.similarSites && result.similarSites.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-white">Boutiques similaires</h3>
                <span className="font-mono text-[0.6rem] text-[#52525b] bg-[#161616] border border-[#222] px-2 py-0.5 rounded-full tracking-wider">CONCURRENTS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.similarSites.map(site => (
                  <div key={site.domain} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-4 flex items-start gap-3 hover:border-[#2a2a2a] transition-colors">
                    {site.favicon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={site.favicon} alt="" className="w-8 h-8 rounded-lg flex-shrink-0 bg-[#161616]" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div className="w-8 h-8 rounded-lg flex-shrink-0 bg-[#161616] border border-[#222] flex items-center justify-center text-xs text-[#52525b]">
                        {site.domain[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-heading font-bold text-sm text-white truncate">{site.domain}</p>
                        <button
                          onClick={() => analyze(site.domain)}
                          className="font-mono text-[0.6rem] text-primary border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-md hover:bg-primary/10 transition-colors flex-shrink-0"
                        >
                          Scanner →
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {site.visits && (
                          <span className="font-mono text-[0.65rem] text-[#52525b]">👁 {formatVisits(site.visits)}/mois</span>
                        )}
                        {site.globalRank && (
                          <span className="font-mono text-[0.65rem] text-[#52525b]">🌐 #{site.globalRank.toLocaleString("fr")}</span>
                        )}
                        {site.topCountry && (
                          <span className="font-mono text-[0.65rem] text-[#52525b]">📍 {site.topCountry}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Analyse IA ── */}
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
