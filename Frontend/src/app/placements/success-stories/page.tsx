import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TestimonialVideoCard from "@/components/TestimonialVideoCard";
import { TestimonialItem } from "@/types/testimonial";
import { getApiBase, resolveImageUrl } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Placement success stories",
  description: "Read inspiring career transformation and placement success stories from BITC Amravati alumni.",
  openGraph: {
    title: "Placement Success Stories | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Student placement success stories and alumni reviews.",
  },
};

export default async function SuccessStoriesPage() {
  let successStories: TestimonialItem[] = [];

  try {
    const apiUrl = getApiBase();
    const res = await fetch(`${apiUrl}/testimonials`, { cache: 'no-store' });

    if (res.ok) {
      const data = await res.json();
      if (data.testimonials && Array.isArray(data.testimonials)) {
        successStories = data.testimonials.map((t: any) => ({
          ...t,
          image: resolveImageUrl(t.image),
        }));
      }
    }
  } catch (error) {
    console.error("Failed to fetch stories from API:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. Hero Banner */}
      <section className="relative w-full lg:min-h-[calc(100vh-80px)] flex flex-col items-center justify-center pt-12 sm:pt-14 md:pt-12 pb-8 sm:pb-10 bg-white overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center flex flex-col items-center justify-center h-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Alumni Success
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.2]">
            Meet Our <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Achievers</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-[700px] mx-auto leading-relaxed mb-6 font-normal">
            Read inspiring stories from our alumni who transformed their careers through BITC's industry-driven training and dedicated placement support.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Link href="/certifications">
              <Button className="h-12 px-8 rounded-full text-slate-800 shadow-lg shadow-orange-500/20 text-base font-normal bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
                Start your journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Highlight Stats */}
      <section className="py-10 sm:py-12 bg-white text-slate-900 relative z-20">
        <div className="container max-w-[1100px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 text-center">
            {[
              { stat: "10+", label: "Hiring Partners" },
              { stat: "500+", label: "Students Certified" },
              { stat: "12 LPA", label: "Highest Package" },
              { stat: "95%", label: "Placement Ratio" }
            ].map((item, index) => (
              <div key={index} className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100/90 shadow-sm hover:bg-white hover:border-primary/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 group">
                <div className="text-3xl md:text-4xl font-bold mb-2 opacity-65 group-hover:opacity-100 transform group-hover:scale-105 transition-all duration-300">
                  <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
                    {item.stat}
                  </span>
                </div>
                <div className="text-xs md:text-[13px] font-bold text-slate-800 tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Success Stories Grid */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1400px] mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Inspiring <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Transformations</span></h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-normal">Hear directly from our students about how BITC helped them achieve their career goals.</p>
          </div>

          {successStories.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 justify-items-center">
              {successStories.map((story: TestimonialItem, i: number) => (
                <TestimonialVideoCard
                  key={story.id || i}
                  story={story}
                  index={i}
                  className="w-full max-w-[650px]"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <p className="text-base font-medium">Stories will appear here once added from the dashboard.</p>
            </div>
          )}

        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-20 bg-white text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-[1.2]">Ready to Write Your Own <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Success Story?</span></h2>
          <p className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed font-normal">
            Join thousands of successful graduates who started their journey with BITC. Enroll today and take the first step towards your dream career.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/certifications">
              <Button className="h-14 px-10 rounded-full text-slate-800 text-lg font-normal shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all w-full sm:w-auto bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
                Explore Certifications
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="h-14 px-10 rounded-full border-blue-200/80 text-slate-600 hover:bg-white hover:border-blue-300 text-lg font-normal hover:-translate-y-1 transition-all w-full sm:w-auto bg-white/80 backdrop-blur-sm shadow-sm">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
