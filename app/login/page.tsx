"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import {
  signInWithPasswordAction,
  type LoginActionState,
} from "@/actions/auth";

const initialState: LoginActionState = { error: null };

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/lives";
  const err = searchParams.get("error");
  const [state, formAction, pending] = useActionState(
    signInWithPasswordAction,
    initialState,
  );

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-bold text-slate-900">メンバーログイン</h1>
      <p className="mt-2 text-sm text-slate-600">
        メールアドレスとパスワードでログインします。バンドリスト（名前入り）の閲覧・編集は、登録されたメンバーのみが行えます。
      </p>
      {err === "auth" ? (
        <div className="mt-4 space-y-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-medium">認証処理に失敗しました。再度ログインをお試しください。</p>
        </div>
      ) : null}
      {err === "no_access" ? (
        <p className="mt-4 text-sm text-amber-800">
          アカウントはありますが、メンバー一覧に未登録です。管理者に依頼してください。
        </p>
      ) : null}
      <form action={formAction} className="mt-8 space-y-4">
        <input type="hidden" name="next" value={next} />
        <label className="block">
          <span className="text-xs font-medium text-slate-600">メールアドレス</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-600">パスワード</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="パスワード"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-indigo-600 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {pending ? "認証中…" : "ログイン"}
        </button>
      </form>
      {state.error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-slate-500">
        セキュリティ保護のため、認証エラー時は詳細を表示しません。
      </p>
      <p className="mt-8 text-center text-sm text-slate-500">
        <Link href="/" className="text-indigo-600 hover:text-indigo-500">
          サイトトップへ
        </Link>
      </p>
    </div>
  );
}
