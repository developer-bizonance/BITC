import prisma from "@/lib/prisma";
import { getCourseBySlug, Course } from "@/data/courses";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, CheckCircle2, Clock, BookOpen, Target, Briefcase, 
  Award, Sparkles, LayoutTemplate, Network, IndianRupee, Download, 
  Layers, Cpu, Laptop, Rocket, FileText, Check, ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ApplyButton } from "@/components/courses/ApplyButton";

import type { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

async function fetchCourse(slug: string): Promise<Course | null> {
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, '-');
  
  // 1. Try Backend API first for live dynamic curriculum & details
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
    const res = await fetch(`${apiUrl}/courses/${normalizedSlug}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.course) {
        return {
          slug: data.course.slug,
          title: data.course.title,
          category: data.course.category,
          duration: data.course.duration,
          fees: data.course.fees,
          price: data.course.price || 36000,
          description: data.course.description,
          features: data.course.features || [],
          image: data.course.image,
          curriculum: (data.course.curriculum as any[]) || [],
        };
      }
    }
  } catch (apiErr) {
    // Fallback to database or static
  }

  // 2. Try Prisma Neon DB
  try {
    const dbCourse = await prisma.course.findUnique({
      where: { slug: normalizedSlug },
    });
    if (dbCourse) {
      return {
        slug: dbCourse.slug,
        title: dbCourse.title,
        category: dbCourse.category as any,
        duration: dbCourse.duration,
        fees: dbCourse.fees,
        price: dbCourse.price,
        description: dbCourse.description,
        features: dbCourse.features,
        curriculum: (dbCourse.curriculum as any[]) || [],
      };
    }
  } catch (err) {
    console.warn("Neon DB fetch failed for course detail, falling back to static:", err);
  }

  // 3. Fallback to local static
  return getCourseBySlug(normalizedSlug) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const course = await fetchCourse(resolvedParams.slug);

  if (!course) {
    return {
      title: "Course Not Found | BITC",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${course.title} Course`,
    description: `${course.description} Duration: ${course.duration}. Learn from industry experts at BITC BIZONANCE with placement assistance.`,
    keywords: [
      course.title,
      `${course.title} Course Amravati`,
      `${course.category} Certification`,
      "BITC Training",
      "BIZONANCE Industrial Training Centre",
    ],
    openGraph: {
      title: `${course.title} Course | BIZONANCE Industrial Training Centre. (BITC) | Amravati`,
      description: course.description,
    },
  };
}

