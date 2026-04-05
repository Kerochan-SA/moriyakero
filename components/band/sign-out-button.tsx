"use client";

import { useTransition } from "react";
import { signOut } from "@/actions/auth";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
    >
      {pending ? "…" : "ログアウト"}
    </button>
  );
}
