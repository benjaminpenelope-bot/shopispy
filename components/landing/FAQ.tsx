"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "ShopiSpy est-il adapté aux débutants en e-commerce ?",
    a: "Oui. L'interface est conçue pour être lisible même sans expérience préalable. Le score de saturation et le score de tendance te donnent une réponse claire en un coup d'œil. Pas besoin d'analyser des tableurs.",
  },
  {
    q: "Comment est calculé le score de saturation ?",
    a: "L'algorithme analyse le nombre de stores Shopify vendant le même produit, le volume d'annonces Meta/TikTok actives, la dynamique de reviews, et la densité de mots-clés SEO. Le tout est normalisé sur 100.",
  },
  {
    q: "La fiche produit générée est-elle prête à publier sur Shopify ?",
    a: "Quasiment. Elle contient le titre, la description, les bullet points bénéfices et les mots-clés SEO. Il te reste juste à ajouter tes photos produit et ajuster le prix final avant de publier.",
  },
  {
    q: "Est-ce que ShopiSpy fonctionne avec d'autres plateformes que Shopify ?",
    a: "Les données de veille sont issues de l'écosystème Shopify, mais les fiches IA générées peuvent être copiées sur WooCommerce, Wix, Prestashop ou n'importe quelle boutique.",
  },
  {
    q: "Puis-je annuler mon abonnement à tout moment ?",
    a: "Oui, sans conditions ni frais. Tu peux résilier depuis ton espace membre en 2 clics. Aucun engagement, aucun préavis.",
  },
  {
    q: "Les données produits sont-elles mises à jour régulièrement ?",
    a: "Le catalogue est mis à jour quotidiennement. Les scores de saturation et tendance sont recalculés toutes les 24h pour refléter les mouvements du marché en temps réel.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14">
          <span className="section-tag">FAQ</span>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-ink tracking-tight">
            Questions fréquentes
          </h2>
          <p className="text-text-muted">
            Tout ce que tu dois savoir avant de te lancer.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                open === i ? "border-[#c7d2fe] shadow-card" : "border-border hover:border-[#c7d2fe]"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
              >
                <span className="font-sans font-semibold text-sm text-ink">
                  {faq.q}
                </span>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    open === i
                      ? "bg-primary text-white rotate-45"
                      : "bg-bg-soft text-text-muted"
                  }`}
                >
                  +
                </span>
              </button>

              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-text-muted text-sm leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-text-muted text-sm mt-10">
          Une autre question ?{" "}
          <a href="mailto:hello@shopispy.io" className="text-primary font-semibold hover:underline">
            Écris-nous →
          </a>
        </p>
      </div>
    </section>
  );
}
