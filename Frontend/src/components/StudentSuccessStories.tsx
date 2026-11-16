"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Play, TrendingUp, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialItem } from "@/types/testimonial";
import { getApiBase, resolveImageUrl } from "@/lib/utils";

const getYouTubeID = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function StudentSuccessStories() {
  const [stories, setStories] = useState<TestimonialItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const apiUrl = getApiBase();
        const res = await fetch(`${apiUrl}/testimonials`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.testimonials && Array.isArray(data.testimonials)) {
            setStories(
              data.testimonials
                .filter((t: any) => {
                  const name = (t.name || "").trim().toLowerCase();
                  const quote = (t.quote || "").trim().toLowerCase();
                  return name !== "test" && !quote.startsWith("testhbc") && quote.length > 5;
                })
                .map((t: any) => ({
                  ...t,
                  image: resolveImageUrl(t.image),
                }))
            );
          }
        }
      } catch (err) {
        console.warn("Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  useEffect(() => {
    setIsPlaying(false);
    setImgError(false);
  }, [currentIndex]);

  // Auto-slide when multiple stories exist
  useEffect(() => {
    if (stories.length <= 1 || isPaused || isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [stories.length, isPaused, isPlaying]);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  if (!loading && stories.length === 0) {
    return null;
  }

  const currentStory = stories[currentIndex] || stories[0];
  if (!currentStory) return null;

  const resolvedImg = resolveImageUrl(currentStory.image);
  const hasValidImg = Boolean(!imgError && resolvedImg);
  const ytId = getYouTubeID(currentStory.youtubeUrl || "");

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      <div className="container max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with See More link on right */}
        <div className="relative mb-8 md:mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center w-full">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 leading-[1.2]">
              Student <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Success Stories</span>
            </h2>
            <p className="text-slate-600 text-xs md:text-sm font-medium">
              Hear from our alumni who are now working at top tech companies.
            </p>
          </div>

          <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 shrink-0">
            <Link
              href="/placements/success-stories"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-primary transition-colors cursor-pointer shrink-0"
            >
              See More <span className="text-lg leading-none" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Showcase Container: Decreased size + Video Section bigger than Left Section */}
        <div 
          className="w-full max-w-[800px] md:max-w-[840px] mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Keyframe animation for smooth transition */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes storyPostIn {
                0% {
                  opacity: 0;
                  transform: scale(0.98) translateY(6px);
                }
                100% {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
              .animate-story-post {
                animation: storyPostIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `
          }} />

          {/* Card Wrapper with Side Navigation Buttons */}
          <div className="relative">
            {/* Side Navigation Buttons (Left & Right of Card) */}
            {stories.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  aria-label="Previous story"
                  className="absolute -left-3 sm:-left-5 md:-left-6 top-[36%] sm:top-[40%] md:top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-lg shadow-slate-900/10 text-slate-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer hover:border-amber-400 hover:text-amber-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNext}
                  aria-label="Next story"
                  className="absolute -right-3 sm:-right-5 md:-right-6 top-[36%] sm:top-[40%] md:top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-lg shadow-slate-900/10 text-slate-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer hover:border-amber-400 hover:text-amber-600"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Card with Exact Style & Content Placement from Image 1 */}
            <div 
              key={currentStory.id || currentIndex}
              className="animate-story-post bg-white rounded-2xl md:rounded-[26px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row items-stretch min-h-[340px] sm:min-h-[360px] md:min-h-[390px]"
            >
            {/* ========================================================================= */}
            {/* LEFT COLUMN: Exactly matching Image 1 layout (~40% width)                  */}
            {/* ========================================================================= */}
            <div className="w-full md:w-[40%] lg:w-[39%] p-6 sm:p-7 md:p-8 flex flex-col justify-between bg-slate-50/80 text-left">
              
              {/* 1. Top Profile Info Horizontal */}
              <div className="flex flex-row items-center gap-3.5 w-full">
                <div className="relative shrink-0">
                  {hasValidImg ? (
                    <img
                      src={resolvedImg}
                      alt={currentStory.name}
                      onError={() => setImgError(true)}
                      className="w-14 h-14 sm:w-15 sm:h-15 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-amber-500/15"
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-900 font-bold flex items-center justify-center text-lg shadow-md ring-2 ring-amber-500/15">
                      {currentStory.name ? currentStory.name.charAt(0).toUpperCase() : "S"}
                    </div>
                  )}
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-black text-[9px] font-bold shadow-xs"
                    title="Verified Placement"
                  >
                    ✓
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  {/* Name */}
                  <h4 className="text-sm sm:text-base font-bold text-gray-800 leading-tight truncate">
                    {currentStory.name}
                  </h4>

                  {/* Role • Company */}
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">
                    {currentStory.role} {currentStory.company && <span className="text-amber-600 font-bold">• {currentStory.company}</span>}
                  </p>

                  {/* Package Pill */}
                  {currentStory.packageAmt && (
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200/90 w-fit">
                      <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
                      <span>{currentStory.packageAmt} Package</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Middle Quote Text with quote glyph */}
              <div className="w-full my-4 sm:my-5 flex-1 flex flex-col justify-center text-left">
                <Quote className="w-4 h-4 text-amber-500/70 mb-1.5 shrink-0" />
                <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed italic font-normal line-clamp-4">
                  &quot;{currentStory.quote}&quot;
                </p>
              </div>

              {/* 3. Bottom: Google 'G' Icon + Rating Stars */}
              <div className="w-full pt-3.5 border-t border-slate-200/80 flex items-center justify-start gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: currentStory.rating || 5 }).map((_, s) => (
                    <Star key={s} className="h-3 w-3 fill-current mr-0.5" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-700 ml-0.5">
                  {(currentStory.rating || 5).toFixed(1)}
                </span>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* RIGHT COLUMN: Video Section (Bigger than Left: ~60% width)                */}
            {/* ========================================================================= */}
            <div className="w-full md:w-[60%] lg:w-[61%] min-h-[280px] sm:min-h-[320px] md:min-h-full relative bg-slate-950 flex items-center justify-center overflow-hidden">
              {ytId ? (
                isPlaying ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                    title={currentStory.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center cursor-pointer group/video"
                    style={{ backgroundImage: `url('https://img.youtube.com/vi/${ytId}/hqdefault.jpg')` }}
                    onClick={() => setIsPlaying(true)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/30 group-hover/video:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover/video:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                )
              ) : (
                /* Exactly matching Image 1: Dark box, circular photo with thin gold ring, name, role, company */
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-[#0B0F19] flex flex-col items-center justify-center p-6 text-center">
                  {hasValidImg ? (
                    <img
                      src={resolvedImg}
                      alt={currentStory.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-amber-400/50 shadow-xl mb-3.5 ring-4 ring-amber-400/10"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-xl mb-3.5 ring-4 ring-amber-400/10">
                      {currentStory.name ? currentStory.name.charAt(0).toUpperCase() : "B"}
                    </div>
                  )}
                  <p className="text-white font-bold text-base leading-tight">
                    {currentStory.name}
                  </p>
                  <p className="text-amber-400 text-xs font-semibold mt-1">
                    {currentStory.role}
                  </p>
                  {currentStory.company && (
                    <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                      {currentStory.company}
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>
          </div>

          {/* Carousel Pagination Dots */}
          {stories.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {stories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to story ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? "w-6 bg-amber-500"
                      : "w-2 bg-slate-200 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
