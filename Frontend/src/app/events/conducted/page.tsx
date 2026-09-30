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
import ConductedEventsGridTabs from "./ConductedEventsGridTabs";

export const metadata: Metadata = {
  title: "Conducted Events | BIZONANCE Industrial Training Centre. (BITC)",
  description:
    "Take a look back at our successful workshops, hackathons, and industrial visits.",
};

export default async function ConductedEventsPage() {
  let conductedEvents: any[] = [];
  let conductedEventsByYear: Record<string, any[]> = {};
  let sortedYears: string[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/events`,
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
          venue: e.venue || null,
          speaker: e.speaker || null,
          image: e.imageUrl || null,
        }));
        conductedEvents = mappedEvents
          .filter((e: any) => e.rawDate < now.toISOString())
          .sort(
            (a: any, b: any) =>
              new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime(),
          );
          
        conductedEventsByYear = conductedEvents.reduce((acc: Record<string, any[]>, event: any) => {
          const year = new Date(event.rawDate).getFullYear().toString();
          if (!acc[year]) acc[year] = [];
          acc[year].push(event);
          return acc;
        }, {});
        sortedYears = Object.keys(conductedEventsByYear).sort((a, b) => Number(b) - Number(a));
      }
    }
  } catch (error) {
    console.warn("Failed to fetch events from backend API.");
  }
  return (
    <div
      className="flex flex-col min-h-screen bg-slate-50 pt-24 pb-20"
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Conducted{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
              Events
            </span>
          </h1>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl">
            Take a look back at our successful workshops, hackathons, and industrial visits.
          </p>
        </div>
        
        {sortedYears.length > 0 ? (
          <section id="conducted-events" className="mb-16">
            <ConductedEventsGridTabs 
              conductedEventsByYear={conductedEventsByYear} 
              sortedYears={sortedYears} 
            />
          </section>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Conducted Events</h3>
            <p className="text-slate-500">Check back later for past events.</p>
          </div>
        )}
      </div>
    </div>
  );
}
