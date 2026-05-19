"use client";
import Link from "next/link";
import { useState } from "react";
import { LogoIcon } from "@/components/ui/Logo";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/90 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon className="w-8 h-8" />
          <span className="font-heading font-bold text-xl text-white tracking-tight">
            Shopi<span className="gradient-text">Spy</span>
          </span>
          <span className="hidden sm:inline-flex items-center font-mono text-[0.6rem] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full tracking-wider">
            BETA
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Fonctionnalités", href: "#features" },
            { label: "Tarifs", href: "#tarifs" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 font-sans text-sm font-medium text-[#71717a] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <button className="px-4 py-2 text-sm font-medium text-[#71717a] hover:text-white transition-colors">
              Connexion
            </button>
          </Link>
          <Link href="/dashboard/spy">
            <button className="btn-neon px-4 py-2 text-sm">
              Scanner une boutique →
            </button>
          </Link>
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0d0d0d] border-t border-[#1a1a1a] px-4 py-4 space-y-1">
          {[
            { label: "Fonctionnalités", href: "#features" },
            { label: "Tarifs", href: "#tarifs" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 font-sans text-sm font-medium text-[#71717a] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#1a1a1a] flex flex-col gap-2">
            <Link href="/login" onClick={() => setOpen(false)}>
              <button className="w-full px-4 py-3 text-sm font-medium text-[#71717a] border border-[#222] rounded-xl hover:text-white hover:border-[#333] transition-colors">
                Connexion
              </button>
            </Link>
            <Link href="/dashboard/spy" onClick={() => setOpen(false)}>
              <button className="btn-neon w-full px-4 py-3 text-sm">
                Scanner une boutique →
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
