import React from "react";
import {
  GraduationCap,
  Award,
  BookOpen,
  Rocket,
  Briefcase,
  Lightbulb,
  Compass,
  Globe,
} from "lucide-react";

interface AudienceItem {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

const AUDIENCE_ITEMS: AudienceItem[] = [
  {
    title: "Engineering Students",
    subtitle: "B.Tech / B.E. / M.Tech",
    icon: GraduationCap,
    bgClass: "bg-blue-50 group-hover:bg-primary",
    textClass: "text-primary group-hover:text-white",
    borderClass: "border-blue-100/80",
  },
  {
    title: "Diploma Students",
    subtitle: "Polytechnic & Applied",
    icon: Award,
    bgClass: "bg-amber-50 group-hover:bg-amber-500",
    textClass: "text-amber-600 group-hover:text-white",
    borderClass: "border-amber-100/80",
  },
  {
    title: "University Students",
    subtitle: "BCA, B.Sc, MCA & Degree",
    icon: BookOpen,
    bgClass: "bg-indigo-50 group-hover:bg-indigo-600",
    textClass: "text-indigo-600 group-hover:text-white",
    borderClass: "border-indigo-100/80",
  },
  {
    title: "Fresh Graduates",
    subtitle: "Job-Ready Skill Sprint",
    icon: Rocket,
    bgClass: "bg-emerald-50 group-hover:bg-emerald-600",
    textClass: "text-emerald-600 group-hover:text-white",
    borderClass: "border-emerald-100/80",
  },
  {
    title: "Working Professionals",
    subtitle: "Upskilling & Career Growth",
    icon: Briefcase,
    bgClass: "bg-sky-50 group-hover:bg-sky-600",
    textClass: "text-sky-600 group-hover:text-white",
    borderClass: "border-sky-100/80",
  },
  {
    title: "Entrepreneurs",
    subtitle: "Tech Founders & Innovators",
    icon: Lightbulb,
    bgClass: "bg-orange-50 group-hover:bg-orange-500",
    textClass: "text-orange-600 group-hover:text-white",
    borderClass: "border-orange-100/80",
  },
  {
    title: "Career Switchers",
    subtitle: "Non-IT to Tech Transition",
    icon: Compass,
    bgClass: "bg-purple-50 group-hover:bg-purple-600",
    textClass: "text-purple-600 group-hover:text-white",
    borderClass: "border-purple-100/80",
  },
  {
    title: "Freelancers",
    subtitle: "Global Remote Projects",
    icon: Globe,
    bgClass: "bg-teal-50 group-hover:bg-teal-600",
    textClass: "text-teal-600 group-hover:text-white",
    borderClass: "border-teal-100/80",
  },
];

export default function WhoCanJoinSection() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="container max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Redesigned Interactive Audience Cards (7 columns on desktop for ample width) */}
          <div className="order-2 lg:order-1 lg:col-span-7 relative">
            {/* Ambient Background Glows */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="relative p-5 sm:p-7 rounded-[2rem] bg-gradient-to-br from-slate-50/90 via-white to-blue-50/30 border border-slate-200/80 shadow-xl shadow-slate-200/50">
              
              {/* Header inside container */}
              <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-slate-200/60">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Target Audiences
                  </span>
                </div>
              </div>

              {/* 2-Column Grid of Audience Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {AUDIENCE_ITEMS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-3 sm:p-3.5 border border-slate-200/80 hover:border-primary/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 group cursor-default"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${item.borderClass} ${item.bgClass} transition-all duration-300 shadow-sm`}
                      >
                        <Icon className={`w-5 h-5 ${item.textClass} transition-colors duration-300`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-tight mt-1">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Content & Description (5 columns on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Who Can Join{" "}
              <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
                BITC?
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 font-normal">
              Whether you are starting your career or looking to upgrade your skills, BITC provides learning opportunities tailored to your goals. Our programs are designed for individuals across various educational and professional backgrounds who are eager to bridge the gap between theory and practice.
            </p>

            <div className="inline-flex items-center gap-2 text-primary font-medium bg-primary/5 px-4 sm:px-5 py-2.5 rounded-full border border-primary/10 shadow-sm text-xs sm:text-sm whitespace-nowrap">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Empowering learners at every stage of their journey</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export { WhoCanJoinSection };
