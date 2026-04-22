type Props = {
  /** 先頭行をヘッダとして扱う */
  matrix: unknown[][];
  caption?: string;
  maxBodyRows?: number;
};

export function SheetTable({ matrix, caption, maxBodyRows = 400 }: Props) {
  if (!matrix || matrix.length === 0) {
    return <p className="text-sm text-slate-500">（空のシート）</p>;
  }

  const header = (matrix[0] ?? []) as unknown[];
  const colCount = Math.max(
    header.length,
    ...matrix.slice(1).map((r) => (Array.isArray(r) ? r.length : 0)),
  );
  const body = matrix.slice(1);
  const truncated = body.length > maxBodyRows;
  const visible = truncated ? body.slice(0, maxBodyRows) : body;

  function cellText(cell: unknown) {
    if (cell instanceof Date) return cell.toISOString().slice(0, 10);
    if (cell == null) return "";
    if (typeof cell === "object") return JSON.stringify(cell);
    return String(cell);
  }

  return (
    <div className="space-y-2">
      <div className="max-h-[min(70vh,560px)] overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-max border-collapse text-left text-xs">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="sticky top-0 z-10 bg-slate-100 text-[11px] font-semibold text-slate-700">
            <tr>
              {Array.from({ length: colCount }, (_, i) => (
                <th
                  key={i}
                  scope="col"
                  className="whitespace-nowrap border-b border-slate-200 px-2 py-2"
                >
                  {cellText(header[i])}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-800">
            {visible.map((row, ri) => {
              const r = Array.isArray(row) ? row : [];
              return (
                <tr
                  key={ri}
                  className={ri % 2 === 0 ? "bg-white" : "bg-slate-50/80"}
                >
                  {Array.from({ length: colCount }, (_, ci) => {
                    const cell = r[ci];
                    const t = cellText(cell);
                    return (
                      <td
                        key={ci}
                        className="max-w-[14rem] truncate border-b border-slate-100 px-2 py-1.5 align-top"
                        title={t || undefined}
                      >
                        {t}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {truncated ? (
        <p className="text-xs text-slate-500">
          行数が多いため先頭 {maxBodyRows} 行のみ表示しています。
        </p>
      ) : null}
    </div>
  );
}
