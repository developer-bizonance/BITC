"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import EventCard from "@/components/events/EventCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface AutoEventsCarouselProps {
  events: any[];
  isUpcoming?: boolean;
  intervalMs?: number;
}

export default function AutoEventsCarousel({
  events = [],
  isUpcoming = true,
  intervalMs = 3000,
}: AutoEventsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // If 3 or fewer events, do not loop or scroll; keep them stable in a grid
  const shouldScroll = events && events.length > 3;

  // If there are more than 3 events, duplicate only if under 6 slides so Embla can loop smoothly
  const slides = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    if (!shouldScroll) return events;
    if (events.length >= 6) return events;
    return [...events, ...events];
  }, [events, shouldScroll]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (shouldScroll && !isPaused && api) {
      timerRef.current = setInterval(() => {
        api.scrollNext();
      }, intervalMs);
    }
  }, [api, isPaused, intervalMs, shouldScroll]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  if (!events || events.length === 0) return null;

  // When cards are 3 or fewer, keep them stable without carousel or scrolling
  if (!shouldScroll) {
    return (
      <div className="w-full px-2 md:px-0 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <div key={`${event.id || idx}`} className="h-full p-1 transition-transform duration-300">
              <EventCard event={event} isUpcoming={isUpcoming} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full group/carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
          duration: 35,
        }}
        className="w-full px-2 md:px-0"
      >
        <CarouselContent className="-ml-4 py-4">
          {slides.map((event, idx) => (
            <CarouselItem
              key={`${event.id}-${idx}`}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="h-full p-2 transition-transform duration-300">
                <EventCard event={event} isUpcoming={isUpcoming} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
