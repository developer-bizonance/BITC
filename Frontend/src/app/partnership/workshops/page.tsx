import type { Metadata } from "next";
import Link from "next/link";
import { Users, CheckCircle2, ArrowRight, MonitorPlay, Lightbulb, Code, Target, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Technical Workshops",
  description: "Skill-building technical workshops and bootcamps conducted by BITC Amravati for college students.",
  openGraph: {
    title: "Technical Workshops | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Hands-on tech workshops for colleges and students.",
  },
};

export default function WorkshopsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white py-16 lg:py-24 overflow-hidden border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span>Interactive Learning</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            Technical <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Workshops</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-[700px] mx-auto leading-relaxed mb-10 font-medium">
            Intensive, hands-on sessions designed to equip students and professionals with practical, highly sought-after industry skills in a matter of days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="h-14 px-8 rounded-full text-white font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
              Host a Workshop
            </Link>
          </div>
        </div>
      </section>

      {/* 2. What to Expect */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The Workshop Experience</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We move beyond theoretical lectures. Our workshops are highly interactive environments focused on doing, building, and solving.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Code, title: "100% Hands-On Coding", desc: "No boring slides. Participants code along with the instructor, building mini-projects in real-time." },
              { icon: Lightbulb, title: "Industry Use-Cases", desc: "Learn how concepts are applied to solve actual business problems in enterprise environments." },
              { icon: MonitorPlay, title: "Live Demonstrations", desc: "Watch experts debug, architect, and deploy applications live, sharing their thought processes." }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:border-amber-200 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Popular Workshop Topics */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1770&auto=format&fit=crop" alt="Workshop participant" className="rounded-2xl w-full h-56 object-cover shadow-lg" />
              <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1770&auto=format&fit=crop" alt="Coding session" className="rounded-2xl w-full h-56 object-cover shadow-lg translate-y-8" />
            </div>
          </div>
          
          <div className="flex-1 w-full order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Trending Workshop Topics</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We frequently update our workshop catalog to reflect the latest technological advancements. Here are some of our most requested sessions across academic campuses:
            </p>
            <div className="space-y-4">
              {[
                { title: "Building Modern UIs with React & Next.js", icon: Code },
                { title: "Introduction to Generative AI & Prompt Engineering", icon: Cpu },
                { title: "Cloud Deployment on AWS & GCP", icon: Target },
                { title: "Ethical Hacking & Penetration Testing Basics", icon: MonitorPlay },
                { title: "Data Visualization using Python & Tableau", icon: Lightbulb },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-slate-800">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Bring Our Experts to Your Campus</h2>
          <p className="text-slate-600 mb-8 text-lg font-medium">Looking to organize a high-impact technical workshop for your students or employees? Get in touch with us to schedule a session.</p>
          <Link href="/contact" className="inline-flex h-14 px-8 rounded-full text-white font-bold items-center justify-center transition-all shadow-lg gap-2 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)]">
            Organize a Workshop <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
