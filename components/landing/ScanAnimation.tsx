"use client";
import { useState, useEffect } from "react";

const STEPS = [
  { label: "Détection Shopify", delay: 0 },
  { label: "Extraction des produits", delay: 600 },
  { label: "Analyse hooks marketing", delay: 1300 },
  { label: "Détection apps installées", delay: 2100 },
  { label: "Calcul Winner Score", delay: 3000 },
  { label: "Génération fiche produit IA", delay: 3900 },
];

export function ScanAnimation() {
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [current, setCurrent] = useState(-1);

  function startScan() {
    setActive(true);
    setCompleted([]);
    setCurrent(0);
  }

  useEffect(() => {
    if (!active || current < 0) return;
    if (current >= STEPS.length) return;

    const t = setTimeout(() => {
      setCompleted(prev => [...prev, current]);
      if (current < STEPS.length - 1) setCurrent(current + 1);
      else setCurrent(STEPS.length);
    }, 700);

    return () => clearTimeout(t);
  }, [active, current]);

  const done = current === STEPS.length;

  return (
    <section className="py-20 bg-[#080808]" id="demo">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="section-tag">Simulation</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mt-4">
            Un scan qui prend <span className="gradient-text">5 secondes.</span>
          </h2>
        </div>

        {/* Terminal window */}
        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl overflow-hidden shadow-card-lg">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a1a] bg-[#111111]">
            <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="w-3 h-3 rounded-full bg-[#00ff87]" />
            <span className="ml-3 font-mono text-xs text-[#52525b]">shopispy — scan</span>
          </div>

          <div className="p-6 space-y-3 min-h-[280px]">
            {/* Input line */}
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-primary">$</span>
              <span className="text-[#a1a1aa]">shopispy scan</span>
              <span className="text-white">gymshark.com</span>
              {!active && <span className="cursor-blink text-white" />}
            </div>

            {active && (
              <div className="space-y-2 pt-1">
                {STEPS.map((step, i) => {
                  const isCompleted = completed.includes(i);
                  const isRunning = current === i;
                  const visible = isCompleted || isRunning;
                  if (!visible) return null;
                  return (
                    <div key={i} className="scan-step flex items-center gap-3 font-mono text-sm" style={{ animationDelay: "0ms" }}>
                      {isCompleted ? (
                        <span className="text-primary font-bold">✓</span>
                      ) : (
                        <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin inline-block" />
                      )}
                      <span className={isCompleted ? "text-[#a1a1aa]" : "text-white"}>
                        {step.label}
                        {isRunning && <span className="cursor-blink" />}
                      </span>
                      {isCompleted && <span className="text-[#52525b] text-xs ml-auto">ok</span>}
                    </div>
                  );
                })}

                {done && (
                  <div className="scan-step mt-4 pt-4 border-t border-[#1a1a1a] space-y-1">
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <span className="text-primary">→</span>
                      <span className="text-white font-semibold">Rapport généré</span>
                      <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded font-bold border border-primary/20">
                        Score : 82/100
                      </span>
                    </div>
                    <p className="font-mono text-xs text-[#52525b] ml-5">Voir le rapport complet ↓</p>
                  </div>
                )}
              </div>
            )}

            {!active && (
              <div className="flex items-center justify-center h-40">
                <button onClick={startScan} className="btn-neon px-6 py-3 text-sm flex items-center gap-2">
                  ▶ Lancer la simulation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
