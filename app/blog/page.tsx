import type { Metadata } from "next";
import { BlogArchiveNav } from "@/components/blog-archive-nav";
import { BlogPostCard } from "@/components/blog-post-card";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "ブログ",
  description: "技術メモや制作ログなど",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">ブログ</h1>
        <p className="mb-8 text-slate-600">
          Markdown を{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">
            content/blog
          </code>{" "}
          に追加すると一覧に表示されます。frontmatter に{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">
            tags
          </code>{" "}
          や{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">
            category
          </code>{" "}
          を書くと、下のナビから絞り込みページへリンクできます。
        </p>
        <BlogArchiveNav />
        {posts.length === 0 ? (
          <p className="text-slate-500">まだ記事がありません。</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <BlogPostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
