import { Button } from "@/components/ui/Button";

const PLANS = [
  {
    name: "Starter",
    price: "29",
    desc: "Pour tester et valider tes premières niches.",
    features: [
      "50 recherches / mois",
      "Score saturation inclus",
      "10 fiches IA / mois",
      "Export CSV",
    ],
    cta: "Commencer",
    highlight: false,
    color: "bg-bg-soft",
  },
  {
    name: "Pro",
    price: "79",
    desc: "Pour les ecommerçants actifs qui scalent.",
    features: [
      "Recherches illimitées",
      "Score saturation avancé",
      "Fiches IA illimitées",
      "Mots-clés SEO complets",
      "Alertes nouvelles niches",
      "Support prioritaire",
    ],
    cta: "Passer Pro 🚀",
    highlight: true,
    color: "bg-gradient-to-b from-[#1e1b4b] to-[#312e81]",
  },
  {
    name: "Agency",
    price: "199",
    desc: "Pour les agences et les multi-stores.",
    features: [
      "Tout ce qu'il y a dans Pro",
      "5 membres d'équipe",
      "API access",
      "White-label export",
      "Onboarding dédié",
    ],
    cta: "Nous contacter",
    highlight: false,
    color: "bg-bg-soft",
  },
];

export function Pricing() {
  return (
    <section className="py-24 bg-bg-soft" id="tarifs">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="section-tag">Tarifs</span>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-ink tracking-tight">
            Simple. <span className="gradient-text">Transparent.</span>
          </h2>
          <p className="text-text-muted max-w-sm mx-auto">
            Sans engagement. Annule quand tu veux. Essai gratuit inclus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover ${
                plan.highlight
                  ? "border-transparent shadow-glow relative"
                  : "border-border shadow-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                  <span className="bg-gradient-to-r from-primary to-secondary text-white text-[0.7rem] font-bold px-4 py-1.5 rounded-full shadow-glow-sm whitespace-nowrap">
                    ⚡ Le plus populaire
                  </span>
                </div>
              )}

              <div className={`p-8 space-y-6 rounded-2xl overflow-hidden ${plan.color} ${plan.highlight ? "pt-10" : ""}`}>
                <div>
                  <div className={`font-sans text-xs font-bold uppercase tracking-widest ${plan.highlight ? "text-[#a5b4fc]" : "text-text-muted"}`}>
                    {plan.name}
                  </div>
                  <div className={`font-heading font-extrabold text-4xl mt-1 ${plan.highlight ? "text-white" : "text-ink"}`}>
                    {plan.price}€
                    <span className={`font-sans text-sm font-normal ml-1 ${plan.highlight ? "text-[#a5b4fc]" : "text-text-muted"}`}>
                      /mois
                    </span>
                  </div>
                  <p className={`text-sm mt-2 ${plan.highlight ? "text-[#c7d2fe]" : "text-text-muted"}`}>
                    {plan.desc}
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? "text-[#e0e7ff]" : "text-ink/80"}`}>
                      <span className={`text-base ${plan.highlight ? "text-[#a5b4fc]" : "text-success"}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlight ? "secondary" : "outline"}
                  className={`w-full ${plan.highlight ? "!bg-white !text-primary hover:!bg-bg-blue" : ""}`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-text-muted text-sm mt-8">
          💳 Paiement sécurisé par Stripe · Pas de CB requise pour l'essai
        </p>
      </div>
    </section>
  );
}
