export function Pricing() {
  return (
    <section className="py-20 bg-[#080808]" id="tarifs">
      <div className="max-w-lg mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <span className="section-tag">Tarifs</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white tracking-tight">
            Une offre. <span className="gradient-text">À vie.</span>
          </h2>
          <p className="text-[#71717a] text-sm">
            Places limitées pendant la beta.
          </p>
        </div>

        <div className="relative">
          {/* Badge */}
          <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
            <span className="bg-primary text-[#080808] text-[0.7rem] font-bold px-4 py-1.5 rounded-full shadow-glow-sm font-mono tracking-wider">
              ⚡ FOUNDERS ACCESS
            </span>
          </div>

          <div className="bg-[#0d1a0f] border border-primary/30 rounded-3xl p-8 pt-10 shadow-glow space-y-8">
            {/* Prix */}
            <div className="text-center">
              <div className="font-heading font-extrabold text-6xl text-white">
                59€
              </div>
              <div className="font-mono text-xs text-primary mt-1 tracking-wider">ACCÈS À VIE</div>
              <p className="text-[#71717a] text-sm mt-3">
                Paiement unique. Zéro abonnement. Toutes les mises à jour incluses.
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {[
                "Accès lifetime à toutes les fonctionnalités",
                "Toutes les futures mises à jour incluses",
                "Accès beta privée prioritaire",
                "Support direct par message",
                "Templates e-commerce inclus",
                "Historique illimité des scans",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                  <span className="text-primary flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="space-y-3">
              <a href="/login">
                <button className="btn-neon w-full py-4 text-base font-bold">
                  Rejoindre les fondateurs →
                </button>
              </a>
              <p className="text-center font-mono text-xs text-[#52525b]">
                🔒 Paiement sécurisé · Accès immédiat
              </p>
            </div>

            {/* Rareté */}
            <div className="bg-[#111111] border border-[#222] rounded-xl p-3 text-center">
              <p className="font-mono text-xs text-[#71717a]">
                <span className="text-primary font-bold">Places limitées</span> pendant la beta privée.
                <br />Le prix augmentera au lancement public.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
