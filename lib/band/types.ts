export type BandImportedPayload = {
  sourceFile: string;
  exportedAt: string;
  entries: BandListEntry[];
  /** 元ブックのシート名 → 2次元配列（表示用） */
  rawSheets: Record<string, unknown[][] | null>;
};

export type BandListEntry = {
  date: string;
  liveName: string;
  copyFrom: string | null;
  videoUrl: string | null;
  membersByRole: Record<string, string | null>;
  /** その行のメンバー名（重複除去・空除外） */
  memberNames: string[];
  songs: string[];
  myParts: string[];
  note: string | null;
};

export type RankedItem = { label: string; count: number };
