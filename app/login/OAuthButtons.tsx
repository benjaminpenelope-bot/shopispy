"use client";
import { createClient } from "@/lib/supabase/client";

export function OAuthButtons() {
  const supabase = createClient();

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  async function signInWithApple() {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <div className="space-y-2">
      <button
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-3 bg-[#111111] border border-[#222] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#161616] hover:border-[#333] transition-all"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continuer avec Google
      </button>

      <button
        onClick={signInWithApple}
        className="w-full flex items-center justify-center gap-3 bg-[#111111] border border-[#222] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#161616] hover:border-[#333] transition-all"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
          <path d="M14.4 9.6c0-2.7 2.2-4 2.3-4.1-1.3-1.8-3.2-2.1-3.9-2.1-1.7-.2-3.2 1-4 1-.8 0-2.1-1-3.4-.9-1.8.1-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.2 1.9 2.6 3.2 2.6 1.3 0 1.8-.8 3.3-.8 1.5 0 2 .8 3.3.8 1.4 0 2.3-1.3 3.1-2.5.6-.9 1-1.8 1.2-2.1C16.4 13.6 14.4 11.9 14.4 9.6zM11.9 2.5c.7-.9 1.2-2.1 1.1-3.3-1.1.1-2.3.7-3.1 1.6-.7.8-1.3 2-1.1 3.2C9.9 4.1 11.1 3.4 11.9 2.5z"/>
        </svg>
        Continuer avec Apple
      </button>
    </div>
  );
}
