import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "記事が見つかりません" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/blog"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← ブログ一覧
        </Link>
        <article className="mt-8">
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-400">
            <time dateTime={post.date}>{post.date}</time>
            {post.category ? (
              <>
                <span aria-hidden>·</span>
                <Link
                  href={`/blog/category/${encodeURIComponent(post.category)}`}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  {post.category}
                </Link>
              </>
            ) : null}
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">{post.title}</h1>
          {post.tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="タグ">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-indigo-100 hover:text-indigo-900"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {post.excerpt ? (
            <p className="mt-4 text-lg text-slate-600">{post.excerpt}</p>
          ) : null}
          <div className="mt-10 space-y-4 text-slate-800 [&_a]:text-indigo-600 [&_a]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:leading-relaxed [&_strong]:font-semibold">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}
