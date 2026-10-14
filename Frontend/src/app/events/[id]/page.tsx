import { resolveImageUrl, getApiBase } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";
import EventRegistrationModal from "@/components/events/EventRegistrationModal";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return {
    title: `Event Details | BIZONANCE Industrial Training Centre. (BITC)`,
  };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  let event: any = null;
  const { id } = await params;
  
  try {
    const res = await fetch(`${getApiBase()}/events`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.events && data.events.length > 0) {
        const foundEvent = data.events.find((e: any, i: number) => (e.id || i).toString() === id);
        if (foundEvent) {
          event = {
            id: foundEvent.id || parseInt(id),
            title: foundEvent.title,
            category: foundEvent.type ? foundEvent.type.charAt(0).toUpperCase() + foundEvent.type.slice(1).toLowerCase() : "Event",
            date: new Date(foundEvent.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }),
            rawDate: new Date(foundEvent.date).toISOString(),
            venue: foundEvent.venue || null,
            speaker: foundEvent.speaker || null,
            image: resolveImageUrl(foundEvent.imageUrl) || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
            description: foundEvent.description || "Join us for an exciting and informative session packed with insights and networking opportunities.",
          };
        }
      }
    }
  } catch (error) {
    console.warn("Failed to fetch event.");
  }

  if (!event) {
    notFound();
  }

  const now = new Date();
  const isUpcoming = new Date(event.rawDate) >= now;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src={event.image} alt={event.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
        
        <div className="container max-w-[800px] mx-auto px-4 relative z-10 mt-16 text-center">
          <div className="inline-block bg-primary/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-primary/30 uppercase tracking-widest">
            {event.category}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            {event.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-slate-200">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Date</p>
                <p className="font-medium text-white">{event.date}</p>
              </div>
            </div>
            
            {event.venue && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Venue</p>
                  <p className="font-medium text-white">{event.venue}</p>
                </div>
              </div>
            )}
            
            {event.speaker && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Industry expert</p>
                  <p className="font-medium text-white">{event.speaker}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-[800px] mx-auto px-4">
          <Link href="/events" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          
          <div className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-700">
            <h2>About the Event</h2>
            <p className="whitespace-pre-wrap">{event.description}</p>
            

            
            {event.speaker && (
              <>
                <h3>Meet the Industry Expert</h3>
                <div className="not-prose flex flex-col sm:flex-row gap-6 items-start bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="w-20 h-20 rounded-full bg-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-gray-600">{event.speaker}</h4>
                    <p className="text-primary font-medium text-sm mb-3">Industry Expert</p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      With years of hands-on experience and a passion for teaching, our industry expert brings deep industry knowledge and practical insights to help you navigate your career path successfully.
                    </p>
                  </div>
                </div>
              </>
            )}
            
            <p className="mt-8 font-medium">Don't miss this opportunity to advance your knowledge and take the next step in your career journey.</p>
            
            <div className="mt-12 not-prose flex justify-center">
              <EventRegistrationModal
                eventId={event.id.toString()}
                eventName={event.title}
                triggerText="Register Now"
                triggerClassName="inline-flex justify-center items-center h-14 px-10 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-black font-medium rounded-full shadow-md hover:opacity-90 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 text-base border-0"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
