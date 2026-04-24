import type { Metadata } from "next";
import { RankedTable } from "@/features/band/components/ranked-table";
import { getBandAccessState } from "@/features/band/lib/auth-session";
import { computeBandStats } from "@/features/band/lib/compute-stats";
import { dbRowToBandEntry } from "@/features/band/lib/db";
import type { LiveSetlistDbRow } from "@/features/band/lib/db";

export const metadata: Metadata = {
  title: "統計",
};

export const dynamic = "force-dynamic";

export default async function LivesStatsPage() {
  const s = await getBandAccessState();
  const canSeeNames = s.kind === "ok";

  // 型安全に supabase クライアントを取得
  const supabase = "supabase" in s ? s.supabase : null;

  let entries: any[] = []; // 初期値は空配列

  try {
    // supabaseクライアントがあれば（環境変数があれば）、ログイン・非ログイン問わずデータ取得
    if (supabase) {
      const { data, error } = await supabase
        .from("live_setlist_entries")
        .select("*")
        .order("performance_date", { ascending: false });

      if (error) throw new Error(error.message);

      if (data) {
        entries = data.map((r) => dbRowToBandEntry(r as LiveSetlistDbRow));
      }
    }
  } catch (error) {
    console.error(error);
    return (
      <div className="p-6">
        <p className="text-sm text-red-600 font-medium">データの読み込みに失敗しました。</p>
      </div>
    );
  }

  // 3. 取得できた entries（ログイン時はDBから、それ以外は空）で統計を計算
  const stats = computeBandStats(entries);

  // --- 匿名化ロジック ---
  // 共演メンバー名のみ、非ログイン時は「共演者 A, B...」に置き換える
  const displayPartnerRankings = canSeeNames
    ? stats.partnerRankings
    : stats.partnerRankings.map((r, i) => ({
        ...r,
        label: `共演者 ${String.fromCharCode(65 + i)}`,
      }));

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900">演奏統計</h2>
        <p className="text-sm text-slate-600">
          これまでのすべての演奏活動から集計しています。
          {!canSeeNames && entries.length > 0 && (
            <span className="block mt-1 text-xs text-slate-400 italic">
              ※ プライバシー保護のため、メンバー名は匿名化されています。
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* メンバー別ランキング：常に表示 */}
        <RankedTable
          title="組んだ回数（メンバー別）"
          description={canSeeNames ? "自分以外のメンバーが登場した回数をカウント" : "登場回数のみ表示しています"}
          items={displayPartnerRankings}
          initialMaxRows={40}
        />

        <RankedTable
          title="コピー回数（コピー元）"
          items={stats.copyRankings}
          initialMaxRows={40}
        />

        <RankedTable
          title="自分のパート別"
          items={stats.partRankings}
          initialMaxRows={20}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 年別サマリーテーブル */}
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
              <tbody className="divide-y divide-slate-50">
                {stats.yearlySummary.map((y) => (
                  <tr key={y.year} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 pr-4 font-medium text-slate-700">{y.year}</td>
                    <td className="py-2 pr-4 text-right tabular-nums text-slate-600">
                      {y.liveEvents}
                    </td>
                    <td className="py-2 text-right tabular-nums text-slate-600">
                      {y.songEntries}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 月別演奏エントリ推移 */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">月別（演奏エントリ数）</h2>
          <div className="mt-4 max-h-80 overflow-y-auto pr-2">
            <table className="w-full text-left text-sm border-separate border-spacing-0">
              <tbody className="divide-y divide-slate-50">
                {stats.monthlySongEntries.map((m) => (
                  <tr key={m.yearMonth} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 font-mono text-xs text-slate-500">{m.yearMonth}</td>
                    <td className="py-2 text-right tabular-nums font-semibold text-slate-700">
                      {m.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}