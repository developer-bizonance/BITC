"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { eventSlug } from "@/lib/utils";

interface FeaturedEventBannerProps {
  event: {
    id?: string | number;
    title: string;
    category: string;
    date: string;
    time?: string | null;
    rawDate: string; // ISO string
    venue?: string | null;
    speaker?: string | null;
    image?: string | null;
    shortDescription?: string | null;
    description?: string | null;
  };
}

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
  over: boolean;
}

function parseEventTargetTimestamp(dateStr: string, timeStr?: string | null): number {
  let year: number;
  let month: number;
  let day: number;

  const dateMatch = (dateStr || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    year = parseInt(dateMatch[1], 10);
    month = parseInt(dateMatch[2], 10) - 1;
    day = parseInt(dateMatch[3], 10);
  } else {
    const d = new Date(dateStr);
    year = d.getFullYear();
    month = d.getMonth();
    day = d.getDate();
  }

  let hours = 0;
  let minutes = 0;

  if (timeStr && typeof timeStr === "string" && timeStr.trim()) {
    const startPart = timeStr.trim().split(/[-–—]|(?:\s+to\s+)/i)[0].trim();
    const match = startPart.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = match[2] ? parseInt(match[2], 10) : 0;
      const meridiem = match[3] ? match[3].toUpperCase() : null;

      if (meridiem === "PM" && h < 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;

      hours = h;
      minutes = m;
    }
  }

  return new Date(year, month, day, hours, minutes, 0, 0).getTime();
}

function getTimeLeft(targetTimestamp: number): TimeLeft {
  const now = new Date().getTime();
  const diff = targetTimestamp - now;

  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, over: true };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    secs: Math.floor((diff % (1000 * 60)) / 1000),
    over: false,
  };
}

function useCountdown(dateStr: string, timeStr?: string | null) {
  // Start as null to avoid SSR/client hydration mismatch
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const targetTimestamp = parseEventTargetTimestamp(dateStr, timeStr);

    // Set initial value on client only
    const initial = getTimeLeft(targetTimestamp);
    setTimeLeft(initial);

    // If event timing is already finished, trigger a single refresh to transition to next event without infinite loops
    if (initial.over) {
      const reloadKey = `bitc_event_reloaded_${dateStr}_${timeStr || 'default'}`;
      try {
        if (typeof window !== "undefined" && !sessionStorage.getItem(reloadKey)) {
          sessionStorage.setItem(reloadKey, "true");
          const t = setTimeout(() => {
            window.location.reload();
          }, 1000);
          return () => clearTimeout(t);
        }
      } catch {}
    }

    const timer = setInterval(() => {
      const current = getTimeLeft(targetTimestamp);
      setTimeLeft(current);
      if (current.over) {
        clearInterval(timer);
        // Countdown reached 0: reload to move to conducted and show next latest event
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dateStr, timeStr]);

  return timeLeft;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function FeaturedEventBanner({ event }: FeaturedEventBannerProps) {
  const timeLeft = useCountdown(event.rawDate, event.time);

  return (
    <section className="py-16 bg-white relative z-20">
      <div className="container max-w-[1360px] mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row md:items-start gap-8 lg:gap-12">
          {/* Separate Square Image Section */}
          <div
            className="w-full max-w-[440px] sm:max-w-[480px] md:max-w-none md:w-[420px] lg:w-[480px] xl:w-[500px] aspect-square shrink-0 rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 bg-gradient-to-br from-blue-600 to-indigo-800"
            style={{ aspectRatio: "1 / 1" }}
          >
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Separate Info Section */}
          <div className="flex-1 flex flex-col justify-start md:pt-1 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-5 leading-tight">
              {event.title}
            </h2>

            <div className="space-y-3 mb-6">
              {event.speaker && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="w-5 h-5 text-gray-400 shrink-0" />
                  <span>{event.speaker}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-600">
                <CalendarDays className="w-5 h-5 text-gray-400 shrink-0" />
                <span>{event.date}</span>
              </div>
              {event.time && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                  <span>{event.time}</span>
                </div>
              )}
              {event.venue && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                  <span>{event.venue}</span>
                </div>
              )}
            </div>

            {/* Dynamic Short Description (concise highlight on banner) */}
            {(() => {
              const text = (event.shortDescription && event.shortDescription.trim())
                ? event.shortDescription.trim()
                : (event.description && event.description.trim())
                  ? (event.description.trim().length > 180
                    ? event.description.trim().slice(0, 177).trim() + "..."
                    : event.description.trim())
                  : "";
              return text ? (
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 font-normal">
                  {text}
                </p>
              ) : null;
            })()}

            {/* Live Countdown — only rendered client-side after mount */}
            {timeLeft === null || timeLeft.over ? (
              // Placeholder shown during SSR / before hydration or during transition to next event
              <div className="flex items-end gap-1.5 sm:gap-3 mb-8">
                {["DAYS", "HOURS", "MINS", "SECS"].map((label, i, arr) => (
                  <div key={label} className="flex items-end gap-1.5 sm:gap-3">
                    <div className="flex flex-col items-center bg-slate-50 rounded-2xl px-2 sm:px-4 py-2 sm:py-3 min-w-[50px] sm:min-w-[60px] border border-slate-100 shadow-sm">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-200 tabular-nums leading-none">00</span>
                      <span className="text-[9px] sm:text-[10px] text-gray-300 uppercase font-bold tracking-widest mt-1">{label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-xl sm:text-2xl font-bold text-gray-200 mb-2 sm:mb-3">:</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-end gap-1.5 sm:gap-3 mb-8">
                {[
                  { value: timeLeft.days, label: "DAYS" },
                  { value: timeLeft.hours, label: "HOURS" },
                  { value: timeLeft.mins, label: "MINS" },
                  { value: timeLeft.secs, label: "SECS" },
                ].map((item, i, arr) => (
                  <div key={item.label} className="flex items-end gap-1.5 sm:gap-3">
                    <div className="flex flex-col items-center bg-slate-50 rounded-2xl px-2 sm:px-4 py-2 sm:py-3 min-w-[50px] sm:min-w-[60px] border border-slate-100 shadow-sm">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums leading-none">
                        {pad(item.value)}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
                        {item.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-xl sm:text-2xl font-bold text-gray-300 mb-2 sm:mb-3">:</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Link
              href={`/events/${eventSlug(event.title, event.id)}`}
              className="inline-flex items-center justify-center w-full sm:w-auto h-13 px-8 py-3 rounded-full text-slate-800 text-base font-normal transition-all hover:-translate-y-0.5 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:shadow-lg hover:shadow-orange-400/30"
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
