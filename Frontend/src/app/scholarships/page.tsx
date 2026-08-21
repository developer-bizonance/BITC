import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowRight, Award, CheckCircle2, GraduationCap, 
  Lightbulb, Users, FileText, Target, BrainCircuit,
  CreditCard, Briefcase, Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Scholarships & Financial Aid",
  description: "Learn about merit-based scholarships and financial aid opportunities for IT and Management courses at BITC Amravati.",
  openGraph: {
    title: "Scholarships & Financial Aid | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Merit scholarships and tuition fee assistance for deserving candidates.",
  },
};

export default function ScholarshipsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative w-full bg-white py-24 overflow-hidden border-b border-gray-100">
        <div className="container max-w-[1000px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm font-bold mb-6">
            <Award className="w-4 h-4" />
            BITC Scholarship Program
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Unlock Up To <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">50% Scholarship</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            We believe that financial constraints should never stand in the way of true talent. Our scholarship program is designed to empower deserving students to launch their tech careers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="h-14 px-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white text-lg font-bold flex items-center justify-center hover:shadow-xl hover:shadow-orange-500/25 hover:-translate-y-1 transition-all">
              Apply for Scholarship <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="#criteria" className="h-14 px-10 rounded-full bg-white text-slate-700 text-lg font-bold flex items-center justify-center hover:bg-gray-50 border border-gray-200 transition-all shadow-sm">
              View Criteria
            </Link>
          </div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section id="criteria" className="py-20 lg:py-28 bg-white relative">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Eligibility Criteria</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              We look for passion, dedication, and potential. Review the criteria below to see if you qualify for the BITC Merit & Need-Based Scholarship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Academic Excellence</h3>
                <p className="text-slate-600 leading-relaxed">
                  Students with a strong academic background, maintaining a minimum of 75% aggregate in their recent qualifying examinations (12th grade or Graduation).
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">BITC Assessment Test</h3>
                <p className="text-slate-600 leading-relaxed">
                  Applicants must clear the BITC Online Scholarship Assessment. The test evaluates basic logical reasoning, aptitude, and problem-solving skills.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Financial Need</h3>
                <p className="text-slate-600 leading-relaxed">
                  Special consideration is given to talented students from economically weaker sections (EWS) to ensure equal access to premium tech education.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Diversity & Inclusion</h3>
                <p className="text-slate-600 leading-relaxed">
                  We actively encourage applications from women in tech, candidates from underrepresented backgrounds, and specially-abled individuals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group lg:col-span-2">
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-2xl text-white flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)]">
                  <Zap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Tech Innovators & Hobbyists</h3>
                  <p className="text-slate-600 leading-relaxed">
                    If your grades aren't perfect but you have a strong portfolio of side projects, GitHub repositories, or freelance work, you can bypass the standard academic criteria! We value builders above all else.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="container max-w-[1000px] mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">How to Apply</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Securing your scholarship is a straightforward, transparent 3-step process.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-2xl font-black text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Submit Your Application</h3>
                <p className="text-slate-600">
                  Fill out our online application form. Select the program you are interested in and make sure to check the "I want to apply for a scholarship" box. Upload your past academic records or portfolio links.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <span className="text-2xl font-black text-orange-600">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Take the Assessment</h3>
                <p className="text-slate-600">
                  Once your application is reviewed, you'll receive a link to our 45-minute online aptitude and logic assessment. It can be taken from the comfort of your home at any time within 48 hours of receiving the link.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <span className="text-2xl font-black text-emerald-600">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Personal Interview & Result</h3>
                <p className="text-slate-600">
                  Shortlisted candidates will be invited for a brief 15-minute video interview with our admission counselors to understand your career goals. Results and scholarship percentage are announced within 24 hours!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1000px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Ready to start your journey?</h2>
          <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto font-medium">
            Don't let anything hold you back. Apply today, secure your scholarship, and take the first step towards a high-paying career in tech.
          </p>
          <Link href="/contact" className="inline-flex h-14 px-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white text-lg font-bold items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-orange-500/25">
            Contact Us
          </Link>
        </div>
      </section>

    </div>
  );
}
