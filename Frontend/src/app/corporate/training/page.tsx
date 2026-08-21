import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, CheckCircle2, Users, Target, Zap, ArrowRight, Building2, MonitorPlay } from "lucide-react";

export const metadata: Metadata = {
  title: "Corporate Training Programs",
  description: "Customized corporate training solutions tailored to enterprise tech requirements by BITC Amravati.",
  openGraph: {
    title: "Corporate Training Programs | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Customized corporate tech training for enterprise teams.",
  },
};

export default function CorporateTrainingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white py-16 lg:py-24 overflow-hidden border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <Briefcase className="w-4 h-4 text-primary" />
            <span>For Organizations</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            Customized <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Corporate Training</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-[700px] mx-auto leading-relaxed mb-10 font-medium">
            Empower your team with cutting-edge skills. Our tailored training programs align perfectly with your business goals, ensuring measurable impact and growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] text-white font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-xl border-0">
              Request a Proposal
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Why Choose Us */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Partner With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We don't just deliver courses; we create transformational learning experiences designed specifically for your corporate environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Tailored Curriculum", desc: "Every program is customized to address the specific technical or behavioral gaps within your organization." },
              { icon: Users, title: "Expert Instructors", desc: "Learn from industry veterans with decades of hands-on experience in global enterprise environments." },
              { icon: Zap, title: "Immediate Impact", desc: "Practical, project-based training that employees can immediately apply to their day-to-day work." }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Popular Training Domains */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Core Training Domains</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We cover a broad spectrum of in-demand technologies and methodologies. Whether you need to transition your team to a new tech stack or refine their agile practices, we have you covered.
            </p>
            <ul className="space-y-4">
              {[
                "Full Stack Web Development (MERN, Next.js, Java)",
                "Data Science, AI & Machine Learning",
                "Cloud Computing (AWS, Azure, GCP)",
                "Cybersecurity & Ethical Hacking",
                "Agile Methodologies & Scrum",
                "Soft Skills & Business Communication"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                alt="Corporate Training Session" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 border border-black/10 rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to upskill your team?</h2>
          <p className="text-slate-600 mb-8 text-lg font-medium">Connect with our corporate relations team to design a training program that perfectly aligns with your organizational objectives.</p>
          <Link href="/contact" className="inline-flex h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] text-white font-bold items-center justify-center transition-all shadow-lg hover:shadow-xl gap-2">
            Talk to an Expert <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
