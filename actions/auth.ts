"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginActionState = {
  error: string | null;
};

const LOGIN_FAILED_MESSAGE = "メールアドレスまたはパスワードが正しくありません。";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitizeNextPath(input: FormDataEntryValue | null) {
  const fallback = "/lives";
  if (typeof input !== "string") return fallback;
  const value = input.trim();
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}

export async function signInWithPasswordAction(
  _prev: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeNextPath(formData.get("next"));

  if (!email || !password) {
    await sleep(600);
    return { error: LOGIN_FAILED_MESSAGE };
  }

  let signInFailed = false;

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      signInFailed = true;
    }
  } catch {
    signInFailed = true;
  }

  if (signInFailed) {
    await sleep(900);
    return {
      error: LOGIN_FAILED_MESSAGE,
    };
  }

  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function signOut() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    /* Supabase 未設定時など */
  }
  revalidatePath("/", "layout");
  redirect("/");
}
