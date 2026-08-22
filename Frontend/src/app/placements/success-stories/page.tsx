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
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white py-16 overflow-hidden border-b border-gray-100">
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
      <section className="py-12 bg-slate-100 border-y border-slate-200/80 text-slate-900 relative z-20">
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
      <section className="py-20 bg-gray-50">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Inspiring Transformations</h2>
            <p className="text-gray-500 text-lg">Hear directly from our students about how BITC helped them achieve their career goals.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story: any, i: number) => (
              <Card key={i} className="border-0 shadow-lg bg-white rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                <CardContent className="p-0">
                  {/* Top Header / Company Info */}
                  <div className="bg-slate-900 text-white p-6 pb-12 relative">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-primary" />
                        <span className="font-bold">{story.company || "Company N/A"}</span>
                      </div>
                      {story.packageAmt && (
                        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs font-bold text-green-400">
                          <TrendingUp className="w-3 h-3" />
                          {story.packageAmt}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">{story.role || "Alumni"}</div>
                  </div>

                  {/* Profile and Content */}
                  <div className="p-6 pt-0 relative">
                    <div className="absolute -top-10 left-6">
                      <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
                        <ValidImage src={story.image} alt={story.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    
                    <div className="ml-[90px] pt-2 mb-6">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">{story.name}</h3>
                      <div className="text-sm font-semibold text-primary">{story.course || "BITC Graduate"}</div>
                    </div>

                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-100 -z-10" />
                      <p className="text-gray-600 leading-relaxed italic relative z-10 text-[15px]">
                        "{story.quote}"
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex gap-1">
                      {[...Array(story.rating || 5)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Video Testimonials</h2>
              <p className="text-gray-500 text-lg max-w-2xl">Watch our alumni share their unfiltered experiences and journeys at BITC.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {videoTestimonials.map((video: any, i: number) => (
              <VideoTestimonialCard key={video.id || i} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Ready to Write Your Own Success Story?</h2>
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
