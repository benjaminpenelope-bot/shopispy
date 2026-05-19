const FEATURES = [
  {
    icon: "📊",
    tag: "Facebook Ads + AliExpress",
    title: "Score de saturation réel",
    desc: "Compte en direct les publicités Facebook actives sur chaque produit et croise avec les volumes de vente AliExpress. Tu sais exactement si un marché est saturé ou encore prenable.",
    color: "bg-[#eef2ff]",
    iconBg: "bg-[#e0e7ff]",
  },
  {
    icon: "🕵️",
    tag: "Shopify Spy",
    title: "Analyse n'importe quelle boutique",
    desc: "Entre l'URL d'une boutique Shopify pour voir tous ses produits, leurs scores de saturation et une analyse IA complète de son positionnement et de ses opportunités.",
    color: "bg-[#fdf4ff]",
    iconBg: "bg-[#f3e8ff]",
  },
  {
    icon: "✨",
    tag: "IA Générative",
    title: "Fiche produit IA en 1 clic",
    desc: "Génère titre accrocheur, description optimisée, bullet bénéfices, audience cible, angle pub et fourchette de prix. GPT-4o, calibré e-commerce FR.",
    color: "bg-[#fffbeb]",
    iconBg: "bg-[#fef3c7]",
  },
  {
    icon: "🔑",
    tag: "SEO",
    title: "10 mots-clés SEO inclus",
    desc: "Chaque fiche générée embarque les 10 mots-clés SEO les plus pertinents, prêts à copier dans Shopify pour booster ta visibilité organique dès le lancement.",
    color: "bg-[#ecfdf5]",
    iconBg: "bg-[#d1fae5]",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-white" id="features-detail">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="section-tag">Fonctionnalités</span>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-ink tracking-tight">
            Tout ce qu'il faut pour
            <br />
            <span className="gradient-text">lancer le bon produit.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`${f.color} rounded-2xl p-8 border border-border hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group`}
            >
              <div className="flex items-start gap-4">
                <div className={`${f.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                  {f.icon}
                </div>
                <div className="space-y-2">
                  <span className="inline-block text-[0.7rem] font-semibold uppercase tracking-wider text-text-muted bg-white/70 px-2.5 py-0.5 rounded-full border border-border">
                    {f.tag}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-ink">{f.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof strip */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center space-y-4">
          <div className="text-4xl">⭐⭐⭐⭐⭐</div>
          <blockquote className="font-sans text-lg font-medium max-w-2xl mx-auto leading-relaxed opacity-95">
            "J'ai trouvé 3 produits gagnants en 20 minutes. Le score de saturation m'a évité de me lancer sur un marché déjà mort. Outil indispensable."
          </blockquote>
          <div className="font-sans text-sm opacity-80">
            — Thomas R., ecommerçant Shopify depuis 2 ans
          </div>
        </div>
      </div>
    </section>
  );
}
