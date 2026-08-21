import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Cpu, Code2, LineChart, 
  Lightbulb, Rocket, Target, Zap, Globe, Users,
  BookOpen, BrainCircuit
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Future-Proof Your Skills",
  description: "Learn how BITC Amravati future-proofs your tech career with AI-integrated curriculum, practical labs, and industry projects.",
  openGraph: {
    title: "Future-Proof Your Skills | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Build future-ready tech skills with AI & modern frameworks.",
  },
};

export default function FutureProofPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white py-24 overflow-hidden border-b border-gray-100">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-sm font-bold mb-8">
              <ShieldCheck className="w-4 h-4" />
              The BITC Edge
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Future-Proof Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Career Trajectory</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              In a world where technology evolves daily, traditional education is no longer enough. Learn how BITC equips you with adaptable skills, AI integration, and a builder's mindset to thrive in any tech landscape.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses/it" className="h-14 px-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white text-lg font-bold flex items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg">
                Explore Programs
              </Link>
              <Link href="#pillars" className="h-14 px-10 rounded-full bg-white text-slate-700 text-lg font-bold flex items-center justify-center hover:bg-gray-50 border border-gray-200 transition-all shadow-sm">
                Our Core Pillars
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats overlapping hero */}
      <section className="relative z-20 -mt-16 mb-16 px-4">
        <div className="container max-w-[1000px] mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex-1 text-center py-4 md:py-0 px-4">
              <div className="text-4xl font-black text-slate-900 mb-1">6 Mo</div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Curriculum Refresh Rate</div>
            </div>
            <div className="flex-1 text-center py-4 md:py-0 px-4">
              <div className="text-4xl font-black text-slate-900 mb-1">100%</div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">AI-Integrated Modules</div>
            </div>
            <div className="flex-1 text-center py-4 md:py-0 px-4">
              <div className="text-4xl font-black text-slate-900 mb-1">92%</div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Placement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section id="pillars" className="py-16 lg:py-24 bg-slate-50">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">How we keep you ahead</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              We don't just teach code or business theory. We teach you how to adapt, learn, and leverage the latest tools to become an irreplaceable asset.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">AI-First Workflows</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every course at BITC integrates modern AI tools (like Copilot, ChatGPT, and Midjourney). You won't just learn a skill; you'll learn how to 10x your productivity using AI.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Industry-Aligned Tech Stack</h3>
                <p className="text-slate-600 leading-relaxed">
                  We constantly monitor the job market and update our curriculum every 6 months. You'll learn the exact frameworks, languages, and tools that top tech companies are actively hiring for.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Project-Based Learning</h3>
                <p className="text-slate-600 leading-relaxed">
                  Theory is obsolete without execution. You will build, deploy, and scale real-world applications. By the time you graduate, you will have a robust portfolio proving your capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Business Acumen</h3>
                <p className="text-slate-600 leading-relaxed">
                  Great developers understand business. Great managers understand tech. Our cross-disciplinary approach ensures you understand how your work impacts the bottom line, making you highly promotable.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Soft Skills & Communication</h3>
                <p className="text-slate-600 leading-relaxed">
                  Technical skills get you the interview; soft skills get you the job. We train you on professional communication, interview prep, team collaboration, and presentation skills.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 bg-amber-50 text-slate-900 relative overflow-hidden group">
              <CardContent className="p-8 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Lifelong Career Support</h3>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Once a BITC student, always a BITC student. You get lifetime access to our alumni network, exclusive job boards, and ongoing mentorship sessions even after you land your first job.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="container max-w-[800px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Stop Learning, <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Start Evolving.</span></h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            The best time to future-proof your career was 5 years ago. The second best time is today. Join BITC and become the talent that top companies are desperate to hire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="h-14 px-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white text-lg font-bold flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-orange-500/25">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/contact" className="h-14 px-10 rounded-full bg-white text-slate-900 border-2 border-slate-200 text-lg font-bold flex items-center justify-center hover:border-slate-400 transition-colors">
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
