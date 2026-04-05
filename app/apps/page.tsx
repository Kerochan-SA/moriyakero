import type { Metadata } from "next";
import { Code2, Cpu, ExternalLink, GitBranch } from "lucide-react";
import { apps } from "@/data/apps";

export const metadata: Metadata = {
  title: "アプリ・制作物",
  description: "開発したアプリやプロジェクトへのリンク",
};

function iconFor(id: string) {
  if (id.includes("ros") || id.includes("robot")) {
    return <Cpu className="text-emerald-600" size={32} aria-hidden />;
  }
  return <Code2 className="text-indigo-600" size={32} aria-hidden />;
}

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">アプリ・制作物</h1>
        <p className="mb-12 max-w-2xl text-slate-600">
          公開URLやリポジトリは{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">data/apps.ts</code>{" "}
          の <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">url</code> /{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">repositoryUrl</code>{" "}
          に追記すると、ここからリンクできます。
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {apps.map((app) => (
            <article
              key={app.id}
              id={app.id}
              className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                {iconFor(app.id)}
                <div className="flex shrink-0 gap-2">
                  {app.url ? (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
                      aria-label={`${app.title} を開く`}
                    >
                      <ExternalLink size={20} />
                    </a>
                  ) : null}
                  {app.repositoryUrl ? (
                    <a
                      href={app.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
                      aria-label={`${app.title} のリポジトリ`}
                    >
                      <GitBranch size={20} />
                    </a>
                  ) : null}
                </div>
              </div>
              <h2 className="text-xl font-bold">{app.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {app.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {!app.url && !app.repositoryUrl ? (
                <p className="mt-4 text-xs text-slate-400">リンクは未設定です</p>
              ) : null}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
