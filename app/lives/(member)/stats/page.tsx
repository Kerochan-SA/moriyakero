import type { Metadata } from "next";
import { RankedTable } from "@/components/band/ranked-table";
import { getBandAccessState } from "@/lib/auth/band-session";
import { computeBandStats } from "@/lib/band/compute-stats";
import { dbRowToBandEntry } from "@/lib/band/db";
import type { LiveSetlistDbRow } from "@/lib/band/db";

export const metadata: Metadata = {
  title: "統計",
};

export const dynamic = "force-dynamic";

export default async function LivesStatsPage() {
  const s = await getBandAccessState();
  if (s.kind !== "ok") return null;

  const { data: rows, error } = await s.supabase
    .from("live_setlist_entries")
    .select("*");

  if (error) {
    return <p className="text-sm text-red-600">{error.message}</p>;
  }

  const entries = (rows ?? []).map((r) =>
    dbRowToBandEntry(r as LiveSetlistDbRow),
  );
  const stats = computeBandStats(entries);

  return (
    <div className="space-y-10">
      <p className="text-sm text-slate-600">
        データベース上の全エントリから再集計しています。
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <RankedTable
          title="組んだ回数（メンバー別）"
          description="一覧の各行で、自分以外のメンバーがいるたびにカウント（config の自分の名前を除く）"
          items={stats.partnerRankings}
          maxRows={40}
        />
        <RankedTable
          title="コピー回数（コピー元）"
          items={stats.copyRankings}
          maxRows={40}
        />
        <RankedTable
          title="自分のパート別"
          items={stats.partRankings}
          maxRows={20}
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">暦年ごと</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[20rem] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs font-semibold text-slate-500">
              <tr>
                <th className="py-2 pr-4">年</th>
                <th className="py-2 pr-4 text-right">ライブ本数</th>
                <th className="py-2 text-right">演奏エントリ</th>
              </tr>
            </thead>
            <tbody>
              {stats.yearlySummary.map((y) => (
                <tr key={y.year} className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">{y.year}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">
                    {y.liveEvents}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {y.songEntries}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">月別（演奏エントリ）</h2>
        <div className="mt-4 max-h-80 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <tbody>
              {stats.monthlySongEntries.map((m) => (
                <tr key={m.yearMonth} className="border-b border-slate-100">
                  <td className="py-1.5 font-mono text-xs">{m.yearMonth}</td>
                  <td className="py-1.5 text-right tabular-nums">{m.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
