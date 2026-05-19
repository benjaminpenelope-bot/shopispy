"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/dashboard/actions";
import { LogoIcon } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard/search", label: "Recherche produits", icon: "🔍" },
  { href: "/dashboard/spy", label: "Analyser boutique", icon: "🕵️" },
  { href: "/dashboard/clones", label: "Mes fiches IA", icon: "✨" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 border-r border-border bg-white flex-col z-40 shadow-card">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoIcon className="w-8 h-8" />
            <span className="font-heading font-bold text-lg text-ink">
              Shopi<span className="gradient-text">Spy</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="dash-section-label px-3 mb-3">Navigation</p>
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("sidebar-link", active && "active")}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Plan badge */}
        <div className="mx-3 mb-3 bg-bg-blue border border-[#c7d2fe] rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary">Plan Starter</span>
            <span className="text-[0.65rem] font-mono text-text-muted">10/50 rech.</span>
          </div>
          <div className="w-full bg-[#c7d2fe] rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: "20%" }} />
          </div>
          <Link href="#tarifs" className="text-[0.7rem] font-semibold text-primary hover:underline">
            Passer Pro →
          </Link>
        </div>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-border">
          <form action={logout}>
            <button
              type="submit"
              className="sidebar-link w-full text-left hover:!text-danger hover:!bg-red-50"
            >
              <span className="text-lg leading-none">👋</span>
              <span>Déconnexion</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border flex items-center justify-around px-2 py-2 safe-area-bottom">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${
                active ? "text-primary bg-bg-blue" : "text-text-muted"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[0.6rem] font-semibold">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
        <form action={logout}>
          <button
            type="submit"
            className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-text-muted transition-colors hover:text-danger"
          >
            <span className="text-xl">👋</span>
            <span className="text-[0.6rem] font-semibold">Sortir</span>
          </button>
        </form>
      </nav>
    </>
  );
}
