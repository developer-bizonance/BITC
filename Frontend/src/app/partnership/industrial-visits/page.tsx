import type { Metadata } from "next";
import Link from "next/link";
import { Building2, CheckCircle2, ArrowRight, Eye, Briefcase, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Industrial Visits",
  description: "Real-world exposure and industrial corporate visits organized by BITC Amravati for students.",
  openGraph: {
    title: "Industrial Visits | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Corporate office visits and practical industry exposure for students.",
  },
};

export default function IndustrialVisitsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white py-16 lg:py-24 overflow-hidden border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Real-World Exposure</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            Industrial <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Visits</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-[700px] mx-auto leading-relaxed mb-10 font-medium">
            Take learning beyond the classroom walls. We organize guided industrial visits to leading IT firms and tech parks to give students a glimpse of the corporate world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="h-14 px-8 rounded-full text-white font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
              Schedule a Visit
            </Link>
          </div>
        </div>
      </section>

      {/* 2. The Experience */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1770&auto=format&fit=crop" alt="Corporate office" className="rounded-2xl w-full h-56 object-cover shadow-lg" />
              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1770&auto=format&fit=crop" alt="Team meeting" className="rounded-2xl w-full h-56 object-cover shadow-lg translate-y-8" />
            </div>
          </div>
          
          <div className="flex-1 w-full order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Industrial Visits Matter</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Reading about software development lifecycles in a textbook is completely different from witnessing a live product deployment in an enterprise setting. Our visits provide that crucial practical perspective.
            </p>
            <div className="space-y-6">
              {[
                { icon: Eye, title: "First-Hand Observation", desc: "Witness internal operations, infrastructure, and work culture in real-time." },
                { icon: Briefcase, title: "Interact with Experts", desc: "Q&A sessions with project managers, HRs, and technical leads." },
                { icon: MapPin, title: "Campus to Corporate", desc: "Helps students mentally transition from an academic mindset to a professional one." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-1">
                    <item.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-600 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Book an Industrial Visit for Your Students</h2>
          <p className="text-slate-600 mb-8 text-lg font-medium">Give your students the industry exposure they need to succeed in their careers.</p>
          <Link href="/contact" className="inline-flex h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-bold items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg gap-2">
            Plan a Trip <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
