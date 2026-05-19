"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Hero() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  function handleScan() {
    router.push("/dashboard/spy");
  }

  return (
    <section className="relative pt-28 pb-12 overflow-hidden bg-[#080808]">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#00ff87 1px, transparent 1px), linear-gradient(90deg, #00ff87 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Badges */}
        <div className="fade-up delay-0 flex flex-wrap items-center justify-center gap-2">
          {["Beta privée", "Marché FR", "Accès fondateur"].map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] font-semibold text-primary bg-primary/8 border border-primary/20 px-3 py-1 rounded-full tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {b}
            </span>
          ))}
        </div>

        {/* Headline */}
        <h1 className="fade-up delay-100 font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white">
          Espionne les boutiques
          <br />
          Shopify qui{" "}
          <span className="gradient-text">gagnent déjà.</span>
        </h1>

        {/* Subheadline */}
        <p className="fade-up delay-200 text-[#71717a] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Colle une URL Shopify. ShopiSpy analyse les produits, hooks marketing, prix, apps, tendances et angles gagnants pour t'aider à lancer plus vite.
        </p>

        {/* URL Input */}
        <div className="fade-up delay-300 max-w-xl mx-auto">
          <div className="flex gap-2 p-1.5 bg-[#111111] border border-[#2a2a2a] rounded-2xl focus-within:border-primary/50 focus-within:shadow-glow-sm transition-all">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleScan()}
              placeholder="Colle une URL Shopify…"
              className="flex-1 bg-transparent border-none px-4 py-3 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-none focus:ring-0"
            />
            <button onClick={handleScan} className="btn-neon px-5 py-3 text-sm flex-shrink-0 rounded-xl">
              Scanner →
            </button>
          </div>
          <p className="mt-3 text-[0.7rem] text-[#52525b] font-mono tracking-wide">
            Détection Shopify • Analyse marketing • Fiche produit IA
          </p>
        </div>

        {/* CTA secondaire */}
        <div className="fade-up delay-400">
          <a href="#demo" className="inline-flex items-center gap-2 text-sm text-[#71717a] hover:text-white transition-colors group">
            <span className="w-6 h-6 rounded-full border border-[#333] flex items-center justify-center group-hover:border-primary/50 transition-colors">▶</span>
            Voir un exemple de rapport
          </a>
        </div>

        {/* Social proof minimal */}
        <div className="fade-up delay-500 flex items-center justify-center gap-6 text-[#52525b] text-xs font-mono pt-4 border-t border-[#111111]">
          <span>✓ Aucune carte requise</span>
          <span>✓ Accès immédiat</span>
          <span>✓ Beta privée active</span>
        </div>
      </div>
    </section>
  );
}
