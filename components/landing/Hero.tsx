import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative pt-24 pb-6 overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#fdf4ff]">
      {/* Orbs décoratifs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-secondary/8 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Grille subtile */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Tag */}
        <div className="fade-up delay-0 flex justify-center">
          <span className="section-tag">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Ton outil de recherche produit, clé en main
          </span>
        </div>

        {/* Headline */}
        <h1 className="fade-up delay-100 font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-ink">
          Trouve des produits
          <br />
          <span className="gradient-text">gagnants</span> avant
          <br />
          tout le monde.
        </h1>

        {/* Sous-titre */}
        <p className="fade-up delay-200 text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Score de saturation en temps réel, veille sur les niches trending
          et génération de fiche produit <span className="font-semibold text-ink">via IA en 1 clic</span>.
        </p>

        {/* CTAs */}
        <div className="fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#waitlist">
            <Button size="lg" className="w-full sm:w-auto px-8 shadow-glow">
              🚀 Commencer gratuitement
            </Button>
          </a>
          <Link href="/dashboard/search">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Voir la démo →
            </Button>
          </Link>
        </div>

        {/* Proof */}
        <div className="fade-up delay-400 flex items-center justify-center gap-2 text-text-muted text-sm">
          <span className="flex -space-x-2">
            {["🧑‍💼","👩‍💻","🧑‍🚀","👨‍💻"].map((e, i) => (
              <span key={i} className="w-7 h-7 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-sm">
                {e}
              </span>
            ))}
          </span>
          <span>
            <strong className="text-ink">+340 ecommerçants</strong> utilisent ShopiSpy cette semaine
          </span>
        </div>

        {/* Stats */}
        <div className="fade-up delay-500 grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
          {[
            { val: "12k+", label: "Produits indexés" },
            { val: "340+", label: "Niches analysées" },
            { val: "< 5s", label: "Fiche générée" },
          ].map(({ val, label }) => (
            <div key={label} className="bg-white/70 backdrop-blur rounded-xl p-3 border border-white shadow-card text-center">
              <div className="font-heading font-extrabold text-xl sm:text-2xl gradient-text whitespace-nowrap">{val}</div>
              <div className="text-text-muted text-[0.65rem] sm:text-xs mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
