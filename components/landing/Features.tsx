const FEATURES = [
  {
    icon: "🕵️",
    tag: "Core",
    title: "Espionnage Shopify",
    desc: "Colle n'importe quelle URL Shopify. ShopiSpy extrait les produits, prix, structure et signaux de performance en quelques secondes.",
  },
  {
    icon: "🎣",
    tag: "Marketing",
    title: "Hooks marketing",
    desc: "Détecte les angles émotionnels utilisés par la boutique : rareté, preuve sociale, transformation, urgence. Réutilisables directement.",
  },
  {
    icon: "✨",
    tag: "IA",
    title: "Fiche produit IA",
    desc: "Titre, description, bullet points bénéfices, audience cible, angle pub et prix conseillé. GPT-4o calibré e-commerce FR.",
  },
  {
    icon: "🔧",
    tag: "Technique",
    title: "Apps & thème détectés",
    desc: "Klaviyo, Judge.me, ReConvert, Loox… Vois exactement quels outils utilisent les boutiques qui performent.",
  },
  {
    icon: "🏆",
    tag: "Score",
    title: "Winner Score",
    desc: "Un score de 0 à 100 calculé à partir des données réelles : saturation marché, tendance, prix, positionnement concurrentiel.",
  },
  {
    icon: "📈",
    tag: "Tendance",
    title: "Google Trends Momentum",
    desc: "Indicateur de croissance sur 30 jours. Repère si un produit monte fort, se stabilise ou perd de l'intérêt avant de te lancer.",
  },
  {
    icon: "📊",
    tag: "Données",
    title: "Saturation Level",
    desc: "Basé sur les annonces Facebook Ads actives en France et les volumes AliExpress. Tu sais si le marché est encore prenable.",
  },
  {
    icon: "🗂️",
    tag: "Historique",
    title: "Historique des scans",
    desc: "Retrouve toutes tes boutiques analysées, leurs scores et tes fiches IA générées. Organisé, consultable, exportable.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-[#080808]" id="features">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14">
          <span className="section-tag">Fonctionnalités</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight">
            Tout ce qu'il faut pour
            <br />
            <span className="gradient-text">lancer le bon produit.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="neon-card p-5 space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{f.icon}</span>
                <span className="font-mono text-[0.6rem] text-[#52525b] bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#222] tracking-wider">
                  {f.tag}
                </span>
              </div>
              <h3 className="font-heading font-bold text-sm text-white">{f.title}</h3>
              <p className="text-[#71717a] text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-14 bg-[#0d1a0f] border border-primary/20 rounded-2xl p-8 text-center space-y-4">
          <div className="font-mono text-primary text-2xl tracking-widest">★★★★★</div>
          <blockquote className="font-sans text-base font-medium max-w-2xl mx-auto text-white leading-relaxed">
            "J'ai trouvé 3 produits exploitables en 20 minutes. Le score de saturation m'a évité de me lancer sur un marché mort. Outil indispensable."
          </blockquote>
          <div className="font-mono text-xs text-[#52525b]">
            — Thomas R., e-commerçant Shopify depuis 2 ans
          </div>
        </div>
      </div>
    </section>
  );
}
