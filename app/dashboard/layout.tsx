import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#080808]">
      <Sidebar userId={user.id} userEmail={user.email ?? ""} />
      <main className="md:ml-60 min-h-screen pb-20 md:pb-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-[#080808]/90 backdrop-blur border-b border-[#111111] px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="text-xs text-[#52525b] truncate max-w-[200px] sm:max-w-none font-mono">
            <span className="text-[#71717a]">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-primary bg-primary/8 border border-primary/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              En ligne
            </span>
          </div>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
