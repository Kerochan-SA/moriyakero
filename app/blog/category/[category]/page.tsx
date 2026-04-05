import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostCard } from "@/components/blog-post-card";
import {
  getAllCategories,
  getPostsByCategory,
} from "@/lib/blog";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: `カテゴリ: ${category}` };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const known = new Set(getAllCategories());
  if (!known.has(category)) notFound();

  const posts = getPostsByCategory(category);

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
          カテゴリ: {category}
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
