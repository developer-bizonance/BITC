"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Play, Sparkles, TrendingUp, Award, Quote } from "lucide-react";

interface TestimonialItem {
  id?: string;
  name: string;
  role: string;
  company?: string;
  course?: string;
  packageAmt?: string;
  quote: string;
  image: string;
  rating?: number;
  youtubeUrl?: string;
}

const defaultStories: TestimonialItem[] = [
  {
    id: "testi-1",
    name: "Rahul Sharma",
    role: "Software Engineer",
    company: "TCS",
    course: "Full Stack Development",
    packageAmt: "6 LPA",
    quote: "The MERN stack certification at BITC gave me the practical skills I needed to clear my interviews with ease.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "testi-2",
    name: "Priya Patel",
    role: "Data Analyst",
    company: "Wipro",
    course: "Data Science & AI",
    packageAmt: "8 LPA",
    quote: "Excellent faculty and hands-on projects. The placement cell was very supportive throughout the process.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "testi-3",
    name: "Amit Kumar",
    role: "Automation Engineer",
    company: "L&T",
    course: "Industrial Automation",
    packageAmt: "5.5 LPA",
    quote: "The industrial automation training was exactly what the industry demands right now.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "testi-4",
    name: "Simran Kaur",
    role: "Cloud Architect",
    company: "Amazon",
    course: "DevOps & Cloud",
    packageAmt: "12 LPA",
    quote: "BITC helped me build deep practical experience with live projects that gave me confidence during interviews.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

const getYouTubeID = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

function TestimonialVideoCard({ story, index }: { story: TestimonialItem; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);

  const ytId = getYouTubeID(story.youtubeUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const videoThumbnail = ytId
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    : story.image;

  return (
    <Card className="!p-0 !gap-0 border-0 border-none shadow-lg shadow-slate-200/50 bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch h-full">
      
      {/* ========================================================================= */}
      {/* LEFT COLUMN (As drawn): Photo (Circle) -> Name -> Desi -> Intro Box -> Rating */}
      {/* ========================================================================= */}
      <div className="w-full md:w-[44%] lg:w-[45%] p-4 sm:p-5 flex flex-col items-center text-center justify-between bg-white">
        
        {/* Top: Circular Profile Photo */}
        <div className="flex flex-col items-center w-full">
          <div className="relative mb-2">
            <img
              src={imgError ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80" : story.image}
              alt={story.name}
              onError={() => setImgError(true)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-amber-500/15"
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-white text-[9px] font-bold shadow-xs"
              title="Verified Placement"
            >
              ✓
            </div>
          </div>

          {/* Name */}
          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
            {story.name}
          </h4>

          {/* Designation (Desi.) */}
          <p className="text-[11px] font-bold text-slate-500 mt-0.5">
            {story.role} {story.company && <span className="text-amber-600 font-extrabold">• {story.company}</span>}
          </p>

          {/* Placement / Course Badge */}
          {story.packageAmt && (
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
              <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
              <span>{story.packageAmt} Package</span>
            </div>
          )}
        </div>

        {/* Middle: Intro / Review Quote Box */}
        <div className="w-full bg-slate-50 rounded-xl p-2.5 sm:p-3 my-2.5 flex-1 flex flex-col justify-center text-left relative shadow-xs">
          <Quote className="w-3 h-3 text-amber-500/50 mb-0.5 shrink-0" />
          <p className="text-slate-700 text-[11px] sm:text-xs leading-relaxed italic font-medium line-clamp-3">
            &quot;{story.quote}&quot;
          </p>
        </div>

        {/* Bottom: Google 'G' Icon + Stars */}
        <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <div className="flex items-center text-amber-400">
            {Array.from({ length: story.rating || 5 }).map((_, s) => (
              <Star key={s} className="h-3 w-3 fill-current mr-0.5" />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-700 ml-0.5">
            {(story.rating || 5).toFixed(1)}
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: FULL-COVER VIDEO AREA                                       */}
      {/* ========================================================================= */}
      <div className="w-full md:w-[56%] lg:w-[55%] min-h-[190px] sm:min-h-[220px] md:min-h-full relative bg-slate-950 flex items-center justify-center overflow-hidden">
        {isPlaying && ytId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
            title={`${story.name} Testimonial Video`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: `url('${videoThumbnail}')` }}
            onClick={() => setIsPlaying(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20" />
            
            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white flex items-center justify-center shadow-lg shadow-orange-500/50">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
              </div>
            </div>

            {/* Bottom Video Badge */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
              <div>
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Alumni Video Story
                </p>
                <h5 className="text-xs font-bold truncate text-white drop-shadow-sm">
                  {story.name} • {story.company || "BITC Graduate"}
                </h5>
              </div>
              <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <span className="w-1 h-1 rounded-full bg-white animate-ping"></span>
                Play Video
              </span>
            </div>
          </div>
        )}
      </div>

    </Card>
  );
}

export default function StudentSuccessStories() {
  const [stories, setStories] = useState<TestimonialItem[]>(defaultStories);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          (typeof window !== "undefined" &&
          (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1")
            ? "http://localhost:5000/api"
            : "https://bitc-backend-theta.vercel.app/api");

        const res = await fetch(`${apiUrl}/testimonials`);
        if (res.ok) {
          const data = await res.json();
          if (data.testimonials && data.testimonials.length > 0) {
            setStories(data.testimonials);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch testimonials:", err);
      }
    }
    loadTestimonials();
  }, []);

  return (
    <section className="py-14 md:py-20 bg-white relative overflow-hidden">
      <div className="container max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-2.5 tracking-tight">
            Student <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Success Stories</span>
          </h2>
          <p className="text-slate-600 text-xs md:text-sm font-medium">
            Hear from our alumni who are now working at top tech companies.
          </p>
        </div>

        {/* 2 Components In One Horizontal Line (grid-cols-1 lg:grid-cols-2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7">
          {stories.map((story, i) => (
            <TestimonialVideoCard key={story.id || i} story={story} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}


