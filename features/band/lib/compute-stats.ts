import { BAND_SELF_MEMBER_NAMES } from "@/features/band/data/config";
import type { BandListEntry, RankedItem } from "@/features/band/lib/types";

const selfSet = new Set<string>(BAND_SELF_MEMBER_NAMES);

export type BandComputedStats = {
  /** 一覧の1行＝1曲（演奏エントリ）とみなし、同じ行に自分以外のメンバーがいるたびに +1 */
  partnerRankings: RankedItem[];
  /** コピー元アーティスト名ごとの行数 */
  copyRankings: RankedItem[];
  /** 自分のパート列に入っている値の集計 */
  partRankings: RankedItem[];
  /** YYYY-MM ごとの演奏エントリ数 */
  monthlySongEntries: { yearMonth: string; count: number }[];
  /** 暦年ごと: ライブ本数（同日同ライブ名は1）と演奏エントリ数 */
  yearlySummary: {
    year: string;
    liveEvents: number;
    songEntries: number;
  }[];
};

export function computeBandStats(entries: BandListEntry[]): BandComputedStats {
  const partnerCounts = new Map<string, number>();
  const copyCounts = new Map<string, number>();
  const partCounts = new Map<string, number>();
  const yearSongCounts = new Map<string, number>();
  const yearLiveKeys = new Map<string, Set<string>>();
  const monthCounts = new Map<string, number>();

  for (const e of entries) {
    if (!e.date) continue;
    const year = e.date.slice(0, 4);
    const month = e.date.slice(0, 7);

    for (const name of e.memberNames) {
      if (selfSet.has(name)) continue;
      partnerCounts.set(name, (partnerCounts.get(name) ?? 0) + 1);
    }

    if (e.copyFrom) {
      copyCounts.set(e.copyFrom, (copyCounts.get(e.copyFrom) ?? 0) + 1);
    }

    for (const p of e.myParts) {
      partCounts.set(p, (partCounts.get(p) ?? 0) + 1);
    }

    yearSongCounts.set(year, (yearSongCounts.get(year) ?? 0) + 1);

    if (!yearLiveKeys.has(year)) yearLiveKeys.set(year, new Set());
    const liveKey = `${e.date}::${e.liveName}`;
    yearLiveKeys.get(year)!.add(liveKey);

    monthCounts.set(month, (monthCounts.get(month) ?? 0) + 1);
  }

  const toRanked = (m: Map<string, number>): RankedItem[] =>
    [...m.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

  const yearlySummary = [...yearLiveKeys.entries()]
    .map(([y, set]) => ({
      year: y,
      liveEvents: set.size,
      songEntries: yearSongCounts.get(y) ?? 0,
    }))
    .sort((a, b) => b.year.localeCompare(a.year));

  const monthlySongEntries = [...monthCounts.entries()]
    .map(([yearMonth, count]) => ({ yearMonth, count }))
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));

  return {
    partnerRankings: toRanked(partnerCounts),
    copyRankings: toRanked(copyCounts),
    partRankings: toRanked(partCounts),
    monthlySongEntries,
    yearlySummary,
  };
}
