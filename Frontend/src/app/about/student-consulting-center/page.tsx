import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Target, BookOpen, MessageSquare, Briefcase, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ConsultationForm from "@/components/ConsultationForm";

export const metadata: Metadata = {
  title: "Student Consulting Center | BIZONANCE Industrial Training Centre",
  description: "Get personalized career guidance and expert advice on courses at the BITC Student Consulting Center.",
};

export default function StudentConsultingCenter() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-full opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
            <Compass className="w-4 h-4" />
            Career Guidance & Counseling
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 max-w-4xl leading-tight">
            Navigate Your Career with <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Expert Guidance</span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 mb-10 max-w-2xl leading-relaxed">
            Not sure which Certification to choose? Confused about career paths? Our expert counselors are here to help you make informed decisions and build a clear roadmap for success.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#book-consultation" className="h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-900 text-lg font-bold flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5">
              Book Your Consultation <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How We Can Help <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">You</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">We provide comprehensive support at every stage of your educational and professional journey.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Career Path Mapping",
                desc: "We analyze your strengths, interests, and background to recommend the most suitable career domains."
              },
              {
                icon: BookOpen,
                title: "Certification Selection",
                desc: "Get expert advice on which BITC certification aligns perfectly with your long-term career goals."
              },
              {
                icon: Briefcase,
                title: "Industry Insights",
                desc: "Learn about the latest trends, in-demand skills, and salary expectations in the tech and management sectors."
              },
              {
                icon: MessageSquare,
                title: "Interview Preparation",
                desc: "Tips and strategies to help you ace technical and HR rounds with top hiring companies."
              },
              {
                icon: Calendar,
                title: "Personalized Roadmap",
                desc: "Walk away with a step-by-step, actionable plan covering learning, projects, and placements."
              },
              {
                icon: CheckCircle2,
                title: "Profile Building",
                desc: "Guidance on improving your resume, GitHub, and LinkedIn profiles to attract top recruiters."
              }
            ].map((service, i) => (
              <Card key={i} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form CTA Section */}
      <section id="book-consultation" className="py-20 bg-white border-t border-gray-100">
        <div className="container max-w-[800px] mx-auto px-4">
          <div className="bg-slate-50 rounded-[2rem] p-8 md:p-12 text-center text-slate-900 relative overflow-hidden shadow-xl border border-gray-200">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discuss Your <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Future?</span></h2>
              <p className="text-gray-600 text-lg mb-10 max-w-lg mx-auto">
                Schedule a one-on-one session with our senior career counselors. The consultation is completely free!
              </p>
              
              <div className="max-w-md mx-auto text-left">
                <ConsultationForm theme="light" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
