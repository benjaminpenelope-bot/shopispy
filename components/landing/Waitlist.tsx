"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("waitlist")
        .insert({ email: email.toLowerCase().trim() });

      if (error && error.code !== "23505") throw error;
      setState("success");
    } catch {
      setErrorMsg("Une erreur est survenue. Réessaie dans quelques secondes.");
      setState("error");
    }
  }

  return (
    <section className="py-24 bg-white" id="waitlist">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-3xl p-12 text-center space-y-8 shadow-card-lg relative overflow-hidden">
          {/* Orbs décoratifs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 text-[#a5b4fc] text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full border border-white/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a5b4fc] animate-pulse" />
                Accès anticipé
              </span>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white leading-tight">
                Rejoins la bêta privée.
              </h2>
              <p className="text-[#c7d2fe] mt-3 leading-relaxed">
                Les <strong className="text-white">200 premiers inscrits</strong> obtiennent 3 mois
                de plan Pro à{" "}
                <span className="text-accent font-bold">-50%</span> et un accès prioritaire aux nouvelles features.
              </p>
            </div>

            {state === "success" ? (
              <div className="bg-white/10 border border-white/20 rounded-2xl px-8 py-6 space-y-2">
                <div className="text-3xl">🎉</div>
                <div className="font-heading font-bold text-white text-xl">
                  Tu es sur la liste !
                </div>
                <div className="text-[#c7d2fe] text-sm">
                  On te contacte dès l'ouverture. Garde un œil sur tes emails.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                  className="flex-1 px-4 py-3 text-sm !bg-white/10 !border-white/20 !text-white placeholder:!text-white/40 hover:!border-white/40 focus:!border-white/60 focus:!shadow-none"
                />
                <Button
                  type="submit"
                  disabled={state === "loading"}
                  className="!bg-white !text-primary hover:!bg-bg-blue whitespace-nowrap font-bold"
                >
                  {state === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      En cours…
                    </span>
                  ) : (
                    "Rejoindre →"
                  )}
                </Button>
              </form>
            )}

            {state === "error" && (
              <p className="text-red-300 text-xs text-center">{errorMsg}</p>
            )}

            <p className="text-[#6366f1] text-xs">
              🔒 Pas de spam. Désabonnement en 1 clic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
