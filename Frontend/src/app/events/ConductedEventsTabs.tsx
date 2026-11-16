"use client";

import { useState } from "react";
import EventCard from "@/components/events/EventCard";

export default function ConductedEventsTabs({ 
  conductedEventsByYear, 
  sortedYears 
}: { 
  conductedEventsByYear: Record<string, any[]>; 
  sortedYears: string[];
}) {
  const [selectedYear, setSelectedYear] = useState(sortedYears[0] || "");

  if (!sortedYears.length) return null;

  const currentEvents = conductedEventsByYear[selectedYear] || [];

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
                ? "bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-900 shadow-md shadow-orange-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Events for selected year: 3 events in one row, no animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentEvents.map((event, idx) => (
          <div key={`${event.id || idx}`} className="h-full">
            <EventCard event={event} isUpcoming={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
