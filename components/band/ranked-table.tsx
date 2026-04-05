import type { RankedItem } from "@/lib/band/types";

type Props = {
  title: string;
  items: RankedItem[];
  maxRows?: number;
  description?: string;
};

export function RankedTable({
  title,
  items,
  maxRows = 30,
  description,
}: Props) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const visible = items.slice(0, maxRows);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      ) : null}
      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">データがありません。</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {visible.map((row, i) => (
            <li key={`${i}-${row.label}`} className="flex items-center gap-3 text-sm">
              <span className="w-6 tabular-nums text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate font-medium text-slate-800">
                {row.label}
              </span>
              <span className="tabular-nums text-slate-600">{row.count}</span>
              <span
                className="hidden h-2 flex-1 overflow-hidden rounded-full bg-slate-100 sm:block sm:max-w-[8rem]"
                aria-hidden
              >
                <span
                  className="block h-full rounded-full bg-indigo-500"
                  style={{ width: `${(row.count / max) * 100}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
      )}
      {items.length > maxRows ? (
        <p className="mt-3 text-xs text-slate-500">
          他 {items.length - maxRows} 件（表は上位 {maxRows} 件のみ）
        </p>
      ) : null}
    </section>
  );
}
