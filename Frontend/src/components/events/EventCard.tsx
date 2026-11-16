import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, Clock, ChevronRight, Star } from "lucide-react";
import EventRegistrationModal from "@/components/events/EventRegistrationModal";
import { eventSlug } from "@/lib/utils";

export interface EventCardProps {
  event: {
    id: string | number;
    title: string;
    date: string;
    time?: string | null;
    venue?: string | null;
    speaker?: string | null;
    image?: string | null;
    slug?: string;
    rawDate?: string;
    rating?: number | null;
    ratingsCount?: number | null;
  };
  isUpcoming?: boolean;
}

export default function EventCard({ event, isUpcoming = false }: EventCardProps) {
  const targetSlug = event.slug || eventSlug(event.title, event.id.toString());
  const detailUrl = `/events/${targetSlug}`;

  return (
    <Card className="h-full overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 group rounded-3xl bg-white flex flex-col hover:-translate-y-1 p-0 gap-0">
      {event.image ? (
        <Link
          href={detailUrl}
          className="block w-full h-56 relative overflow-hidden bg-gray-100 transition-all duration-500 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
          <img
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
      ) : null}

      <CardContent className="p-6 md:p-8 flex flex-col flex-1">
        <Link href={detailUrl}>
          <h3 className="text-xl font-medium text-gray-600 mb-5 line-clamp-2 leading-tight group-hover:text-primary transition-colors cursor-pointer">
            {event.title}
          </h3>
        </Link>

        <div className="space-y-3 mb-8 flex-1">
          {event.speaker && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Users className="w-4.5 h-4.5 text-primary shrink-0" />
              <span className="font-semibold text-slate-800">{event.speaker}</span>
            </div>
          )}
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <CalendarDays className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
            <div className="font-semibold text-slate-800">{event.date}</div>
          </div>
          {event.time && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4.5 h-4.5 text-primary shrink-0" />
              <span className="text-slate-700">{event.time}</span>
            </div>
          )}
          {event.venue && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />
              <span className="text-slate-700">{event.venue}</span>
            </div>
          )}
          {event.rating && event.rating > 0 && (
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500 shrink-0" />
              <span className="font-semibold text-slate-900">{event.rating} / 5</span>
              <span className="text-xs text-gray-400">
                ({event.ratingsCount || 1} review{(event.ratingsCount || 1) === 1 ? "" : "s"})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end pt-5 border-t border-gray-100 mt-auto">
          {isUpcoming ? (
            <div className="w-full flex items-center gap-2">
              <Link href={detailUrl} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-full py-5 text-sm"
                >
                  Details
                </Button>
              </Link>
              <div className="flex-1">
                <EventRegistrationModal
                  eventId={event.id.toString()}
                  eventName={event.title}
                  triggerClassName="w-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-900 font-semibold rounded-full py-5 text-sm shadow-none hover:shadow-md hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all cursor-pointer border-0"
                  triggerText="Register"
                />
              </div>
            </div>
          ) : (
            <Link href={detailUrl} className="w-full">
              <Button className="w-full text-slate-900 font-medium transition-all duration-300 rounded-full py-6 shadow-none hover:shadow-lg hover:shadow-orange-500/20 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:-translate-y-0.5 cursor-pointer">
                View Details <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

