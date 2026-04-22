import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export type BandAccessState =
  | { kind: "no_env" }
  | { kind: "anon"; supabase: SupabaseClient }
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

  return { kind: "ok", user, supabase };
}

/** メンバー向けレイアウト用（未設定・未ログインを処理） */
export async function assertBandLayoutAccess() {
  const s = await getBandAccessState();
  if (s.kind === "no_env") {
    return { ok: false as const, reason: "no_env" as const };
  }
  if (s.kind === "anon") {
    redirect("/login?next=/lives");
  }
  return { ok: true as const, user: s.user, supabase: s.supabase };
}

/** 編集画面用（未ログインを処理） */
export async function assertBandEditorAccess(nextPath: string) {
  const s = await getBandAccessState();
  if (s.kind === "no_env") {
    return { ok: false as const, reason: "no_env" as const };
  }
  if (s.kind === "anon") {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return { ok: true as const, user: s.user, supabase: s.supabase };
}
