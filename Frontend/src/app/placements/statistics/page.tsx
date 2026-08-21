import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users, Building2, Briefcase, Award, GraduationCap, BarChart3, ChevronRight, CheckCircle2, DollarSign, Target } from "lucide-react";

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
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white py-16 overflow-hidden border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Placement Report 2024-2025</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            Our Placement <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Statistics</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-[700px] mx-auto leading-relaxed mb-8 font-medium">
            A testament to our commitment to excellence. Discover how BITC students are securing top roles at leading global organizations with industry-best compensation packages.
          </p>
        </div>
      </section>

      {/* 2. Key Highlights */}
      <section className="py-16 bg-slate-100 border-y border-slate-200/80 relative">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Placement Ratio", value: "95%", icon: Award, suffix: "Eligible students placed" },
              { label: "Hiring Partners", value: "10+", icon: Building2, suffix: "Top recruiting companies" },
              { label: "Highest Package", value: "12 LPA", icon: DollarSign, suffix: "Offered to top performers" },
              { label: "Students Trained", value: "1K+", icon: Target, suffix: "Across all active batches" }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/80 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xs text-slate-500 mt-auto">{stat.suffix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Industry Wise Placements */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="flex-1 w-full">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Industry-wise <span className="text-primary">Breakdown</span></h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our graduates find success across a diverse range of industries, reflecting the versatile and comprehensive nature of our curriculum. The IT & Software sector continues to be the largest recruiter, followed closely by Cloud Computing and Consulting.
              </p>
              
              <div className="space-y-6">
                {[
                  { name: "IT / Software", percent: 45, color: "bg-blue-500" },
                  { name: "Cloud Computing & DevOps", percent: 20, color: "bg-emerald-500" },
                  { name: "Consulting & Analytics", percent: 15, color: "bg-purple-500" },
                  { name: "E-Commerce & Retail", percent: 12, color: "bg-amber-500" },
                  { name: "Others (Healthcare, EdTech, etc.)", percent: 8, color: "bg-slate-400" },
                ].map((ind, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                      <span>{ind.name}</span>
                      <span>{ind.percent}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${ind.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${ind.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full flex justify-center items-center">
              <div className="relative w-full max-w-sm drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bar%20chart/3D/bar_chart_3d.png" 
                  alt="Sector Analysis" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 5. CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-blue-500/5 relative overflow-hidden">
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to write your own success story?</h2>
          <p className="text-gray-600 mb-10 text-lg">
            Join BITC and get the industry-relevant training, expert mentorship, and placement assistance you need to launch a rewarding career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="h-14 px-8 rounded-full text-white font-bold flex items-center justify-center hover:/90 transition-all shadow-lg hover:shadow-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)]">
              Explore Our Programs
            </Link>
            <Link href="/placements/success-stories" className="h-14 px-8 rounded-full bg-white text-slate-800 font-bold flex items-center justify-center hover:bg-gray-50 border border-gray-200 transition-all shadow-sm">
              Read Success Stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
