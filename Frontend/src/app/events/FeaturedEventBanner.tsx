"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react";

interface FeaturedEventBannerProps {
  event: {
    title: string;
    category: string;
    date: string;
    rawDate: string; // ISO string
    venue?: string | null;
    speaker?: string | null;
    image?: string | null;
  };
}

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
  over: boolean;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = target - now;

  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, over: true };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    secs: Math.floor((diff % (1000 * 60)) / 1000),
    over: false,
  };
}

function useCountdown(targetDate: string) {
  // Start as null to avoid SSR/client hydration mismatch
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Set initial value on client only
    setTimeLeft(getTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function FeaturedEventBanner({ event }: FeaturedEventBannerProps) {
  const timeLeft = useCountdown(event.rawDate);

  return (
    <section className="py-16 bg-gray-50 relative z-20">
      <div className="container max-w-[1200px] mx-auto px-4">
        <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl bg-white p-0 gap-0">
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 md:h-full">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-transparent mix-blend-multiply" />
              <div className="absolute top-6 left-6 bg-black/30 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                HIGHLIGHT EVENT
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="text-primary font-bold text-sm mb-3 uppercase tracking-wider">
                {event.category}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-5 leading-tight">
                {event.title}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <CalendarDays className="w-5 h-5 text-gray-400 shrink-0" />
                  <span>{event.date}</span>
                </div>
                {event.venue && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                )}
                {event.speaker && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-5 h-5 text-gray-400 shrink-0" />
                    <span>{event.speaker}</span>
                  </div>
                )}
              </div>

              {/* Live Countdown — only rendered client-side after mount */}
              {timeLeft === null ? (
                // Skeleton placeholder shown during SSR / before hydration
                <div className="flex items-end gap-3 mb-8">
                  {["DAYS", "HOURS", "MINS", "SECS"].map((label, i, arr) => (
                    <div key={label} className="flex items-end gap-3">
                      <div className="flex flex-col items-center bg-slate-50 rounded-2xl px-4 py-3 min-w-[60px] border border-slate-100 shadow-sm">
                        <span className="text-3xl font-extrabold text-slate-200 tabular-nums leading-none">--</span>
                        <span className="text-[10px] text-gray-300 uppercase font-bold tracking-widest mt-1">{label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <span className="text-2xl font-bold text-gray-200 mb-3">:</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : timeLeft.over ? (
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 font-bold px-4 py-2 rounded-xl text-sm mb-6 border border-green-100">
                  ✅ Event has taken place
                </div>
              ) : (
                <div className="flex items-end gap-3 mb-8">
                  {[
                    { value: timeLeft.days, label: "DAYS" },
                    { value: timeLeft.hours, label: "HOURS" },
                    { value: timeLeft.mins, label: "MINS" },
                    { value: timeLeft.secs, label: "SECS" },
                  ].map((item, i, arr) => (
                    <div key={item.label} className="flex items-end gap-3">
                      <div className="flex flex-col items-center bg-slate-50 rounded-2xl px-4 py-3 min-w-[60px] border border-slate-100 shadow-sm">
                        <span className="text-3xl font-extrabold text-slate-900 tabular-nums leading-none">
                          {pad(item.value)}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
                          {item.label}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <span className="text-2xl font-bold text-gray-300 mb-3">:</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full sm:w-auto h-13 px-8 py-3 rounded-xl text-white text-base font-semibold transition-all hover:-translate-y-0.5 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:shadow-lg hover:shadow-orange-400/30"
              >
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
