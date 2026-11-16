import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Rocket,
  Target,
  Network,
  Code,
  Globe,
  CheckCircle2,
  Quote,
  Lightbulb,
  BookOpen,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about the journey, milestones, and history of BIZONANCE Industrial Training Centre (BITC) in Amravati.",
  openGraph: {
    title: "Our Story | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Discover the journey and vision behind BITC.",
  },
};

export default function OurStoryPage() {
  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* 1. Hero Section */}
      <section className="relative w-full lg:min-h-[calc(100vh-80px)] bg-white py-14 sm:py-18 lg:py-24 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1000px] mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center lg:my-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium rounded-full px-4 py-1.5 text-sm mb-4 sm:mb-6">
            <BookOpen className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900 leading-[1.2]">
            Building the Bridge Between <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Education and Industry</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-[900px] mx-auto leading-relaxed mt-4 sm:mt-6">
            Every great Training Center begins with a vision. BITC was founded to transform the way students learn by connecting academic knowledge with real industry experience, ensuring every learner is prepared for the opportunities of tomorrow.
          </p>
        </div>
      </section>

      {/* 2. Our Beginning */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="relative order-2 lg:order-1">
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative">
                  <img
                    src="/our-story-team.jpg"
                    alt="Our Beginning"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 mt-0 leading-tight">Where it all <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Started</span></h2>
                <div className="space-y-4 text-gray-600 leading-relaxed text-base md:text-lg">
                  <p>
                    In today&apos;s rapidly evolving world, industries require professionals who possess more than academic knowledge. Employers seek individuals with practical skills, problem-solving abilities, industry exposure, and the confidence to perform from day one.
                  </p>
                  <p>
                    Unfortunately, many students graduate with strong theoretical knowledge but limited practical experience. This gap between education and industry inspired the creation of <strong>BIZONANCE Industrial Training Centre (BITC)</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission Card Component (Shown below "Where it all Started") */}
            <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 text-center shadow-sm">
                <p className="text-sm sm:text-base text-slate-600 font-medium mb-3">
                  Backed by <strong className="text-slate-900 font-semibold">BIZONANCE INDIA PVT. LTD.</strong>, BITC was established with a single mission:
                </p>
                <blockquote className="text-slate-800 text-base sm:text-lg md:text-xl font-medium italic leading-relaxed max-w-3xl mx-auto">
                  &ldquo;To bridge the gap between education and employment by providing practical,<br className="hidden sm:inline" /> industry-integrated learning experiences.&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
      </section>

      {/* 3. The Challenge & Why BITC Was Created */}
      <section className="py-16 md:py-24 bg-white text-slate-900 relative overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Challenge we <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Identified</span></h2>
              <p className="text-slate-600 max-w-[700px] mx-auto text-lg">
                Traditional education often leaves students asking difficult questions about their future.
              </p>
            </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
                {[
                  "How do I apply what I've learned?",
                  "What skills do companies actually expect?",
                  "How do I gain experience before getting my first job?"
                ].map((q, i) => (
                  <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-md transition-all">
                    <Lightbulb className="w-10 h-10 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-800">"{q}"</p>
                  </div>
                ))}
              </div>

                <div className="mt-16 md:mt-24 pt-8 md:pt-12 max-w-[1000px] mx-auto">
                  <div className="text-center mb-10">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Transforming Learning Into <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Experience</span></h3>
                    <p className="text-slate-600 text-base md:text-[17px] max-w-[950px] mx-auto leading-relaxed">
                      BITC was created to answer these questions by bringing students closer to the industry through hands-on learning<br className="hidden md:inline" /> and expert mentorship. We believe students shouldn&apos;t wait until their first job to experience the professional world.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "Learn from Industry Experts", "Build live projects",
                      "Work with Modern Technologies", "Participate in Workshops",
                      "Gain internship experience", "Build professional networks",
                      "Develop career skills", "Become industry ready"
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center text-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60 hover:border-primary/50 transition-colors">
                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                        <span className="text-sm text-slate-700 font-semibold">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Journey Timeline - Single Screen Horizontal Process Grid */}
            <section className="py-14 md:py-20 bg-white relative overflow-hidden">
              <div className="container max-w-[1350px] mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50/70 border border-orange-100 text-orange-500 text-xs font-medium uppercase tracking-wider mb-3">
                    <Rocket className="w-3.5 h-3.5 text-orange-400" />
                    Our Evolution
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    Milestones That Shaped <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Our Journey</span>
                  </h2>
                  <p className="text-slate-600 max-w-[600px] mx-auto text-sm md:text-base leading-relaxed font-medium">
                    A 5-step evolution from vision to empowering thousands of job-ready professionals across India.
                  </p>
                </div>

                {/* Single-Screen Horizontal Cards Layout */}
                <div className="relative">
                  {/* Horizontal Connecting Line on Large Screens */}
                  <div className="hidden lg:block absolute top-[48px] left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-blue-500 z-0 opacity-40" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 relative z-10">
                    {[
                      {
                        num: "01",
                        title: "Foundation",
                        icon: Rocket,
                        desc: "Established as the industrial training division of BIZONANCE INDIA PVT. LTD.",
                        iconGlow: "from-amber-400 to-orange-500",
                        tag: "Est. Vision",
                      },
                      {
                        num: "02",
                        title: "Industry Curriculum",
                        icon: Target,
                        desc: "Co-designed practical training modules aligned with real employer demands.",
                        iconGlow: "from-orange-500 to-amber-500",
                        tag: "Hands-on Focus",
                      },
                      {
                        num: "03",
                        title: "Expert Network",
                        icon: Network,
                        desc: "Connected senior tech leaders directly with learners for 1-on-1 mentorship.",
                        iconGlow: "from-blue-500 to-indigo-600",
                        tag: "1-on-1 Mentors",
                      },
                      {
                        num: "04",
                        title: "Live Projects",
                        icon: Code,
                        desc: "Integrated real client codebases, production apps, and internship training.",
                        iconGlow: "from-emerald-500 to-teal-600",
                        tag: "Real client apps",
                      },
                      {
                        num: "05",
                        title: "Nationwide Expansion",
                        icon: Globe,
                        desc: "Expanding MoU partnerships with top colleges, certifications, and placement drives.",
                        iconGlow: "from-purple-500 to-indigo-500",
                        tag: "10+ MoUs",
                      },
                    ].map((milestone, i) => (
                      <Card
                        key={i}
                        className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group bg-white flex flex-col items-center text-center p-5 h-full hover:-translate-y-2 rounded-2xl relative overflow-hidden"
                      >
                        {/* Icon Box */}
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 mb-4 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300">
                          <milestone.icon className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors">
                          {milestone.title}
                        </h3>
                        <p className="text-[12.5px] text-slate-600 leading-relaxed mb-4 flex-1">
                          {milestone.desc}
                        </p>

                        {/* Bottom Tag */}
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-50 text-[11px] font-medium text-slate-500 border border-slate-100 mt-auto">
                          {milestone.tag}
                        </span>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 5. The Problem We Solve & Our Belief */}
            <section className="py-16 md:py-24 bg-white">
              <div className="container max-w-[1200px] mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-8">
                  <Card className="bg-white border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                        <Target className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">The Problem we <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Solve</span></h3>
                      <p className="text-gray-600 mb-6 font-medium text-base">Education Alone Isn't Enough. Today's employers expect professionals who can:</p>
                      <ul className="space-y-4">
                        {[
                          "Solve real problems", "Communicate Effectively",
                          "Work in Teams", "Adapt Quickly",
                          "Use modern technologies", "Think Critically"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-8 text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                        BITC develops these skills through experiential learning.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-amber-50 border border-amber-200/80 shadow-md">
                    <CardContent className="p-10 h-full flex flex-col justify-center text-center relative overflow-hidden">
                      <Quote className="w-12 h-12 text-orange-500/40 mx-auto mb-6 relative z-10" />
                      <h3 className="text-2xl font-bold mb-6 text-slate-900 relative z-10">Our <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Belief</span></h3>
                      <p className="text-lg text-slate-700 leading-relaxed italic relative z-10 font-medium">
                        "Every student deserves the opportunity to learn from experienced professionals, gain practical exposure, and build a successful career—regardless of their background."
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <Globe className="w-7 h-7 text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Inspired By <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Industry</span></h3>
                      <p className="text-gray-600 mb-6 font-medium text-base">We continuously study the market to ensure our training remains relevant and future-focused:</p>
                      <ul className="space-y-4">
                        {[
                          "Emerging Technologies",
                          "Hiring Trends",
                          "Employer Expectations",
                          "Industry best practices"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-700">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                            <span className="font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* 6. Today & Tomorrow */}
            <section className="py-16 md:py-24 bg-white">
              <div className="container max-w-[1200px] mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                  {/* Today */}
                  <div className="bg-gray-50 p-8 md:p-12 rounded-[2rem] border border-gray-100">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-medium rounded-full text-sm uppercase tracking-wider mb-6">Today</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Who we are <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Today</span></h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      Today, BITC is growing into an industry-integrated learning ecosystem where students, professionals, colleges, and companies collaborate to create meaningful learning experiences.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      We continue to strengthen our programs through innovation, technology, and industry collaboration.
                    </p>
                  </div>

                  {/* Tomorrow */}
                  <div className="bg-blue-50 p-8 md:p-12 rounded-[2rem] border border-blue-100">
                    <div className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-700 font-medium rounded-full text-sm uppercase tracking-wider mb-6">Tomorrow</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Looking <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Ahead</span></h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-10">
                      Our vision extends beyond training. We aim to become one of India's most trusted Training Centers for practical learning, industry mentorship, career development, and professional excellence.
                    </p>

                    <h4 className="text-lg font-medium text-gray-600 mb-6">Future initiatives <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">include:</span></h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        "AI-Powered Learning", "International Certifications",
                        "Startup Incubation", "Innovation Labs",
                        "Research Certifications", "Global industry partnerships",
                        "Entrepreneurship Development", "Digital learning platform"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-100/50 shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. The BITC Philosophy Card */}
            <section className="py-16 md:py-20 bg-white relative overflow-hidden">
              <div className="container max-w-[1100px] mx-auto px-4 relative z-10">
                <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-50 via-white to-amber-50/25 border border-slate-200/80 p-8 sm:p-12 md:p-16 text-center shadow-lg shadow-slate-100/60 overflow-hidden">
                  {/* Ambient background glows */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-400/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/10 via-amber-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/15 relative z-10">
                    <Quote className="w-7 h-7" />
                  </div>

                  <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-slate-900 leading-snug tracking-normal max-w-[850px] mx-auto relative z-10">
                    "Education Provides Knowledge, Experience Builds Confidence, Industry Creates Professionals,{" "}
                    <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
                      BITC Brings Them Together,
                    </span>"
                  </blockquote>

                  <div className="inline-flex items-center gap-3 mt-8 relative z-10">
                    <span className="h-px w-8 bg-slate-300" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      The BITC Philosophy
                    </span>
                    <span className="h-px w-8 bg-slate-300" />
                  </div>
                </div>
              </div>
            </section>

            {/* 8. Call To Action */}
            <section className="py-16 md:py-24 bg-white text-slate-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
              <div className="container max-w-[850px] mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Be Part of Our{" "}
                  <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
                    Journey
                  </span>
                </h2>
                <p className="text-base md:text-lg text-slate-600 mb-10 max-w-[620px] mx-auto font-normal leading-relaxed">
                  Whether you're beginning your career, upgrading your skills, or preparing for the future, BITC is here to help you take the next step.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/certifications"
                    className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 font-normal flex items-center justify-center gap-2 hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 text-base md:text-lg"
                  >
                    Explore Certifications <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-white text-slate-600 font-normal flex items-center justify-center border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-base md:text-lg shadow-sm"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </section>

          </div>
          );
}
