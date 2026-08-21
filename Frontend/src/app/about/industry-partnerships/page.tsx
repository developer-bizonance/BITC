import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import IndustryPartnersGrid from "@/components/IndustryPartnersGrid";
import {
  Handshake,
  Building2,
  GraduationCap,
  Briefcase,
  Users,
  Code,
  Mic2,
  ArrowRight,
  CheckCircle2,
  Target,
  Phone,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Industry Partnerships",
  description: "Learn about corporate and industry collaborations at BIZONANCE Industrial Training Centre (BITC).",
  openGraph: {
    title: "Industry Partnerships | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Our corporate collaborations and corporate training partnerships.",
  },
};

export default function IndustryPartnershipsPage() {
  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[calc(100vh-80px)] bg-white py-20 lg:py-28 overflow-hidden flex flex-col items-center justify-center border-b border-gray-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1000px] mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold rounded-full px-5 py-2 text-sm uppercase tracking-widest mb-8">
            <Handshake className="w-4 h-4" />
            Partnerships
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Connecting Education <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">with Industry</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-[1.4rem] text-gray-600 max-w-[900px] mx-auto leading-relaxed">
            Industry partnerships are the foundation of BITC's learning model. By collaborating with leading companies, we ensure our students gain relevant skills, real exposure, and direct access to career opportunities.
          </p>
        </div>
      </section>

      {/* ── WHY PARTNERSHIPS MATTER ── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Why Partnerships Matter</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                The most effective education happens when academia and industry work together. Our partnerships ensure that every program we offer is built around real industry requirements, not just textbook theories.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through our network of 300+ industry partners, students gain access to internships, placements, live projects, workshops, guest lectures, and mentorship from professionals working at leading companies.
              </p>
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3]">
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1170&auto=format&fit=crop" alt="Partnership" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR INDUSTRY PARTNERS ── */}
      <IndustryPartnersGrid />

      {/* ── PARTNER BENEFITS ── */}
      <section className="py-16 md:py-24 bg-slate-100 text-slate-900 border-y border-slate-200/80 relative overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Partner Benefits</h2>
            <p className="text-slate-600 max-w-[600px] mx-auto text-lg">What our industry partnerships bring to students.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Internship Opportunities", icon: Briefcase, desc: "Gain real workplace experience through structured internship programs with partner companies." },
              { title: "Placement Support", icon: Target, desc: "Direct hiring pipelines and placement drives connecting students with top employers." },
              { title: "Industry Workshops", icon: Code, desc: "Hands-on workshops conducted by industry professionals on the latest technologies." },
              { title: "Guest Lectures", icon: Mic2, desc: "Regular sessions by industry leaders sharing insights, trends, and career advice." },
              { title: "Live Projects", icon: Building2, desc: "Work on real business problems and contribute to live industry projects." },
              { title: "Mentorship", icon: Users, desc: "One-on-one guidance from experienced professionals throughout the learning journey." },
            ].map((item, i) => (
              <Card key={i} className="bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-7">
                  <item.icon className="w-10 h-10 text-primary mb-5" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* ── CORPORATE COLLABORATION ── */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Corporate Solutions</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Corporate Collaboration</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                BITC works closely with corporate partners to develop tailored solutions that address their talent and training needs.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Upskilling Programs", desc: "Custom training for existing employees to stay ahead of industry trends." },
                  { title: "Corporate Training", desc: "Structured programs designed for teams and departments." },
                  { title: "Consultancy", desc: "Advisory services for talent acquisition and workforce development." },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Partnership Process */}
            <div className="bg-white text-slate-900 border border-slate-200/80 rounded-[2rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-8">Partnership Process</h3>
                <div className="space-y-6">
                  {[
                    { step: "01", title: "Contact Us", desc: "Reach out to our partnerships team." },
                    { step: "02", title: "Discussion", desc: "We understand your requirements and goals." },
                    { step: "03", title: "Agreement", desc: "Formalize the partnership with clear objectives." },
                    { step: "04", title: "Implementation", desc: "Launch programs, workshops, and collaboration." },
                    { step: "05", title: "Growth", desc: "Measure impact and expand the partnership." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-extrabold text-sm">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-slate-600 text-sm font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BECOME A PARTNER CTA ── */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Become a Partner</h2>
          <p className="text-xl text-gray-600 mb-10">
            Join our growing network of industry partners and help shape the next generation of professionals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-semibold flex items-center gap-2 justify-center hover:shadow-xl transition-all text-lg">
              Partner With Us <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="h-14 px-8 rounded-full bg-white/80 text-slate-900 font-semibold flex items-center justify-center border border-blue-200/80 hover:bg-white transition-all text-lg shadow-sm backdrop-blur-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
