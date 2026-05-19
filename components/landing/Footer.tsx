import { LogoIcon } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#111111]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#111111]">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <LogoIcon className="w-7 h-7" />
              <span className="font-heading font-bold text-lg text-white">ShopiSpy</span>
            </div>
            <p className="text-[#52525b] text-sm leading-relaxed max-w-xs font-mono">
              L'avantage Shopify des débutants malins.
            </p>
            <div className="flex gap-3">
              {["TikTok", "Instagram", "Twitter"].map((s) => (
                <a key={s} href="#" className="text-[#3f3f46] text-xs hover:text-primary transition-colors font-mono">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Produit",
              links: [
                { label: "Fonctionnalités", href: "#features" },
                { label: "Tarifs", href: "#tarifs" },
                { label: "FAQ", href: "#faq" },
              ],
            },
            {
              title: "Légal",
              links: [
                { label: "Mentions légales", href: "#" },
                { label: "Confidentialité", href: "#" },
                { label: "Contact", href: "mailto:hello@shopispy.io" },
              ],
            },
          ].map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="font-mono font-semibold text-xs text-[#52525b] tracking-wider uppercase">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[#71717a] text-sm hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#3f3f46] text-xs font-mono">
            © 2025 ShopiSpy · Conçu pour les e-commerçants qui gagnent.
          </p>
          <p className="text-[#3f3f46] text-xs font-mono">
            Made in 🇫🇷 France
          </p>
        </div>
      </div>
    </footer>
  );
}
