"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "Est-ce que ShopiSpy copie exactement les boutiques ?",
    a: "Non. L'outil analyse, reformule et génère une base de travail à adapter. L'objectif est de s'inspirer intelligemment, pas de dupliquer bêtement.",
  },
  {
    q: "À qui s'adresse ShopiSpy ?",
    a: "Aux débutants Shopify, e-commerçants, créateurs de boutiques et freelances qui veulent gagner du temps sur l'analyse concurrentielle.",
  },
  {
    q: "Est-ce que je peux scanner n'importe quelle boutique ?",
    a: "Tu peux analyser les boutiques accessibles publiquement. Certaines données peuvent varier selon la structure du site.",
  },
  {
    q: "Est-ce que Google Trends est inclus ?",
    a: "Oui. ShopiSpy intègre un indicateur de momentum pour repérer si un produit est en croissance, stable ou en perte d'intérêt.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 bg-[#080808]" id="faq">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <span className="section-tag">FAQ</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white tracking-tight">
            Questions fréquentes
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`bg-[#0d0d0d] border rounded-xl overflow-hidden transition-all duration-200 ${
                open === i ? "border-primary/30" : "border-[#1e1e1e] hover:border-[#2a2a2a]"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
              >
                <span className="font-sans font-semibold text-sm text-white">{faq.q}</span>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  open === i ? "bg-primary text-[#080808] rotate-45" : "bg-[#1a1a1a] text-[#52525b]"
                }`}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-[#71717a] text-sm leading-relaxed border-t border-[#1a1a1a] pt-4">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-[#52525b] text-sm mt-10 font-mono">
          Une question ?{" "}
          <a href="mailto:hello@shopispy.io" className="text-primary hover:underline">
            hello@shopispy.io
          </a>
        </p>
      </div>
    </section>
  );
}
