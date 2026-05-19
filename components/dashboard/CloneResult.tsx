"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { formatPrice, saturationLabel, trendLabel } from "@/lib/utils";
import type { Product, ClonedProduct } from "@/types";

interface Props {
  product: Product;
}

type GenState = "idle" | "loading" | "done" | "error";

function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${
        copied
          ? "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]"
          : "bg-bg-soft text-text-muted border-border hover:border-primary hover:text-primary"
      }`}
    >
      {copied ? "✓ Copié" : label}
    </button>
  );
}

function ResultSection({
  label,
  icon,
  children,
  copyText,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
  copyText?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-card p-5 space-y-3 hover:border-[#c7d2fe] transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wider">
            {label}
          </span>
        </div>
        {copyText && <CopyButton text={copyText} />}
      </div>
      {children}
    </div>
  );
}

export function CloneResult({ product }: Props) {
  const [state, setState] = useState<GenState>("idle");
  const [result, setResult] = useState<Partial<ClonedProduct> | null>(null);
  const [error, setError] = useState("");

  async function generate() {
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
      setState("error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Produit source */}
      <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="bg-gradient-to-r from-bg-blue to-[#f5f3ff] px-6 py-4 border-b border-border">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Produit source
          </span>
        </div>
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Infos */}
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-ink leading-tight">
                {product.title}
              </h2>
              <p className="text-text-muted mt-1 text-sm">{product.niche}</p>
            </div>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {product.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <div className="space-y-3">
              <ScoreBar
                score={product.saturation_score}
                label={`Saturation — ${saturationLabel(product.saturation_score)}`}
                colorMode="saturation"
              />
              <ScoreBar
                score={product.trend_score}
                label={`Tendance — ${trendLabel(product.trend_score)}`}
                colorMode="trend"
              />
            </div>
          </div>

          {/* Stats grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {[
                { label: "Prix actuel", val: formatPrice(product.price, product.currency), icon: "💰" },
                { label: "Cmd / mois", val: `~${product.monthly_orders_estimate.toLocaleString("fr-FR")}`, icon: "📦" },
                { label: "Saturation", val: `${product.saturation_score}/100`, icon: "📊" },
                { label: "Tendance", val: `${product.trend_score}/100`, icon: "📈" },
              ].map(({ label, val, icon }) => (
                <div key={label} className="bg-bg-soft rounded-xl p-3 border border-border">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="font-heading font-bold text-primary text-base">{val}</div>
                  <div className="text-xs text-text-muted">{label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={generate}
              disabled={state === "loading"}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm py-3.5 rounded-xl shadow-glow-sm hover:shadow-glow hover:brightness-105 transition-all hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {state === "loading" ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Génération en cours…
                </>
              ) : state === "done" ? (
                "↺ Regénérer la fiche"
              ) : (
                "⚡ Générer la fiche produit IA"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Erreur */}
      {state === "error" && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4">
          <p className="text-sm text-danger font-medium">{error}</p>
        </div>
      )}

      {/* Skeleton loading */}
      {state === "loading" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border h-32 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-bg-soft via-[#e0e7ff]/40 to-bg-soft animate-shimmer"
                style={{ backgroundSize: "200% 100%" }} />
            </div>
          ))}
        </div>
      )}

      {/* Résultat */}
      {state === "done" && result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="section-tag">✨ Fiche générée par IA</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const content = [
                  `FICHE PRODUIT — ShopiSpy`,
                  `Produit : ${product.title}`,
                  ``,
                  `ACCROCHE\n${result.hook}`,
                  ``,
                  `TITRE\n${result.title}`,
                  ``,
                  `DESCRIPTION\n${result.description}`,
                  ``,
                  `POINTS CLÉS\n${result.bullet_points?.join("\n")}`,
                  ``,
                  `AUDIENCE CIBLE\n${result.target_audience}`,
                  ``,
                  `ANGLE PUBLICITAIRE\n${result.ad_angle}`,
                  ``,
                  `PRIX SUGGÉRÉ : ${result.suggested_price}€`,
                  result.suggested_price_rationale ?? "",
                  ``,
                  `MOTS-CLÉS SEO\n${result.seo_keywords?.join(", ")}`,
                ].join("\n");
                navigator.clipboard.writeText(content);
              }}
            >
              📋 Tout copier
            </Button>
          </div>

          {/* Hook */}
          {result.hook && (
            <div className="bg-gradient-to-r from-[#1e1b4b] to-[#312e81] rounded-2xl p-6 text-center space-y-2">
              <span className="text-xs font-semibold text-[#a5b4fc] uppercase tracking-wider">Accroche</span>
              <p className="font-heading font-extrabold text-2xl text-white leading-tight">
                "{result.hook}"
              </p>
              <CopyButton text={result.hook} label="Copier l'accroche" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.title && (
              <ResultSection label="Titre produit" icon="🏷️" copyText={result.title}>
                <p className="font-heading font-bold text-lg text-ink">{result.title}</p>
              </ResultSection>
            )}

            {result.target_audience && (
              <ResultSection label="Audience cible" icon="🎯" copyText={result.target_audience}>
                <p className="text-text-muted text-sm leading-relaxed">{result.target_audience}</p>
              </ResultSection>
            )}

            {result.ad_angle && (
              <ResultSection label="Angle publicitaire" icon="📣" copyText={result.ad_angle}>
                <p className="text-text-muted text-sm leading-relaxed italic">"{result.ad_angle}"</p>
              </ResultSection>
            )}

            {result.suggested_price && (
              <ResultSection label="Prix suggéré" icon="💰">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading font-extrabold text-3xl text-primary">
                    {formatPrice(result.suggested_price)}
                  </span>
                  <span className="text-xs text-text-muted">
                    vs {formatPrice(product.price)} actuel
                  </span>
                </div>
                {result.suggested_price_rationale && (
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    {result.suggested_price_rationale}
                  </p>
                )}
              </ResultSection>
            )}
          </div>

          {result.description && (
            <ResultSection label="Description produit" icon="📝" copyText={result.description}>
              <p className="text-ink/80 text-sm leading-relaxed">{result.description}</p>
            </ResultSection>
          )}

          {result.bullet_points && (
            <ResultSection label="Points clés bénéfices" icon="✅" copyText={result.bullet_points.join("\n")}>
              <ul className="space-y-2.5">
                {result.bullet_points.map((bp, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ink/80">
                    <span className="w-5 h-5 rounded-full bg-[#ecfdf5] text-[#059669] text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                      ✓
                    </span>
                    {bp}
                  </li>
                ))}
              </ul>
            </ResultSection>
          )}

          {result.seo_keywords && (
            <ResultSection label="Mots-clés SEO" icon="🔑" copyText={result.seo_keywords.join(", ")}>
              <div className="flex gap-2 flex-wrap">
                {result.seo_keywords.map((kw, i) => (
                  <Badge key={i} variant="primary">{kw}</Badge>
                ))}
              </div>
            </ResultSection>
          )}
        </div>
      )}
    </div>
  );
}
