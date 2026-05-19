import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-migrate-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Create user_usage table via RPC if available, otherwise use raw SQL
  const sql = `
    create table if not exists public.user_usage (
      user_id uuid references auth.users(id) on delete cascade,
      month char(7) not null,
      searches int not null default 0,
      clones int not null default 0,
      spy_scans int not null default 0,
      primary key (user_id, month)
    );
    alter table public.user_usage enable row level security;
    drop policy if exists "usage_own" on public.user_usage;
    create policy "usage_own" on public.user_usage
      for all using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  `;

  const { error } = await supabase.rpc("exec_sql", { sql });
  if (error) {
    return NextResponse.json({ error: error.message, hint: "Create the table manually in Supabase SQL editor" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
