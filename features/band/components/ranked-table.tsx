"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { RankedItem } from "@/features/band/lib/types";

type Props = {
  title: string;
  items: RankedItem[];
  initialMaxRows?: number; // 初期表示数
  description?: string;
};

export function RankedTable({
  title,
  items,
  initialMaxRows = 40,
  description,
}: Props) {
  // 「もっと見る」状態を管理するステート
  const [isExpanded, setIsExpanded] = useState(false);
  const maxCount = Math.max(1, ...items.map((i) => i.count));
  
  // 表示するデータを切り替え
  const visibleItems = isExpanded ? items : items.slice(0, initialMaxRows);
  const hasMore = items.length > initialMaxRows;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm h-fit">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
          Total: {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">データがありません。</p>
      ) : (
        <>
          <ul className="mt-4 space-y-2">
            {visibleItems.map((row, i) => (
              <li
                key={`${i}-${row.label}`}
                className="flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-1 duration-300"
              >
                <span className="w-6 tabular-nums text-slate-400 text-right">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate font-medium text-slate-800" title={row.label}>
                  {row.label}
                </span>
                <span className="tabular-nums text-slate-600 font-semibold">{row.count}</span>
                <span
                  className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 sm:block sm:max-w-[6rem]"
                  aria-hidden
                >
                  <span
                    className="block h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${(row.count / maxCount) * 100}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>

          {/* 開閉ボタン */}
          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={14} /> 閉じる
                </>
              ) : (
                <>
                  <ChevronDown size={14} /> 残り {items.length - initialMaxRows} 件を表示
                </>
              )}
            </button>
          )}
        </>
      )}
    </section>
  );
}