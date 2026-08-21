import type { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckCircle2, ArrowRight, BookOpen, GraduationCap, Users, Handshake, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "MoU & Academic Partnerships",
  description: "Explore Memorandums of Understanding (MoU) and academic institutional partnerships with BITC Amravati.",
  openGraph: {
    title: "MoU & Academic Partnerships | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Academic MoU collaborations with top engineering colleges.",
  },
};

export default function MoUPartnershipPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white py-16 lg:py-24 overflow-hidden border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <Handshake className="w-4 h-4 text-primary" />
            <span>Academic Collaborations</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            Memorandums of <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Understanding</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-[700px] mx-auto leading-relaxed mb-10 font-medium">
            Bridging the gap between academia and industry. We partner with leading educational institutions to deliver cutting-edge, industry-relevant training directly to students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="h-14 px-8 rounded-full text-white font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
              Initiate an MoU
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Why Sign an MoU with Us? */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Partner With BITC?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">An MoU with BITC ensures your students get hands-on experience and industry exposure, significantly boosting their employability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: "Industry-Aligned Curriculum", desc: "We supplement your syllabus with practical, up-to-date technologies." },
              { icon: Users, title: "Expert Mentorship", desc: "Students are trained by seasoned professionals from the corporate sector." },
              { icon: Zap, title: "Live Projects", desc: "Hands-on experience through real-world projects and case studies." },
              { icon: ShieldCheck, title: "Placement Assistance", desc: "Dedicated support to help trained students secure jobs in top tech firms." }
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                  <benefit.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MoU Benefits / Features */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" 
                alt="Signing an MoU" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent mix-blend-overlay" />
            </div>
          </div>

          <div className="flex-1 w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">What the MoU Covers</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our academic partnerships are comprehensive and mutually beneficial. A typical MoU with BITC encompasses a wide range of activities designed to elevate the educational standard of the institution.
            </p>
            <ul className="space-y-5">
              {[
                "Setup of Center of Excellence (CoE) on campus.",
                "Conducting regular seminars, workshops, and hackathons.",
                "Faculty Development Programs (FDP) for upskilling professors.",
                "Industrial visits and corporate exposure for students.",
                "Joint research initiatives and project guidance."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Empower Your Students Today</h2>
          <p className="text-slate-600 mb-8 text-lg font-medium">Are you a university or college representative? Let's discuss how we can work together to build a brighter future for your students.</p>
          <Link href="/contact" className="inline-flex h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-bold items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg gap-2">
            Propose a Partnership <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
