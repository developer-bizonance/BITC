import { resolveImageUrl, getApiBase, matchesEvent, isUpcomingEventDate } from "@/lib/utils";
import type { Metadata } from "next";
import { CalendarDays, MapPin, Users, Clock, Star } from "lucide-react";
import { notFound } from "next/navigation";
import EventRegistrationModal from "@/components/events/EventRegistrationModal";
import ConductedEventMedia from "./ConductedEventMedia";
import EventDescriptionRenderer from "@/components/events/EventDescriptionRenderer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return {
    title: `Event Details | BIZONANCE Industrial Training Centre. (BITC)`,
  };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  let event: any = null;
  let eventRating: { averageRating: number; ratingsCount: number; formSlug?: string } | null = null;
  const { id } = await params;

  try {
    const [eventsRes, feedbackRes] = await Promise.all([
      fetch(`${getApiBase()}/events`, { cache: 'no-store' }),
      fetch(`${getApiBase()}/event-feedback/forms`, { cache: 'no-store' }).catch(() => null),
    ]);

    if (eventsRes.ok) {
      const data = await eventsRes.json();
      if (data.events && data.events.length > 0) {
        const foundEvent = data.events.find((e: any, i: number) => matchesEvent({ ...e, id: e.id || i }, id));
        if (foundEvent) {
          event = {
            id: foundEvent.id || id,
            title: foundEvent.title,
            category: foundEvent.type ? foundEvent.type.charAt(0).toUpperCase() + foundEvent.type.slice(1).toLowerCase() : "Event",
            date: new Date(foundEvent.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }),
            rawDate: new Date(foundEvent.date).toISOString(),
            time: foundEvent.time || null,
            venue: foundEvent.venue || null,
            speaker: foundEvent.speaker || null,
            heading: foundEvent.heading || null,
            image: resolveImageUrl(foundEvent.imageUrl),
            shortDescription: foundEvent.shortDescription || null,
            description: foundEvent.description || foundEvent.shortDescription || "",
            photos: Array.isArray(foundEvent.photos) ? foundEvent.photos.map((p: string) => resolveImageUrl(p)) : [],
            videos: Array.isArray(foundEvent.videos) ? foundEvent.videos : [],
          };

          // Match admin-created feedback form for this event if it exists
          if (feedbackRes && feedbackRes.ok) {
            try {
              const fbData = await feedbackRes.json();
              if (fbData.success && Array.isArray(fbData.forms)) {
                const normalize = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
                const targetIdNorm = normalize(id);
                const eventTitleNorm = normalize(foundEvent.title);

                const matchedForm = fbData.forms.find((f: any) => {
                  if (f.eventId && foundEvent.id && String(f.eventId) === String(foundEvent.id)) return true;
                  if (f.slug && (normalize(f.slug) === targetIdNorm || normalize(f.slug) === eventTitleNorm)) return true;
                  if (f.eventTitle && normalize(f.eventTitle) === eventTitleNorm) return true;
                  return false;
                });

                // STRICT: ONLY show dynamic rating if feedback form exists AND real attendee reviews have been submitted
                if (
                  matchedForm &&
                  typeof matchedForm.averageRating === "number" &&
                  matchedForm.averageRating > 0 &&
                  matchedForm.ratingsCount > 0
                ) {
                  eventRating = {
                    averageRating: Number(matchedForm.averageRating.toFixed(1)),
                    ratingsCount: matchedForm.ratingsCount,
                    formSlug: matchedForm.slug || matchedForm.id,
                  };
                }
              }
            } catch (err) {
              console.warn("Error parsing feedback forms:", err);
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn("Failed to fetch event.", error);
  }

  if (!event) {
    notFound();
  }

  const isUpcoming = isUpcomingEventDate(event.rawDate, event.time);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Landing Banner — occupies the entire initial viewport on desktop so details are below the fold */}
      <section className="relative w-full md:min-h-[calc(100vh-72px)] flex flex-col items-center justify-center py-14 sm:py-18 md:py-24 bg-white overflow-hidden">
        <div className="container max-w-[1000px] mx-auto px-4 relative z-10 text-center flex flex-col items-center justify-center flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {event.category || "BITC Event"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.2]">
            {event.title}
          </h1>

          {event.shortDescription && (
            <p className="text-base md:text-lg text-gray-600 max-w-[800px] mx-auto leading-relaxed font-normal mb-8">
              {event.shortDescription}
            </p>
          )}

          {/* Event Metadata (clean without card background) */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-slate-700 my-4">
            {event.speaker && (
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-primary shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Speaker / Expert</p>
                  <p className="font-semibold text-slate-900 text-sm leading-tight">{event.speaker}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-5 h-5 text-primary shrink-0" />
              <div className="text-left">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Date</p>
                <p className="font-semibold text-slate-900 text-sm leading-tight">{event.date}</p>
              </div>
            </div>

            {event.time && (
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Time</p>
                  <p className="font-semibold text-slate-900 text-sm leading-tight">{event.time}</p>
                </div>
              </div>
            )}

            {event.venue && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Venue</p>
                  <p className="font-semibold text-slate-900 text-sm leading-tight">{event.venue}</p>
                </div>
              </div>
            )}

            {/* Dynamic Rating: ONLY shown if admin created a feedback form for this event AND has real reviews */}
            {eventRating && eventRating.averageRating > 0 && eventRating.ratingsCount > 0 && (
              <div className="flex items-center gap-2.5">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Rating</p>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-sm leading-tight">
                    <span>{eventRating.averageRating} / 5</span>
                    <span className="text-xs text-gray-400 font-normal">
                      ({eventRating.ratingsCount} review{eventRating.ratingsCount === 1 ? "" : "s"})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Register for this event button below the data (upcoming only) */}
          {isUpcoming && (
            <div className="mt-8 flex justify-center">
              <EventRegistrationModal
                eventId={event.id.toString()}
                eventName={event.title}
                triggerText="Register for this event"
                triggerClassName="inline-flex justify-center items-center w-full sm:w-auto h-12 md:h-13 px-8 md:px-10 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-900 font-semibold rounded-full shadow-md hover:opacity-95 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base border-0 cursor-pointer"
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Detailed Content Section — shown after scrolling only */}
      <section className="pt-16 pb-24 md:pb-32 bg-white border-t border-slate-100">
        <div className="container max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col items-center md:flex-row md:items-start gap-8 lg:gap-12">
            {/* Event Square Image on Left Side (same format and size as highlights banner) */}
            {event.image && (
              <div
                className="w-full max-w-[440px] sm:max-w-[480px] md:max-w-none md:w-[420px] lg:w-[480px] xl:w-[500px] aspect-square shrink-0 rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 bg-gradient-to-br from-blue-600 to-indigo-800"
                style={{ aspectRatio: "1 / 1" }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent pointer-events-none" />
              </div>
            )}

            {/* Only First Section on Right Side */}
            <div className="flex-1 flex flex-col justify-start md:pt-1 w-full">
              <EventDescriptionRenderer
                description={event.description}
                topHeading={event.heading}
                mode="first"
              />
            </div>
          </div>

          {/* All Remaining Sections Shown Below the Image */}
          <div className="w-full max-w-[1200px] mx-auto">
            <EventDescriptionRenderer
              description={event.description}
              mode="remaining"
            />
          </div>

          {/* If conducted: Capsule Photos & Videos. If upcoming: Register CTA */}
          {isUpcoming ? (
            <div className="mt-16 pt-12 border-t border-slate-100 text-center flex flex-col items-center">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Ready to Participate?</h3>
              <p className="text-gray-500 text-sm md:text-base mb-6 max-w-md">
                Secure your spot today to access this session, participate in live Q&amp;A, and earn your certificate.
              </p>
              <EventRegistrationModal
                eventId={event.id.toString()}
                eventName={event.title}
                triggerText="Register for this Event"
                triggerClassName="inline-flex justify-center items-center h-13 px-10 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 font-semibold rounded-full shadow-md hover:opacity-90 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 text-base border-0 cursor-pointer"
              />
            </div>
          ) : (
            <ConductedEventMedia
              photos={event.photos}
              videos={event.videos}
              eventTitle={event.title}
            />
          )}
        </div>
      </section>
    </div>
  );
}
