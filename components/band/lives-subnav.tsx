import Link from "next/link";

const items = [
  { href: "/lives", label: "概要" },
  { href: "/lives/entries", label: "一覧・検索" },
  { href: "/lives/entries/new", label: "新規" },
  { href: "/lives/stats", label: "統計" },
] as const;

export function LivesSubNav() {
  return (
    <nav
      className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4"
      aria-label="ライブデータ"
    >
      {items.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
