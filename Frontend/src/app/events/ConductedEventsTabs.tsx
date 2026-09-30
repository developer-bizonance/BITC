"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CalendarDays, MapPin, Users, ChevronRight } from "lucide-react";

export default function ConductedEventsTabs({ 
  conductedEventsByYear, 
  sortedYears 
}: { 
  conductedEventsByYear: Record<string, any[]>; 
  sortedYears: string[];
}) {
  const [selectedYear, setSelectedYear] = useState(sortedYears[0] || "");

  if (!sortedYears.length) return null;

  return (
    <div className="space-y-8">
      {/* Year Capsule Buttons */}
      <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
        {sortedYears.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
              selectedYear === year
                ? "bg-slate-900 text-white shadow-slate-900/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Events for selected year */}
      <div key={selectedYear} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Carousel className="w-full px-2 md:px-0">
          <CarouselContent className="-ml-4 py-4">
            {conductedEventsByYear[selectedYear]?.map((event) => (
              <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full p-2">
                  <Card className="h-full overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 group rounded-3xl bg-white flex flex-col hover:-translate-y-1 p-0 gap-0">
                    {event.image ? (
                      <div className="w-full h-56 relative overflow-hidden bg-gray-100 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-900 shadow-sm uppercase tracking-wider">
                          {event.category}
                        </div>
                      </div>
                    ) : null}
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
                          <span className="text-slate-700">Industry expert: <span className="font-semibold">{event.speaker}</span></span>
                        </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end pt-5 border-t border-gray-100 mt-auto">
                        <Link href={`/events/${event.id}`} className="w-full">
                          <Button className="w-full text-black font-medium transition-all duration-300 rounded-full py-6 shadow-none hover:shadow-lg hover:shadow-orange-500/20 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:-translate-y-0.5">
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
          {(conductedEventsByYear[selectedYear]?.length || 0) > 3 && (
            <>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:text-primary h-12 w-12 shadow-sm" />
              <CarouselNext className="hidden md:flex -right-12 bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:text-primary h-12 w-12 shadow-sm" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
}
