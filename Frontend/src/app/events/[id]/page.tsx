import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Users, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import EventRegistrationModal from "@/components/events/EventRegistrationModal";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return {
    title: `Event Details | BIZONANCE Industrial Training Centre. (BITC)`,
  };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  let event: any = null;
  const { id } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://bitc-backend-theta.vercel.app/api"}/events`, { cache: 'no-store' });
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
            image: foundEvent.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
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
          <div className="inline-block bg-primary/20 backdrop-blur-md text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-primary/30 uppercase tracking-widest">
            {event.category}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            {event.title}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-[800px] mx-auto px-4">
          <Link href="/events" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 prose prose-slate prose-lg md:prose-xl max-w-none text-slate-700">
              <h2>About the Event</h2>
              <p>{event.description}</p>
              
              <h3>Why You Should Attend</h3>
              <ul>
                <li>Gain hands-on experience and actionable insights.</li>
                <li>Network with industry professionals and peers.</li>
                <li>Enhance your skills with expert guidance.</li>
              </ul>
              
              <p>Don't miss this opportunity to advance your knowledge and take the next step in your career journey.</p>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Event Details</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4 text-slate-700">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 shrink-0">
                      <CalendarDays className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Date</p>
                      <p className="font-semibold">{event.date}</p>
                    </div>
                  </div>
                  
                  {event.venue && (
                    <div className="flex items-start gap-4 text-slate-700">
                      <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Venue</p>
                        <p className="font-semibold">{event.venue}</p>
                      </div>
                    </div>
                  )}
                  
                  {event.speaker && (
                    <div className="flex items-start gap-4 text-slate-700">
                      <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Speaker</p>
                        <p className="font-semibold">{event.speaker}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {isUpcoming ? (
                  <EventRegistrationModal eventId={event.id.toString()} eventName={event.title}>
                    <Button className="w-full text-white font-bold transition-all duration-300 rounded-full py-6 shadow-md shadow-orange-500/20 bg-primary hover:bg-orange-600 hover:-translate-y-0.5">
                      Register Now <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </EventRegistrationModal>
                ) : (
                  <div className="text-center p-4 bg-green-50 text-green-700 rounded-xl font-semibold border border-green-100">
                    ✅ Event Completed
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
