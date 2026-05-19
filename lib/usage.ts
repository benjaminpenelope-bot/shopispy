import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

type UsageField = "searches" | "clones" | "spy_scans";

export async function incrementUsage(userId: string, field: UsageField) {
  const month = new Date().toISOString().slice(0, 7);
  const sb = supabaseAdmin();

  // Try upsert — silently fail if table doesn't exist yet
  try {
    const { data: existing } = await sb
      .from("user_usage")
      .select(field)
      .eq("user_id", userId)
      .eq("month", month)
      .single();

    if (existing) {
      const current = (existing as Record<string, number>)[field] ?? 0;
      await sb
        .from("user_usage")
        .update({ [field]: current + 1 })
        .eq("user_id", userId)
        .eq("month", month);
    } else {
      await sb
        .from("user_usage")
        .insert({ user_id: userId, month, [field]: 1 });
    }
  } catch {
    // Table may not exist yet — non-blocking
  }
}
