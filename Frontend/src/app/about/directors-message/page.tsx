import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Quote,
  BookOpen,
  Lightbulb,
  Users,
  Building2,
  GraduationCap,
  Sprout,
  Rocket,
  Target,
  TrendingUp,
  Globe,
  User,
  Briefcase,
  Award
} from "lucide-react";

export const metadata: Metadata = {
  title: "Director's Message",
  description: "Read the leadership message and inspirational words from the Director of BIZONANCE Industrial Training Centre (BITC).",
  openGraph: {
    title: "Director's Message | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Inspirational words from BITC leadership.",
  },
};

export default function DirectorsMessagePage() {
  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* ── HERO ── */}
      <section className="relative w-full pt-8 pb-16 lg:pt-10 lg:pb-24 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col-reverse lg:flex-row">

            {/* Text Content */}
            <div className="flex-1 p-10 md:p-16 flex flex-col justify-center relative">
              <Quote className="absolute top-8 left-8 md:top-12 md:left-12 w-24 h-24 text-slate-50 opacity-50 -z-10" />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 shadow-sm w-fit">
                <Target className="w-4 h-4" />
                Message from the Director
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] mb-6">
                A Vision for <br />
                <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#0052D4_0%,#4364F7_50%,#6FB1FC_100%)]">Transformative Education</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium max-w-[90%]">
                Every decision at BITC is driven by a single belief — that education should empower students to build meaningful careers, not just earn degrees.
              </p>

              <div className="mt-auto pt-8 border-t border-slate-100">
                <h4 className="text-xl font-bold text-slate-900 mb-2.5">Pratik D. Gawande</h4>
                <div className="space-y-1.5 text-sm font-semibold text-slate-600">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    Director, BIZONANCE Industrial Training Centre
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    Founder &amp; CEO, BIZONANCE INDIA Pvt. Ltd.
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="lg:w-[45%] xl:w-[50%] relative min-h-[400px] lg:min-h-[500px]">
              <img
                src="/profile.png"
                alt="Director"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent lg:block hidden" />
            </div>

          </div>
        </div>
      </section>


      {/* ── WELCOME MESSAGE ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-[900px] mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 text-center">Why BITC Was Created</h2>
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6 text-justify">
            <p>
              I have spent over a decade working with industries and watching fresh graduates struggle—not because they lacked intelligence, but because they lacked exposure to the real world. The gap between what colleges teach and what companies expect has been growing every year.
            </p>
            <p>
              <strong>BITC was created to close that gap.</strong> We believe the future of education lies in practical, industry-integrated learning. Our students don't just attend classes—they work on live projects, interact with mentors from the industry, participate in workshops, and gain the confidence to perform from day one.
            </p>
            <p>
              The responsibility of building a career doesn't belong to the student alone. It is shared by educators, mentors, institutions, and industries. At BITC, we accept that responsibility and we take it seriously.
            </p>
            <p>
              The career opportunities in technology, data, AI, and digital business are immense. But students need the right guidance, the right skills, and the right platform. That is what BITC provides.
            </p>
          </div>
        </div>
      </section>

      {/* ── DIRECTOR'S BELIEFS ── */}
      <section className="py-16 md:py-24 bg-slate-100 text-slate-900 border-y border-slate-200/80 relative overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">What I Believe In</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Director&apos;s Beliefs</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Practical Learning", icon: BookOpen, desc: "Theory without practice is incomplete. Every program must include real-world application." },
              { title: "Innovation", icon: Lightbulb, desc: "Education must evolve with technology. We embrace AI, automation, and modern tools." },
              { title: "Leadership", icon: Rocket, desc: "We don't just build employees—we build leaders who can drive change." },
              { title: "Industry Exposure", icon: Building2, desc: "Students must interact with the industry before entering it. Workshops, visits, and mentorship matter." },
              { title: "Student Success", icon: GraduationCap, desc: "Every decision at BITC is guided by one question: Does this help our students succeed?" },
              { title: "Lifelong Learning", icon: Sprout, desc: "The world changes fast. Professionals must continuously learn, adapt, and grow." },
            ].map((item, i) => (
              <Card key={i} className="bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-7">
                  <item.icon className="w-10 h-10 text-primary mb-5" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIRECTOR'S VISION ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Director&apos;s Vision</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Where BITC Is Heading</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 md:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Short-Term Milestones</h3>
              <p className="text-gray-600 leading-relaxed">
                Become one of India's most recognized industry-integrated Training Centers with 50,000+ students trained, 500+ industry partnerships, and presence across multiple cities.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 md:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Long-Term Aspiration</h3>
              <p className="text-gray-600 leading-relaxed">
                Build a global learning ecosystem with international certifications, AI-powered learning platforms, startup incubation, and research partnerships with leading universities.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-[2rem] p-8 md:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Future Expansion</h3>
              <p className="text-gray-600 leading-relaxed">
                Launch innovation labs, digital campuses, entrepreneurship programs, and international partnerships to empower learners beyond borders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE & SIGNATURE ── */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-y border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[850px] mx-auto px-4 text-center relative z-10">
          <Quote className="w-9 h-9 text-primary/40 mx-auto mb-4" />
          <p className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug mb-6 text-slate-900 tracking-tight max-w-[850px] mx-auto">
            "Education should prepare students for{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
              life
            </span>
            , not just examinations."
          </p>

          {/* Signature */}
          <div className="border-t border-slate-300/80 pt-4 inline-block">
            <p className="text-base font-bold text-slate-900">Director</p>
            <p className="text-xs text-slate-600 font-medium">BIZONANCE Industrial Training Centre</p>
            <p className="text-primary font-bold italic mt-1 text-base">— BITC</p>
          </div>
        </div>
      </section>
    </div>
  );
}
