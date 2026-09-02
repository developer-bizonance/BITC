import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Quote, Star, TrendingUp, Building } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import VideoTestimonialCard from "./VideoTestimonialCard";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Placement Success Stories",
  description: "Read inspiring career transformation and placement success stories from BITC Amravati alumni.",
  openGraph: {
    title: "Placement Success Stories | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Student placement success stories and alumni reviews.",
  },
};

// Fallback static data in case backend fails
const fallbackStories = [
  {
    name: "Rahul Verma",
    course: "Full Stack Development",
    company: "Amazon",
    role: "SDE-1",
    packageAmt: "14 LPA",
    quote: "BITC's intensive coding bootcamp and mock interviews completely transformed my approach to problem-solving. The mentors guided me at every step.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=crop",
    rating: 5
  },
  {
    name: "Priya Sharma",
    course: "Data Science & AI",
    company: "TCS",
    role: "Data Analyst",
    packageAmt: "8 LPA",
    quote: "The live industry projects were the game changer for me. During my interview, I could confidently explain complex machine learning models I built at BITC.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop",
    rating: 5
  }
];

// Reusable Image component with fallback for invalid URLs
function ValidImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  let isValidUrl = true;
  try {
    new URL(src);
  } catch {
    isValidUrl = false;
  }

  if (!isValidUrl || !src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center text-gray-400 font-medium ${className}`}>
        {alt.charAt(0)}
      </div>
    );
  }

  return (
    <img src={src} alt={alt} className={className} />
  );
}

export default async function SuccessStoriesPage() {
  let successStories = [];
  let videoTestimonials = [];
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://bitc-backend-theta.vercel.app";
    const res = await fetch(`${backendUrl}/api/testimonials`, { cache: 'no-store' });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.testimonials) {
        successStories = data.testimonials;
      }
    }

    const videoRes = await fetch(`${backendUrl}/api/video-testimonials`, { cache: 'no-store' });
    if (videoRes.ok) {
      const videoData = await videoRes.json();
      if (videoData.success && videoData.testimonials) {
        videoTestimonials = videoData.testimonials;
      }
    }
  } catch (error) {
    console.error("Failed to fetch stories from API:", error);
  }

  // Use fallback if the API returns no data
  if (!successStories || successStories.length === 0) {
    successStories = fallbackStories;
  }

  // Fallback for video testimonials if empty
  if (!videoTestimonials || videoTestimonials.length === 0) {
    videoTestimonials = [
      { id: "fallback-1", title: "From Non-IT to Full Stack Developer", name: "Ravi Kumar", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { id: "fallback-2", title: "Landing my dream job at Amazon", name: "Simran Kaur", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
    ];
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Banner */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white py-16 overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            ALUMNI SUCCESS
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Meet Our <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Achievers.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-[800px] mx-auto leading-relaxed mb-10 font-medium">
            Read inspiring stories from our alumni who transformed their careers through BITC's industry-driven training and dedicated placement support.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/courses">
              <Button className="h-12 px-8 rounded-full text-white shadow-lg shadow-orange-500/20 text-base font-semibold bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
                Start Your Journey
              </Button>
            </Link>
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
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Inspiring <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Transformations</span></h2>
            <p className="text-gray-500 text-lg">Hear directly from our students about how BITC helped them achieve their career goals.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story: any, i: number) => (
              <Card key={i} className="!p-0 !gap-0 border-0 shadow-xl shadow-gray-200/40 bg-white rounded-2xl relative overflow-hidden h-full flex flex-col hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -top-4 right-4 text-[120px] font-serif leading-none text-gray-100 pointer-events-none select-none">
                  &quot;
                </div>

                <CardContent className="p-6 flex flex-col flex-1 relative z-10">
                  {/* Image and Name */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative">
                      <ValidImage
                        src={story.image}
                        alt={story.name}
                        className="w-12 h-12 rounded-full object-cover relative z-10 border-2 border-white shadow-md bg-slate-100"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[15px]">{story.name}</h4>
                      <p className="text-[12px] text-gray-500 font-semibold">
                        {story.role || "Alumni"} {story.company && `at ${story.company}`}
                      </p>
                    </div>
                    {story.packageAmt && (
                      <div className="ml-auto bg-green-50 text-green-700 px-2 py-1 rounded-full text-[11px] font-bold border border-green-200 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {story.packageAmt}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-700 text-[14px] italic mb-6 leading-relaxed flex-1 relative z-10 font-medium">
                    &quot;{story.quote}&quot;
                  </p>

                  {/* Rating Stars & Google Icon */}
                  <div className="flex items-center text-amber-400 mt-auto pt-4 border-t border-gray-100">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    {Array.from({ length: story.rating || 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-current mr-1" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" className="h-12 px-8 rounded-full border-gray-300 text-gray-600 hover:text-primary hover:border-primary text-base font-semibold">
              Load More Stories
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Video Testimonials */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Video <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Testimonials</span></h2>
              <p className="text-gray-500 text-lg max-w-2xl">Watch our alumni share their unfiltered experiences and journeys at BITC.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {videoTestimonials.map((video: any, i: number) => (
              <VideoTestimonialCard key={video.id || i} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Ready to Write Your Own <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Success Story?</span></h2>
          <p className="text-xl text-slate-600 font-medium mb-10 leading-relaxed">
            Join thousands of successful graduates who started their journey with BITC. Enroll today and take the first step towards your dream career.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/courses">
              <Button className="h-14 px-10 rounded-full text-white text-lg font-bold shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all w-full sm:w-auto bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
                Explore Programs
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="h-14 px-10 rounded-full border-blue-200/80 text-slate-700 hover:bg-white hover:border-blue-300 text-lg font-bold hover:-translate-y-1 transition-all w-full sm:w-auto bg-white/80 backdrop-blur-sm shadow-sm">
                Contact Admissions
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
