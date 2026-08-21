import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, CheckCircle2, ArrowRight, Lightbulb, Rocket, BarChart } from "lucide-react";

export const metadata: Metadata = {
  title: "Employee Upskilling",
  description: "Boost workforce skills in AI, Full Stack, Data Science, and Cloud with BITC Amravati employee upskilling programs.",
  openGraph: {
    title: "Employee Upskilling | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Future-proof workforce skills with BITC upskilling programs.",
  },
};

export default function EmployeeUpskillingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white py-16 lg:py-24 overflow-hidden border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Future-Proof Your Workforce</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            Employee <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Upskilling</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-[700px] mx-auto leading-relaxed mb-10 font-medium">
            Transform your employees into industry leaders. Our upskilling programs focus on closing the skill gap and accelerating digital transformation from within.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="h-14 px-8 rounded-full text-white font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
              Explore Upskilling Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* 2. The Value of Upskilling */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 w-full order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1768&auto=format&fit=crop" alt="Team collaborating" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1770&auto=format&fit=crop" alt="Employee learning" className="rounded-2xl w-full h-48 object-cover shadow-lg translate-y-4 lg:translate-y-8" />
              </div>
            </div>
            <div className="flex-1 w-full order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Upskill Your Team?</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                In a rapidly evolving technological landscape, relying solely on external hiring is inefficient. Upskilling your existing talent fosters loyalty, improves retention, and builds a more resilient organization capable of handling future challenges.
              </p>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>Increase employee retention by showing investment in their growth.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>Boost productivity by adopting modern tools and methodologies.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>Reduce hiring and onboarding costs significantly.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Approach */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Upskilling Approach</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A systematic, data-driven methodology to ensure learning translates directly into performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BarChart, title: "1. Skill Gap Analysis", desc: "We assess your current workforce capabilities and identify crucial areas for improvement." },
              { icon: Lightbulb, title: "2. Customized Learning", desc: "We design a specialized curriculum balancing theoretical knowledge with practical application." },
              { icon: Rocket, title: "3. Implementation", desc: "Employees apply new skills on live, guided projects relevant to your business." }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 4. CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Invest in Your Greatest Asset</h2>
          <p className="text-slate-600 mb-8 text-lg font-medium">Contact us today to start assessing your team's upskilling needs and build a brighter future for your company.</p>
          <Link href="/contact" className="inline-flex h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] text-white font-bold items-center justify-center transition-all shadow-lg hover:shadow-xl gap-2">
            Schedule a Consultation <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
