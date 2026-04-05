import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostCard } from "@/components/blog-post-card";
import { getAllTags, getPostsByTag } from "@/lib/blog";

type Props = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `タグ: ${tag}` };
}

export default async function BlogTagPage({ params }: Props) {
  const { tag } = await params;
  const known = new Set(getAllTags());
  if (!known.has(tag)) notFound();

  const posts = getPostsByTag(tag);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/blog"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← ブログ一覧
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">
          タグ: {tag}
        </h1>
        <p className="mt-2 text-slate-600">{posts.length} 件</p>
        <ul className="mt-10 space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <BlogPostCard post={post} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
