"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialItem {
  id?: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  rating?: number;
}

const defaultStories: TestimonialItem[] = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer at TCS",
    quote: "The MERN stack certification at BITC gave me the practical skills I needed to clear my interviews with ease.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Data Analyst at Wipro",
    quote: "Excellent faculty and hands-on projects. The placement cell was very supportive throughout the process.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    role: "Automation Engineer at L&T",
    quote: "The industrial automation training was exactly what the industry demands right now.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
  },
];

export default function StudentSuccessStories() {
  const [stories, setStories] = useState<TestimonialItem[]>(defaultStories);
  const [imgError, setImgError] = useState<Record<string | number, boolean>>({});

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          if (data.testimonials && data.testimonials.length > 0) {
            setStories(data.testimonials);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic testimonials:", err);
      }
    }
    loadTestimonials();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="container max-w-[1400px] mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <p className="text-primary font-bold uppercase tracking-widest text-[14px] mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Student <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Success Stories</span>
          </h2>
          <p className="text-gray-500 text-[16px] max-w-2xl mx-auto">Hear from our alumni who are now working at top tech companies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <Card key={story.id || i} className="!p-0 !gap-0 border-0 shadow-xl shadow-gray-200/40 bg-white rounded-2xl relative overflow-hidden h-full flex flex-col hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-4 right-4 text-[120px] font-serif leading-none text-gray-100 pointer-events-none select-none">
                "
              </div>

              <CardContent className="p-6 flex flex-col flex-1 relative z-10">
                {/* Image and Name */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <img
                      src={story.image}
                      alt={story.name}
                      onError={() => setImgError((prev) => ({ ...prev, [story.id || i]: true }))}
                      className="w-12 h-12 rounded-full object-cover relative z-10 border-2 border-white shadow-md bg-slate-100"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-[15px]">{story.name}</h4>
                    <p className="text-[12px] text-gray-500 font-semibold">{story.role}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-700 text-[14px] italic mb-6 leading-relaxed flex-1 relative z-10 font-medium">
                  "{story.quote}"
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
      </div>
    </section>
  );
}
