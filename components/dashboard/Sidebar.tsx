"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/app/dashboard/actions";
import { LogoIcon } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard/search", label: "Recherche produits", icon: "🔍" },
  { href: "/dashboard/spy", label: "Analyser boutique", icon: "🕵️" },
  { href: "/dashboard/history", label: "Historique scans", icon: "🕘" },
  { href: "/dashboard/clones", label: "Mes fiches IA", icon: "✨" },
];

const PLAN_LIMIT = 50;

interface Props {
  userId: string;
  userEmail: string;
}

export function Sidebar({ userId }: Props) {
  const pathname = usePathname();
  const [usage, setUsage] = useState({ searches: 0, clones: 0, spy_scans: 0 });

  useEffect(() => {
    const month = new Date().toISOString().slice(0, 7);
    const supabase = createClient();
    supabase
      .from("user_usage")
      .select("searches, clones, spy_scans")
      .eq("user_id", userId)
      .eq("month", month)
      .single()
      .then(({ data }) => {
        if (data) setUsage(data);
      });
  }, [userId]);

  const totalUsed = usage.searches + usage.spy_scans;
  const pct = Math.min(100, Math.round((totalUsed / PLAN_LIMIT) * 100));

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 border-r border-[#111111] bg-[#080808] flex-col z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#111111]">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoIcon className="w-8 h-8" />
            <span className="font-heading font-bold text-lg text-white">
              Shopi<span className="gradient-text">Spy</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="dash-section-label px-3 mb-3">Navigation</p>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
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
        <div className="mx-3 mb-3 bg-[#0d1a0f] border border-primary/20 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary font-mono">Plan Starter</span>
            <span className="text-[0.65rem] font-mono text-[#52525b]">{totalUsed}/{PLAN_LIMIT} scans</span>
          </div>
          <div className="w-full bg-[#1a1a1a] rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-700 shadow-glow-sm"
              style={{ width: `${pct}%` }}
            />
          </div>
          <Link href="#tarifs" className="text-[0.7rem] font-semibold text-primary hover:underline font-mono">
            Passer Founders →
          </Link>
        </div>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-[#111111]">
          <form action={logout}>
            <button
              type="submit"
              className="sidebar-link w-full text-left hover:!text-danger hover:!bg-[#1a0a0a]"
            >
              <span className="text-lg leading-none">👋</span>
              <span>Déconnexion</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080808] border-t border-[#111111] flex items-center justify-around px-2 py-2">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${
                active ? "text-primary bg-primary/8" : "text-[#52525b]"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[0.6rem] font-semibold font-mono">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
        <form action={logout}>
          <button
            type="submit"
            className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-[#52525b] transition-colors hover:text-danger"
          >
            <span className="text-xl">👋</span>
            <span className="text-[0.6rem] font-semibold font-mono">Sortir</span>
          </button>
        </form>
      </nav>
    </>
  );
}
