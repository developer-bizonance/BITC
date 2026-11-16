import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Award, CheckCircle2, GraduationCap,
  Lightbulb, Users, FileText, Target, BrainCircuit,
  CreditCard, Briefcase, Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScholarshipApplicationForm } from "@/components/forms/ScholarshipApplicationForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const metadata: Metadata = {
  title: "Scholarships & Financial Aid",
  description: "Learn about merit-based scholarships and financial aid opportunities for IT and Management certifications at BITC Amravati.",
  openGraph: {
    title: "Scholarships & Financial Aid | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Merit scholarships and tuition fee assistance for deserving candidates.",
    images: [
      {
        url: "/og-image.png",
        secureUrl: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "BIZONANCE Industrial Training Centre. (BITC) | Amravati Logo",
      },
      {
        url: "/og-square.png",
        secureUrl: "/og-square.png",
        width: 800,
        height: 800,
        type: "image/png",
        alt: "BIZONANCE Industrial Training Centre. (BITC) | Amravati Logo",
      },
    ],
  },
};

export default function ScholarshipsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative w-full bg-white lg:min-h-[calc(100vh-80px)] flex items-center py-14 sm:py-18 lg:py-20 overflow-hidden">
        <div className="container max-w-[1000px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            BITC Scholarship for Students
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.2]">
            Unlock Up to <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">50% Scholarship</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            We believe that financial constraints should never stand in the way of true talent. Our scholarship program is designed to empower deserving students to launch their tech careers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog>
              <DialogTrigger render={
                <button className="h-14 px-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 text-base md:text-lg font-normal flex items-center justify-center hover:shadow-xl hover:shadow-orange-500/25 hover:-translate-y-1 transition-all">
                  Apply for Scholarship <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              } />
              <DialogContent className="sm:max-w-2xl p-0 border-none bg-transparent shadow-none overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <ScholarshipApplicationForm />
              </DialogContent>
            </Dialog>
            <Link href="#criteria" className="h-14 px-10 rounded-full bg-white text-slate-600 text-base md:text-lg font-normal flex items-center justify-center hover:bg-gray-50 border border-gray-200 transition-all shadow-sm">
              View Criteria
            </Link>
          </div>
        </div>
      </section>



      {/* Eligibility Criteria */}
      <section id="criteria" className="py-12 sm:py-16 lg:py-28 bg-white relative">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Eligibility <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Criteria</span></h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              We look for passion, dedication, and potential. Review the criteria below to see if you qualify for the BITC Merit & Need-Based Scholarship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">Academic Excellence</h3>
                <p className="text-slate-600 leading-relaxed">
                  Students with a strong academic background, maintaining a minimum of 75% aggregate in their recent qualifying examinations (12th grade or Graduation).
                </p>
              </CardContent>
            </Card>

            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">BITC Assessment Test</h3>
                <p className="text-slate-600 leading-relaxed">
                  Applicants must clear the BITC Online Scholarship Assessment. The test evaluates basic logical reasoning, aptitude, and problem-solving skills.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">Financial Need</h3>
                <p className="text-slate-600 leading-relaxed">
                  Special consideration is given to talented students from economically weaker sections (EWS) to ensure equal access to premium tech education.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">Diversity & Inclusion</h3>
                <p className="text-slate-600 leading-relaxed">
                  We actively encourage applications from women in tech, candidates from underrepresented backgrounds, and specially-abled individuals.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">Tech Innovators & Hobbyists</h3>
                <p className="text-slate-600 leading-relaxed">
                  If your grades aren't perfect but you have a strong portfolio of side projects, GitHub repositories, or freelance work, you can bypass the standard academic criteria! We value builders above all else.
                </p>
              </CardContent>
            </Card>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">Extracurricular Achievements</h3>
                <p className="text-slate-600 leading-relaxed">
                  Students who have demonstrated exceptional leadership or excellence in sports, arts, or other extracurricular activities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container max-w-[1000px] mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">How to <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Apply</span></h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Securing your scholarship is a straightforward, transparent 3-step process.
            </p>
          </div>

          <div className="space-y-6">
            <div className="group flex flex-col md:flex-row gap-6 items-start bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200/90 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out cursor-default">
              <div className="w-16 h-16 rounded-full bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-blue-500/25">
                <span className="text-2xl font-black text-blue-600 group-hover:text-white transition-colors duration-300">1</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-900 group-hover:text-blue-950 transition-colors mb-2">Submit Your Application</h3>
                <p className="text-gray-500 leading-relaxed font-normal">
                  Fill out our online application form. Select the program you are interested in and make sure to check the "I want to apply for a scholarship" box. Upload your past academic records or portfolio links.
                </p>
              </div>
            </div>

            <div className="group flex flex-col md:flex-row gap-6 items-start bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-orange-200/90 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out cursor-default">
              <div className="w-16 h-16 rounded-full bg-orange-100 group-hover:bg-orange-500 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-orange-500/25">
                <span className="text-2xl font-black text-orange-600 group-hover:text-white transition-colors duration-300">2</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-900 group-hover:text-orange-950 transition-colors mb-2">Take the Assessment</h3>
                <p className="text-gray-500 leading-relaxed font-normal">
                  Once your application is reviewed, you'll receive a link to our 45-minute online aptitude and logic assessment. It can be taken from the comfort of your home at any time within 48 hours of receiving the link.
                </p>
              </div>
            </div>

            <div className="group flex flex-col md:flex-row gap-6 items-start bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200/90 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out cursor-default">
              <div className="w-16 h-16 rounded-full bg-emerald-100 group-hover:bg-emerald-600 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-emerald-500/25">
                <span className="text-2xl font-black text-emerald-600 group-hover:text-white transition-colors duration-300">3</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-900 group-hover:text-emerald-950 transition-colors mb-2">Personal Interview & Result</h3>
                <p className="text-gray-500 leading-relaxed font-normal">
                  Shortlisted candidates will be invited for a brief 15-minute video interview with our admission counselors to understand your career goals. Results and scholarship percentage are announced within 24 hours!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1000px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-[1.2]">Ready to Start Your <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Journey?</span></h2>
          <p className="text-gray-500 text-base md:text-lg mb-10 max-w-2xl mx-auto font-normal">
            Don't let anything hold you back. Apply today, secure your scholarship, and take the first step towards a high-paying career in tech.
          </p>
          <Dialog>
            <DialogTrigger render={
              <button className="inline-flex h-14 px-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-700 text-base md:text-lg font-normal items-center justify-center hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 transition-all shadow-lg shadow-orange-500/25 cursor-pointer">
                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            } />
            <DialogContent className="sm:max-w-2xl p-0 border-none bg-transparent shadow-none overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <ScholarshipApplicationForm />
            </DialogContent>
          </Dialog>
        </div>
      </section>

    </div>
  );
}
