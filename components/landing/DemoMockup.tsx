import { ScoreGauge } from "@/components/ui/ScoreGauge";

export function DemoMockup() {
  return (
    <section className="py-20 bg-[#080808]" id="rapport">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="section-tag">Exemple de rapport</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mt-4">
            Ce que tu obtiens <span className="gradient-text">en 5 secondes.</span>
          </h2>
          <p className="text-[#71717a] text-sm mt-3">Rapport simulé — boutique fitness fictive</p>
        </div>

        {/* Rapport card */}
        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-3xl overflow-hidden shadow-card-lg">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#1a1a1a] flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-mono text-xs text-[#52525b] mb-1">BOUTIQUE ANALYSÉE</p>
              <p className="font-heading font-bold text-white">gymshark-example.myshopify.com</p>
            </div>
            <ScoreGauge score={82} label="Winner Score" size={110} />
          </div>

          {/* Grid métriques */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#1a1a1a]">
            {[
              { label: "Prix conseillé", val: "49€ – 69€", icon: "💰", color: "" },
              { label: "Saturation", val: "Moyenne", icon: "📊", color: "text-[#f59e0b]" },
              { label: "Google Trends", val: "+31% / 30j", icon: "📈", color: "text-primary" },
              { label: "Thème Shopify", val: "Prestige", icon: "🎨", color: "" },
            ].map(({ label, val, icon, color }) => (
              <div key={label} className="p-4 border-r border-[#1a1a1a] last:border-r-0 text-center">
                <div className="text-xl mb-1">{icon}</div>
                <div className={`font-heading font-bold text-base ${color || "text-white"}`}>{val}</div>
                <div className="font-mono text-[0.6rem] text-[#52525b] mt-0.5 tracking-wider">{label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-6">
            {/* Hook marketing */}
            <div className="space-y-3">
              <p className="font-mono text-xs text-[#52525b] tracking-wider">HOOK MARKETING DÉTECTÉ</p>
              <div className="bg-[#111111] border border-[#222] rounded-xl p-4">
                <p className="text-white font-semibold text-sm leading-relaxed">
                  "Luxe accessible, rareté, preuve sociale"
                </p>
                <p className="text-[#71717a] text-xs mt-2">Angle : Transformation + statut + achat impulsif</p>
              </div>

              <p className="font-mono text-xs text-[#52525b] tracking-wider mt-4">APPS DÉTECTÉES</p>
              <div className="flex gap-2 flex-wrap">
                {["Klaviyo", "Judge.me", "ReConvert"].map(app => (
                  <span key={app} className="bg-[#111111] border border-[#222] text-[#a1a1aa] text-xs px-3 py-1.5 rounded-lg font-mono">
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Fiche IA */}
            <div className="space-y-3">
              <p className="font-mono text-xs text-[#52525b] tracking-wider">FICHE PRODUIT IA</p>
              <div className="bg-[#111111] border border-[#222] rounded-xl p-4 space-y-3">
                <p className="text-white font-heading font-bold text-sm">
                  Legging Performance Ultra-Flex — Confort extrême, maintien pro
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Tissu 4 voies pour liberté totale de mouvement",
                    "Coupe sculptante, taille haute maintien ventre plat",
                    "Séchage rapide, résistant à 40 lavages",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-[#71717a]">
                      <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-[#1a1a1a]">
                  <p className="text-[0.65rem] font-mono text-[#52525b]">10 mots-clés SEO inclus</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {["legging sport femme", "fitness yoga", "taille haute"].map(k => (
                      <span key={k} className="bg-primary/8 text-primary text-[0.6rem] px-2 py-0.5 rounded border border-primary/15 font-mono">
                        {k}
                      </span>
                    ))}
                    <span className="text-[#52525b] text-[0.6rem] py-0.5">+7 autres</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA blur overlay */}
          <div className="relative border-t border-[#1a1a1a] overflow-hidden rounded-b-3xl">
            <div className="px-6 py-8 opacity-20 pointer-events-none space-y-2">
              <div className="h-3 bg-[#222] rounded w-3/4" />
              <div className="h-3 bg-[#222] rounded w-1/2" />
              <div className="h-3 bg-[#222] rounded w-2/3" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/90 to-transparent flex items-center justify-center">
              <div className="text-center space-y-3">
                <p className="text-white font-heading font-bold text-lg">Débloquer le rapport complet</p>
                <a href="/login">
                  <button className="btn-neon px-8 py-3 text-sm">
                    Accéder à ShopiSpy →
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
