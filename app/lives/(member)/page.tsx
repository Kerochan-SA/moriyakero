import Link from "next/link";
import { BAND_SELF_MEMBER_NAMES } from "@/data/band/config";
import { getBandAccessState } from "@/lib/auth/band-session";
import { computeBandStats } from "@/lib/band/compute-stats";
import { dbRowToBandEntry } from "@/lib/band/db";
import type { LiveSetlistDbRow } from "@/lib/band/db";
import { groupByLive } from "@/lib/band/queries";

export const dynamic = "force-dynamic";

export default async function LivesOverviewPage() {
  const s = await getBandAccessState();
  if (s.kind !== "ok") return null;

  const { data: rows, error } = await s.supabase
    .from("live_setlist_entries")
    .select("*")
    .order("performance_date", { ascending: false });

  if (error) {
    return (
      <p className="text-sm text-red-600">
        読み込みに失敗しました: {error.message}
      </p>
    );
  }

  const list = rows ?? [];
  const entries = list.map((r) => dbRowToBandEntry(r as LiveSetlistDbRow));
  const stats = computeBandStats(entries);
  const groups = groupByLive(
    list.map((r) => ({
      performance_date: r.performance_date as string,
      live_name: r.live_name as string,
    })),
  );

  const topPartners = stats.partnerRankings.slice(0, 5);
  const topCopies = stats.copyRankings.slice(0, 5);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">演奏エントリ</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
            {list.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">集計上の自分</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {BAND_SELF_MEMBER_NAMES.join(" / ")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            <code className="rounded bg-slate-100 px-1">data/band/config.ts</code>
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">ライブ単位</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
            {groups.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">日付＋ライブ名の組</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">操作</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link className="text-indigo-600 hover:text-indigo-500" href="/lives/entries/new">
                新規エントリ
              </Link>
            </li>
            <li>
              <Link className="text-indigo-600 hover:text-indigo-500" href="/lives/entries">
                一覧・検索
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">共演が多いメンバー（上位5）</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {topPartners.map((r, i) => (
              <li key={`${i}-${r.label}`} className="flex justify-between gap-4">
                <span className="text-slate-600">
                  {i + 1}. {r.label}
                </span>
                <span className="tabular-nums font-medium">{r.count}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">コピー元（上位5）</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {topCopies.map((r, i) => (
              <li key={`${i}-${r.label}`} className="flex justify-between gap-4">
                <span className="text-slate-600">
                  {i + 1}. {r.label}
                </span>
                <span className="tabular-nums font-medium">{r.count}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">ライブごと（直近）</h2>
        <p className="mb-4 text-xs text-slate-500">
          同じ日・同じライブ名の曲をまとめています。リンクから一括で絞り込みできます。
        </p>
        <ul className="space-y-2">
          {groups.slice(0, 20).map((g) => {
            const href = `/lives/entries?date=${encodeURIComponent(g.performance_date)}&live=${encodeURIComponent(g.live_name)}`;
            return (
              <li key={`${g.performance_date}-${g.live_name}`}>
                <Link
                  href={href}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-indigo-200"
                >
                  <span className="font-mono text-xs text-slate-500">
                    {g.performance_date}
                  </span>
                  <span className="min-w-0 flex-1 font-medium text-slate-900">
                    {g.live_name}
                  </span>
                  <span className="text-xs text-slate-500">{g.count} 曲</span>
                </Link>
              </li>
            );
          })}
        </ul>
        {groups.length > 20 ? (
          <p className="mt-3 text-xs text-slate-500">
            他 {groups.length - 20} 件は一覧ページで検索してください。
          </p>
        ) : null}
      </section>
    </div>
  );
}
