export function WhyItWorks() {
  return (
    <section className="py-20 bg-[#080808]" id="why">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="section-tag">Comparaison</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mt-4">
            Pourquoi ça <span className="gradient-text">change tout.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Avant */}
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#52525b] text-sm font-bold">✕</span>
              <p className="font-heading font-bold text-[#71717a]">La plupart des débutants</p>
            </div>
            <ul className="space-y-3">
              {[
                "Testent des produits au hasard",
                "Copient mal sans comprendre pourquoi ça marche",
                "Perdent des semaines sans données",
                "Lancent avec zéro validation marché",
                "Se font griller par la concurrence",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#52525b]">
                  <span className="text-[#3f3f46] mt-0.5 flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Après */}
          <div className="bg-[#0d1a0f] border border-primary/20 rounded-2xl p-6 space-y-4 shadow-glow-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">✓</span>
              <p className="font-heading font-bold text-white">Avec ShopiSpy</p>
            </div>
            <ul className="space-y-3">
              {[
                "Analyse ce qui vend déjà chez les concurrents",
                "Détecte les angles marketing gagnants",
                "Valide la tendance marché en temps réel",
                "Génère une base produit prête à retravailler",
                "Lance plus vite, avec moins de risques",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#a1a1aa]">
                  <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
