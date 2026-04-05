import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { getBandAccessState } from "@/lib/auth/band-session";
import { MEMBER_ROLE_KEYS } from "@/lib/band/constants";
import { fetchEntriesForList } from "@/lib/band/queries";

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
  if (s.kind !== "ok") return null;

  const rows = await fetchEntriesForList(s.supabase, {
    q: sp.q ?? null,
    date: sp.date ?? null,
    live: sp.live ?? null,
  });

  const qDefault = sp.q ?? "";
  const dateDefault = sp.date ?? "";
  const liveDefault = sp.live ?? "";

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">一覧・検索</h2>
      <p className="mt-1 text-sm text-slate-600">
        ライブ名・コピー元・備考・曲名に部分一致（大文字小文字無視）
      </p>

      <form
        className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end"
        method="get"
        action="/lives/entries"
      >
        <label className="block min-w-[10rem] flex-1">
          <span className="text-xs font-medium text-slate-600">キーワード</span>
          <input
            name="q"
            defaultValue={qDefault}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
            placeholder="曲名・バンド名など"
          />
        </label>
        <label className="block w-full sm:w-40">
          <span className="text-xs font-medium text-slate-600">日付</span>
          <input
            type="date"
            name="date"
            defaultValue={dateDefault}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
          />
        </label>
        <label className="block min-w-[8rem] flex-1">
          <span className="text-xs font-medium text-slate-600">ライブ名（完全一致）</span>
          <input
            name="live"
            defaultValue={liveDefault}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          検索
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">{rows.length} 件</p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[56rem] border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-100 text-[11px] font-semibold text-slate-700">
            <tr>
              <th className="px-2 py-2">日付</th>
              <th className="px-2 py-2">ライブ</th>
              <th className="px-2 py-2">コピー元</th>
              <th className="px-2 py-2">動画</th>
              {MEMBER_ROLE_KEYS.slice(0, 6).map((k) => (
                <th key={k} className="px-2 py-2">
                  {k}
                </th>
              ))}
              <th className="px-2 py-2">曲</th>
              <th className="px-2 py-2">パート</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => {
              const members = (r.members as Record<string, string | null>) ?? {};
              const songs = (r.songs as string[]) ?? [];
              const parts = (r.my_parts as string[]) ?? [];
              return (
                <tr
                  key={r.id as string}
                  className={ri % 2 === 0 ? "bg-white" : "bg-slate-50/80"}
                >
                  <td className="whitespace-nowrap border-b border-slate-100 px-2 py-2 font-mono text-[11px]">
                    {r.performance_date as string}
                  </td>
                  <td className="max-w-[8rem] truncate border-b border-slate-100 px-2 py-2">
                    {r.live_name as string}
                  </td>
                  <td className="max-w-[6rem] truncate border-b border-slate-100 px-2 py-2">
                    {(r.copy_from as string) ?? ""}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2">
                    {r.video_url ? (
                      <a
                        href={String(r.video_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-indigo-600"
                      >
                        <ExternalLink className="size-3" aria-hidden />
                      </a>
                    ) : null}
                  </td>
                  {MEMBER_ROLE_KEYS.slice(0, 6).map((k) => (
                    <td
                      key={k}
                      className="max-w-[4rem] truncate border-b border-slate-100 px-2 py-2"
                      title={members[k] ?? undefined}
                    >
                      {members[k] ?? ""}
                    </td>
                  ))}
                  <td
                    className="max-w-[10rem] truncate border-b border-slate-100 px-2 py-2"
                    title={songs.join(" / ")}
                  >
                    {songs.join(" / ")}
                  </td>
                  <td className="whitespace-nowrap border-b border-slate-100 px-2 py-2">
                    {parts.join(" · ")}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2">
                    <Link
                      href={`/lives/entries/${r.id}`}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      編集
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
