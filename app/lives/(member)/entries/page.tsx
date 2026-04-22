import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { getBandAccessState } from "@/features/band/lib/auth-session";
import { MEMBER_ROLE_KEYS } from "@/features/band/lib/constants";
import { fetchEntriesForList } from "@/features/band/lib/queries";
import { LiveEntriesTable } from "@/features/band/components/live-entries-table";

export const metadata: Metadata = {
  title: "演奏一覧",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string; date?: string; live?: string }>;
};

export default async function LivesEntriesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const s = await getBandAccessState();
  const canEdit = s.kind === "ok";

  let rows: any[] = [];

  try {
    if (s.kind === "ok") {
      rows = await fetchEntriesForList(s.supabase, {
        q: sp.q ?? null,
        date: sp.date ?? null,
        live: sp.live ?? null,
      });
    } else {
      // ログインしていない場合は空にする
      rows = [];
    }
  } catch (error) {
    // エラー処理
  }

  const qDefault = sp.q ?? "";
  const dateDefault = sp.date ?? "";
  const liveDefault = sp.live ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">一覧・検索</h2>
        <p className="mt-1 text-sm text-slate-600">
          ライブ名・コピー元・備考・曲名から検索できます。
        </p>
        {!canEdit && (
          <p className="mt-2 inline-block rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 border border-amber-100">
            ※ メンバー名と編集機能はログインメンバー限定です。
          </p>
        )}
      </div>

      {/* 検索フォーム */}
      <form
        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end"
        method="get"
        action="/lives/entries"
      >
        <label className="block min-w-[10rem] flex-1">
          <span className="text-xs font-semibold text-slate-500">キーワード</span>
          <input
            name="q"
            defaultValue={qDefault}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="曲名・バンド名・備考など"
          />
        </label>
        <label className="block w-full sm:w-40">
          <span className="text-xs font-semibold text-slate-500">日付</span>
          <input
            type="date"
            name="date"
            defaultValue={dateDefault}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <label className="block min-w-[8rem] flex-1">
          <span className="text-xs font-semibold text-slate-500">ライブ名（完全一致）</span>
          <input
            name="live"
            defaultValue={liveDefault}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-95"
        >
          検索
        </button>
      </form>

      {/* 一覧テーブル */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          該当: <span className="text-slate-900">{rows.length}</span> 件
        </p>
      </div>

      {/* 切り出したコンポーネントを呼び出す */}
      <LiveEntriesTable rows={rows} canEdit={canEdit} />
    </div>
  );
}