export default async function CoursePage({ params }: PageProps) {
  const resolvedParams = await params;
  const course = await fetchCourse(resolvedParams.slug);

  if (!course) {
    notFound();
  }

  const totalTopics = course.curriculum.reduce((acc, mod) => acc + (mod.topics?.length || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative w-full bg-white text-slate-900 py-8 md:py-12 lg:py-14 overflow-hidden border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <LayoutTemplate className="w-3.5 h-3.5" />
                {course.category}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-slate-900">
                {course.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed font-medium">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mb-10">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-slate-700">{course.duration} Program</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-slate-700">Industry Certification</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <ApplyButton courseId={course.slug} courseTitle={course.title} />
                <Link href="#curriculum" className="h-14 px-10 rounded-full bg-white text-slate-700 text-lg font-bold flex items-center justify-center hover:bg-gray-50 border border-gray-200 transition-all shadow-sm">
                  View Curriculum
                </Link>
              </div>
            </div>

            {/* Right Side Stats/Features */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-blue-500/10 to-emerald-500/10 rounded-[2rem] blur-3xl pointer-events-none" />
              <Card className="bg-white border-slate-200/80 shadow-2xl shadow-slate-900/5 relative z-10 overflow-hidden rounded-[2rem]">
                <div className="h-2 w-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]" />
                <CardContent className="p-8 md:p-10">
                  {/* Course Feature Image */}


                  {/* Certification Fees Banner */}
                  <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl flex items-center justify-between border border-slate-700/50">
                    <div>
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">Certification Fees</p>
                      <p className="text-3xl md:text-4xl font-black tracking-tight text-white">{course.fees}</p>
                    </div>
                    <div className="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold rounded-full backdrop-blur-md">
                      100% Inclusive
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-orange-500" />
                    Program Highlights
                  </h3>
                  <ul className="space-y-4">
                    {course.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-semibold text-[15px]">{feature}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-3.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-semibold text-[15px]">1-on-1 Mentorship & Career Guidance</span>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-semibold text-[15px]">Access to Exclusive BITC Placement Drive</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content / Curriculum Section - PREMIUM REDESIGN */}
      <section id="curriculum" className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
        <div className="container max-w-[1100px] mx-auto px-4 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-extrabold uppercase tracking-widest mb-4">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>INDUSTRY-DESIGNED SYLLABUS</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Comprehensive Course Curriculum
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Curated by industry leads and updated quarterly to equip you with production-grade skills, real-world workflows, and AI integration.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-800">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>{course.curriculum.length} Intensive Modules</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-800">
                <BookOpen className="w-4 h-4 text-orange-600" />
                <span>{totalTopics}+ Deep-Dive Topics</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-800">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>AI Tools & Workflows</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-800">
                <Rocket className="w-4 h-4 text-emerald-600" />
                <span>Live Capstone Project</span>
              </div>
            </div>
          </div>

          {/* Accordion List */}
          <Accordion className="w-full space-y-5">
            {course.curriculum.map((module, i) => (
              <AccordionItem 
                key={i} 
                value={`module-${i}`} 
                className="border border-slate-200/90 rounded-2xl px-6 md:px-8 py-1.5 bg-white shadow-sm hover:shadow-md data-[state=open]:shadow-xl data-[state=open]:border-slate-300 transition-all duration-300 overflow-hidden group"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full pr-4">
                    <div className="flex items-center gap-4">
                      {/* Module Number Badge */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-amber-400 flex items-center justify-center shrink-0 shadow-md font-black text-base border border-slate-700/50 group-data-[state=open]:from-amber-500 group-data-[state=open]:to-orange-500 group-data-[state=open]:text-slate-950 transition-all duration-300">
                        0{i + 1}
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600 block mb-0.5">
                          MODULE {i + 1}
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                          {module.title.replace(/^Module \d+:\s*/i, '')}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-center">
                      <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200 shrink-0">
                        {module.topics.length} Key Topics
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-2 pb-7 border-t border-slate-100 mt-2">
                  <div className="space-y-4 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Core Learning Outcomes & Technical Skills:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {module.topics.map((topic, j) => (
                        <div 
                          key={j} 
                          className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-amber-500/5 hover:border-amber-500/20 transition-all"
                        >
                          <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-sm font-semibold text-slate-800 leading-snug">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {/* Real-World Capstone Banner */}
          <div className="mt-14 p-8 md:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl border border-slate-700/80 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-4 border border-amber-500/30">
                <Rocket className="w-3.5 h-3.5" />
                <span>HANDS-ON INDUSTRIAL CAPSTONE</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
                Build a Production-Ready Capstone Project
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base font-medium">
                Apply everything you've learned to construct a real-world enterprise project under the guidance of senior software leads. Review your code, optimize performance, and showcase it directly to top tech recruiters.
              </p>
            </div>
            
            <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <ApplyButton courseId={course.slug} courseTitle={course.title} />
              <Link 
                href="/contact" 
                className="w-full sm:w-auto h-14 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/20 transition-all shadow-md backdrop-blur-md"
              >
                Inquire Syllabus <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Curriculum Features Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Laptop className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">100% Practical</h4>
              <p className="text-xs text-slate-500">Real-world coding exercises and live project builds.</p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">AI Workflows</h4>
              <p className="text-xs text-slate-500">Integrated Copilot, Cursor & AI prompt engineering.</p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">BITC Certification</h4>
              <p className="text-xs text-slate-500">Recognized industrial certification upon completion.</p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">Placement Drive</h4>
              <p className="text-xs text-slate-500">Direct interview opportunities with hiring partners.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
