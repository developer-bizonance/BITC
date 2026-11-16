import TrustedBy from "@/components/TrustedBy";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Placement Cell & Career Assistance | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
  description: "BITC Placement Cell provides mock interviews, resume building, portfolio refinement, soft skills training, and 100% placement support for IT and Management students.",
  openGraph: {
    title: "Placement Cell & Career Assistance | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Dedicated Placement Cell providing mock interviews, career guidance, and campus recruitment drives.",
  },
};
import Link from "next/link";
import {
  Target, Briefcase, GraduationCap, Users,
  TrendingUp, FileText, CheckCircle2, MessageSquare,
  ArrowRight, Award, Trophy
} from "lucide-react";

const activities = [
  {
    title: "Resume & Portfolio Building",
    description: "Expert guidance on crafting professional resumes and impressive portfolios tailored to industry standards.",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Mock Interviews",
    description: "Rigorous practice sessions with industry experts to help you ace technical and HR interviews.",
    icon: MessageSquare,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Aptitude & Technical Training",
    description: "Specialized training programs to clear quantitative, logical, and coding assessment rounds.",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Soft skills development",
    description: "Personality development, communication skills, and corporate etiquette workshops.",
    icon: Users,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    title: "Pre-Placement Talks",
    description: "Direct interaction with corporate leaders and recruiters to understand company expectations.",
    icon: Target,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    title: "Career Counseling",
    description: "One-on-one sessions to help you choose the right career path based on your strengths.",
    icon: Briefcase,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  }
];

const process = [
  { step: "01", title: "Registration", desc: "Enroll in the placement assistance program." },
  { step: "02", title: "Skill Assessment", desc: "Identify strengths and areas for improvement." },
  { step: "03", title: "Training & Grooming", desc: "Participate in workshops, mock interviews, and technical prep." },
  { step: "04", title: "Drive Participation", desc: "Appear for campus and off-campus recruitment drives." },
  { step: "05", title: "Offer & Onboarding", desc: "Secure the offer letter and prepare for Day 1." },
];

export default function PlacementCellPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. Hero Banner */}
      <section className="relative w-full lg:min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 sm:py-14 md:py-12 bg-white overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center flex flex-col items-center justify-center h-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Placement Cell
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.2]">
            Empowering Your <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Career Journey</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-[800px] mx-auto leading-relaxed font-normal">
            Our dedicated Placement Cell bridges the gap between academics and industry, equipping you with the skills, confidence, and opportunities to secure your dream job.
          </p>
        </div>
      </section>

      {/* 2. Key Statistics */}
      <section className="py-10 sm:py-12 md:py-16 bg-white relative">
        <div className="container max-w-[1100px] mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              100% <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Placement Assistance</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed font-normal">Our dedicated placement cell ensures you get the right launchpad for your career.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 text-center">
            {[
              { stat: "10+", label: "Hiring Partners" },
              { stat: "500+", label: "Students Certified" },
              { stat: "12 LPA", label: "Highest Package" },
              { stat: "95%", label: "Placement Ratio" }
            ].map((item, index) => (
              <div key={index} className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100/90 shadow-sm hover:bg-white hover:border-primary/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 group">
                <div className="text-3xl md:text-4xl font-bold mb-2 opacity-65 group-hover:opacity-100 transform group-hover:scale-105 transition-all duration-300">
                  <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
                    {item.stat}
                  </span>
                </div>
                <div className="text-xs md:text-[13px] font-bold text-slate-800 tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Placement Activities */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">How we Prepare <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">You</span></h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-normal">
              Our comprehensive placement preparation program goes beyond traditional academics to ensure you are completely industry-ready by the time you graduate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white rounded-2xl overflow-hidden hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl ${activity.bg} ${activity.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <activity.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-600 mb-3">{activity.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {activity.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Placement Process */}
      <section className="py-12 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10 items-center">

            {/* Desktop Image Column (Left on desktop, hidden on mobile) */}
            <div className="hidden lg:block flex-1 w-full relative max-w-md mx-auto lg:max-w-none">
              <div className="aspect-square lg:aspect-[4/5] lg:max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-xl relative">
                <img
                  src="/placement-process.jpg"
                  alt="Students in a mock interview and placement drive"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 w-full space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Our Proven Placement <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Process</span></h2>
                <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed font-normal">We follow a rigorous, step-by-step methodology to transform students into highly employable professionals.</p>
              </div>

              {/* Mobile Image (Shown under paragraph on mobile, hidden on lg) */}
              <div className="block lg:hidden w-full relative max-w-md mx-auto mb-8">
                <div className="aspect-square rounded-[2rem] overflow-hidden shadow-xl relative">
                  <img
                    src="/placement-process.jpg"
                    alt="Students in a mock interview and placement drive"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {process.map((p, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full text-black flex items-center justify-center font-medium text-base shrink-0 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] shadow-sm">
                        {p.step}
                      </div>
                      {i !== process.length - 1 && (
                        <div className="w-[2px] h-full bg-slate-100 mt-2 group-hover:bg-primary/20 transition-colors" />
                      )}
                    </div>
                    <div className="pb-4">
                      <h4 className="text-lg font-medium text-gray-600 mb-1">{p.title}</h4>
                      <p className="text-gray-500 text-sm">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Marquee (Dynamic from database) */}
      <TrustedBy />

      {/* 5. CTA */}
      <section className="py-20 bg-white text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-[1.2]">Your Dream Job <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Awaits</span></h2>
          <p className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed font-normal">
            Take the first step towards a successful career. Get in touch with the BITC Placement Cell today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact?enquiry=Placement%20%26%20Student%20Recruitment#contact-form">
              <Button className="w-full sm:w-auto h-14 px-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] text-lg font-normal shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all border-0">
                Contact placement officer
              </Button>
            </Link>
            <Link href="/placements/partners">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-full border-blue-200/80 text-slate-600 hover:bg-white hover:border-blue-300 text-lg font-normal hover:-translate-y-1 transition-all bg-white/80 backdrop-blur-sm shadow-sm">
                View hiring partners
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
