import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";
import { getApiBase, resolveImageUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const apiBase = getApiBase();
    const res = await fetch(`${apiBase}/blogs/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const blog = data.blog || data;
      if (blog?.title) {
        return {
          title: `${blog.title} | BITC Blog`,
          description: blog.content ? blog.content.replace(/<[^>]*>/g, "").substring(0, 160) : undefined,
        };
      }
    }
  } catch (_) {}
  return {
    title: `Blog Post | BIZONANCE Industrial Training Centre. (BITC)`,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  let blog: any = null;
  const { id } = await params;
  const apiBase = getApiBase();

  try {
    // Try to get specific blog
    let res = await fetch(`${apiBase}/blogs/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.blog) blog = data.blog;
      else blog = data;
    } else {
      // Fallback: fetch all and find by id or slug
      res = await fetch(`${apiBase}/blogs`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.blogs) {
          blog = data.blogs.find((b: any) => b.id?.toString() === id || b.slug === id);
        }
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
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
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
          <Link
            href="/resources/blog"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>

          {/* Featured Cover Image inside article if present and not in banner mode */}
          {image && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-slate-100 shadow-md max-h-[460px]">
              <img
                src={image}
                alt={blog.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Authentic Blog Description / Body Content */}
          <article className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-800">
            {blog.content ? (
              blog.content.includes("<") ? (
                <div
                  className="space-y-4 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <div className="space-y-6">
                  {blog.content.split(/\n\s*\n/).map((paragraph: string, i: number) => (
                    <p
                      key={`p-${i}`}
                      className="text-slate-700 text-lg md:text-xl leading-relaxed whitespace-pre-line"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
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
