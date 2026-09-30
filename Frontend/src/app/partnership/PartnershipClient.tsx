"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Zap, ShieldCheck, CheckCircle2, Briefcase, TrendingUp, Award, Building2, GraduationCap, FileText, Laptop, Mic, PlayCircle, Star, Code, Ticket, Network, Lightbulb, Trophy, X, ChevronDown, Handshake, Target, Mic2, Rocket } from "lucide-react";
import { PartnerWithUsForm } from "@/components/forms/PartnerWithUsForm";
import IndustryPartnersGrid from "@/components/IndustryPartnersGrid";

export default function PartnershipClient() {
  const [activeTab, setActiveTab] = useState<"educational" | "corporate">("educational");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const whatWeDoItems = [
    { name: "Workshops", icon: Laptop, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Seminars", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Expert Talks", icon: Mic, color: "text-pink-500", bg: "bg-pink-50" },
    { name: "Webinars", icon: PlayCircle, color: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "Masterclasses", icon: Star, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Bootcamps", icon: Rocket, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Hackathons", icon: Code, color: "text-cyan-500", bg: "bg-cyan-50" },
    { name: "Industrial Visits", icon: Building2, color: "text-slate-500", bg: "bg-slate-100" },
    { name: "Guest Lectures", icon: Users, color: "text-amber-500", bg: "bg-amber-50" },
    { name: "Career Fair", icon: Briefcase, color: "text-fuchsia-500", bg: "bg-fuchsia-50" },
    { name: "Placement Drives", icon: Ticket, color: "text-rose-500", bg: "bg-rose-50" },
    { name: "Networking Events", icon: Network, color: "text-teal-500", bg: "bg-teal-50" },
    { name: "Tech Meetups", icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-50" },
    { name: "Innovation Challenges", icon: Trophy, color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Full Screen Landing Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-20 overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/30 via-transparent to-transparent pointer-events-none" />
        
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center flex flex-col items-center justify-center flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 text-sm font-semibold mb-6 shadow-sm">
            <Handshake className="w-4 h-4" />
            <span>Collaborate with us</span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            Our <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Partnerships</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-[800px] mx-auto leading-relaxed font-medium mb-12">
            Discover how we collaborate with top institutions to elevate academic standards, and partner with leading enterprises to build robust corporate workforces.
          </p>

          {/* Tabs (Capsules) */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button
              onClick={() => setActiveTab("educational")}
              className={`px-8 py-4 rounded-full font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-3 ${
                activeTab === "educational" 
                  ? "bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-black shadow-xl shadow-orange-500/20 scale-105" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              Educational Partnership
            </button>
            <button
              onClick={() => setActiveTab("corporate")}
              className={`px-8 py-4 rounded-full font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-3 ${
                activeTab === "corporate" 
                  ? "bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-black shadow-xl shadow-orange-500/20 scale-105" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Corporate Partnership
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center text-slate-400">
          <span className="text-[10px] font-bold mb-1 uppercase tracking-widest text-slate-400">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* Content Area */}
      <section className="py-24 bg-white min-h-screen">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "educational" && (
          <div className="space-y-20">
            {/* Overview */}
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Bridging Academia and <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Industry</span></h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We partner with leading universities, colleges, and educational institutions to deliver cutting-edge, industry-relevant tech training directly to students on their campuses.
              </p>
            </div>

            {/* Key Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: FileText, title: "Academic MoU", desc: "Formalize our collaboration to setup a Center of Excellence (CoE) directly on your campus." },
                { icon: Users, title: "Tech Workshops", desc: "Conduct regular intensive bootcamps, hackathons, and skill-building sessions." },
                { icon: GraduationCap, title: "Faculty Development", desc: "FDPs designed to upskill your professors in the latest industry tech stacks." },
                { icon: Building2, title: "Industrial Visits", desc: "Real-world exposure for students through guided tours of leading IT parks." }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* What We Do Section */}
            <div className="py-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What We <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Do</span></h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  We organize a wide variety of events to cater to different learning styles and career goals.
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {whatWeDoItems.map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center group cursor-pointer">
                    <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-1 group-hover:shadow-md`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits List */}
            <div className="flex flex-col lg:flex-row gap-12 items-center bg-slate-50 rounded-[2rem] p-8 md:p-12 border border-slate-100">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Why Partner With Us?</h3>
                <ul className="space-y-4">
                  {[
                    "Industry-Aligned Curriculum supplementing your standard syllabus.",
                    "Expert Mentorship from seasoned corporate professionals.",
                    "Hands-on experience through Live Projects and Case Studies.",
                    "Dedicated Placement Assistance for your certified students."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                      <span className="font-medium text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
                  alt="Educational Partnership" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "corporate" && (
          <div className="space-y-20">
            {/* Overview */}
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Empowering Your <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Workforce</span></h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Transform your team's capabilities with our enterprise-grade training solutions. We deliver customized learning paths that align directly with your business goals and technological needs.
              </p>
            </div>

            {/* Key Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Briefcase, title: "Corporate Training", desc: "Customized team training programs on modern tech stacks like MERN, Cloud, and AI." },
                { icon: TrendingUp, title: "Employee Upskilling", desc: "Continuous learning modules to keep your existing workforce sharp and up-to-date." },
                { icon: Award, title: "Leadership Certifications", desc: "Executive development focused on technical leadership, agile management, and strategy." }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Benefits List */}
            <div className="flex flex-col lg:flex-row-reverse gap-12 items-center bg-slate-50 rounded-[2rem] p-8 md:p-12 border border-slate-100">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Enterprise Advantages</h3>
                <ul className="space-y-4">
                  {[
                    "Highly customized syllabi tailored to your specific project needs.",
                    "Flexible delivery models: On-site, Hybrid, or fully Remote.",
                    "Post-training assessments and detailed performance analytics.",
                    "Onboarding bootcamps for your newly hired freshers."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                      <Zap className="w-6 h-6 text-yellow-500 shrink-0" />
                      <span className="font-medium text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                  alt="Corporate Training" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>


            {/* Partner Benefits */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Partner <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Benefits</span></h2>
                <p className="text-slate-600 max-w-[600px] mx-auto text-lg">Why leading companies choose to partner with us.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Access to Top Talent", icon: Target, desc: "Hire pre-assessed, project-ready candidates with hands-on experience in modern tech stacks." },
                  { title: "Reduced Onboarding Time", icon: Zap, desc: "Our graduates are already trained on industry standards, saving you months of initial training." },
                  { title: "Customized Upskilling", icon: BookOpen, desc: "Tailored training programs to upgrade your existing workforce on emerging technologies like AI and Cloud." },
                  { title: "Employer Branding", icon: Star, desc: "Build a strong brand presence on campuses through sponsored hackathons and tech talks." },
                  { title: "Live Project Outsourcing", icon: Code, desc: "Leverage our talent pool to build prototypes or internal tools under expert guidance." },
                  { title: "CSR Initiatives", icon: Handshake, desc: "Fulfill Corporate Social Responsibility goals by sponsoring tech education for deserving youth." },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all rounded-xl p-7">
                    <item.icon className="w-10 h-10 text-primary mb-5" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Industry Partners */}
            <IndustryPartnersGrid />
          </div>
        )}

        {/* Unified CTA */}
        <div className="mt-20 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Ready to Collaborate?</h3>
          <p className="text-slate-600 mb-8">
            Whether you are an academic institution or a corporate enterprise, let's discuss how we can build a brighter future together.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-black font-bold items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg hover:shadow-orange-500/30 gap-2"
          >
            Propose a Partnership <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
        </div>
      </section>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-2 sm:p-4">
              <PartnerWithUsForm type={activeTab} onSuccess={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
