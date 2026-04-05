import Link from "next/link";
import { X, Code2, Cpu, ExternalLink } from "lucide-react";
import { featuredApps } from "@/data/apps";

export default function HomePage() {
  const highlights = featuredApps(4);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-20">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            洩矢 ケロ / Moriya Kero
          </h1>
          <p className="mb-8 text-lg text-slate-600 sm:text-xl">
            Kyoto University / Engineering / Information Science
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://x.com/moriyakero2000"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-900 p-2 text-white transition hover:bg-slate-700"
              aria-label="X（旧Twitter）"
            >
              <X size={24} />
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <section className="mb-20">
          <h2 className="mb-8 border-l-4 border-indigo-500 pl-4 text-2xl font-bold">
            About Me
          </h2>
          <div className="grid gap-12 text-slate-700 md:grid-cols-2 md:leading-relaxed">
            <p>
              京都大学工学部情報学科計算機科学コース
              <br />
              データベースを用いたWeb開発からアルゴリズム設計まで
            </p>
            <p>
              京大アンプラグド(Cj.)、ZETS(Dr.)の2つの軽音サークルに所属
              <br />
              ライブイベントの運営を効率化するためのツール開発など、技術を身近な課題解決に活かそうとしている
            </p>
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-l-4 border-indigo-500 pl-4">
            <h2 className="text-2xl font-bold">Projects</h2>
            <Link
              href="/apps"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              アプリ一覧へ →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {highlights.map((app) => {
              const isRos =
                app.id.includes("ros") || app.id.includes("robot");
              return (
                <div
                  key={app.id}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300"
                >
                  <div className="mb-4 flex items-start justify-between">
                    {isRos ? (
                      <Cpu className="text-emerald-600" size={32} />
                    ) : (
                      <Code2 className="text-indigo-600" size={32} />
                    )}
                    {app.url ? (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-300 transition group-hover:text-indigo-500"
                        aria-label={`${app.title} を開く`}
                      >
                        <ExternalLink size={20} />
                      </a>
                    ) : null}
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{app.title}</h3>
                  <p className="mb-4 text-sm text-slate-600">{app.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-800">ブログ</h2>
          <p className="mt-2 text-sm text-slate-600">
            技術メモや制作ログはブログページにまとめています。
          </p>
          <Link
            href="/blog"
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            ブログを見る
          </Link>
        </section>

        <section>
          <h2 className="mb-8 border-l-4 border-indigo-500 pl-4 text-2xl font-bold">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              "TypeScript",
              "Python",
              "Next.js",
              "Java",
              "PostgreSQL",
              "supabase",
              "Docker",
              "ROS",
              "OCaml",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-sm text-slate-400">
        © 2026 Moriya Kero. Powered by Next.js & Moriyakero.
      </footer>
    </div>
  );
}
