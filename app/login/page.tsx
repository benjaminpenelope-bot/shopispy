import Link from "next/link";
import { login, signup } from "./actions";
import { LogoIcon } from "@/components/ui/Logo";
import { OAuthButtons } from "./OAuthButtons";

interface Props {
  searchParams: Promise<{ error?: string; info?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      {/* Grid bg */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#00ff87 1px, transparent 1px), linear-gradient(90deg, #00ff87 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <LogoIcon className="w-12 h-12" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white">
            Shopi<span className="gradient-text">Spy</span>
          </h1>
          <p className="text-[#71717a] text-sm font-mono">Trouve ton prochain produit gagnant</p>
        </div>

        {/* Card */}
        <div className="bg-[#0d0d0d] rounded-2xl border border-[#1e1e1e] p-8 space-y-5">
          {/* Messages */}
          {params.error && (
            <div className="bg-[#1a0808] border border-danger/30 rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <p className="text-sm text-danger">{decodeURIComponent(params.error)}</p>
            </div>
          )}
          {params.info && (
            <div className="bg-[#0d1a0f] border border-primary/30 rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-base">✉️</span>
              <p className="text-sm text-primary">{decodeURIComponent(params.info)}</p>
            </div>
          )}

          {/* OAuth */}
          <OAuthButtons />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1e1e1e]" />
            <span className="text-[#3f3f46] text-xs font-mono">ou par email</span>
            <div className="flex-1 h-px bg-[#1e1e1e]" />
          </div>

          {/* Email/password form */}
          <form className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525b] uppercase tracking-wider font-mono">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="ton@email.com"
                required
                className="w-full px-4 py-2.5 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525b] uppercase tracking-wider font-mono">
                Mot de passe
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2.5 text-sm"
              />
              <p className="text-[0.7rem] text-[#3f3f46] font-mono">Minimum 6 caractères</p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                formAction={login}
                className="btn-neon w-full py-3 text-sm"
              >
                Se connecter →
              </button>
              <button
                formAction={signup}
                className="w-full bg-transparent text-[#71717a] font-semibold text-sm py-3 rounded-xl border border-[#222] hover:bg-[#111] hover:text-white hover:border-[#333] transition-all"
              >
                Créer un compte
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-[#3f3f46] text-xs font-mono">
          <Link href="/" className="hover:text-primary transition-colors">
            ← Retour au site
          </Link>
          <span className="mx-2">·</span>
          <a href="#" className="hover:text-primary transition-colors">
            Mot de passe oublié ?
          </a>
        </p>
      </div>
    </div>
  );
}
