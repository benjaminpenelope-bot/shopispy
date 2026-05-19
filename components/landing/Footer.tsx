export function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <span className="font-heading font-bold text-lg">ShopiSpy</span>
            </div>
            <p className="text-[#94a3b8] text-sm leading-relaxed">
              Outil de veille produit pour les ecommerçants Shopify qui veulent gagner.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Produit",
              links: ["Features", "Tarifs", "Changelog", "Roadmap"],
            },
            {
              title: "Ressources",
              links: ["Blog", "Guide Shopify", "FAQ", "Support"],
            },
            {
              title: "Légal",
              links: ["CGU", "Politique de confidentialité", "Cookies"],
            },
          ].map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="font-sans font-semibold text-sm text-white">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[#94a3b8] text-sm hover:text-white transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#64748b] text-sm">
            © 2025 ShopiSpy · Conçu pour les ecommerçants qui gagnent.
          </p>
          <div className="flex items-center gap-4">
            {["TikTok", "Instagram", "Twitter"].map((s) => (
              <a key={s} href="#" className="text-[#64748b] text-sm hover:text-white transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
