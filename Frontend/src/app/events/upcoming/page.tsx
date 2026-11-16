import { resolveImageUrl, getApiBase, isUpcomingEventDate, parseEventStartTimestamp } from "@/lib/utils";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Users,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import EventRegistrationModal from "@/components/events/EventRegistrationModal";
import EventCard from "@/components/events/EventCard";

export const metadata: Metadata = {
  title: "Upcoming Events | BIZONANCE Industrial Training Centre. (BITC)",
  description:
    "Browse all upcoming events, hackathons, and technical workshops at BITC.",
};

export default async function UpcomingEventsPage() {
  let upcomingEvents: any[] = [];
  try {
    const res = await fetch(
      `${getApiBase()}/events`,
      { cache: "no-store" },
    );
    if (res.ok) {
      const data = await res.json();
      if (data.events && data.events.length > 0) {
        const now = new Date();
        const mappedEvents = data.events.map((e: any, i: number) => ({
          id: e.id || i,
          title: e.title,
          category: e.type
            ? e.type.charAt(0).toUpperCase() + e.type.slice(1).toLowerCase()
            : "Event",
          date: new Date(e.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          rawDate: new Date(e.date).toISOString(),
          time: e.time || null,
          venue: e.venue || null,
          speaker: e.speaker || null,
          heading: e.heading || null,
          image: resolveImageUrl(e.imageUrl),
        }));
        upcomingEvents = mappedEvents
          .filter((e: any) => isUpcomingEventDate(e.rawDate, e.time))
          .sort(
            (a: any, b: any) =>
              parseEventStartTimestamp(a.rawDate, a.time) - parseEventStartTimestamp(b.rawDate, b.time),
          );
      }
    }
  } catch (error) {
    console.warn("Failed to fetch events from backend API.");
  }
  return (
    <div
      className="flex flex-col min-h-screen bg-slate-50 pt-12 sm:pt-16 md:pt-24 pb-12 md:pb-20"
      style={{ zoom: "90%" }}
    >
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/events"
            className="inline-flex items-center text-primary font-medium hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.2]">
            Upcoming{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
              Events
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mt-4 max-w-2xl leading-relaxed font-normal">
            Don&apos;t miss out on these exclusive learning opportunities.
          </p>
        </div>
        {upcomingEvents.length > 0 ? (
          <section id="upcoming-events" className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="h-full">
                  <EventCard event={event} isUpcoming={true} />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <h3 className="text-2xl font-medium text-gray-600 mb-2">No Upcoming Events</h3>
            <p className="text-slate-500">Check back later for more events.</p>
          </div>
        )}
      </div>
    </div>
  );
}

