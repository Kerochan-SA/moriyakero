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
  
  // 読み取り用のSupabaseクライアント（s.supabaseがない場合は、公開用クライアントが必要な場合があります）
  // ここでは getBandAccessState が常にクライアントを返すと仮定、あるいは別途作成したものを想定します。
  const supabase = 'supabase' in s ? s.supabase : null;

  let entries: ReturnType<typeof dbRowToBandEntry>[] = [];
  let groups: { performance_date: string; live_name: string; count: number }[] = [];
  let listLength = 0;

  try {
    // 1. データの取得（ログイン状態に関わらず実行）
    if (supabase) {
      const { data, error } = await supabase
        .from("live_setlist_entries")
        .select("*")
        .order("performance_date", { ascending: false });

      if (error) throw new Error(error.message);

      const list = (data ?? []) as LiveSetlistDbRow[];
      listLength = list.length;
      
      entries = list.map((r) => dbRowToBandEntry(r));
      groups = groupByLive(
        list.map((r) => ({
          performance_date: r.performance_date,
          live_name: r.live_name,
        })),
      );
    }
  } catch (e) {
    console.error(e);
    return (
      <p className="text-sm text-red-600 p-4">データの読み込みに失敗しました。</p>
    );
  }

  // 2. 統計の計算（常に計算）
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
          <p className="text-xs font-medium text-slate-500">集計対象（自分）</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {/* 非ログイン時は「メンバー1 / 2」のように表示 */}
            {canEdit 
              ? BAND_SELF_MEMBER_NAMES.join(" / ") 
              : BAND_SELF_MEMBER_NAMES.map((_, i) => `メンバー${i + 1}`).join(" / ")}
          </p>
          <p className="mt-1 text-xs text-slate-500 italic">
            {!canEdit && "（ログインで実名表示）"}
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
                  ＋ 新規エントリを追加
                </Link>
              ) : (
                <Link className="text-slate-400 hover:text-slate-500" href="/login?next=/lives/entries/new">
                  管理者ログイン
                </Link>
              )}
            </li>
            <li>
              <Link className="text-indigo-600 hover:text-indigo-500" href="/lives/entries">
                すべての一覧・検索
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ランキングセクション */}
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">共演が多いメンバー（上位5）</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {topPartners.map((r, i) => (
              <li key={`${i}-${r.label}`} className="flex justify-between gap-4 border-b border-slate-50 pb-1">
                <span className="text-slate-600">
                  {/* 非ログイン時は「共演者A」のように匿名化 */}
                  {i + 1}. {canEdit ? r.label : `共演者 ${String.fromCharCode(65 + i)}`}
                </span>
                <span className="tabular-nums font-semibold text-slate-900">{r.count}</span>
              </li>
            ))}
            {topPartners.length === 0 && <p className="text-slate-400 py-2">データがありません</p>}
          </ol>
          {!canEdit && topPartners.length > 0 && (
             <p className="mt-2 text-[10px] text-slate-400 text-right">※名前は匿名化されています</p>
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

      {/* ライブ一覧：常に表示 */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">ライブごと（直近20件）</h2>
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
            <p className="text-sm text-slate-500">データが見つかりませんでした。</p>
          </div>
        )}
      </section>
    </div>
  );
}