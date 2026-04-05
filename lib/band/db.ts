import type { MemberRoleKey } from "@/lib/band/constants";
import { MEMBER_ROLE_KEYS } from "@/lib/band/constants";
import type { BandListEntry } from "@/lib/band/types";

export type LiveSetlistDbRow = {
  id: string;
  performance_date: string;
  live_name: string;
  copy_from: string | null;
  video_url: string | null;
  members: Record<string, string | null>;
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
  const membersByRole = membersRecordFromRow(row.members);
  return {
    date: row.performance_date,
    liveName: row.live_name,
    copyFrom: row.copy_from,
    videoUrl: row.video_url,
    membersByRole,
    memberNames: memberNamesFromMembers(membersByRole),
    songs: row.songs ?? [],
    myParts: row.my_parts ?? [],
    note: row.note,
  };
}

export function sanitizeIlike(q: string): string {
  return q.replace(/[%_\\]/g, "").trim();
}
