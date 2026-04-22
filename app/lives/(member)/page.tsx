import Link from "next/link";
import { BAND_SELF_MEMBER_NAMES } from "@/features/band/data/config";
import { getBandAccessState } from "@/features/band/lib/auth-session";
import { computeBandStats } from "@/features/band/lib/compute-stats";
import { dbRowToBandEntry } from "@/features/band/lib/db";
import type { LiveSetlistDbRow } from "@/features/band/lib/db";
import { groupByLive } from "@/features/band/lib/queries";

export const dynamic = "force-dynamic";

export default async function LivesOverviewPage() {
  const s = await getBandAccessState();
  const canEdit = s.kind === "ok";

  // 変数の初期化
  let entries: ReturnType<typeof dbRowToBandEntry>[] = [];
  let groups: { performance_date: string; live_name: string; count: number }[] = [];
  let listLength = 0;

  try {
    // 1. Supabaseからデータを取得（ログイン時のみ実行）
    if (canEdit && s.supabase) {
      const { data, error } = await s.supabase
        .from("live_setlist_entries")
        .select("*")
        .order("performance_date", { ascending: false });

      if (error) throw new Error(error.message);

      const list = (data ?? []) as LiveSetlistDbRow[];
      listLength = list.length;
      
      // データの変換
      entries = list.map((r) => dbRowToBandEntry(r));
      
      // ライブ単位でのグルーピング
      groups = groupByLive(
        list.map((r) => ({
          performance_date: r.performance_date,
          live_name: r.live_name,
        })),
      );
    } else {
      // 非ログイン時は空の状態にする
      entries = [];
      groups = [];
      listLength = 0;
    }
  } catch (e) {
    console.error(e);
    return (
      <p className="text-sm text-red-600 p-4">データの読み込みに失敗しました。</p>
    );
  }

  // 2. 統計の計算（データがある場合のみ）
  const stats = computeBandStats(entries);
  const topPartners = stats.partnerRankings.slice(0, 5);
  const topCopies = stats.copyRankings.slice(0, 5);

  return (
    <div className="space-y-10">
      {/* 統計カードセクション */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">演奏エントリ</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
            {listLength}
          </p>
        </div>
        
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">集計上の自分</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {canEdit ? BAND_SELF_MEMBER_NAMES.join(" / ") : "ログインで表示"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            <code className="rounded bg-slate-100 px-1">config.ts</code>
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
              {canEdit ? (
                <Link className="text-indigo-600 hover:text-indigo-500 font-medium" href="/lives/entries/new">
                  ＋ 新規エントリ
                </Link>
              ) : (
                <Link className="text-indigo-600 hover:text-indigo-500" href="/login?next=/lives/entries/new">
                  ログインして追加
                </Link>
              )}
            </li>
            <li>
              <Link className="text-indigo-600 hover:text-indigo-500" href="/lives/entries">
                一覧・検索
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ランキングセクション */}
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">共演が多いメンバー（上位5）</h2>
          {canEdit ? (
            <ol className="mt-4 space-y-2 text-sm">
              {topPartners.map((r, i) => (
                <li key={`${i}-${r.label}`} className="flex justify-between gap-4 border-b border-slate-50 pb-1">
                  <span className="text-slate-600">{i + 1}. {r.label}</span>
                  <span className="tabular-nums font-semibold text-slate-900">{r.count}</span>
                </li>
              ))}
              {topPartners.length === 0 && <p className="text-slate-400 py-2">データがありません</p>}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-slate-500 italic">
              ログインすると詳細な統計が表示されます。
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">コピー元（上位5）</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {topCopies.map((r, i) => (
              <li key={`${i}-${r.label}`} className="flex justify-between gap-4 border-b border-slate-50 pb-1">
                <span className="text-slate-600">{i + 1}. {r.label}</span>
                <span className="tabular-nums font-semibold text-slate-900">{r.count}</span>
              </li>
            ))}
            {topCopies.length === 0 && <p className="text-slate-400 py-2">データがありません</p>}
          </ol>
        </div>
      </section>

      {/* ライブ一覧（直近） */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">ライブごと（直近）</h2>
        <p className="mb-4 text-xs text-slate-500">
          日付とライブ名でまとめています。
        </p>
        {groups.length > 0 ? (
          <>
            <ul className="space-y-2">
              {groups.slice(0, 20).map((g) => {
                const href = `/lives/entries?date=${encodeURIComponent(g.performance_date)}&live=${encodeURIComponent(g.live_name)}`;
                return (
                  <li key={`${g.performance_date}-${g.live_name}`}>
                    <Link
                      href={href}
                      className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-indigo-200 hover:bg-slate-50"
                    >
                      <span className="font-mono text-xs text-slate-500">{g.performance_date}</span>
                      <span className="min-w-0 flex-1 font-medium text-slate-900">{g.live_name}</span>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{g.count} 曲</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {groups.length > 20 && (
              <p className="mt-4 text-center">
                <Link href="/lives/entries" className="text-sm text-indigo-600 font-medium hover:underline">
                  すべてのライブを表示 →
                </Link>
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500">
              {canEdit ? "まだエントリがありません。" : "ログインしてデータを表示してください。"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}