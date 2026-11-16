import { resolveImageUrl, getApiBase, eventSlug, isUpcomingEventDate, parseEventStartTimestamp, parseEventEndTimestamp } from "@/lib/utils";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Events, Hackathons & Tech Workshops | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
  description: "Participate in National Level Coding Challenges, Innovation Fests, Hackathons, Technical Workshops, and Industry Guest Lectures organized by BITC BIZONANCE.",
  openGraph: {
    title: "Events, Hackathons & Tech Workshops | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Join upcoming hackathons, tech workshops, and coding challenges at BITC.",
    images: [
      {
        url: "/og-image.png",
        secureUrl: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "BIZONANCE Industrial Training Centre. (BITC) | Amravati Logo",
      },
      {
        url: "/og-square.png",
        secureUrl: "/og-square.png",
        width: 800,
        height: 800,
        type: "image/png",
        alt: "BIZONANCE Industrial Training Centre. (BITC) | Amravati Logo",
      },
    ],
  },
};
import Link from "next/link";
import FeaturedEventBanner from "./FeaturedEventBanner";
import EventRegistrationModal from "@/components/events/EventRegistrationModal";
import ConductedEventsTabs from "./ConductedEventsTabs";
import EventCard from "@/components/events/EventCard";
import EventCategoriesGrid from "./EventCategoriesGrid";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  CalendarDays, MapPin, Users, ArrowRight, PlayCircle, Clock,
  Mic, Code, Laptop, Lightbulb, TrendingUp, Trophy, Network,
  Building, GraduationCap, Briefcase, Ticket, ChevronRight,
  Star, Rocket
} from "lucide-react";

