import Link from "next/link";

const links = [
  { href: "/", label: "ホーム" },
  { href: "/apps", label: "アプリ" },
  { href: "/blog", label: "ブログ" },
  { href: "/lives", label: "出演" },
  { href: "/academics", label: "履修" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-slate-900 hover:text-indigo-600"
        >
          Moriya Kero
        </Link>
        <nav
          className="flex max-w-[min(100%,24rem)] flex-wrap justify-end gap-x-1 gap-y-1 sm:max-w-none sm:gap-4"
          aria-label="メイン"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
