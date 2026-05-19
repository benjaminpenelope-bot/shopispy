import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { LogoIcon } from "@/components/ui/Logo";

const PRODUCTS = [
  {
    id: 1,
    title: "Lampe Sunset Projector LED",
    store: "hexdeco-store.myshopify.com",
    niche: "Déco chambre",
    price: "34,90 €",
    saturation: 21,
    trend: 93,
    orders: "4 200",
    satBadge: { label: "Opportunité 🟢", variant: "success" as const },
    trendBadge: { label: "Explosif 🔥", variant: "primary" as const },
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    featured: true,
  },
  {
    id: 2,
    title: "Pochette MagSafe Aimantée",
    store: "soundlab-fr.myshopify.com",
    niche: "Accessoires tech",
    price: "18,50 €",
    saturation: 19,
    trend: 92,
    orders: "5 400",
    satBadge: { label: "Opportunité 🟢", variant: "success" as const },
    trendBadge: { label: "Viral TikTok", variant: "primary" as const },
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&q=80",
    featured: false,
  },
  {
    id: 3,
    title: "Gourde Stanley Dupe Inox 1L",
    store: "hydrationco.myshopify.com",
    niche: "Lifestyle",
    price: "22,00 €",
    saturation: 69,
    trend: 61,
    orders: "8 700",
    satBadge: { label: "Saturé ⚠️", variant: "warning" as const },
    trendBadge: { label: "Stable", variant: "default" as const },
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",
    featured: false,
  },
];

export function DemoMockup() {
  return (
    <section className="bg-white pt-4 pb-24" id="features">
      <div className="max-w-6xl mx-auto px-6">

        {/* Label de section */}
        <div className="text-center space-y-4 mb-10">
          <span className="section-tag">Aperçu en direct</span>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-ink tracking-tight">
            Ce que tu vois dans<br />
            <span className="gradient-text">le dashboard.</span>
          </h2>
        </div>

        {/* Fenêtre navigateur */}
        <div className="rounded-2xl border border-[#e2e8f0] shadow-card-lg overflow-hidden">

          {/* Chrome barre */}
          <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] px-4 py-2.5 flex items-center gap-3">
            <div className="flex gap-1.5">
              {["#f87171","#fbbf24","#34d399"].map(c => (
                <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <div className="flex-1 max-w-sm mx-auto bg-white border border-[#e2e8f0] rounded-lg px-3 py-1.5 flex items-center gap-2">
              <svg className="w-3 h-3 text-[#94a3b8] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span className="font-mono text-[0.65rem] text-[#94a3b8] tracking-tight">
                shopispy.io/dashboard/search
              </span>
            </div>
          </div>

          {/* App shell */}
          <div className="flex min-h-[520px]">

            {/* Mini sidebar */}
            <div className="w-44 border-r border-[#e2e8f0] bg-white flex-shrink-0 p-3 space-y-1 hidden sm:block">
              <div className="flex items-center gap-2 px-2 py-2 mb-3">
                <LogoIcon className="w-6 h-6" />
                <span className="font-heading font-bold text-sm text-ink">ShopiSpy</span>
              </div>
              {[
                { icon: "🔍", label: "Recherche", active: true },
                { icon: "✨", label: "Mes fiches", active: false },
                { icon: "📊", label: "Analytics", active: false },
              ].map(item => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    item.active
                      ? "bg-bg-blue text-primary font-semibold"
                      : "text-[#94a3b8]"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Contenu principal */}
            <div className="flex-1 bg-[#f8fafc] p-5 space-y-4 overflow-hidden">

              {/* Search bar */}
              <div className="flex gap-2">
                <div className="flex-1 min-w-0 bg-white border border-[#e2e8f0] rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-card text-sm text-[#94a3b8] overflow-hidden">
                  <span className="text-base flex-shrink-0">🔍</span>
                  <span className="truncate">lampe déco tendance</span>
                  <span className="ml-auto flex-shrink-0 text-xs bg-[#f1f5f9] px-2 py-0.5 rounded-md text-[#94a3b8] font-mono whitespace-nowrap">
                    3 rés.
                  </span>
                </div>
                <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 rounded-xl flex items-center shadow-glow-sm flex-shrink-0 whitespace-nowrap">
                  Analyser
                </div>
              </div>

              {/* Filtres */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                {["Tous", "Opportunité 🟢", "Trending 🔥", "Saturé ⚠️"].map((f, i) => (
                  <div
                    key={f}
                    className={`text-[0.65rem] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${
                      i === 0
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-[#6b7280] border-[#e5e7eb]"
                    }`}
                  >
                    {f}
                  </div>
                ))}
              </div>

              {/* Grille produits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRODUCTS.map((p) => (
                  <div
                    key={p.id}
                    className={`bg-white rounded-xl border overflow-hidden shadow-card ${
                      p.featured ? "border-[#c7d2fe] ring-1 ring-[#c7d2fe]" : "border-[#e5e7eb]"
                    }`}
                  >
                    {/* Image produit */}
                    <div className="relative h-32 bg-[#f8fafc] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                      {p.featured && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full">
                          ⚡ Top tendance
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant={p.satBadge.variant}>
                          {p.satBadge.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 space-y-2">
                      <div>
                        <div className="font-heading font-bold text-xs text-ink leading-snug line-clamp-1">
                          {p.title}
                        </div>
                        <div className="text-[0.65rem] text-[#94a3b8] mt-0.5">{p.store}</div>
                      </div>

                      <div className="space-y-1.5">
                        <ScoreBar score={p.saturation} label="Saturation" colorMode="saturation" />
                        <ScoreBar score={p.trend} label="Tendance" colorMode="trend" />
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#f1f5f9]">
                        <div>
                          <div className="font-heading font-bold text-primary text-sm">{p.price}</div>
                          <div className="text-[0.6rem] text-[#94a3b8]">{p.orders} cmd/mois</div>
                        </div>
                        <div className="text-[0.65rem] font-bold text-white bg-gradient-to-r from-primary to-secondary px-2.5 py-1.5 rounded-lg">
                          ✨ Cloner
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Caption sous le mockup */}
        <p className="text-center text-sm text-text-muted mt-5">
          Données actualisées quotidiennement · Scores calculés sur + de 2 millions de produits Shopify
        </p>
      </div>
    </section>
  );
}
