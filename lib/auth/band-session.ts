import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export type BandAccessState =
  | { kind: "no_env" }
  | { kind: "anon"; supabase: SupabaseClient }
  | { kind: "no_member"; user: User; supabase: SupabaseClient }
  | { kind: "ok"; user: User; supabase: SupabaseClient };

export async function getBandAccessState(): Promise<BandAccessState> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { kind: "no_env" };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { kind: "anon", supabase };
  }

  const { data: member } = await supabase
    .from("band_members")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!member) {
    return { kind: "no_member", user, supabase };
  }

  return { kind: "ok", user, supabase };
}

/** メンバー向けレイアウト用（未設定・未ログイン・未登録を処理） */
export async function assertBandLayoutAccess() {
  const s = await getBandAccessState();
  if (s.kind === "no_env") {
    return { ok: false as const, reason: "no_env" as const };
  }
  if (s.kind === "anon") {
    redirect("/login?next=/lives");
  }
  if (s.kind === "no_member") {
    redirect("/lives/no-access");
  }
  return { ok: true as const, user: s.user, supabase: s.supabase };
}
