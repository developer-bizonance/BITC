import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight, User } from "lucide-react";
import { getApiBase, resolveImageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tech Blog & Insights | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
  description: "Read the latest articles on AI in software engineering, tech interview strategies, Next.js, Cloud development, and career growth tips from BITC experts.",
  openGraph: {
    title: "Tech Blog & Insights | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Stay updated with tech industry insights, coding tips, and career guidance.",
  },
};

export default async function BlogPage() {
  let blogs: any[] = [];
  const apiBase = getApiBase();

  try {
    const res = await fetch(`${apiBase}/blogs`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.blogs && Array.isArray(data.blogs)) {
        const seenIds = new Set<string>();
        const seenSlugs = new Set<string>();
        const seenTitles = new Set<string>();
        const uniqueBlogs: any[] = [];

        const normSlug = (s?: string) =>
          s ? String(s).trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "") : "";
        const normTitle = (s?: string) =>
          s ? String(s).trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ") : "";

        for (const b of data.blogs) {
          if (!b) continue;
          const idKey = b.id ? String(b.id).trim().toLowerCase() : "";
          const slugKey = normSlug(b.slug);
          const titleKey = normTitle(b.title);

          if (idKey && seenIds.has(idKey)) continue;
          if (slugKey && seenSlugs.has(slugKey)) continue;
          if (titleKey && seenTitles.has(titleKey)) continue;

          if (idKey) seenIds.add(idKey);
          if (slugKey) seenSlugs.add(slugKey);
          if (titleKey) seenTitles.add(titleKey);

          uniqueBlogs.push(b);
        }
        blogs = uniqueBlogs.map((b: any, i: number) => ({
          id: b.id || b.slug || i,
          title: b.title,
          excerpt: b.content
            ? b.content.replace(/<[^>]*>/g, "").trim().substring(0, 160) + "..."
            : "No description available",
          category: b.category || "General",
          date: b.publishedAt
            ? new Date(b.publishedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
            : "Recently",
          author: b.author || "Admin",
          image: b.image ? resolveImageUrl(b.image) : "",
        }));
      }
    }
  } catch (error) {
    console.warn("Failed to fetch blogs from backend API.");
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="bg-white pt-16 pb-8 text-slate-900 text-center">
        <div className="container max-w-[1200px] mx-auto px-4">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Our <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Blog</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Stay updated with the latest tech trends, career advice, and news from BITC.
          </p>
        </div>
      </section>

      {/* 2. Blog Grid */}
      <section className="pb-16 pt-4">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow group flex flex-col"
              >
                <div className="h-48 overflow-hidden relative bg-slate-100 flex items-center justify-center">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                      <BookOpen className="w-10 h-10 stroke-[1.5] text-slate-400 mb-1" />
                      <span className="text-xs font-medium text-slate-400">BITC Insights</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {blog.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> {blog.author}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <Link
                    href={`/resources/blog/${blog.id}`}
                    className="mt-auto inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
