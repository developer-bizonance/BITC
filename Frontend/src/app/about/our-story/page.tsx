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
  Lightbulb
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
      <section className="relative w-full min-h-[calc(100vh-80px)] bg-white py-16 lg:py-24 overflow-hidden flex flex-col items-center justify-center border-b border-gray-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1000px] mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center my-auto">
          <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Our Story</h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Building the Bridge Between <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Education and Industry</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-[1.4rem] text-gray-600 max-w-[900px] mx-auto leading-relaxed mt-6">
            Every great Training Center begins with a vision. BITC was founded to transform the way students learn by connecting academic knowledge with real industry experience, ensuring every learner is prepared for the opportunities of tomorrow.
          </p>
        </div>
      </section>

      {/* 2. Our Beginning */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1170&auto=format&fit=crop" 
                  alt="Our Beginning" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Where It All Started</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-base md:text-lg">
                <p>
                  In today's rapidly evolving world, industries require professionals who possess more than academic knowledge. Employers seek individuals with practical skills, problem-solving abilities, industry exposure, and the confidence to perform from day one.
                </p>
                <p>
                  Unfortunately, many students graduate with strong theoretical knowledge but limited practical experience. This gap between education and industry inspired the creation of <strong>BIZONANCE Industrial Training Centre (BITC)</strong>.
                </p>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mt-8 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                  <p className="text-slate-900 font-semibold mb-3">Backed by BIZONANCE INDIA PVT. LTD., BITC was established with a single mission:</p>
                  <p className="text-primary font-bold italic text-xl">
                    "To bridge the gap between education and employment by providing practical, industry-integrated learning experiences."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Challenge & Why BITC Was Created */}
      <section className="py-16 md:py-24 bg-slate-100 text-slate-900 border-y border-slate-200/80 relative overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Challenge We Identified</h2>
            <p className="text-slate-600 max-w-[700px] mx-auto text-lg">
              Traditional education often leaves students asking difficult questions about their future.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-20 max-w-[1000px] mx-auto">
            {[
              "How do I apply what I've learned?",
              "What skills do companies actually expect?",
              "How do I gain experience before getting my first job?"
            ].map((q, i) => (
              <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-md transition-all">
                <Lightbulb className="w-10 h-10 text-primary mx-auto mb-4" />
                <p className="text-lg font-bold text-slate-800">"{q}"</p>
              </div>
            ))}
          </div>

          <div className="max-w-[900px] mx-auto bg-white border border-slate-200/80 rounded-[2rem] p-8 md:p-12 shadow-xl">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Transforming Learning into Experience</h3>
              <p className="text-slate-600 text-lg">
                BITC was created to answer these questions by bringing students closer to the industry through hands-on learning and expert mentorship. We believe students shouldn't wait until their first job to experience the professional world.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Learn from Industry Experts", "Build Live Projects", 
                "Work with Modern Technologies", "Participate in Workshops",
                "Gain Internship Experience", "Build Professional Networks",
                "Develop Career Skills", "Become Industry Ready"
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
      <section className="py-14 md:py-20 bg-slate-50 relative overflow-hidden border-t border-b border-slate-200/60">
        <div className="container max-w-[1350px] mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
              <Rocket className="w-3.5 h-3.5 text-orange-500" />
              Our Evolution
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
              Milestones That Shaped <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Our Journey</span>
            </h2>
            <p className="text-slate-600 max-w-[600px] mx-auto text-sm md:text-base leading-relaxed font-medium">
              A 5-step evolution from vision to empowering thousands of job-ready professionals across India.
            </p>
          </div>

          {/* Single-Screen Horizontal Cards Layout */}
          <div className="relative">
            {/* Horizontal Connecting Line on Large Screens */}
            <div className="hidden lg:block absolute top-[72px] left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-blue-500 z-0 opacity-40" />

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
                  tag: "Real Client Apps",
                },
                {
                  num: "05",
                  title: "Nationwide Expansion",
                  icon: Globe,
                  desc: "Expanding MoU partnerships with top colleges, certifications, and placement drives.",
                  iconGlow: "from-purple-500 to-indigo-500",
                  tag: "500+ MoUs",
                },
              ].map((milestone, i) => (
                <Card
                  key={i}
                  className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group bg-white flex flex-col items-center text-center p-5 h-full hover:-translate-y-2 rounded-2xl relative overflow-hidden"
                >
                  {/* Step Number Pill */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-100 text-slate-700 border border-slate-200/80 mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    STEP {milestone.num}
                  </div>

                  {/* Icon Box */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${milestone.iconGlow} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <milestone.icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-black text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors">
                    {milestone.title}
                  </h3>
                  <p className="text-[12.5px] text-slate-600 leading-relaxed font-medium mb-4 flex-1">
                    {milestone.desc}
                  </p>

                  {/* Bottom Tag */}
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-50 text-[11px] font-bold text-slate-500 border border-slate-100 mt-auto">
                    {milestone.tag}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. The Problem We Solve & Our Belief */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="bg-white border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">The Problem We Solve</h3>
                <p className="text-gray-600 mb-6 font-medium text-base">Education Alone Isn't Enough. Today's employers expect professionals who can:</p>
                <ul className="space-y-4">
                  {[
                    "Solve Real Problems", "Communicate Effectively", 
                    "Work in Teams", "Adapt Quickly", 
                    "Use Modern Technologies", "Think Critically"
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
                <h3 className="text-2xl font-bold mb-6 text-slate-900 relative z-10">Our Belief</h3>
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
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Inspired by Industry</h3>
                <p className="text-gray-600 mb-6 font-medium text-base">We continuously study the market to ensure our training remains relevant and future-focused:</p>
                <ul className="space-y-4">
                  {[
                    "Emerging Technologies", 
                    "Hiring Trends", 
                    "Employer Expectations", 
                    "Industry Best Practices"
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
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-bold rounded-full text-sm uppercase tracking-wider mb-6">Today</div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Who We Are Today</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Today, BITC is growing into an industry-integrated learning ecosystem where students, professionals, colleges, and companies collaborate to create meaningful learning experiences.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We continue to strengthen our programs through innovation, technology, and industry collaboration.
              </p>
            </div>
            
            {/* Tomorrow */}
            <div className="bg-blue-50 p-8 md:p-12 rounded-[2rem] border border-blue-100">
              <div className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-700 font-bold rounded-full text-sm uppercase tracking-wider mb-6">Tomorrow</div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Looking Ahead</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                Our vision extends beyond training. We aim to become one of India's most trusted Training Centers for practical learning, industry mentorship, career development, and professional excellence.
              </p>
              
              <h4 className="text-lg font-bold text-slate-900 mb-6">Future initiatives include:</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "AI-Powered Learning", "International Certifications",
                  "Startup Incubation", "Innovation Labs",
                  "Research Programs", "Global Industry Partnerships",
                  "Entrepreneurship Development", "Digital Learning Platform"
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

      {/* 7. Inspirational Quote & CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[900px] mx-auto px-4 text-center relative z-10">
          <Quote className="w-9 h-9 text-primary mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug mb-6 tracking-tight max-w-[900px] mx-auto">
            "Education provides knowledge. Experience builds confidence. Industry creates professionals.{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
              BITC brings them together.
            </span>"
          </h2>
          
          <div className="w-16 h-1 bg-slate-300/80 mx-auto mb-6 rounded-full" />
          
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Be Part of Our Journey</h3>
          <p className="text-base text-slate-600 mb-6 max-w-[550px] mx-auto font-medium">
            Whether you're beginning your career, upgrading your skills, or preparing for the future, BITC is here to help you take the next step.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/courses" className="h-11 px-6 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-semibold flex items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-md shadow-primary/25 hover:shadow-lg text-base">
              Explore Programs
            </Link>
            <Link href="/contact" className="h-11 px-6 rounded-full bg-white/80 text-slate-700 font-semibold flex items-center justify-center border border-blue-200/80 hover:border-blue-300 hover:bg-white transition-all text-base shadow-sm backdrop-blur-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
