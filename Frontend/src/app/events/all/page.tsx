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
export const metadata: Metadata = {
  title: "All Events | BIZONANCE Industrial Training Centre. (BITC)",
  description:
    "Browse all upcoming and conducted events, hackathons, and technical workshops at BITC.",
};
export default async function AllEventsPage() {
  let upcomingEvents: any[] = [];
  let conductedEvents: any[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "https://bitc-backend-theta.vercel.app/api")}/events`,
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
        upcomingEvents = mappedEvents
          .filter((e: any) => e.rawDate >= now.toISOString())
          .sort(
            (a: any, b: any) =>
              new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime(),
          );
        conductedEvents = mappedEvents
          .filter((e: any) => e.rawDate < now.toISOString())
          .sort(
            (a: any, b: any) =>
              new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime(),
          );
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
      {" "}
      <div className="container max-w-[1200px] mx-auto px-4">
        {" "}
        <div className="mb-8">
          {" "}
          <Link
            href="/events"
            className="inline-flex items-center text-primary font-medium hover:text-orange-600 transition-colors mb-4"
          >
            {" "}
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events{" "}
          </Link>{" "}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {" "}
            All{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
              Events
            </span>{" "}
          </h1>{" "}
          <p className="text-lg text-slate-600 mt-4 max-w-2xl">
            {" "}
            Browse through our complete collection of upcoming opportunities and
            past successful events.{" "}
          </p>{" "}
        </div>{" "}
        {/* Upcoming Events Grid */}{" "}
        {upcomingEvents.length > 0 && (
          <section id="upcoming-events" className="mb-16">
            {" "}
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 border-b pb-4">
              Upcoming Events
            </h2>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {" "}
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="h-full overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 group rounded-full bg-white flex flex-col hover:-translate-y-1 p-0 gap-0"
                >
                  {" "}
                  {event.image ? (
                    <div className="w-full h-56 relative overflow-hidden bg-gray-100">
                      {" "}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />{" "}
                      <img
                        src={event.image}
                        alt={event.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />{" "}
                      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-900 shadow-sm uppercase tracking-wider">
                        {" "}
                        {event.category}{" "}
                      </div>{" "}
                    </div>
                  ) : null}{" "}
                  <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                    {" "}
                    <h3 className="text-xl font-bold text-slate-900 mb-5 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>{" "}
                    <div className="space-y-3.5 mb-8 flex-1">
                      {" "}
                      <div className="flex items-start gap-3 text-sm text-gray-600">
                        {" "}
                        <CalendarDays className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />{" "}
                        <div className="font-semibold text-slate-800">
                          {event.date}
                        </div>{" "}
                      </div>{" "}
                      {event.venue && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          {" "}
                          <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />{" "}
                          <span className="text-slate-700">
                            {event.venue}
                          </span>{" "}
                        </div>
                      )}{" "}
                      {event.speaker && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          {" "}
                          <Users className="w-4.5 h-4.5 text-primary shrink-0" />{" "}
                          <span className="text-slate-700">
                            Industry expert:{" "}
                            <span className="font-semibold">
                              {event.speaker}
                            </span>
                          </span>{" "}
                        </div>
                      )}{" "}
                    </div>{" "}
                    <div className="flex items-center justify-end pt-5 border-t border-gray-100 mt-auto">
                      {" "}
                      <EventRegistrationModal
                        eventId={event.id}
                        eventName={event.title}
                        triggerClassName="w-full bg-slate-50 hover:bg-primary hover:text-black text-slate-900 font-medium transition-all duration-300 rounded-full py-6 shadow-none hover:shadow-lg hover:shadow-primary/20"
                        triggerText="Register Now"
                      />
                    </div>{" "}
                  </CardContent>{" "}
                </Card>
              ))}{" "}
            </div>{" "}
          </section>
        )}{" "}
        {/* Conducted Events Grid */}{" "}
        {conductedEvents.length > 0 && (
          <section id="conducted-events">
            {" "}
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 border-b pb-4">
              Conducted Events
            </h2>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {" "}
              {conductedEvents.map((event) => (
                <Card
                  key={event.id}
                  className="h-full overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 group rounded-full bg-white flex flex-col hover:-translate-y-1 p-0 gap-0"
                >
                  {" "}
                  {event.image ? (
                    <div className="w-full h-56 relative overflow-hidden bg-gray-100 transition-all duration-500">
                      {" "}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />{" "}
                      <img
                        src={event.image}
                        alt={event.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />{" "}
                      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-900 shadow-sm uppercase tracking-wider">
                        {" "}
                        {event.category}{" "}
                      </div>{" "}
                    </div>
                  ) : null}{" "}
                  <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                    {" "}
                    <h3 className="text-xl font-bold text-slate-900 mb-5 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>{" "}
                    <div className="space-y-3.5 mb-8 flex-1">
                      {" "}
                      <div className="flex items-start gap-3 text-sm text-gray-600">
                        {" "}
                        <CalendarDays className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />{" "}
                        <div className="font-semibold text-slate-800">
                          {event.date}
                        </div>{" "}
                      </div>{" "}
                      {event.venue && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          {" "}
                          <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />{" "}
                          <span className="text-slate-700">
                            {event.venue}
                          </span>{" "}
                        </div>
                      )}{" "}
                      {event.speaker && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          {" "}
                          <Users className="w-4.5 h-4.5 text-primary shrink-0" />{" "}
                          <span className="text-slate-700">
                            Industry expert:{" "}
                            <span className="font-semibold">
                              {event.speaker}
                            </span>
                          </span>{" "}
                        </div>
                      )}{" "}
                    </div>{" "}
                    <div className="flex items-center justify-end pt-5 border-t border-gray-100 mt-auto">
                      {" "}
                      <Link href={`/events/${event.id}`} className="w-full">
                        {" "}
                        <Button className="w-full text-black font-medium transition-all duration-300 rounded-full py-6 shadow-none hover:shadow-lg hover:shadow-orange-500/20 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:-translate-y-0.5">
                          {" "}
                          View Details{" "}
                          <ChevronRight className="w-4 h-4 ml-1" />{" "}
                        </Button>{" "}
                      </Link>{" "}
                    </div>{" "}
                  </CardContent>{" "}
                </Card>
              ))}{" "}
            </div>{" "}
          </section>
        )}{" "}
      </div>{" "}
    </div>
  );
}
