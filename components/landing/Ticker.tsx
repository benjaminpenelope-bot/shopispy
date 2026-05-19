"use client";

const items = [
  { icon: "🔥", text: "Produits gagnants" },
  { icon: "📊", text: "Score de saturation" },
  { icon: "✨", text: "Fiche produit IA" },
  { icon: "🎯", text: "Veille concurrentielle" },
  { icon: "💡", text: "Niches inexploitées" },
  { icon: "📈", text: "Trending maintenant" },
  { icon: "🛒", text: "Analyse marché" },
  { icon: "⚡", text: "1 clic → fiche complète" },
];

export function Ticker() {
  const doubled = [...items, ...items];

  return (
    <div className="bg-white border-y border-border overflow-hidden py-3.5">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-2.5 px-6 whitespace-nowrap">
            <span className="font-sans text-sm font-medium text-ink flex items-center gap-2">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </span>
            <span className="text-[#c7d2fe] text-xs select-none">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
