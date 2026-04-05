import { assertBandLayoutAccess } from "@/lib/auth/band-session";
import { LivesSubNav } from "@/components/band/lives-subnav";
import { SignOutButton } from "@/components/band/sign-out-button";

export const dynamic = "force-dynamic";

export default async function LivesMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const r = await assertBandLayoutAccess();

  if (!r.ok) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
        <div className="mx-auto max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <h1 className="text-lg font-bold text-amber-950">
            Supabase が未設定です
          </h1>
          <p className="mt-2 text-sm text-amber-900">
            ルートに{" "}
            <code className="rounded bg-white px-1">.env.local</code> を置き、
            <code className="rounded bg-white px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            と{" "}
            <code className="rounded bg-white px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
            を設定してください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-slate-500">メンバー専用</p>
            <p className="text-sm font-medium text-slate-800">{r.user.email}</p>
          </div>
          <SignOutButton />
        </header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          ライブ・バンド出演
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          スマホから演奏を追加・修正できます（RLS で名前付きデータは保護されています）
        </p>
        <LivesSubNav />
        {children}
      </div>
    </div>
  );
}
