import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";
import { getApiBase, resolveImageUrl } from "@/lib/utils";

import EventDescriptionRenderer from "@/components/events/EventDescriptionRenderer";
import BlogShareButton from "@/components/BlogShareButton";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id || "");
  const normalizedId = decodedId.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
  const cleanId = normalizedId.replace(/[^a-z0-9]/g, "");

  try {
    const apiBase = getApiBase();
    let blog: any = null;

    // 1. Direct query
    try {
      const res = await fetch(`${apiBase}/blogs/${encodeURIComponent(decodedId)}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        blog = data.blog || data;
      }
    } catch (_) {}

    // 2. Query all blogs fallback (match by id, slug, title)
    if (!blog || !blog.title) {
      try {
        const res = await fetch(`${apiBase}/blogs`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const blogsList = data.blogs || [];
          blog = blogsList.find((b: any) => {
            if (!b) return false;
            const bId = String(b.id || "").toLowerCase();
            const bSlug = String(b.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
            const bTitle = String(b.title || "").toLowerCase();
            const bTitleSlug = bTitle.replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-");
            const bClean = bTitle.replace(/[^a-z0-9]/g, "");
            return (
              bId === decodedId.toLowerCase() ||
              bSlug === decodedId.toLowerCase() ||
              bSlug === normalizedId ||
              bTitleSlug === normalizedId ||
              bTitle === decodedId.toLowerCase() ||
              (cleanId && bClean === cleanId)
            );
          });
        }
      } catch (_) {}
    }

    if (blog?.title) {
      return {
        title: `${blog.title} | BITC Blog`,
        description: blog.content ? blog.content.replace(/<[^>]*>/g, "").substring(0, 160) : undefined,
      };
    }
  } catch (_) { }
  return {
    title: `Blog Post | BIZONANCE Industrial Training Centre. (BITC)`,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  let blog: any = null;
  const { id } = await params;
  const decodedId = decodeURIComponent(id || "");
  const normalizedId = decodedId.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
  const cleanId = normalizedId.replace(/[^a-z0-9]/g, "");
  const apiBase = getApiBase();

  try {
    // 1. Direct query
    try {
      const res = await fetch(`${apiBase}/blogs/${encodeURIComponent(decodedId)}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.blog) blog = data.blog;
        else blog = data;
      }
    } catch (_) {}

    // 2. Query all blogs fallback (match by id, slug, or title)
    if (!blog || !blog.title) {
      const res = await fetch(`${apiBase}/blogs`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const blogsList = data.blogs || [];
        blog = blogsList.find((b: any) => {
          if (!b) return false;
          const bId = String(b.id || "").toLowerCase();
          const bSlug = String(b.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
          const bTitle = String(b.title || "").toLowerCase();
          const bTitleSlug = bTitle.replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-");
          const bClean = bTitle.replace(/[^a-z0-9]/g, "");
          return (
            bId === decodedId.toLowerCase() ||
            bSlug === decodedId.toLowerCase() ||
            bSlug === normalizedId ||
            bTitleSlug === normalizedId ||
            bTitle === decodedId.toLowerCase() ||
            (cleanId && bClean === cleanId)
          );
        });
      }
    }
  } catch (error) {
    console.warn("Failed to fetch blog.");
  }

  if (!blog) {
    notFound();
  }

  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    : "Recently";
  const author = blog.author || "Admin";
  const image = blog.image ? resolveImageUrl(blog.image) : "";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full py-20 min-h-[360px] flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
        {image ? (
          <>
            <div className="absolute inset-0 opacity-35">
              <img src={image} alt={blog.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 opacity-95" />
        )}

        <div className="container max-w-[840px] mx-auto px-4 relative z-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.2]">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-300 font-medium">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" /> {date}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" /> {author}
            </span>
          </div>
        </div>
      </section>

      {/* Main Blog Content Section */}
      <section className="py-12 md:py-20">
        <div className="container max-w-[840px] mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <Link
              href="/resources/blog"
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blogs
            </Link>
            <BlogShareButton
              url={`/resources/blog/${decodedId}`}
              title={blog.title || "BITC Blog Post"}
              direction="down"
            />
          </div>

          {/* Authentic Blog Description / Body Content */}
          <article className="max-w-none text-slate-800 space-y-8">
            {blog.content ? (
              blog.content.includes("<") ? (
                <div
                  className="space-y-4 leading-relaxed prose prose-slate prose-lg md:prose-xl"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <EventDescriptionRenderer description={blog.content} mode="all" />
              )
            ) : (
              <p className="italic text-slate-500">No content available for this blog post.</p>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
