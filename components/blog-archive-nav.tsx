import Link from "next/link";
import {
  getAllCategories,
  getAllPostYears,
  getAllTags,
} from "@/lib/blog";

export function BlogArchiveNav() {
  const years = getAllPostYears();
  const tags = getAllTags();
  const categories = getAllCategories();

  if (years.length === 0 && tags.length === 0 && categories.length === 0) {
    return null;
  }

  return (
    <aside
      className="mb-12 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="ブログのアーカイブ"
    >
      {years.length > 0 ? (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            年別
          </h2>
          <ul className="flex flex-wrap gap-2">
            {years.map((y) => (
              <li key={y}>
                <Link
                  href={`/blog/year/${y}`}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-800 hover:bg-indigo-100 hover:text-indigo-900"
                >
                  {y}年
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {categories.length > 0 ? (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            カテゴリ
          </h2>
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/blog/category/${encodeURIComponent(c)}`}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-800 hover:bg-indigo-100 hover:text-indigo-900"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {tags.length > 0 ? (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            タグ
          </h2>
          <ul className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <li key={t}>
                <Link
                  href={`/blog/tag/${encodeURIComponent(t)}`}
                  className="rounded-md border border-slate-200 px-2.5 py-1 text-sm text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
