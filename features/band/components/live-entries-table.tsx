"use client";

import { LiveEntryRow } from "./live-entry-row";

type Props = {
  rows: any[];
  canEdit: boolean;
};

export function LiveEntriesTable({ rows, canEdit }: Props) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
        <p className="text-sm text-slate-500">該当するエントリが見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[50rem] border-collapse text-left text-xs">
        <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-3 py-4">日付</th>
            <th className="px-3 py-4">ライブ</th>
            <th className="px-3 py-4">コピー元 / 1曲目</th>
            <th className="px-3 py-4 text-center">動画</th>
            <th className="px-3 py-4">My Part</th>
            <th className="w-10 px-3 py-4"></th>
            <th className="w-16 px-3 py-4" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <LiveEntryRow key={r.id} r={r} canEdit={canEdit} />
          ))}
        </tbody>
      </table>
    </div>
  );
}