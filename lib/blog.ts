import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags: string[];
  category?: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .filter((t): t is string => typeof t === "string")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parseMeta(slug: string, data: Record<string, unknown>, content: string): BlogPost {
  const title = typeof data.title === "string" ? data.title : slug;
  const date = typeof data.date === "string" ? data.date : "";
  const excerpt =
    typeof data.excerpt === "string" ? data.excerpt : undefined;
  const tags = normalizeTags(data.tags);
  const category =
    typeof data.category === "string" && data.category.trim()
      ? data.category.trim()
      : undefined;
  return { slug, title, date, excerpt, tags, category, content };
}

/** `date` の先頭4桁を年として返す（パースできなければ null） */
export function getYearFromPostDate(date: string): string | null {
  const m = date.trim().match(/^(\d{4})/);
  return m ? m[1] : null;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return parseMeta(slug, data as Record<string, unknown>, content);
}

export function getAllPosts(): BlogPostMeta[] {
  return getPostSlugs()
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      const { content: _c, ...meta } = post;
      return meta;
    })
    .filter((p): p is BlogPostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const p of getAllPosts()) {
    for (const t of p.tags) set.add(t);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "ja"));
}

export function getAllCategories(): string[] {
  const set = new Set<string>();
  for (const p of getAllPosts()) {
    if (p.category) set.add(p.category);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "ja"));
}

export function getAllPostYears(): string[] {
  const set = new Set<string>();
  for (const p of getAllPosts()) {
    const y = getYearFromPostDate(p.date);
    if (y) set.add(y);
  }
  return [...set].sort((a, b) => b.localeCompare(a));
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getPostsByCategory(category: string): BlogPostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostsByYear(year: string): BlogPostMeta[] {
  return getAllPosts().filter((p) => getYearFromPostDate(p.date) === year);
}
