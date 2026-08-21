import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, BookOpen, Building2, CheckCircle2, GraduationCap, Users, Briefcase, Star, Search, ChevronLeft, ChevronRight, PlayCircle, Shield, Clock, Award, TrendingUp, Sparkles, Target, Trophy, Monitor, Compass, UserCheck, Network, Code, Medal } from "lucide-react";
import type { Metadata } from "next";
import FeaturedCertifications from "@/components/FeaturedCertifications";
import AcademicPartners from "@/components/AcademicPartners";
import StudentSuccessStories from "@/components/StudentSuccessStories";

export const metadata: Metadata = {
  title: "BIZONANCE Industrial Training Centre. (BITC) | Amravati",
  description: "Accelerate your tech career with BITC. Master Full Stack Development, AI & ML, Data Science, Cyber Security, and UI/UX Design with guaranteed placement support in Amravati.",
  openGraph: {
    title: "BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Accelerate your tech career with BITC. Master Full Stack Development, AI & ML, Data Science, Cyber Security, and UI/UX Design with placement support.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-[15px]">



      {/* 1. Hero Section */}
      <section className="relative w-full bg-white pt-16 lg:pt-24 pb-12 lg:pb-16 overflow-hidden flex items-center justify-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />

        <div className="container max-w-[1300px] mx-auto px-4 flex flex-col lg:flex-row items-center gap-10 lg:gap-12 relative z-10">

          {/* Left Content */}
          <div className="w-full lg:w-[48%] flex flex-col justify-center">
            <h1 className="text-[2.25rem] md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-extrabold tracking-tight mb-5 text-slate-900 leading-[1.2]">
              Learn from Industry Experts. <br className="hidden xl:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 leading-[1.2]">Become an Certified and Industry Ready</span>
            </h1>

            <p className="text-base text-gray-600 mb-6 max-w-[500px] leading-relaxed">
              At BITC, you learn directly from experienced professionals, collaborate on live projects, gain real industry exposure, earn recognized certifications, and build the confidence to launch a successful career.
            </p>

            {/* Goals / Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {["Learn", "Intern", "Certified", "Get a job"].map((goal, i) => (
                <span key={i} className="px-3 py-1 rounded-full border border-gray-100 text-[12px] font-bold text-gray-600 bg-white shadow-sm flex items-center gap-1.5 hover:border-primary/30 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                  {goal}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="#featured-certifications" className="h-12 px-7 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white text-base font-bold flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5">
                Explore Programs <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/contact" className="h-12 px-7 rounded-full bg-gray-100 text-slate-900 text-base font-bold flex items-center justify-center hover:bg-gray-200 transition-all shadow-sm">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Image/Graphic */}
          <div className="w-full lg:w-[52%] relative flex justify-center lg:justify-end mt-10 lg:mt-0">
            <div className="relative w-full max-w-[550px] lg:max-w-full xl:max-w-[650px] aspect-[4/3] lg:aspect-[16/10]">
              {/* Image */}
              <div className="w-full h-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10 bg-gray-50 relative group">
                <img
                  src="/Hero.png"
                  alt="Professional presenting to a team"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 border border-gray-200/50 rounded-[1.5rem] sm:rounded-[2rem] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 2.5. Our Academic Partners */}
      <AcademicPartners />

      {/* 5. Featured Certifications */}
      <section id="featured-certifications" className="py-12 md:py-20 bg-white">
        <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-dark mb-4">Our Certifications</h2>
              <p className="text-gray-500 text-[16px]">Master the skills that top companies are looking for.</p>
            </div>
          </div>

          <FeaturedCertifications />
        </div>
      </section>

      {/* 6. Scholarship Poster */}
      <section className="py-12 md:py-16 bg-white px-4">
        <div className="container max-w-[1200px] mx-auto bg-transparent relative overflow-hidden">


          <div className="relative z-10 px-6 py-16 md:py-20 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-bold mb-6 shadow-sm">
                <Medal className="w-4 h-4 text-orange-500" />
                BITC Scholarship for Students
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                Up to <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">50% Scholarship</span><br />for Deserving Students.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium max-w-xl mx-auto md:mx-0">
                We believe financial constraints should never hold back true talent. Unlock your potential and let us fund your tech career journey.
              </p>

              <Link href="/scholarships" className="inline-flex h-14 items-center justify-center rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] px-8 text-lg font-extrabold text-white shadow-lg hover:shadow-xl hover:scale-105 hover:shadow-orange-500/20 transition-all duration-300">
                Check Eligibility Criteria <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            <div className="hidden md:flex w-full max-w-[500px] items-center justify-center relative">
              <div className="w-full h-[450px] relative z-10 hover:-translate-y-2 transition-transform duration-500">
                <img src="/student-grad-nobg.png" alt="Student in graduation gown" className="w-full h-full object-contain scale-[1.25]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose BITC */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-dark mb-4">Why Choose BITC?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-[16px]">We bridge the gap between academic learning and industry requirements.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              {
                title: "Industry-Focused Curriculum",
                icon: BookOpen,
                desc: "Certifications designed with real industry requirements in mind, ensuring you learn practical skills."
              },
              {
                title: "Learn from Industry Experts",
                icon: Users,
                desc: "Get trained by professionals who bring real-world knowledge into every classroom."
              },
              {
                title: "Hands-on Live Projects",
                icon: Briefcase,
                desc: "Work on real-world case studies to build a strong portfolio and practical experience."
              },
              {
                title: "Internship Opportunities",
                icon: Target,
                desc: "Gain valuable industry exposure through structured internships in real business environments."
              },
              {
                title: "Placement Assistance",
                icon: Trophy,
                desc: "Receive end-to-end placement support including mock interviews and job referrals."
              },
              {
                title: "Industry-Recognized Certifications",
                icon: Award,
                desc: "Earn certificates that validate your skills and make you competitive in the job market."
              },
              {
                title: "Modern Learning Environment",
                icon: Monitor,
                desc: "Learn in well-equipped computer labs with access to the latest software and tools."
              },
              {
                title: "Career-Focused Mentorship",
                icon: Compass,
                desc: "Mentors guide you throughout your learning journey to choose the right career path."
              }
            ].map((feature, i) => (
              <Card key={i} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow group bg-white">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/5 flex items-center justify-center rounded-xl shrink-0 group-hover:bg-primary group-hover:-translate-y-1 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold mb-1.5 leading-tight text-slate-900 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Learning Process */}
      <section className="py-12 md:py-20 bg-primary/5">
        <div className="container max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Learning Process</h2>
            <p className="text-slate-700 font-semibold text-[16px]">Your step-by-step journey from enrollment to placement.</p>
          </div>

          <div className="relative max-w-6xl mx-auto px-4">
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-8 left-16 right-16 h-0.5 bg-primary/20 -z-0" />

            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2 md:gap-0 relative z-10">
              {[
                { title: <>Enroll With <br /> BITC</>, icon: Users },
                { title: "Learn With Industry Experts", icon: BookOpen },
                { title: "Do Multiple Assignments", icon: Code },
                { title: <>Get Internship <br /> Opportunity in BIPL</>, icon: Target },
                { title: "Work on Live Projects", icon: Briefcase },
                { title: <>Get<br /> Certifications</>, icon: Award },
                { title: <>Improve <br /> Soft Skills</>, icon: UserCheck },
                { title: "Placement Guidance", icon: Trophy }
              ].map((step, i, arr) => (
                <div key={i} className="flex flex-col items-center relative w-full md:w-32 group cursor-pointer">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-gray-100 shadow-sm text-primary mb-4 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:scale-110 transition-all duration-300 relative z-10">
                    <step.icon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>

                  <span className="font-normal text-slate-800 text-xs sm:text-[13px] text-center mb-2 md:mb-0 group-hover:text-primary transition-colors">
                    {step.title}
                  </span>

                  {/* Vertical Arrow for Mobile */}
                  {i < arr.length - 1 && (
                    <div className="md:hidden text-gray-300 my-2">
                      <ArrowRight className="w-6 h-6 rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]"></div>
          <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px]"></div>
        </div>

        <div className="container max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              100% <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Placement Assistance</span>
            </h2>
            <p className="text-gray-500 text-[16px] max-w-2xl mx-auto">Our dedicated placement cell ensures you get the right launchpad for your career.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: "10+", label: "Hiring Partners" },
              { stat: "1K+", label: "Students Trained" },
              { stat: "12 LPA", label: "Highest Package" },
              { stat: "95%", label: "Placement Ratio" }
            ].map((item, index) => (
              <div key={index} className="p-8 bg-white rounded-2xl shadow-md border border-slate-200/80 hover:border-primary/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 group">
                <div className="text-4xl md:text-5xl font-black mb-3 transform group-hover:scale-110 transition-transform duration-500">
                  <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
                    {item.stat}
                  </span>
                </div>
                <div className="text-[13px] font-extrabold text-slate-800 uppercase tracking-widest">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Trusted by Colleges & Companies */}
      <section className="py-6 bg-slate-100 text-slate-800 border-y border-slate-200/80 relative overflow-hidden my-2">
        <div className="container max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <p className="text-xs font-extrabold text-slate-600 uppercase tracking-widest whitespace-nowrap">
              Trusted By
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[
              { name: "TCS", logo: "/logos/tcs.svg" },
              { name: "Infosys", logo: "/logos/infosys.svg" },
              { name: "Wipro", logo: "/logos/wipro.svg" },
              { name: "Tech Mahindra", logo: "/logos/tech-mahindra.svg" },
              { name: "HCL", logo: "/logos/hcl.svg" },
              { name: "Cognizant", logo: "/logos/cognizant.svg" }
            ].map((company, i) => (
              <div key={i} className="h-7 md:h-8 flex items-center justify-center grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-full w-auto max-w-[140px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Student Success Stories */}
      <StudentSuccessStories />

    </div>
  );
}
