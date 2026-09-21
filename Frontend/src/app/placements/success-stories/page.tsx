import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TestimonialVideoCard from "@/components/TestimonialVideoCard";
import { defaultStories, TestimonialItem } from "@/data/defaultStories";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Placement Success Stories",
  description: "Read inspiring career transformation and placement success stories from BITC Amravati alumni.",
  openGraph: {
    title: "Placement Success Stories | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Student placement success stories and alumni reviews.",
  },
};

export default async function SuccessStoriesPage() {
  let successStories = [];
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
      (process.env.NODE_ENV === 'development' 
        ? "http://localhost:5000" 
        : "https://bitc-backend-theta.vercel.app");
        
    const res = await fetch(`${backendUrl}/api/testimonials`, { cache: 'no-store' });
    
    if (res.ok) {
      const data = await res.json();
      if (data.testimonials && data.testimonials.length > 0) {
        successStories = data.testimonials;
      }
    }
  } catch (error) {
    console.error("Failed to fetch stories from API:", error);
  }

  // Use fallback if the API returns no data
  if (!successStories || successStories.length === 0) {
    successStories = defaultStories;
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Banner */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center pt-8 md:pt-12 pb-6 bg-white overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center flex flex-col items-center h-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            ALUMNI SUCCESS
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-[1.1]">
            Meet Our <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Achievers.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-[700px] mx-auto leading-relaxed mb-6 font-medium">
            Read inspiring stories from our alumni who transformed their careers through BITC's industry-driven training and dedicated placement support.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Link href="/courses">
              <Button className="h-12 px-8 rounded-full text-white shadow-lg shadow-orange-500/20 text-base font-semibold bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
                Start Your Journey
              </Button>
            </Link>
          </div>
          
          <div className="w-full max-w-[1100px] mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/5 border border-slate-100 relative max-h-[45vh] lg:max-h-[50vh] flex items-center justify-center">
            <img 
              src="/success-stories-hero.png" 
              alt="BITC Alumni Success and Placement" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </section>

      {/* 2. Highlight Stats */}
      <section className="py-12 bg-white text-slate-900 relative z-20">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-slate-200/80">
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">10+</div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">Hiring Partners</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">1K+</div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">Students Trained</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">12 LPA</div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">Highest Package</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">95%</div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">Placement Ratio</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Success Stories Grid */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1400px] mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Inspiring <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Transformations</span></h2>
            <p className="text-gray-500 text-lg">Hear directly from our students about how BITC helped them achieve their career goals.</p>
          </div>

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

        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-20 bg-white text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Ready to Write Your Own <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Success Story?</span></h2>
          <p className="text-xl text-slate-600 font-medium mb-10 leading-relaxed">
            Join thousands of successful graduates who started their journey with BITC. Enroll today and take the first step towards your dream career.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/courses">
              <Button className="h-14 px-10 rounded-full text-white text-lg font-medium shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all w-full sm:w-auto bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
                Explore Programs
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="h-14 px-10 rounded-full border-blue-200/80 text-slate-700 hover:bg-white hover:border-blue-300 text-lg font-medium hover:-translate-y-1 transition-all w-full sm:w-auto bg-white/80 backdrop-blur-sm shadow-sm">
                Contact Admissions
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
