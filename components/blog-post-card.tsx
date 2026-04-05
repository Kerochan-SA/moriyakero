import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

type Props = { post: BlogPostMeta };

export function BlogPostCard({ post }: Props) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
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
      <h2 className="mt-2 text-xl font-bold">
        <Link
          href={`/blog/${post.slug}`}
          className="text-slate-900 hover:text-indigo-600"
        >
          {post.title}
        </Link>
      </h2>
      {post.excerpt ? (
        <p className="mt-2 text-slate-600">{post.excerpt}</p>
      ) : null}
      {post.tags.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="タグ">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 transition hover:bg-indigo-100 hover:text-indigo-800"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        続きを読む
      </Link>
    </article>
  );
}
