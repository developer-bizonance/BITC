import type { Metadata } from "next";
import Link from "next/link";
import { Award, CheckCircle2, ArrowRight, ShieldCheck, Compass, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Leadership Programs",
  description: "Executive development and tech leadership programs for managers and leaders at BITC Amravati.",
  openGraph: {
    title: "Leadership Programs | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Executive development programs for tech leaders.",
  },
};

export default function LeadershipProgramsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white py-16 lg:py-24 overflow-hidden border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <Award className="w-4 h-4 text-primary" />
            <span>Executive Development</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Leadership</span> Programs
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-[700px] mx-auto leading-relaxed mb-10 font-medium">
            Develop visionary leaders capable of navigating complexity, driving innovation, and inspiring teams to achieve extraordinary results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="h-14 px-8 rounded-full text-white font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
              Discover Our Programs
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Core Pillars */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pillars of Effective Leadership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our programs are built on foundational principles that empower managers to transition into highly effective organizational leaders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Compass, title: "Strategic Thinking", desc: "Equip your leaders with the ability to foresee market trends, align team goals with corporate vision, and make data-driven strategic decisions." },
              { icon: ShieldCheck, title: "Resilience & Change Management", desc: "Train leaders to navigate uncertainty, manage crises effectively, and lead organizational change with confidence and empathy." },
              { icon: Users, title: "Team Empowerment", desc: "Learn to foster a culture of inclusivity, motivation, and high performance by effectively mentoring and delegating." }
            ].map((pillar, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:border-purple-200 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center mb-6">
                  <pillar.icon className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Who is this for? */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Who Should Attend?</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our Leadership Development Programs are designed for professionals at various stages of their managerial journey, ensuring that learning is targeted, relevant, and impactful.
            </p>
            <ul className="space-y-6">
              {[
                { title: "First-Time Managers", desc: "Transitioning from individual contributor to team leader." },
                { title: "Mid-Level Executives", desc: "Managing multiple teams and driving operational excellence." },
                { title: "Senior Leaders", desc: "C-suite executives shaping organizational strategy and culture." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <CheckCircle2 className="w-6 h-6 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
                alt="Leadership discussion" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Build the Leaders of Tomorrow</h2>
          <p className="text-slate-600 mb-8 text-lg font-medium">Partner with us to create a customized leadership development journey for your top talent.</p>
          <Link href="/contact" className="inline-flex h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-bold items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg gap-2">
            Get in Touch <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
