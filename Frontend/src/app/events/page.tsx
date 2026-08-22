import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Events, Hackathons & Tech Workshops | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
  description: "Participate in National Level Coding Challenges, Innovation Fests, Hackathons, Technical Workshops, and Industry Guest Lectures organized by BITC BIZONANCE.",
  openGraph: {
    title: "Events, Hackathons & Tech Workshops | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Join upcoming hackathons, tech workshops, and coding challenges at BITC.",
  },
};
import Link from "next/link";
import FeaturedEventBanner from "./FeaturedEventBanner";
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
  Star
} from "lucide-react";

const eventCategories = [
  { name: "Workshops", icon: Laptop, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Seminars", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Expert Talks", icon: Mic, color: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Webinars", icon: PlayCircle, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { name: "Masterclasses", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "Bootcamps", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Hackathons", icon: Code, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { name: "Industrial Visits", icon: Building, color: "text-slate-500", bg: "bg-slate-500/10" },
  { name: "Guest Lectures", icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Career Fair", icon: Briefcase, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10" },
  { name: "Placement Drives", icon: Ticket, color: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Networking Events", icon: Network, color: "text-teal-500", bg: "bg-teal-500/10" },
  { name: "Tech Meetups", icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Innovation Challenges", icon: Trophy, color: "text-red-500", bg: "bg-red-500/10" },
];

export default async function EventsPage() {
  let upcomingEvents: any[] = [];
  let conductedEvents: any[] = [];
  let featuredEvent: any = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://bitc-backend-theta.vercel.app/api"}/events`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.events && data.events.length > 0) {
        const now = new Date();
        const mappedEvents = data.events.map((e: any, i: number) => ({
          id: e.id || i,
          title: e.title,
          category: e.type ? e.type.charAt(0).toUpperCase() + e.type.slice(1).toLowerCase() : "Event",
          date: new Date(e.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }),
          rawDate: new Date(e.date).toISOString(),
          venue: e.venue || null,
          speaker: e.speaker || null,
          image: e.imageUrl || null,
          isFeatured: e.isFeatured || false
        }));

        // Sort upcoming events by soonest date first
        upcomingEvents = mappedEvents
          .filter((e: any) => e.rawDate >= now.toISOString())
          .sort((a: any, b: any) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());

        // Sort conducted events by most recent first
        conductedEvents = mappedEvents
          .filter((e: any) => e.rawDate < now.toISOString())
          .sort((a: any, b: any) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

        const foundFeatured = mappedEvents.find((e: any) => e.isFeatured);
        if (foundFeatured) {
          featuredEvent = foundFeatured;
        } else if (upcomingEvents.length > 0) {
          // If no explicitly featured event, automatically highlight the nearest upcoming event
          featuredEvent = upcomingEvents[0];
        } else if (conductedEvents.length > 0) {
          // Fallback to most recent conducted event if no upcoming events exist
          featuredEvent = conductedEvents[0];
        }
      }
    }
  } catch (error) {
    console.warn("Failed to fetch events from backend API.");
  }




  return (
    <div className="flex flex-col min-h-screen" style={{ zoom: '90%' }}>
      
      {/* 1. Hero Banner */}
      <section className="relative w-full min-h-[112vh] flex flex-col items-center justify-center bg-white py-16 lg:py-24 overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            BITC EVENTS
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Learn. Connect. <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Grow.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-[800px] mx-auto leading-relaxed mb-10 font-medium">
            Experience hands-on learning through workshops, seminars, expert talks, hackathons, industrial visits, and networking events with industry professionals.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#upcoming-events" className="inline-flex items-center justify-center h-12 px-8 rounded-full text-white shadow-lg shadow-orange-500/30 text-base font-semibold transition-colors bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)]">
              Explore Upcoming Events
            </Link>
            <Link href="/resources/gallery" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-300/80 text-base font-semibold transition-all shadow-sm">
              View Past Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Event Section */}
      {featuredEvent && (
        <FeaturedEventBanner event={featuredEvent} />
      )}

      {/* 3. Event Categories Grid */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What We Do</h2>
            <p className="text-gray-500 text-lg">We organize a wide variety of events to cater to different learning styles and career goals.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {eventCategories.map((cat, i) => (
              <div key={i} className="group cursor-pointer flex flex-col items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <span className="text-sm font-semibold text-slate-700 text-center group-hover:text-primary transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Upcoming Events */}
      {upcomingEvents.length > 0 && (
      <section id="upcoming-events" className="py-10 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Upcoming Events</h2>
              <p className="text-gray-500 text-lg">Don&apos;t miss out on these exclusive learning opportunities.</p>
            </div>
            <Link href="/contact" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-orange-600 transition-colors">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Carousel className="w-full px-2 md:px-0">
            <CarouselContent className="-ml-4 py-4">
              {upcomingEvents.map((event) => (
                <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-2">
                    <Card className="h-full overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 group rounded-3xl bg-white flex flex-col hover:-translate-y-1 p-0 gap-0">
                      {event.image && (
                        <div className="w-full h-56 relative overflow-hidden bg-gray-100">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                          <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-900 shadow-sm uppercase tracking-wider">
                            {event.category}
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-5 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                        
                        <div className="space-y-3.5 mb-8 flex-1">
                          <div className="flex items-start gap-3 text-sm text-gray-600">
                            <CalendarDays className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                            <div className="font-semibold text-slate-800">{event.date}</div>
                          </div>
                          {event.venue && (
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />
                            <span className="text-slate-700">{event.venue}</span>
                          </div>
                          )}
                          {event.speaker && (
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Users className="w-4.5 h-4.5 text-primary shrink-0" />
                            <span className="text-slate-700">Speaker: <span className="font-semibold">{event.speaker}</span></span>
                          </div>
                          )}
                        </div>

                        <div className="flex items-center justify-end pt-5 border-t border-gray-100 mt-auto">
                          <Link href="/contact" className="w-full">
                            <Button className="w-full bg-slate-50 hover:bg-primary hover:text-white text-slate-900 font-bold transition-all duration-300 rounded-xl py-6 shadow-none hover:shadow-lg hover:shadow-primary/20">
                              Register Now <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {upcomingEvents.length > 3 && (
              <>
                <CarouselPrevious className="hidden md:flex -left-12 bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:text-primary h-12 w-12 shadow-sm" />
                <CarouselNext className="hidden md:flex -right-12 bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:text-primary h-12 w-12 shadow-sm" />
              </>
            )}
          </Carousel>
        </div>
      </section>
      )}

      {/* 5. Conducted Events */}
      {conductedEvents.length > 0 && (
      <section id="conducted-events" className="py-10 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Conducted Events</h2>
              <p className="text-gray-500 text-lg">Take a look back at our successful workshops, hackathons, and industrial visits.</p>
            </div>
            <Link href="/resources/gallery" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-orange-600 transition-colors">
              View More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Carousel className="w-full px-2 md:px-0">
            <CarouselContent className="-ml-4 py-4">
              {conductedEvents.map((event) => (
                <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-2">
                    <Card className="h-full overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 group rounded-3xl bg-white flex flex-col hover:-translate-y-1 p-0 gap-0">
                      {event.image && (
                        <div className="w-full h-56 relative overflow-hidden bg-gray-100 grayscale hover:grayscale-0 transition-all duration-500">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-900 shadow-sm uppercase tracking-wider">
                            {event.category}
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-5 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                        
                        <div className="space-y-3.5 mb-8 flex-1">
                          <div className="flex items-start gap-3 text-sm text-gray-600">
                            <CalendarDays className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                            <div className="font-semibold text-slate-800">{event.date}</div>
                          </div>
                          {event.venue && (
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />
                            <span className="text-slate-700">{event.venue}</span>
                          </div>
                          )}
                          {event.speaker && (
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Users className="w-4.5 h-4.5 text-primary shrink-0" />
                            <span className="text-slate-700">Speaker: <span className="font-semibold">{event.speaker}</span></span>
                          </div>
                          )}
                        </div>

                        <div className="flex items-center justify-end pt-5 border-t border-gray-100 mt-auto">
                          <Link href="/contact" className="w-full">
                            <Button variant="outline" className="w-full font-bold transition-all duration-300 rounded-xl py-6 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                              View Details <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {conductedEvents.length > 3 && (
              <>
                <CarouselPrevious className="hidden md:flex -left-12 bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:text-primary h-12 w-12 shadow-sm" />
                <CarouselNext className="hidden md:flex -right-12 bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:text-primary h-12 w-12 shadow-sm" />
              </>
            )}
          </Carousel>
        </div>
      </section>
      )}

      {/* 8. Call to Action */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Join Our Next Event</h2>
          <p className="text-xl text-slate-600 font-medium mb-10 leading-relaxed">
            Ready to expand your network, learn new skills, and accelerate your career growth? Register for an upcoming event today.
          </p>
          <Link href="/contact" className="inline-flex items-center justify-center h-14 px-10 rounded-full text-white text-lg font-bold shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
            Contact Us
          </Link>
        </div>
      </section>

    </div>
  );
}
