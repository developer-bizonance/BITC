import React from "react";
import {
  Laptop,
  GraduationCap,
  Mic,
  PlayCircle,
  Star,
  Code,
  Rocket,
  Building2,
  Users,
  Briefcase,
  Ticket,
  Network,
  Lightbulb,
  Trophy,
  Target,
  Award,
  Mic2,
  TrendingUp,
  Zap,
  FileText,
  Handshake,
} from "lucide-react";

interface CategoryItem {
  name: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const allEventCategories: CategoryItem[] = [
  // Row 1 (8 items)
  { name: "Workshops", icon: Laptop, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Seminars", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Expert Talks", icon: Mic, color: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Webinars", icon: PlayCircle, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { name: "Masterclasses", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "Hackathons", icon: Code, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { name: "Bootcamps", icon: Rocket, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Industrial Visits", icon: Building2, color: "text-slate-500", bg: "bg-slate-500/10" },

  // Row 2 (8 items)
  { name: "Guest Lectures", icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Career Guidance", icon: Briefcase, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10" },
  { name: "Placement Drives", icon: Ticket, color: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Networking Meets", icon: Network, color: "text-teal-500", bg: "bg-teal-500/10" },
  { name: "Tech Meetups", icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Bussiness Conclave", icon: Building2, color: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "Leadership Summits", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Startup Meet-Up", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

export default function EventCategoriesGrid() {
  return (
    <div className="w-full">
      {/* Grid of Categories: 8 logos per horizontal row on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-x-3 sm:gap-x-4 lg:gap-x-3 xl:gap-x-4 gap-y-6 sm:gap-y-8 lg:gap-y-8">
        {allEventCategories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div
              key={i}
              className="group cursor-pointer flex flex-col items-center p-2 sm:p-2.5 lg:p-2 xl:p-2.5 transition-all duration-200"
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${cat.bg} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${cat.color}`} />
              </div>
              <span className="text-[11px] sm:text-xs xl:text-[13px] font-semibold text-slate-700 text-center leading-snug group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
