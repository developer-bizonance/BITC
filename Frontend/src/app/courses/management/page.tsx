import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp, PieChart, Landmark, Users, IndianRupee,
  GraduationCap, Clock, CheckCircle2, ArrowRight, Sparkles,
  LineChart, Target, Briefcase, BarChart, Award, Star
} from "lucide-react";

export const metadata: Metadata = {
  title: "Management & Business Courses",
  description: "Accelerate your career with Digital Marketing, Business Analytics, Project Management, and Financial Tech courses at BITC Amravati.",
  openGraph: {
    title: "Management & Business Courses | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Business & Management certification courses for ambitious professionals.",
  },
};

const managementCourses = [
  {
    id: "digital-marketing",
    title: "Digital Marketing & Growth",
    tag: "Marketing & Growth",
    duration: "3 Months",
    fees: "₹20,000",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    desc: "Master SEO, social media marketing, Google Ads, content strategy, and analytics to drive business growth online.",
    highlights: ["SEO & SEM Strategies", "Social Media Marketing", "Google Ads & Analytics", "Content & Email Marketing"],
    popular: true,
  },
  {
    id: "business-analytics",
    title: "Business Analytics & BI",
    tag: "Data & Strategy",
    duration: "6 Months",
    fees: "₹30,000",
    icon: PieChart,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    desc: "Turn data into business decisions. Learn data analysis, visualization, and strategic insights for modern enterprises.",
    highlights: ["Data Analysis & Reporting", "Excel & SQL for Business", "Power BI / Tableau", "Predictive Analytics"],
    popular: true,
  },
  {
    id: "finance",
    title: "Corporate Finance & FinTech",
    tag: "Banking & Finance",
    duration: "6 Months",
    fees: "₹25,000",
    icon: Landmark,
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
    desc: "Build expertise in financial planning, accounting, investment analysis, and corporate finance management.",
    highlights: ["Financial Planning & Analysis", "Accounting Fundamentals", "Investment & Portfolio Mgmt", "Corporate Finance"],
  },
  {
    id: "hr",
    title: "Human Resources (HR) & Ops",
    tag: "HR & People",
    duration: "3 Months",
    fees: "₹20,000",
    icon: Users,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
    desc: "Learn modern HR practices — from talent acquisition and employee engagement to payroll and compliance.",
    highlights: ["Talent Acquisition", "Employee Engagement", "Payroll & Compliance", "HR Analytics"],
  },
  {
    id: "sales",
    title: "Sales & Account Management",
    tag: "Sales & Revenue",
    duration: "3 Months",
    fees: "₹18,000",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    desc: "Develop winning sales strategies, negotiation skills, CRM management, and customer relationship expertise.",
    highlights: ["Sales Strategy & Planning", "CRM & Lead Management", "Negotiation Skills", "Customer Relationship Mgmt"],
  },
];

export const dynamic = 'force-dynamic';

export default async function ManagementCoursesPage() {
  let dynamicCourses = [];
  try {
    const res = await fetch("http://localhost:5000/api/certifications?category=Management", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      dynamicCourses = data.certifications || [];
    }
  } catch (error) {
    console.error("Failed to fetch Management courses:", error);
  }

  const coursesToRender = dynamicCourses.map((c: any) => {
    const localMatch = managementCourses.find(
      (lc) => lc.title.toLowerCase().includes(c.title.toLowerCase()) || c.title.toLowerCase().includes(lc.title.toLowerCase())
    );

    return {
      id: localMatch?.id || c.title.toLowerCase().replace(/ & /g, '-').replace(/[\/\s]+/g, '-'),
      title: c.title,
      tag: c.category || "Management",
      duration: c.duration || "6 Months",
      fees: c.fees || "₹30,000",
      icon: localMatch?.icon || Briefcase,
      image: (c.image && (c.image.startsWith('http') || c.image.startsWith('/'))) ? c.image : (localMatch?.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"),
      desc: localMatch?.desc || "Equip yourself with practical business acumen, leadership skills, and strategic thinking.",
      highlights: localMatch?.highlights || ["Industry Case Studies", "Corporate Mentors", "Live Ad Spend & Tools", "Placement Leadership"],
    };
  });

  const finalCourses = coursesToRender.length > 0 ? coursesToRender : managementCourses;

  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* Hero Banner */}
      <section className="relative w-full flex flex-col items-center justify-center bg-white py-12 md:py-16 lg:py-20 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1360px] mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs md:text-sm font-bold mb-6">
              <Briefcase className="w-4 h-4" />
              <span>BUSINESS & MANAGEMENT</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Management Courses & <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Certifications</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 font-medium max-w-2xl mx-auto">
              Equip yourself with practical business acumen, leadership skills, and strategic thinking to fast-track your corporate growth.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>5 Business Tracks</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Industry Case Studies</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-semibold bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Corporate Mentors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-14 md:py-20 bg-slate-50/70">
        <div className="container max-w-[1360px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Explore Management Programs</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base">
              Practical management certifications designed to elevate your professional trajectory.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {finalCourses.map((course: any) => (
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
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center leading-snug mb-1">
                      {course.title}
                    </h3>

                    {/* AI Badge */}
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        Integrated with AI Tools
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                      {course.desc}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1.5 mb-3">
                      {course.highlights.map((item: any, j: number) => (
                        <div key={j} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="line-clamp-1">Free certification opportunity at Bizonance</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Pricing & CTA */}
                  <div className="mt-auto pt-2.5 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
                        <span>Fees: <strong className="text-blue-600 font-extrabold">{course.fees}</strong></span>
                      </div>
                    </div>

                    <Link href={`/courses/${course.id}`} className="block w-full">
                      <Button className="w-full h-10 rounded-xl bg-slate-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center gap-2 group/btn">
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

      {/* Why Management at BITC */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-[1360px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Why Study Management at BITC?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base">
              Learn business execution, data-backed decision making, and leadership from corporate executives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Real Business Cases", desc: "Analyze actual market cases from Fortune 500 companies and startups.", icon: Briefcase },
              { title: "Executive Mentors", desc: "Get mentored by seasoned executives, marketing heads, and founders.", icon: GraduationCap },
              { title: "Live Ad Spend & Tools", desc: "Manage real budgets on Meta, Google, CRM, and analytics platforms.", icon: Target },
              { title: "Placement Leadership", desc: "Fast-track your entry into management and high-growth commercial roles.", icon: ArrowRight },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-13 h-13 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-blue-600">
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
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Advance Your Business Career</h2>
          <p className="text-base md:text-lg text-slate-600 mb-8 font-medium">
            Gain high-impact business competencies that set you apart in the corporate world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="h-13 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-bold flex items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 text-base">
              Enroll in Management Track
            </Link>
            <Link href="/contact" className="h-13 px-8 rounded-full bg-white text-slate-700 font-bold flex items-center justify-center border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-base shadow-xs">
              Download Brochure
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
