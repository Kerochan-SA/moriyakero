"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/lives";
  const err = searchParams.get("error");
  const detail = searchParams.get("detail");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const origin = window.location.origin;
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) {
          setMessage(error.message);
          return;
        }
        setMessage("ログ用のメールを送信しました。受信箱を確認してください。");
      } catch {
        setMessage("Supabase の設定を確認してください（.env.local）。");
      }
    });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-bold text-slate-900">メンバーログイン</h1>
      <p className="mt-2 text-sm text-slate-600">
        バンドリスト（名前入り）の閲覧・編集は、登録されたメンバーのみが行えます。
      </p>
      {err === "auth" ? (
        <div className="mt-4 space-y-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-medium">認証に失敗しました（メールのリンクが無効か、設定不一致の可能性があります）。</p>
          {detail ? (
            <p className="font-mono text-xs break-all opacity-90">詳細: {detail}</p>
          ) : null}
          <ul className="list-inside list-disc text-xs leading-relaxed">
            <li>
              Supabase → Authentication → URL Configuration の{" "}
              <strong>Redirect URLs</strong> に、<strong>実際にブラウザで開いている URL</strong>
              のコールバックを追加してください（例:{" "}
              <code className="rounded bg-white/80 px-1">http://localhost:3000/auth/callback</code>{" "}
              と{" "}
              <code className="rounded bg-white/80 px-1">
                http://192.168.x.x:3000/auth/callback
              </code>{" "}
              は別扱いです）。
            </li>
            <li>メールのリンクは、リンクを請求したのと同じ端末・同じアドレス（localhost と LAN IP の混在不可）で開いてください。</li>
            <li>古いメールのリンクは1回しか使えません。新しく「マジックリンクを送る」からやり直してください。</li>
          </ul>
        </div>
      ) : null}
      {err === "no_access" ? (
        <p className="mt-4 text-sm text-amber-800">
          アカウントはありますが、メンバー一覧に未登録です。管理者に依頼してください。
        </p>
      ) : null}
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs font-medium text-slate-600">メールアドレス</span>
          <input
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-indigo-600 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {pending ? "送信中…" : "マジックリンクを送る"}
        </button>
      </form>
      {message ? (
        <p className="mt-4 text-sm text-slate-700 whitespace-pre-wrap">{message}</p>
      ) : null}
      <p className="mt-8 text-center text-sm text-slate-500">
        <Link href="/" className="text-indigo-600 hover:text-indigo-500">
          サイトトップへ
        </Link>
      </p>
    </div>
  );
}
