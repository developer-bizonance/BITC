import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutTemplate, PenTool, Video, Film, Clapperboard,
  GraduationCap, Clock, CheckCircle2, ArrowRight, Sparkles,
  Palette, Eye, Layers, IndianRupee, Award, Star
} from "lucide-react";

export const metadata: Metadata = {
  title: "Design Courses",
  description: "Master UI/UX Design, Graphic Design, 3D Animation, and Video Editing with hands-on projects at BITC Amravati.",
  openGraph: {
    title: "Design Courses | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Creative & UI/UX design certification courses.",
  },
};

const designCourses = [
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    tag: "Product Design",
    duration: "6 Months",
    fees: "₹28,000",
    icon: LayoutTemplate,
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop",
    desc: "Design intuitive and beautiful user interfaces. Master user research, wireframing, prototyping, and design systems.",
    highlights: ["User Research & Personas", "Wireframing & Prototyping", "Figma & Adobe XD", "Design Systems & Handoff"],
    popular: true,
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    tag: "Visual Arts",
    duration: "3 Months",
    fees: "₹18,000",
    icon: PenTool,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
    desc: "Create stunning visual content for brands. Learn typography, color theory, branding, and layout design.",
    highlights: ["Adobe Photoshop & Illustrator", "Typography & Color Theory", "Brand Identity Design", "Print & Digital Media"],
    popular: true,
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics",
    tag: "Animation & VFX",
    duration: "3 Months",
    fees: "₹22,000",
    icon: Video,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    desc: "Bring designs to life with motion. Learn animation principles, After Effects, and dynamic visual storytelling.",
    highlights: ["Adobe After Effects", "Animation Principles", "Kinetic Typography", "Visual Storytelling"],
  },
  {
    id: "video-editing",
    title: "Video Editing & Production",
    tag: "Media & Post-Prod",
    duration: "3 Months",
    fees: "₹20,000",
    icon: Film,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
    desc: "Master professional video editing for film, social media, and corporate content using industry-standard tools.",
    highlights: ["Adobe Premiere Pro", "DaVinci Resolve", "Color Grading & Audio", "Social Media Video Content"],
  },
  {
    id: "animation",
    title: "2D & 3D Animation",
    tag: "Creative Media",
    duration: "6 Months",
    fees: "₹30,000",
    icon: Clapperboard,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    desc: "Create captivating 2D and 3D animations. Learn character design, storyboarding, and animation production pipelines.",
    highlights: ["2D & 3D Animation", "Character Design", "Storyboarding", "Animation Pipeline & Rigging"],
  },
];

export const dynamic = 'force-dynamic';

export default async function DesignCoursesPage() {
  let dynamicCourses = [];
  try {
    const res = await fetch("http://localhost:5000/api/certifications?category=Design", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      dynamicCourses = data.certifications || [];
    }
  } catch (error) {
    console.error("Failed to fetch Design courses:", error);
  }

  const coursesToRender = dynamicCourses.map((c: any) => {
    const localMatch = designCourses.find(
      (lc) => lc.title.toLowerCase().includes(c.title.toLowerCase()) || c.title.toLowerCase().includes(lc.title.toLowerCase())
    );

    return {
      id: localMatch?.id || c.title.toLowerCase().replace(/ & /g, '-').replace(/[\/\s]+/g, '-'),
      title: c.title,
      tag: c.category || "Design",
      duration: c.duration || "6 Months",
      fees: c.fees || "₹30,000",
      icon: localMatch?.icon || Palette,
      image: (c.image && (c.image.startsWith('http') || c.image.startsWith('/'))) ? c.image : (localMatch?.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"),
      desc: localMatch?.desc || "Unleash your creativity with hands-on design courses. Learn Figma, Adobe Creative Suite, 3D tools, and build a portfolio.",
      highlights: localMatch?.highlights || ["Portfolio-First Learning", "Industry Design Mentors", "Real-world projects", "Agency Review Support"],
    };
  });

  const finalCourses = coursesToRender.length > 0 ? coursesToRender : designCourses;

  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* Hero Banner */}
      <section className="relative w-full flex flex-col items-center justify-center bg-white py-12 md:py-16 lg:py-20 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1360px] mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-xs md:text-sm font-bold mb-6">
              <Palette className="w-4 h-4" />
              <span>DESIGN & CREATIVE ARTS</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Design Courses & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Certifications</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 font-medium max-w-2xl mx-auto">
              Unleash your creativity with hands-on design courses. Learn Figma, Adobe Creative Suite, 3D tools, and build a portfolio that lands jobs.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>5 Creative Tracks</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Portfolio-First Learning</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Industry Design Mentors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-14 md:py-20 bg-slate-50/70">
        <div className="container max-w-[1360px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Explore Design Programs</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base">
              From UI/UX to animation — master creative skills that top agencies and studios demand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {finalCourses.map((course) => (
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

                  {/* Tag Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                      {course.tag}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors flex items-center leading-snug mb-1">
                      {course.title}
                    </h3>

                    {/* AI Badge */}
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        Integrated with AI Design
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                      {course.desc}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1.5 mb-3">
                      {course.highlights.map((item, j) => (
                        <div key={j} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="line-clamp-1">Portfolio & Agency Review Support</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Pricing & CTA */}
                  <div className="mt-auto pt-2.5 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
                        <span>Fees: <strong className="text-purple-600 font-extrabold">{course.fees}</strong></span>
                      </div>
                    </div>

                    <Link href={`/courses/${course.id}`} className="block w-full">
                      <Button className="w-full h-10 rounded-xl bg-slate-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center gap-2 group/btn">
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

      {/* Why Design at BITC */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-[1360px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Why Learn Design at BITC?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base">
              Learn from real design directors and build projects that stand out to creative agencies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Live Client Briefs", desc: "Work on real design briefs for brands, startups, and agencies.", icon: Eye },
              { title: "Portfolio Development", desc: "Graduate with a polished Behance & Figma portfolio ready for interviews.", icon: Layers },
              { title: "Industry Mentorship", desc: "Learn directly from senior UI/UX and visual designers.", icon: GraduationCap },
              { title: "Tool Mastery", desc: "Master Figma, Photoshop, Illustrator, Premiere Pro, and After Effects.", icon: PenTool },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-purple-300 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-13 h-13 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4 text-purple-600">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-purple-50/70 via-pink-50/40 to-purple-50/30 text-slate-900 border-t border-purple-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Start Your Creative Journey</h2>
          <p className="text-base md:text-lg text-slate-600 mb-8 font-medium">
            Turn your passion for design into a high-paying career. Enroll today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="h-13 px-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold flex items-center justify-center hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 text-base">
              Enroll in Design Track
            </Link>
            <Link href="/contact" className="h-13 px-8 rounded-full bg-white text-slate-700 font-bold flex items-center justify-center border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-base shadow-xs">
              Download Syllabus
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
