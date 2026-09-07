"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Play, Sparkles, TrendingUp, Award, Quote } from "lucide-react";

import TestimonialVideoCard from "./TestimonialVideoCard";
import { defaultStories, TestimonialItem } from "@/data/defaultStories";

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

        {/* Marquee Container */}
        <div className="relative px-1 sm:px-2 overflow-hidden py-4 group mt-6">
          {/* Scoped CSS for Animation */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes storyMarqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              @-webkit-keyframes storyMarqueeScroll {
                0% { -webkit-transform: translateX(0%); }
                100% { -webkit-transform: translateX(-50%); }
              }
              .bitc-story-marquee-track {
                display: flex !important;
                width: max-content !important;
                animation: storyMarqueeScroll 40s linear infinite !important;
                -webkit-animation: storyMarqueeScroll 40s linear infinite !important;
                will-change: transform;
              }
              .bitc-story-marquee-track:hover {
                animation-play-state: paused !important;
                -webkit-animation-play-state: paused !important;
              }
            `
          }} />

          {/* Fading edges to make it look smooth */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className="flex w-max bitc-story-marquee-track animate-marquee">
            <div className="flex gap-4 px-2">
              {stories.map((story, i) => (
                <TestimonialVideoCard key={`orig-${story.id || i}`} story={story} index={i} />
              ))}
            </div>
            {/* Duplicate track for seamless looping */}
            <div className="flex gap-4 px-2" aria-hidden="true">
              {stories.map((story, i) => (
                <TestimonialVideoCard key={`dup-${story.id || i}`} story={story} index={i} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}


