import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, CheckCircle2, ArrowRight, Presentation, Users, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Faculty Development Programs (FDP)",
  description: "Advanced tech training and Faculty Development Programs (FDP) for educators and professors at BITC Amravati.",
  openGraph: {
    title: "Faculty Development Programs (FDP) | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Training educators with modern tech stack and pedagogy.",
  },
};

export default function FDPPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white py-16 lg:py-24 overflow-hidden border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>Empowering Educators</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            Faculty Development <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Programs</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-[700px] mx-auto leading-relaxed mb-10 font-medium">
            Equipping professors and academic staff with the latest industry trends, tools, and teaching methodologies to foster an environment of continuous learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="h-14 px-8 rounded-full text-white font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
              Organize an FDP
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Why FDP? */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Invest in Faculty Development?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Great teachers create great students. Our FDPs are designed to bridge the gap between academic theories and practical industry applications.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Curriculum Modernization", desc: "Learn how to integrate the latest technologies (like AI, Cloud, and Next.js) into existing academic syllabi." },
              { icon: Presentation, title: "Innovative Pedagogy", desc: "Discover new, interactive teaching methods that increase student engagement and practical understanding." },
              { icon: Users, title: "Industry Networking", desc: "Connect with corporate experts and other academicians to foster collaborative research and learning." }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:border-orange-200 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Program Highlights */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">FDP Focus Areas</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our sessions are highly customizable depending on the department's requirements. We specialize in bringing corporate-level technical training to the teaching staff.
            </p>
            <ul className="space-y-4">
              {[
                "Advanced Programming & Frameworks",
                "Data Science & Analytics Tools",
                "Machine Learning & Artificial Intelligence",
                "Cyber Security & Ethical Hacking",
                "Cloud Infrastructure & DevOps",
                "Research Methodologies & Technical Writing"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-orange-500 shrink-0" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1770&auto=format&fit=crop" 
                alt="Faculty Development Session" 
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Upgrade Your Faculty's Toolkit</h2>
          <p className="text-slate-600 mb-8 text-lg font-medium">Contact our partnership team to design a targeted Faculty Development Program for your institution.</p>
          <Link href="/contact" className="inline-flex h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-bold items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg gap-2">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
