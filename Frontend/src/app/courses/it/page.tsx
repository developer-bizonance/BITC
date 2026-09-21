import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Code, Database, Coffee, Terminal, BrainCircuit, BarChart,
  ShieldCheck, Cloud, GraduationCap, Clock, CheckCircle2,
  ArrowRight, Monitor, Sparkles, IndianRupee, Award, Star,
  Users, Laptop, Briefcase
} from "lucide-react";
import { courses as staticCourses } from "@/data/courses";

export const metadata: Metadata = {
  title: "IT & Software Certifications",
  description: "Master Full Stack Java, Python, MERN, AI & ML, Data Science, Cyber Security, and Cloud Computing at BITC Amravati.",
  openGraph: {
    title: "IT & Software Certifications | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Industry-aligned IT & Software engineering certification programs.",
  },
};



export const dynamic = 'force-dynamic';

export default async function ITCoursesPage() {
  let dynamicCourses = [];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
    const res = await fetch(`${API_URL}/certifications?category=Information%20Technology`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      dynamicCourses = data.certifications || [];
    }
  } catch (error) {
    console.error("Failed to fetch IT courses:", error);
  }

  if (!dynamicCourses || dynamicCourses.length === 0) {
    dynamicCourses = staticCourses.filter(c => c.category === "Information Technology");
  }

  const finalCourses = dynamicCourses.map((c: any) => {
    return {
      id: c.slug || c.title.toLowerCase().replace(/ & /g, '-').replace(/[\/\s]+/g, '-'),
      title: c.title,
      tag: c.category || "Information Technology",
      duration: c.duration || "6 Months",
      fees: c.fees || "₹36,000",
      icon: Monitor,
      image: (c.image && (c.image.startsWith('http') || c.image.startsWith('/'))) ? c.image : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    };
  });

  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* Hero Banner */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-start pt-16 md:pt-20 lg:pt-24 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1360px] mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-medium mb-6">
              <Monitor className="w-4 h-4" />
              <span>INFORMATION TECHNOLOGY</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              IT <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Certifications</span> & Programs
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 font-medium max-w-2xl mx-auto">
              Industry-focused IT certification programs designed by experts. Master in-demand technologies, build real projects, and launch your tech career with confidence.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>8 Specialized Programs</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Industry Expert Mentors</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>100% Placement Assistance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-14 md:py-20 bg-white/70">
        <div className="container max-w-[1360px] mx-auto px-4">


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {finalCourses.map((course: any) => {
              const Icon = course.icon;
              return (
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />


                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors flex items-center leading-snug mb-3">
                        {course.title}
                      </h3>

                      {/* Features List */}
                      <div className="space-y-2 mb-4">
                        {/* 1. Duration */}
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Duration: <strong className="text-slate-900 font-semibold">{course.duration}</strong></span>
                        </div>

                        {/* 2. Learn from Experts */}
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Learn from Experts</span>
                        </div>

                        {/* 3. Assignments & Live Projects */}
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Laptop className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Assignments & Live Projects</span>
                        </div>

                        {/* 4. Internship Opportunity */}
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" />
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Why IT at BITC */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-[1360px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Why Learn IT at <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">BITC?</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base">
              Our IT programs go beyond theory — every certification program is built around industry practice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Live Projects", desc: "Work on real-world projects that mirror actual industry challenges.", icon: Code },
              { title: "Expert Mentors", desc: "Learn directly from experienced IT professionals and engineers.", icon: GraduationCap },
              { title: "Industry Certifications", desc: "Earn recognized certifications that strengthen your resume.", icon: CheckCircle2 },
              { title: "Placement Support", desc: "Get end-to-end placement assistance including interview prep.", icon: ArrowRight },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-primary/40 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-13 h-13 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Importance of Certification */}
      <section className="py-20 bg-white text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1360px] mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Importance of <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">IT Certifications</span> in Today's Era
            </h2>
            <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
              Technology is evolving at an unprecedented pace. Here is why certified IT professionals are the most sought-after talent globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                title: "Massive Tech Talent Shortage",
                desc: "With the rise of Cloud, AI, and Cybersecurity, companies are struggling to find qualified professionals. Certifications prove you have the exact skills they need.",
                icon: <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              },
              {
                title: "Future-Proof Career",
                desc: "IT is the backbone of modern business. By mastering core technologies and staying certified, you ensure your skills never become obsolete.",
                icon: <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              },
              {
                title: "Global Remote Opportunities",
                desc: "Tech skills transcend borders. A recognized certification opens doors to high-paying remote roles at top tech companies worldwide.",
                icon: <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
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
