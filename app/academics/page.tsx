import type { Metadata } from "next";
import { academicYears } from "@/data/academics";
import { sortedAcademicYears } from "@/lib/academics";

export const metadata: Metadata = {
  title: "履修・成績",
  description: "年度別の履修科目と成績の整理",
};

export default function AcademicsPage() {
  const blocks = sortedAcademicYears(academicYears);
  const anyGrades = blocks.some((b) =>
    b.courses.some((c) => c.grade !== undefined && c.grade !== ""),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">履修・成績</h1>
        <p className="mt-3 text-slate-600">
          データは{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">
            data/academics.ts
          </code>{" "}
          の <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">academicYears</code>{" "}
          を編集してください。<code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">sortKey</code>{" "}
          が大きい年度が上に表示されます。
        </p>
        <p className="mt-2 text-sm text-slate-500">
          成績を公開したくない科目は <code className="rounded bg-slate-100 px-1 text-xs">grade</code>{" "}
          を省略できます。
        </p>

        {blocks.length === 0 ? (
          <p className="mt-12 text-slate-500">まだ登録がありません。</p>
        ) : (
          <div className="mt-12 space-y-14">
            {blocks.map((block) => (
              <section
                key={block.sortKey}
                aria-labelledby={`academic-${block.sortKey}`}
              >
                <h2
                  id={`academic-${block.sortKey}`}
                  className="mb-4 text-xl font-bold text-slate-800"
                >
                  {block.yearLabel}
                </h2>
                {block.note ? (
                  <p className="mb-4 text-sm text-slate-600">{block.note}</p>
                ) : null}
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full min-w-[32rem] text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th scope="col" className="px-4 py-3">
                          コード
                        </th>
                        <th scope="col" className="px-4 py-3">
                          科目名
                        </th>
                        <th scope="col" className="px-4 py-3 text-right">
                          単位
                        </th>
                        {anyGrades ? (
                          <th scope="col" className="px-4 py-3 text-right">
                            成績
                          </th>
                        ) : null}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {block.courses.map((course, i) => (
                        <tr key={`${block.sortKey}-${course.code ?? course.name}-${i}`}>
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">
                            {course.code ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-slate-800">{course.name}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                            {course.credits}
                          </td>
                          {anyGrades ? (
                            <td className="px-4 py-3 text-right text-slate-700">
                              {course.grade ?? "—"}
                            </td>
                          ) : null}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
