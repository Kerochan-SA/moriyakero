import Link from "next/link";
import { getBandAccessState } from "@/features/band/lib/auth-session";
import { LivesSubNav } from "@/features/band/components/lives-subnav";
import { SignOutButton } from "@/features/band/components/sign-out-button";

export const dynamic = "force-dynamic";

export default async function LivesMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getBandAccessState();
  const canEdit = s.kind === "ok";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-slate-500">
              {canEdit ? "メンバー専用（編集可）" : "公開ビュー"}
            </p>
            {canEdit ? (
              <p className="text-sm font-medium text-slate-800">{s.user.email}</p>
            ) : (
              <p className="text-sm text-slate-600">
                名前表示・編集はログインメンバーのみ利用できます。
              </p>
            )}
          </div>
          {canEdit ? (
            <SignOutButton />
          ) : (
            <Link
              href="/login?next=/lives"
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              ログインして編集
            </Link>
          )}
        </header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          ライブ・バンド出演
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          演奏データは公開、メンバー名と編集機能はログインメンバーのみ利用できます。
        </p>
        <LivesSubNav />
        {children}
      </div>
    </div>
  );
}
