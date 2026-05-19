import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-bg-soft">
      <Sidebar />
      <main className="md:ml-60 min-h-screen pb-20 md:pb-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-border px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="text-xs text-text-muted truncate max-w-[200px] sm:max-w-none">
            <span className="font-semibold text-ink">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-success bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-1 rounded-full">
              ● En ligne
            </span>
          </div>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
