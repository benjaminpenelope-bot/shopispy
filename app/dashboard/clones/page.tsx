import Link from "next/link";

export default function ClonesPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <span className="section-tag">Mes fiches IA</span>
        <h1 className="font-heading font-extrabold text-3xl text-ink mt-3">
          Fiches générées
        </h1>
        <p className="text-text-muted text-sm">
          Toutes tes fiches produit créées avec l'IA, prêtes à copier dans Shopify.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-card py-24 text-center space-y-4">
        <div className="text-5xl">✨</div>
        <p className="font-heading font-bold text-xl text-ink">
          Aucune fiche pour l'instant
        </p>
        <p className="text-text-muted text-sm max-w-xs mx-auto">
          Génère ta première fiche depuis la recherche produit. Ça prend moins de 5 secondes.
        </p>
        <Link
          href="/dashboard/search"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-glow-sm hover:shadow-glow transition-all hover:-translate-y-px mt-2"
        >
          🔍 Rechercher un produit
        </Link>
      </div>
    </div>
  );
}