export default async function EventsPage() {
  let upcomingEvents: any[] = [];
  let conductedEvents: any[] = [];
  let featuredEvent: any = null;
  let conductedEventsByYear: Record<string, any[]> = {};
  let sortedYears: string[] = [];

  try {
    const res = await fetch(
      `${getApiBase()}/events`,
      { cache: "no-store" },
    );
    if (res.ok) {
      const data = await res.json();
      if (data.events && data.events.length > 0) {
        const mappedEvents = data.events.map((e: any, i: number) => ({
          id: e.id || i,
          title: e.title,
          category: e.type ? e.type.charAt(0).toUpperCase() + e.type.slice(1).toLowerCase() : "Event",
          date: new Date(e.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }),
          rawDate: new Date(e.date).toISOString(),
          time: e.time || null,
          venue: e.venue || null,
          speaker: e.speaker || null,
          heading: e.heading || null,
          image: resolveImageUrl(e.imageUrl),
          slug: eventSlug(e.title, e.id),
          shortDescription: e.shortDescription || null,
          description: e.description || null,
          isFeatured: e.isFeatured || false,
          rating: e.rating || null,
          ratingsCount: e.ratingsCount || null,
        }));

        // Sort upcoming events by soonest start time first
        upcomingEvents = mappedEvents
          .filter((e: any) => isUpcomingEventDate(e.rawDate, e.time))
          .sort((a: any, b: any) => parseEventStartTimestamp(a.rawDate, a.time) - parseEventStartTimestamp(b.rawDate, b.time));

        // Sort conducted events by most recently finished first
        conductedEvents = mappedEvents
          .filter((e: any) => !isUpcomingEventDate(e.rawDate, e.time))
          .sort((a: any, b: any) => parseEventEndTimestamp(b.rawDate, b.time)! - parseEventEndTimestamp(a.rawDate, a.time)!);

        conductedEventsByYear = conductedEvents.reduce((acc: Record<string, any[]>, event: any) => {
          const year = new Date(event.rawDate).getFullYear().toString();
          if (!acc[year]) acc[year] = [];
          acc[year].push(event);
          return acc;
        }, {});
        sortedYears = Object.keys(conductedEventsByYear).sort((a, b) => Number(b) - Number(a));

        const now = Date.now();
        const featuredUpcoming = upcomingEvents.find((e: any) => e.isFeatured);
        if (featuredUpcoming) {
          featuredEvent = featuredUpcoming;
        } else if (upcomingEvents.length > 0) {
          // If no event is explicitly pinned, pick the earliest upcoming event whose countdown hasn't already expired
          const nextActiveEvent = upcomingEvents.find((e: any) => {
            const start = parseEventStartTimestamp(e.rawDate, e.time);
            return start > now;
          });
          featuredEvent = nextActiveEvent || upcomingEvents[0];
        } else {
          featuredEvent = null;
        }

        // If the event is shown in the highlight banner, do not show it in Upcoming Events
        if (featuredEvent) {
          upcomingEvents = upcomingEvents.filter(
            (e: any) => String(e.id) !== String(featuredEvent.id)
          );
        }
      }
    }
  } catch (error) {
    console.warn("Failed to fetch events from backend API.");
  }




  return (
    <div className="flex flex-col min-h-screen" style={{ zoom: '90%' }}>

      {/* 1. Hero Banner */}
      <section className="relative w-full lg:min-h-[calc((100vh-62px)/0.9)] flex flex-col items-center justify-center bg-white py-14 sm:py-18 lg:py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />

        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            BITC Events
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.2] mb-6">
            Learn. Connect. <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Grow.</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-[800px] mx-auto leading-relaxed mb-10 font-normal">
            Experience hands-on learning through workshops, seminars, expert talks, hackathons, industrial visits, and corporate training with industry professionals.
          </p>
          <div className="flex justify-center">
            <Link href="#upcoming-events" className="inline-flex items-center justify-center w-full sm:w-auto h-12 px-8 rounded-full text-slate-800 shadow-lg shadow-orange-500/30 text-base font-normal transition-colors bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)]">
              Explore upcoming events
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Event Section */}
      {featuredEvent && (
        <FeaturedEventBanner event={featuredEvent} />
      )}

      {/* 3. Event Categories Grid (Educational + Corporate common points) */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container max-w-[1200px] xl:max-w-[1280px] mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What we <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Do</span></h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-normal">We organize a wide variety of academic, technical, and corporate events to cater to diverse learning styles, career milestones, and industry collaboration.</p>
          </div>

          <EventCategoriesGrid />
        </div>
      </section>

      {/* 4. Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section id="upcoming-events" className="py-10 bg-white">
          <div className="container max-w-[1200px] xl:max-w-[1280px] mx-auto px-4">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Upcoming <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Events</span></h2>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed font-normal">Don&apos;t miss out on these exclusive learning opportunities.</p>
              </div>
              {upcomingEvents.length > 3 && (
                <Link href="/events/upcoming" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-orange-600 transition-colors">
                  View More <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, idx) => (
                <div key={`${event.id || idx}`} className="h-full">
                  <EventCard event={event} isUpcoming={true} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Conducted Events */}
      {sortedYears.length > 0 && (
        <section id="conducted-events" className="py-10 bg-white">
          <div className="container max-w-[1200px] xl:max-w-[1280px] mx-auto px-4">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Conducted <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Events</span></h2>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed font-normal">Take a look back at our successful workshops, hackathons, and industrial visits.</p>
              </div>
              {conductedEvents.length > 3 && (
                <Link href="/events/conducted" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-orange-600 transition-colors">
                  View More <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            <ConductedEventsTabs
              conductedEventsByYear={conductedEventsByYear}
              sortedYears={sortedYears}
            />

          </div>
        </section>
      )}

      {/* 8. Call to Action */}
      <section className="py-20 bg-white text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Get Notified About <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Latest Events</span></h2>
          <p className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed font-normal">
            Stay in the loop with our latest event. Register now to get the latest updates and early access invitations straight to your inbox!
          </p>
          <EventRegistrationModal
            isGeneralUpdate={true}
            triggerText="Subscribe Now"
            triggerClassName="inline-flex items-center justify-center h-14 px-12 rounded-full text-slate-800/85 text-lg font-medium shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0 cursor-pointer"
          />
        </div>
      </section>

    </div>
  );
}

