"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LogoIcon } from "@/components/ui/Logo";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon className="w-8 h-8" />
          <span className="font-heading font-bold text-xl text-ink tracking-tight">
            Shopi<span className="gradient-text">Spy</span>
          </span>
          <span className="hidden sm:inline-flex items-center font-sans text-[0.65rem] font-semibold text-primary bg-bg-blue border border-[#c7d2fe] px-2 py-0.5 rounded-full">
            BETA
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Features", href: "#features" },
            { label: "Tarifs", href: "#tarifs" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 font-sans text-sm font-medium text-text-muted hover:text-ink hover:bg-bg-soft rounded-lg transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Connexion</Button>
          </Link>
          <a href="#waitlist">
            <Button size="sm">Accès gratuit →</Button>
          </a>
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-bg-soft transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-ink transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-ink transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-ink transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-1 shadow-card">
          {[
            { label: "Features", href: "#features" },
            { label: "Tarifs", href: "#tarifs" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 font-sans text-sm font-medium text-text-muted hover:text-ink hover:bg-bg-soft rounded-lg transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">Connexion</Button>
            </Link>
            <a href="#waitlist" onClick={() => setOpen(false)}>
              <Button className="w-full">Accès gratuit →</Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
