"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ScanRecord = {
  id: string;
  url: string;
  product_count: number | null;
  avg_price: number | null;
  niche: string | null;
  score: number | null;
  theme_name: string | null;
  theme_category: string | null;
  created_at: string;
};

function ScoreDot({ score }: { score: number | null }) {
  if (score === null) return null;
  const color = score >= 76 ? "#00ff87" : score >= 56 ? "#a78bfa" : score >= 31 ? "#f59e0b" : "#ef4444";
  return (
    <span className="font-mono text-xs font-bold" style={{ color }}>{score}</span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function ScanHistory() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/scan-history")
      .then(r => r.json())
      .then(d => setScans(d.scans ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch("/api/scan-history", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setScans(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
  }

  function handleRescan(url: string) {
    router.push(`/dashboard/spy?url=${encodeURIComponent(url)}`);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl h-16 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#111] animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
          </div>
        ))}
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-10 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#161616] border border-[#222] flex items-center justify-center text-2xl mx-auto">🕵️</div>
        <div>
          <p className="font-heading font-bold text-white">Aucun scan enregistré</p>
          <p className="text-[#52525b] text-sm mt-1">Lance ton premier scan pour le retrouver ici.</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/spy")}
          className="btn-neon px-5 py-2.5 text-sm rounded-xl"
        >
          Scanner une boutique →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scans.map(scan => (
        <div
          key={scan.id}
          className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-4 flex items-center gap-4 hover:border-[#2a2a2a] transition-colors group"
        >
          {/* Score */}
          <div className="w-10 flex-shrink-0 text-center">
            <ScoreDot score={scan.score} />
            {scan.score === null && <span className="text-[#3f3f46] text-xs">—</span>}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="font-heading font-bold text-sm text-white truncate">{scan.url.replace(/^https?:\/\//, "")}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {scan.niche && <span className="font-mono text-[0.65rem] text-[#71717a]">{scan.niche}</span>}
              {scan.product_count && <span className="font-mono text-[0.65rem] text-[#52525b]">{scan.product_count} produits</span>}
              {scan.avg_price && <span className="font-mono text-[0.65rem] text-[#52525b]">{scan.avg_price}€ moy.</span>}
              {scan.theme_name && (
                <span className={`font-mono text-[0.65rem] ${scan.theme_category === "premium" ? "text-[#f59e0b]" : scan.theme_category === "custom" ? "text-primary" : "text-[#52525b]"}`}>
                  {scan.theme_name}
                </span>
              )}
            </div>
          </div>

          {/* Date */}
          <span className="font-mono text-[0.65rem] text-[#3f3f46] flex-shrink-0 hidden md:block">{formatDate(scan.created_at)}</span>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleRescan(scan.url)}
              className="font-mono text-[0.65rem] text-primary border border-primary/20 bg-primary/5 px-2.5 py-1 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Rescanner →
            </button>
            <button
              onClick={() => handleDelete(scan.id)}
              disabled={deleting === scan.id}
              className="font-mono text-[0.65rem] text-[#52525b] border border-[#222] px-2 py-1 rounded-lg hover:text-danger hover:border-danger/30 transition-colors"
            >
              {deleting === scan.id ? "…" : "✕"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
