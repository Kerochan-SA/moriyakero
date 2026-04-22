import type { MemberRoleKey } from "@/features/band/lib/constants";
import { MEMBER_ROLE_KEYS } from "@/features/band/lib/constants";
import type { BandListEntry } from "@/features/band/lib/types";

export type LiveSetlistDbRow = {
  id: string;
  performance_date: string;
  live_name: string;
  copy_from: string | null;
  video_url: string | null;
  // 1. members の型を Record から「オブジェクトの配列」に変更
  members: { role: string; name: string }[] | null | undefined; 
  songs: string[];
  my_parts: string[];
  note: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export function membersRecordFromRow(
  members: Record<string, unknown> | null | undefined,
): Record<MemberRoleKey, string | null> {
  const out = {} as Record<MemberRoleKey, string | null>;
  for (const key of MEMBER_ROLE_KEYS) {
    const v = members?.[key];
    if (typeof v === "string" && v.trim()) {
      out[key] = v.trim();
    } else {
      out[key] = null;
    }
  }
  return out;
}

export function memberNamesFromMembers(
  members: Record<MemberRoleKey, string | null>,
): string[] {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const key of MEMBER_ROLE_KEYS) {
    const n = members[key];
    if (n && !seen.has(n)) {
      seen.add(n);
      list.push(n);
    }
  }
  return list;
}

export function dbRowToBandEntry(row: LiveSetlistDbRow): BandListEntry {
  // 配列であることを保証
  const membersArray = Array.isArray(row.members) ? row.members : [];

  // 名前だけを抽出した配列を作成（これが統計に使われます）
  const memberNames = membersArray
    .map((m) => m.name)
    .filter((name) => name && name.trim() !== "");

  return {
    date: row.performance_date,
    liveName: row.live_name,
    copyFrom: row.copy_from,
    videoUrl: row.video_url,
    // 互換性のために membersByRole も残す場合、配列から無理やり Record を作ります
    // (重複がある場合は後の人が上書きされますが、統計には影響しません)
    membersByRole: membersArray.reduce((acc, m) => {
      acc[m.role as MemberRoleKey] = m.name;
      return acc;
    }, {} as Record<MemberRoleKey, string | null>),
    memberNames: memberNames, // ここが修正の肝です
    songs: row.songs ?? [],
    myParts: row.my_parts ?? [],
    note: row.note,
  };
}

export function sanitizeIlike(q: string): string {
  return q.replace(/[%_\\]/g, "").trim();
}
