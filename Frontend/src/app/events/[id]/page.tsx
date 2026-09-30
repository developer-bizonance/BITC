import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";

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
          <div className="inline-block bg-primary/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-primary/30 uppercase tracking-widest">
            {event.category}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-black tracking-tight mb-8 leading-tight">
            {event.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-slate-200">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Date</p>
                <p className="font-medium text-black">{event.date}</p>
              </div>
            </div>
            
            {event.venue && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Venue</p>
                  <p className="font-medium text-black">{event.venue}</p>
                </div>
              </div>
            )}
            
            {event.speaker && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Industry expert</p>
                  <p className="font-medium text-black">{event.speaker}</p>
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
            <p>{event.description}</p>
            
            <h3>Key Takeaways</h3>
            <ul>
              <li><strong>Actionable Insights:</strong> Gain practical knowledge that you can apply immediately to your projects.</li>
              <li><strong>Industry Best Practices:</strong> Learn the latest trends and standards from experienced professionals.</li>
              <li><strong>Hands-on Experience:</strong> Participate in interactive sessions designed to build real-world skills.</li>
              <li><strong>Networking:</strong> Connect with peers, mentors, and industry leaders in a collaborative environment.</li>
            </ul>
            
            <h3>Who should attend</h3>
            <p>This event is perfectly suited for:</p>
            <ul>
              <li>Students and recent graduates looking to upskill and gain industry exposure.</li>
              <li>Professionals seeking to stay updated with the latest technological advancements.</li>
              <li>Anyone passionate about {event.category} and eager to learn from experts.</li>
            </ul>
            
            <h3>Agenda</h3>
            <div className="not-prose my-8">
              <div className="border-l-2 border-primary/20 pl-6 space-y-6">
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[1.65rem] top-1.5 border-4 border-white shadow-sm"></div>
                  <h4 className="text-lg font-bold text-slate-900">Registration & Welcome</h4>
                  <p className="text-slate-500 text-sm mt-1">10:00 AM - 10:30 AM</p>
                </div>
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[1.65rem] top-1.5 border-4 border-white shadow-sm"></div>
                  <h4 className="text-lg font-bold text-slate-900">Keynote Presentation</h4>
                  <p className="text-slate-500 text-sm mt-1">10:30 AM - 12:00 PM</p>
                </div>
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[1.65rem] top-1.5 border-4 border-white shadow-sm"></div>
                  <h4 className="text-lg font-bold text-slate-900">Interactive Q&A Session</h4>
                  <p className="text-slate-500 text-sm mt-1">12:00 PM - 1:00 PM</p>
                </div>
              </div>
            </div>
            
            {event.speaker && (
              <>
                <h3>Meet the Industry expert</h3>
                <div className="not-prose flex flex-col sm:flex-row gap-6 items-start bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="w-20 h-20 rounded-full bg-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{event.speaker}</h4>
                    <p className="text-primary font-medium text-sm mb-3">Industry Expert</p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      With years of hands-on experience and a passion for teaching, our industry expert brings deep industry knowledge and practical insights to help you navigate your career path successfully.
                    </p>
                  </div>
                </div>
              </>
            )}
            
            <p className="mt-8 font-medium">Don't miss this opportunity to advance your knowledge and take the next step in your career journey.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
