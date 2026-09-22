import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Blog Post | BIZONANCE Industrial Training Centre. (BITC)`,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  let blog: any = null;
  const { id } = await params;
  try {
    // Try to get specific blog
    let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://bitc-backend-theta.vercel.app/api"}/blogs/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.blog) blog = data.blog;
      else blog = data;
    } else {
      // Fallback: fetch all and find
      res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://bitc-backend-theta.vercel.app/api"}/blogs`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.blogs) {
          blog = data.blogs.find((b: any) => b.id.toString() === id);
        }
      }
    }
  } catch (error) {
    console.warn("Failed to fetch blog.");
  }

  if (!blog) {
    notFound();
  }

  const date = blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString("en-US", { month: 'short', day: '2-digit', year: 'numeric' }) : "Recently";
  const author = blog.author || "Admin";
  const category = blog.category || "General";
  const image = blog.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src={image} alt={blog.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="container max-w-[800px] mx-auto px-4 relative z-10 text-center mt-16">
          <div className="inline-block bg-primary/20 backdrop-blur-md text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-primary/30">
            {category}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-300 font-medium">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {date}</span>
            <span className="flex items-center gap-2"><User className="w-4 h-4" /> {author}</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-[800px] mx-auto px-4">
          <Link href="/resources/blog" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
          
          <div className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-700">
            {/* Original API Content */}
            <div className="mb-12 font-medium text-slate-900 text-xl border-l-4 border-primary pl-6">
              {blog.content ? (
                blog.content.includes('<') ? (
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                ) : (
                  blog.content.split('\n').map((paragraph: string, i: number) => (
                    <p key={`intro-${i}`} className="mb-0">{paragraph}</p>
                  ))
                )
              ) : (
                <p className="italic text-slate-500">No content available for this blog post.</p>
              )}
            </div>

            {/* Extended Dummy Content for Layout Purposes */}
            <h2>The Changing Landscape of Technology</h2>
            <p>
              In today&apos;s fast-paced digital world, staying ahead of the curve is more important than ever. 
              The technological landscape is constantly evolving, bringing new frameworks, paradigms, and methodologies 
              that reshape how we approach problem-solving and application development. As professionals, we must embrace continuous learning.
            </p>
            
            <h3>Key Takeaways</h3>
            <ul>
              <li><strong>Adaptability is crucial:</strong> Technologies will change, but the ability to learn quickly remains constant.</li>
              <li><strong>Fundamentals matter:</strong> Deep knowledge of core principles makes learning new tools much easier.</li>
              <li><strong>Community and collaboration:</strong> The best innovations come from teams that share knowledge openly.</li>
            </ul>

            <p>
              Looking closely at industry trends, we can observe a significant shift towards more distributed, 
              scalable, and resilient architectures. Cloud-native development is no longer just a buzzword; it is 
              the standard for modern software engineering. Companies are increasingly relying on automation, 
              continuous integration, and robust delivery pipelines to maintain competitive advantages.
            </p>

            <blockquote>
              "Innovation distinguishes between a leader and a follower. To lead in tech, you must be willing to dismantle what works today to build what is needed tomorrow."
            </blockquote>

            <h2>Looking Ahead</h2>
            <p>
              As we look to the future, the boundaries between different domains of technology will continue to blur. 
              Artificial intelligence, cloud computing, and advanced web capabilities are converging to create unprecedented 
              opportunities for those willing to seize them. The key to success will be maintaining a balance between 
              practical application and visionary thinking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
