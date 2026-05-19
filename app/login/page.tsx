import Link from "next/link";
import { login, signup } from "./actions";
import { LogoIcon } from "@/components/ui/Logo";

interface Props {
  searchParams: Promise<{ error?: string; info?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#fdf4ff] flex items-center justify-center px-4">
      {/* Orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-secondary/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <LogoIcon className="w-12 h-12" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-ink">
            Shopi<span className="gradient-text">Spy</span>
          </h1>
          <p className="text-text-muted text-sm">Trouve ton prochain produit gagnant</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border shadow-card-lg p-8 space-y-5">
          {/* Messages */}
          {params.error && (
            <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <p className="text-sm text-danger">
                {decodeURIComponent(params.error)}
              </p>
            </div>
          )}
          {params.info && (
            <div className="bg-bg-blue border border-[#c7d2fe] rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-base">✉️</span>
              <p className="text-sm text-primary">
                {decodeURIComponent(params.info)}
              </p>
            </div>
          )}

          <form className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wider">
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
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wider">
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
              <p className="text-[0.7rem] text-text-muted">Minimum 6 caractères</p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                formAction={login}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm py-3 rounded-xl shadow-glow-sm hover:shadow-glow hover:brightness-105 transition-all hover:-translate-y-px"
              >
                Se connecter →
              </button>
              <button
                formAction={signup}
                className="w-full bg-white text-primary font-semibold text-sm py-3 rounded-xl border-2 border-[#c7d2fe] hover:bg-bg-blue hover:border-primary transition-all"
              >
                Créer un compte
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-text-muted text-xs">
          <Link href="/" className="hover:text-primary transition-colors font-medium">
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
