import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Video, Film, Clapperboard, MonitorPlay, Camera,
  GraduationCap, Clock, CheckCircle2, ArrowRight, Sparkles,
  Palette, Eye, Layers, IndianRupee, Award, Star, Users, Laptop, Briefcase
} from "lucide-react";
import { courses as staticCourses } from "@/data/courses";

export const metadata: Metadata = {
  title: "Digital Media Technology Certifications",
  description: "Master Digital Arts, Video Editing, Animation, and Media Production with hands-on projects at BITC Amravati.",
  openGraph: {
    title: "Digital Media Technology Certifications | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Creative digital media certification programs.",
  },
};

export const dynamic = 'force-dynamic';

export default async function DigitalMediaCoursesPage() {
  let dynamicCourses = [];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
    const res = await fetch(`${API_URL}/certifications?category=Digital%20Media%20Technology`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      dynamicCourses = data.certifications || [];
    }
  } catch (error) {
    console.error("Failed to fetch Digital Media courses:", error);
  }

  if (!dynamicCourses || dynamicCourses.length === 0) {
    dynamicCourses = staticCourses.filter(c => c.category === "Digital Media Technology");
  }

  const finalCourses = dynamicCourses.map((c: any) => {
    return {
      id: c.slug || c.title.toLowerCase().replace(/ & /g, '-').replace(/[\/\s]+/g, '-'),
      title: c.title,
      tag: c.category || "Digital Media Technology",
      duration: c.duration || "6 Months",
      fees: c.fees || "₹36,000",
      icon: Video,
      image: (c.image && (c.image.startsWith('http') || c.image.startsWith('/'))) ? c.image : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    };
  });

  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* Hero Banner */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-start pt-16 md:pt-20 lg:pt-24 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1360px] mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs md:text-sm font-medium mb-6">
              <Video className="w-4 h-4" />
              <span>DIGITAL MEDIA TECHNOLOGY</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Digital Media <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Certifications</span> & Programs
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 font-medium max-w-2xl mx-auto">
              Master the art of visual storytelling. Learn industry-standard tools for video editing, animation, and digital media production to launch your creative career.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Specialized Creative Tracks</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Portfolio-First Learning</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Industry Design Mentors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-14 md:py-20 bg-white/70">
        <div className="container max-w-[1360px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {finalCourses.map((course: any) => (
              <Card
                key={course.id}
                className="group p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 bg-white flex flex-col justify-between h-full relative hover:-translate-y-1.5"
              >
                {/* Top Image Banner */}
                <div className="h-48 relative w-full overflow-hidden bg-slate-900">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                </div>

                {/* Body Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors flex items-center leading-snug mb-3">
                      {course.title}
                    </h3>

                    {/* Features List */}
                    <div className="space-y-2 mb-4">
                      {/* 1. Duration */}
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Duration: <strong className="text-slate-900 font-semibold">{course.duration}</strong></span>
                      </div>

                      {/* 2. Learn from Experts */}
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <Users className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Learn from Experts</span>
                      </div>

                      {/* 3. Assignments & Live Projects */}
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <Laptop className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Assignments & Live Projects</span>
                      </div>

                      {/* 4. Internship Opportunity */}
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Internship Opportunity</span>
                      </div>

                      {/* 5. Become Certified */}
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Become a Certified</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Pricing & CTA */}
                  <div className="mt-auto pt-2.5 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-medium text-slate-500">Certification Fees:</span>
                      <span className="text-slate-900 font-extrabold text-xs bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
                        {course.fees || "₹36,000"}
                      </span>
                    </div>

                    <Link href={`/courses/${course.id}`} className="block w-full">
                      <Button className="w-full h-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:opacity-90 text-white font-medium text-xs transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center gap-2 group/btn">
                        <span>View Program</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Digital Media at BITC */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-[1360px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Why Learn Digital Media at <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">BITC?</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base">
              Learn from real digital artists and build projects that stand out to creative agencies and studios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Live Client Briefs", desc: "Work on real media briefs for brands, startups, and agencies.", icon: Eye },
              { title: "Portfolio Development", desc: "Graduate with a polished showreel and portfolio ready for interviews.", icon: Layers },
              { title: "Industry Mentorship", desc: "Learn directly from senior media producers and artists.", icon: GraduationCap },
              { title: "Tool Mastery", desc: "Master Premiere Pro, After Effects, and industry-standard tools.", icon: MonitorPlay },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-rose-300 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-13 h-13 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4 text-rose-600">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Importance of Certification */}
      <section className="py-20 bg-white text-slate-900">
        <div className="container max-w-[1360px] mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Importance of <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Digital Media Certifications</span> in Today's Era
            </h2>
            <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
              Media is the currency of the modern web. Here is why certified digital media professionals are critical to every industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                title: "Booming Creator Economy",
                desc: "With the explosive growth of social media, video platforms, and digital advertising, brands are desperate for creators who can produce high-quality, engaging content.",
                icon: <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              },
              {
                title: "Omnichannel Marketing",
                desc: "Companies no longer rely on a single channel. Certifications prove you have the technical ability to adapt content for diverse platforms and audiences.",
                icon: <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              },
              {
                title: "Future-Proof Creative Skills",
                desc: "While automation tools advance, the strategic vision, storytelling, and emotional connection of human-led digital media remain an invaluable asset.",
                icon: <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all group">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
