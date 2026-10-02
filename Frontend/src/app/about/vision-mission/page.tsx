import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe,
  Handshake,
  Lightbulb,
  Rocket,
  Users,
  Code,
  Building2,
  Award,
  Briefcase,
  Sprout,
  Trophy,
  Shield,
  Sparkles,
  Network,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Quote,
  ArrowDown,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Vision & Mission",
  description: "Explore the core vision, mission, and values driving BIZONANCE Industrial Training Centre (BITC).",
  openGraph: {
    title: "Vision & Mission | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Our core vision and mission to empower tech talent.",
  },
};

export default function VisionMissionPage() {
  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* ── 1. HERO ── */}
      <section className="relative w-full min-h-[calc(100vh-80px)] bg-white py-20 lg:py-28 overflow-hidden flex flex-col items-center justify-center">
        {/* Background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none" />

        <div className="container max-w-[1000px] mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium rounded-full px-5 py-2 text-sm uppercase tracking-widest mb-8">
            <Target className="w-4 h-4" />
            Vision &amp; Mission
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 leading-[1.2]">
            Driven By Purpose. <br className="hidden sm:block" />
            Inspired By Innovation. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Focused On Your Future.</span>
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-[900px] mx-auto leading-relaxed">
            At <strong>BIZONANCE Industrial Training Centre (BITC)</strong>, our vision and mission guide every program, partnership, and learning experience. We are committed to creating professionals who are ready to thrive in the ever-changing world of industry.
          </p>

          {/* Scroll hint */}
          <div className="mt-8 animate-bounce">
            <ArrowDown className="w-6 h-6 text-gray-400 mx-auto" />
          </div>
        </div>
      </section>

      {/* ── 2. OUR VISION ── */}
      <section className="py-24 bg-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">Our Vision</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
            Empowering the Next Generation of <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Industry Leaders</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed font-medium">
            We strive to create a world where every learner is equipped with the practical skills, industry knowledge, and confidence to achieve their highest career potential and drive innovation in the modern workforce.
          </p>
        </div>
      </section>

      {/* ── 3. OUR MISSION ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Left text block */}
            <div className="lg:col-span-2 lg:sticky lg:top-28">
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Our Mission</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Empowering Careers Through <span className="text-primary">Expert-led</span> Learning
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our mission is to provide practical, industry-oriented education that enables students and professionals to build successful careers through expert mentorship, hands-on learning, internships, and career-focused development.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We are committed to creating an environment where learning extends beyond classrooms and every learner gains the confidence to excel in the professional world.
              </p>
            </div>

            {/* Right — Mission cards */}
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
              {[
                { title: "Learn from Industry Experts", icon: Users, desc: "Connect learners with experienced professionals who share real-world knowledge and practical insights." },
                { title: "Practical Learning", icon: Code, desc: "Deliver hands-on training through live projects, case studies, workshops, and modern technologies." },
                { title: "Industry Exposure", icon: Building2, desc: "Provide opportunities for internships, industrial visits, expert talks, and networking experiences." },
                { title: "Professional Certifications", icon: Award, desc: "Offer industry-relevant certifications that validate skills and enhance career opportunities." },
                { title: "Career Development", icon: Briefcase, desc: "Support learners with resume building, interview preparation, communication skills, and placement assistance." },
                { title: "Lifelong Learning", icon: Sprout, desc: "Encourage continuous upskilling to adapt to evolving technologies and industry demands." },
              ].map((item, i) => (
                <Card key={i} className="border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CORE VALUES ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">What we stand for</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">The Values That Define <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">BITC</span></h2>
            <p className="text-gray-600 max-w-[600px] mx-auto text-lg">Six principles that shape every decision, program, and outcome.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Excellence", icon: Trophy, desc: "We strive for the highest standards in education, training, and professional development.", color: "bg-amber-500/10 text-amber-600" },
              { title: "Integrity", icon: Shield, desc: "We believe trust, honesty, and ethical practices are the foundation of meaningful education.", color: "bg-blue-500/10 text-blue-600" },
              { title: "Innovation", icon: Sparkles, desc: "We embrace new ideas, emerging technologies, and creative thinking to inspire future professionals.", color: "bg-purple-500/10 text-purple-600" },
              { title: "Collaboration", icon: Network, desc: "We believe learning becomes stronger when students, mentors, colleges, and industries work together.", color: "bg-green-500/10 text-green-600" },
              { title: "Practical Learning", icon: BookOpen, desc: "We focus on experiential education that prepares learners for real workplace challenges.", color: "bg-red-500/10 text-red-600" },
              { title: "Student Success", icon: GraduationCap, desc: "Every decision we make is guided by one objective: Helping our learners build successful careers.", color: "bg-primary/10 text-primary" },
            ].map((val, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-[0.06] rounded-full bg-current pointer-events-none" style={{ color: val.color.split(" ")[1]?.replace("text-", "") }} />
                <div className={`w-14 h-14 rounded-2xl ${val.color.split(" ")[0]} flex items-center justify-center mb-5`}>
                  <val.icon className={`w-7 h-7 ${val.color.split(" ")[1]}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. EDUCATIONAL PHILOSOPHY ── */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-white">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="text-center mb-20 md:mb-28">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-slate-700 font-bold rounded-full px-5 py-2 text-sm uppercase tracking-widest mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Our Philosophy
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Learn. Experience. <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Grow.</span>
            </h2>
            <p className="text-gray-600 max-w-[700px] mx-auto text-lg md:text-xl leading-relaxed">
              Education shouldn't stop at knowledge. At BITC, every learner goes through a structured, three-step professional journey to ensure true career readiness.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-14 left-[15%] right-[15%] h-1 bg-gray-200 z-0 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 w-full animate-pulse" />
            </div>

            {/* 1. Learn */}
            <div className="group relative z-10 bg-slate-50 rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-16 h-16 mx-auto rounded-2xl bg-white border-2 border-blue-100 shadow-md flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <BookOpen className="w-8 h-8 text-blue-600 relative z-10" />
              </div>
              
              <div className="text-center mb-8 relative z-10">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs mb-3 shadow-md">1</div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Learn</h3>
                <p className="text-gray-500 font-medium text-sm">Build a strong foundation</p>
              </div>
              
              <ul className="space-y-3 relative z-10 mt-auto">
                {[
                  { text: "Learn from Experts", icon: Users },
                  { text: "Understand Industry", icon: Building2 },
                  { text: "Practice Skills", icon: Code }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white group-hover:bg-blue-50/50 transition-all duration-300 p-3 rounded-xl border border-gray-100 group-hover:border-blue-100 group-hover:shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                      <item.icon className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="font-semibold text-slate-700 text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Experience */}
            <div className="group relative z-10 bg-slate-50 rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-16 h-16 mx-auto rounded-2xl bg-white border-2 border-purple-100 shadow-md flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Rocket className="w-8 h-8 text-purple-600 relative z-10" />
              </div>
              
              <div className="text-center mb-8 relative z-10">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs mb-3 shadow-md">2</div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">Experience</h3>
                <p className="text-gray-500 font-medium text-sm">Apply your knowledge</p>
              </div>
              
              <ul className="space-y-3 relative z-10 mt-auto">
                {[
                  { text: "Build live projects", icon: Lightbulb },
                  { text: "Gain internship experience", icon: Briefcase }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white group-hover:bg-purple-50/50 transition-all duration-300 p-3 rounded-xl border border-gray-100 group-hover:border-purple-100 group-hover:shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors duration-300">
                      <item.icon className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="font-semibold text-slate-700 text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Grow */}
            <div className="group relative z-10 bg-slate-50 rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xl hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-16 h-16 mx-auto rounded-2xl bg-white border-2 border-green-100 shadow-md flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <TrendingUp className="w-8 h-8 text-green-600 relative z-10" />
              </div>
              
              <div className="text-center mb-8 relative z-10">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white font-bold text-xs mb-3 shadow-md">3</div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">Grow</h3>
                <p className="text-gray-500 font-medium text-sm">Achieve career success</p>
              </div>
              
              <ul className="space-y-3 relative z-10 mt-auto">
                {[
                  { text: "Earn Certification", icon: Award },
                  { text: "Develop professional skills", icon: Sparkles },
                  { text: "Launch a Successful Career", icon: Target }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white group-hover:bg-green-50/50 transition-all duration-300 p-3 rounded-xl border border-gray-100 group-hover:border-green-100 group-hover:shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors duration-300">
                      <item.icon className="w-4 h-4 text-green-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="font-semibold text-slate-700 text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. OUR COMMITMENT — Promise List ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Our Promise</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Our Commitment to Every <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Learner</span></h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-10">
                When you join BITC, we promise to provide an end-to-end learning experience that goes far beyond theory.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Learning from Industry Experts",
                  "Practical skill development",
                  "Hands-on Project Experience",
                  "Internship Opportunities",
                  "Career Mentorship",
                  "Industry Exposure",
                  "Professional Certifications",
                  "Placement Support",
                  "Continuous Growth",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Goals */}
            <div className="bg-white text-slate-900 border border-slate-200/80 rounded-[2rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Long-Term Goals</p>
                <h3 className="text-2xl md:text-3xl font-extrabold mb-8 text-slate-900">Our Strategic <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Goals</span></h3>
                <p className="text-slate-600 mb-8 font-medium">By empowering learners, we aim to:</p>
                <ul className="space-y-5">
                  {[
                    "Reduce the gap between education and employment",
                    "Promote practical and experiential learning",
                    "Develop globally competitive professionals",
                    "Encourage innovation and entrepreneurship",
                    "Build long-term industry partnerships",
                    "Create future-ready leaders",
                  ].map((goal, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-slate-700 font-semibold">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. PREPARING LEARNERS FOR TOMORROW ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container max-w-[1000px] mx-auto px-4 text-center">
          <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Why it matters</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Preparing Learners for <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Tomorrow</span></h2>
          <p className="text-gray-600 text-xl leading-relaxed max-w-[750px] mx-auto">
            The future belongs to professionals who continuously learn, adapt, and innovate. BITC is committed to creating an environment where education, technology, and industry come together to shape successful careers and lifelong learners.
          </p>
        </div>
      </section>


    </div>
  );
}
