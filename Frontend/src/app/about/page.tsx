import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
  description: "Learn about BITC (BIZONANCE Industrial Training Centre), our mission, industry-aligned training methodology, state-of-the-art infrastructure, and dedicated mentors in Amravati.",
  openGraph: {
    title: "About Us | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Learn about BITC, our mission, industry-aligned training methodology, and infrastructure in Amravati.",
  },
};
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Code,
  Building2,
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
  Trophy,
  Sparkles,
  Shield,
  Network,
  BookOpen,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] bg-white py-16 lg:py-24 overflow-hidden flex flex-col items-center justify-center border-b border-gray-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1000px] mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center my-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Empowering the Next Generation for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Industry Professionals</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-[1.4rem] text-gray-600 mb-8 max-w-[900px] mx-auto leading-relaxed">
            At <strong>BIZONANCE Industrial Training Centre (BITC)</strong>, we believe education should prepare students for the real world—not just the classroom. Our industry-integrated learning model combines expert mentorship, practical training, live projects, internships, and career guidance to help students build successful careers.
          </p>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Who We Are</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-base md:text-lg">
                <p>
                  BITC (BIZONANCE Industrial Training Centre) is the professional training and skill development division of <strong>BIZONANCE INDIA PVT. LTD.</strong>, established with a clear vision to bridge the gap between academic education and industry requirements.
                </p>
                <p>
                  Traditional education often focuses on theory, while industries seek professionals with practical skills, problem-solving abilities, and real-world experience. BITC addresses this challenge by providing students with industry-oriented learning through direct interaction with experienced professionals, live projects, internships, workshops, and career-focused training.
                </p>
                <p>
                  Whether you're a student, graduate, working professional, or entrepreneur, BITC provides the knowledge, practical experience, and confidence needed to succeed in today's competitive world.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Philosophy */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Learning Beyond the Classroom</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-[700px] mx-auto">
            At BITC, learning extends far beyond textbooks. We believe students learn best by engaging directly with the industry.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left max-w-[900px] mx-auto">
            {[
              "Working on real projects",
              "Solving real business problems",
              "Learning directly from industry experts",
              "Collaborating with professionals",
              "Gaining practical experience",
              "Building confidence through hands-on learning"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-12 text-xl font-semibold text-slate-900">
            Our goal is not simply to help students complete a course—but to prepare them for successful careers.
          </p>
        </div>
      </section>

      {/* 4. What Makes BITC Different */}
      <section className="py-16 md:py-24 bg-slate-100 text-slate-900 border-y border-slate-200/80">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why BITC is Different</h2>
            <p className="text-slate-600 max-w-[600px] mx-auto text-lg">
              Unlike traditional coaching Training Centers, BITC focuses on practical industry exposure. Here is our unique approach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Learn from Industry Experts", icon: Users, desc: "Students interact directly with experienced professionals who share practical knowledge, current industry trends, and real-world insights." },
              { title: "Learn by Doing", icon: Code, desc: "Every program includes practical assignments, hands-on labs, and live projects that mirror actual workplace challenges." },
              { title: "Industry Exposure", icon: Building2, desc: "Students participate in workshops, seminars, guest lectures, industrial visits, and networking sessions to understand how industries operate." },
              { title: "Career Development", icon: TrendingUp, desc: "Beyond technical skills, we prepare students with communication, interview preparation, resume building, and professional development." },
              { title: "Industry Certifications", icon: Award, desc: "Receive certifications that showcase your practical knowledge and strengthen your professional profile." },
              { title: "Placement Assistance", icon: Briefcase, desc: "We support students through every stage of their placement journey—from skill development to interview preparation and career guidance." }
            ].map((feature, i) => (
              <Card key={i} className="bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <CardContent className="p-8">
                  <feature.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Who We Serve */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-square max-w-[500px] mx-auto rounded-full bg-gradient-to-tr from-primary/10 to-blue-400/10 flex items-center justify-center p-12">
                <div className="w-full h-full rounded-full border-2 border-dashed border-primary/30 animate-[spin_20s_linear_infinite] absolute" />
                <div className="grid grid-cols-2 gap-4 text-center z-10">
                  {[
                    "Engineering Students", "Diploma Students", "University Students", "Fresh Graduates",
                    "Working Professionals", "Entrepreneurs", "Career Switchers", "Freelancers"
                  ].map((audience, i) => (
                    <div key={i} className="bg-white shadow-sm border border-gray-100 rounded-xl p-3 text-sm font-semibold text-gray-700">
                      {audience}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Who Can Join BITC?</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Whether you are starting your career or looking to upgrade your skills, BITC provides learning opportunities tailored to your goals. Our programs are designed for individuals across various educational and professional backgrounds who are eager to bridge the gap between theory and practice.
              </p>
              <div className="inline-flex items-center gap-2 text-primary font-semibold bg-primary/5 px-6 py-3 rounded-full">
                <GraduationCap className="w-5 h-5" />
                <span>Empowering learners at every stage of their journey</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Our Learning Ecosystem */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="container max-w-[1000px] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">The BITC Learning Journey</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-[1100px] mx-auto text-left">
            {[
              "Meet Industry Experts",
              "Practical Learning",
              "Hands-on Labs",
              "Live Projects",
              "Industry Workshops",
              "Internships",
              "Professional Certification",
              "Placement Assistance",
              "Career Success"
            ].map((step, i) => (
              <div key={i} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border-none hover:shadow-md transition-all duration-300 flex flex-col justify-center relative group overflow-hidden cursor-default">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 shrink-0 rounded-full text-white flex items-center justify-center font-black text-lg shadow-sm bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
                    {i + 1}
                  </div>
                  <h3 className="text-base md:text-[17px] font-bold text-slate-800">{step}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Statistics */}
      <section className="py-16 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { number: "1K+", label: "Students Trained" },
              { number: "10+", label: "Industry Partners" },
              { number: "10+", label: "Expert Mentors" },
              { number: "95%", label: "Placement Support" },
              { number: "50+", label: "Live Projects" },
              { number: "10+", label: "Industry Workshops" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] mb-2">{stat.number}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Core Values & Commitment */}
      <section className="py-16 md:py-24 bg-slate-100 text-slate-900 border-y border-slate-200/80 relative overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Our Core Values</h2>
              <div className="space-y-6">
                {[
                  { title: "Excellence", desc: "Delivering high-quality education with industry relevance.", icon: Trophy },
                  { title: "Innovation", desc: "Encouraging creativity, technology adoption, and problem-solving.", icon: Sparkles },
                  { title: "Integrity", desc: "Building trust through honesty, transparency, and professionalism.", icon: Shield },
                  { title: "Collaboration", desc: "Connecting students, mentors, colleges, and industries for meaningful learning experiences.", icon: Network },
                  { title: "Continuous Learning", desc: "Promoting lifelong learning to adapt to changing technologies and industry demands.", icon: BookOpen }
                ].map((val, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
                      <val.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1 text-slate-900">{val.title}</h4>
                      <p className="text-slate-600 font-medium">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Our Commitment</h2>
              <div className="bg-white border border-slate-200/80 shadow-md rounded-[2rem] p-8 md:p-10">
                <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-medium">
                  <p>
                    At BITC, our commitment extends beyond delivering courses.
                  </p>
                  <p>
                    We strive to build confident professionals who possess technical expertise, practical experience, leadership qualities, and the ability to thrive in a rapidly evolving global workforce.
                  </p>
                  <p>
                    By combining expert mentorship, industry collaboration, and experiential learning, we empower every learner to transform knowledge into meaningful career success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="py-20 bg-white">
        <div className="container max-w-[800px] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Ready to Build Your Future?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Join BITC and experience an education designed around industry, innovation, and career growth.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/courses" className="h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-semibold flex items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 text-lg">
              Explore Programs
            </Link>
            <Link href="/contact" className="h-14 px-8 rounded-full bg-white text-slate-700 font-semibold flex items-center justify-center border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
