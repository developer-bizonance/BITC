import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users, Building2, Briefcase, Award, GraduationCap, BarChart3, ChevronRight, CheckCircle2, DollarSign, Target, Cloud, ShoppingCart, Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Placement Statistics & Records",
  description: "View BITC Amravati placement statistics, highest package, average package, and hiring partner recruitment numbers.",
  openGraph: {
    title: "Placement Statistics & Records | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Our 100% placement record, salary packages, and career statistics.",
  },
};

export default function PlacementStatisticsPage() {
  return (
    <div className="flex flex-col min-h-screen text-[15px] bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full lg:min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 sm:py-14 md:py-12 bg-white overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center flex flex-col items-center justify-center h-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Placement Report</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.2]">
            Our Placement <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Statistics</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-[700px] mx-auto leading-relaxed font-normal">
            A testament to our commitment to excellence. Discover how BITC students are securing top roles at leading global organizations with industry-best compensation packages.
          </p>
        </div>
      </section>

      {/* 2. Key Highlights */}
      <section className="py-10 sm:py-12 md:py-16 bg-white relative">
        <div className="container max-w-[1100px] mx-auto px-4 relative z-10">
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

      {/* 3. Industry Wise Placements */}
      <section className="py-4 md:py-6 lg:py-8 bg-white relative">
        <div className="container max-w-[1150px] mx-auto px-4">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
              
              {/* Left Column: Compact code-developed industry breakdown */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-0.5 bg-amber-500 rounded-full" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Career Outcomes
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-[32px] font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">
                  Industry-wise{" "}
                  <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
                    Breakdown
                  </span>
                </h2>

                <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed mb-3 font-normal">
                  Our graduates find success across a diverse range of industries, reflecting the versatile and comprehensive nature of our curriculum. The IT &amp; Software sector continues to be the largest recruiter, followed closely by Cloud Computing and Consulting.
                </p>

                <div className="space-y-1.5">
                  {[
                    {
                      name: "IT / Software",
                      percent: 45,
                      color: "bg-[#2563eb]",
                      badgeBg: "bg-[#2563eb]",
                      textColor: "text-[#2563eb]",
                      Icon: Code2,
                    },
                    {
                      name: "Cloud Computing & DevOps",
                      percent: 20,
                      color: "bg-[#059669]",
                      badgeBg: "bg-[#059669]",
                      textColor: "text-[#059669]",
                      Icon: Cloud,
                    },
                    {
                      name: "Consulting & Analytics",
                      percent: 15,
                      color: "bg-[#7c3aed]",
                      badgeBg: "bg-[#7c3aed]",
                      textColor: "text-[#7c3aed]",
                      Icon: BarChart3,
                    },
                    {
                      name: "E-Commerce & Retail",
                      percent: 12,
                      color: "bg-[#d97706]",
                      badgeBg: "bg-[#d97706]",
                      textColor: "text-[#d97706]",
                      Icon: ShoppingCart,
                    },
                    {
                      name: "Others (Healthcare, EdTech, etc.)",
                      percent: 8,
                      color: "bg-[#64748b]",
                      badgeBg: "bg-[#64748b]",
                      textColor: "text-[#64748b]",
                      Icon: Users,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50/70 hover:bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-100 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2.5">
                          <div className={"w-7 h-7 rounded-lg " + item.badgeBg + " flex items-center justify-center shrink-0 shadow-xs"}>
                            <item.Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-slate-800">
                            {item.name}
                          </span>
                        </div>
                        <span className={"text-xs font-bold " + item.textColor}>
                          {item.percent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200/60 rounded-full overflow-hidden">
                        <div
                          className={"h-full rounded-full transition-all duration-700 " + item.color}
                          style={{ width: item.percent + "%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive Donut & Placement Highlights */}
              <div className="lg:col-span-6 flex justify-center items-center">
                <div className="w-full max-w-[430px] lg:max-w-[440px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-700/60 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-center">
                    {/* SVG Donut Chart */}
                    <div className="relative w-44 h-44 sm:w-48 sm:h-48 mb-6">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {/* Background track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#334155"
                          strokeWidth="11"
                        />
                        {/* Segments: r=38, C ≈ 238.76 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#2563eb"
                          strokeWidth="11"
                          strokeDasharray="107.44 238.76"
                          strokeDashoffset="0"
                          className="transition-all duration-1000"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#059669"
                          strokeWidth="11"
                          strokeDasharray="47.75 238.76"
                          strokeDashoffset="-107.44"
                          className="transition-all duration-1000"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#7c3aed"
                          strokeWidth="11"
                          strokeDasharray="35.81 238.76"
                          strokeDashoffset="-155.19"
                          className="transition-all duration-1000"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#d97706"
                          strokeWidth="11"
                          strokeDasharray="28.65 238.76"
                          strokeDashoffset="-191.00"
                          className="transition-all duration-1000"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#64748b"
                          strokeWidth="11"
                          strokeDasharray="19.10 238.76"
                          strokeDashoffset="-219.65"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      {/* Center Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                          100%
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-300 font-medium tracking-wide">
                          Industry Placed
                        </span>
                      </div>
                    </div>

                    {/* Stats badges */}
                    <div className="w-full grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-700/60 text-center">
                      <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                        <div className="text-sm font-bold text-amber-400">300+</div>
                        <div className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Hiring Partners</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                        <div className="text-sm font-bold text-emerald-400">12 LPA</div>
                        <div className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Highest CTC</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                        <div className="text-sm font-bold text-blue-400">93%+</div>
                        <div className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Placement Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>



      {/* 5. CTA Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Write Your Own <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Success Story?</span></h2>
          <p className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed font-normal">
            Join BITC and get the industry-relevant training, expert mentorship, and placement assistance you need to launch a rewarding career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/certifications" className="h-14 px-8 rounded-full text-slate-800 font-normal flex items-center justify-center hover:/90 transition-all shadow-lg hover:shadow-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)]">
              Explore our certifications
            </Link>
            <Link href="/placements/success-stories" className="h-14 px-8 rounded-full bg-white text-slate-600 font-normal flex items-center justify-center hover:bg-gray-50 border border-gray-200 transition-all shadow-sm">
              Read success stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
