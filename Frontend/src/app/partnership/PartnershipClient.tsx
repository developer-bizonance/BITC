"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowRight, BookOpen, Users, Zap, ShieldCheck, CheckCircle2, Briefcase, TrendingUp, Award, Building2, GraduationCap, FileText, Laptop, Mic, PlayCircle, Star, Code, Ticket, Network, Lightbulb, Trophy, X, Handshake, Target, Mic2, Rocket } from "lucide-react";
import { PartnerWithUsForm } from "@/components/forms/PartnerWithUsForm";
import AcademicPartners from "@/components/AcademicPartners";
import IndustrialPartners from "@/components/IndustrialPartners";

export default function PartnershipClient({ initialTab }: { initialTab?: "educational" | "corporate" } = {}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const getComputedTab = (): "educational" | "corporate" => {
    if (initialTab) return initialTab;
    if (pathname.includes("/corporate")) return "corporate";
    if (pathname.includes("/educational")) return "educational";
    const tabParam = searchParams.get("tab");
    if (tabParam === "corporate" || tabParam === "educational") return tabParam;
    return "educational";
  };

  const [activeTab, setActiveTab] = useState<"educational" | "corporate">(getComputedTab());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  useEffect(() => {
    setActiveTab(getComputedTab());
  }, [pathname, searchParams, initialTab]);

  const whatWeDoItems = [
    { name: "Placement Drives", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Expert Talks", icon: Mic, color: "text-pink-500", bg: "bg-pink-50" },
    { name: "Guest Lectures", icon: Users, color: "text-amber-500", bg: "bg-amber-50" },
    { name: "Industrial Visits", icon: Building2, color: "text-slate-500", bg: "bg-slate-100" },
    { name: "Workshops", icon: Laptop, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Seminars", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Webinars", icon: PlayCircle, color: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "Masterclasses", icon: Star, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Bootcamps", icon: Rocket, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Hackathons", icon: Code, color: "text-cyan-500", bg: "bg-cyan-50" },
    { name: "Career Guidance", icon: Briefcase, color: "text-fuchsia-500", bg: "bg-fuchsia-50" },
    { name: "R&D Collaboration", icon: Ticket, color: "text-rose-500", bg: "bg-rose-50" },
    { name: "Networking Events", icon: Network, color: "text-teal-500", bg: "bg-teal-50" },
    { name: "Tech Meetups", icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-50" },
    { name: "Live Project Collaboration", icon: Trophy, color: "text-red-500", bg: "bg-red-50" },
  ];

  const corporateEventIdeas = [
    { name: "Placement Drives", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Business Roundtables", icon: Users, color: "text-pink-500", bg: "bg-pink-50" },
    { name: "Corporate Conclaves", icon: Building2, color: "text-amber-500", bg: "bg-amber-50" },
    { name: "Leadership Summits", icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Networking Meets", icon: Network, color: "text-teal-500", bg: "bg-teal-50" },
    { name: "Industry Panels", icon: Mic, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Excellence Awards", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50" },
    { name: "Startup Connect", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Strategic Planning", icon: Target, color: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "Innovation Challenges", icon: Lightbulb, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Marketing Summits", icon: Rocket, color: "text-rose-500", bg: "bg-rose-50" },
    { name: "Employee Engagement", icon: Users, color: "text-fuchsia-500", bg: "bg-fuchsia-50" },
    { name: "Women in Leadership", icon: Star, color: "text-pink-600", bg: "bg-pink-50" },
    { name: "CRM Workshops", icon: ShieldCheck, color: "text-cyan-500", bg: "bg-cyan-50" },
    { name: "Negotiation Masterclass", icon: Briefcase, color: "text-slate-600", bg: "bg-slate-100" },
    { name: "Case Competitions", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "CSR Initiatives", icon: Handshake, color: "text-red-500", bg: "bg-red-50" },
    { name: "Digital Transformation", icon: Laptop, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Wellness & Fitness", icon: CheckCircle2, color: "text-teal-600", bg: "bg-teal-50" },
    { name: "Vendor Partner Meets", icon: Handshake, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Corporate Expos", icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Crisis Management", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50" },
    { name: "Public Speaking Forums", icon: Mic2, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Growth & Expansion", icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-50" },
    { name: "Corporate Town Halls", icon: PlayCircle, color: "text-cyan-600", bg: "bg-cyan-50" },
    { name: "Mentorship & Advisory", icon: GraduationCap, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Full Screen Landing Section */}
      <section className="relative w-full lg:min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-14 sm:py-18 lg:py-20 overflow-hidden bg-white">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center flex flex-col items-center justify-center flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 text-sm font-medium mb-6 shadow-sm">
            <Handshake className="w-4 h-4" />
            <span>Collaborate With Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-slate-900 leading-[1.2]">
            {activeTab === "educational" ? "Educational" : "Corporate"} <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Partnership</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-[800px] mx-auto leading-relaxed font-normal mb-8">
            {activeTab === "educational"
              ? "Discover how we collaborate with top institutions to elevate academic standards."
              : "Discover how we partner with local businesses, startups, and growing enterprises to accelerate business expansion, train staff, and provide skilled talent."}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 font-medium items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg hover:shadow-orange-500/30 gap-2 cursor-pointer active:scale-95"
          >
            Submit MoU <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Content Area */}
      <section className="py-12 sm:py-16 md:py-24 bg-white lg:min-h-screen">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "educational" && (
              <div className="space-y-20">
                {/* Academic Partners Component - Static Grid without animation */}
                <AcademicPartners className="py-0 md:py-0" showButton={false} animated={false} />

                {/* Overview */}
                <div className="text-center max-w-3xl mx-auto pt-10 md:pt-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Bridging Academia And <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Industry</span></h2>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed font-normal">
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
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-105">
                        <item.icon className="w-7 h-7 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-600 mb-3 transition-colors duration-200 group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* What We Do Section */}
                <div className="py-10">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What we <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">do</span></h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
                      We organize a wide variety of events to cater to different learning styles and career goals.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    {whatWeDoItems.map((item, index) => (
                      <div key={index} className="flex flex-col items-center text-center group cursor-pointer">
                        <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-4 transition-all duration-200 ease-out group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-lg`}>
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits List */}
                <div className="flex flex-col lg:flex-row gap-12 items-center py-4">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Why Partner with Us?</h3>
                    <ul className="space-y-4">
                      {[
                        "Industry-Aligned Curriculum supplementing your standard syllabus.",
                        "Expert Mentorship from seasoned corporate professionals.",
                        "Hands-on experience through Live Projects and Case Studies.",
                        "Dedicated Placement Assistance for your certified students."
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4 p-3.5 sm:p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100/80 transition-all">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                          <span className="font-medium text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 w-full relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                    <img
                      src="/educational-partnership-mou.jpg"
                      alt="Educational Partnership"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "corporate" && (
              <div className="space-y-16 md:space-y-24">
                {/* Industrial Partners Component - Static Grid without animation */}
                <IndustrialPartners className="py-0 md:py-0" animated={false} />

                {/* Corporate Engagement & Business Events Section ("What we do") */}
                <div>
                  <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      What we <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">do</span>
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-normal">
                      We organize a wide variety of business events and engagement formats to foster growth and collaboration.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    {corporateEventIdeas.map((item, index) => (
                      <div key={index} className="flex flex-col items-center text-center group cursor-pointer">
                        <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-4 transition-all duration-200 ease-out group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-lg`}>
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Empowering Local & Growing Businesses Section */}
                <div>
                  <div className="text-center max-w-6xl mx-auto mb-10 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Empowering Local & Growing <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Businesses</span></h2>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed font-normal">
                      Whether you are an established local enterprise, retail business, service provider, or scaling venture, we help you streamline operations, adopt modern digital workflows, upskill your staff, and access job-ready talent tailored for your business growth.
                    </p>
                  </div>

                  {/* Key Areas Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { icon: TrendingUp, title: "Business Digitization", desc: "Modernize your everyday business operations with digital tools, online presence, and automated systems." },
                      { icon: Users, title: "Staff Upskilling", desc: "Practical training modules to elevate your employees' sales, customer handling, and operational efficiency." },
                      { icon: GraduationCap, title: "Skilled Local Talent", desc: "Directly recruit trained, job-ready professionals prepared to contribute to your business immediately." },
                      { icon: FileText, title: "Corporate MoU", desc: "Formalize ongoing strategic collaboration for continuous workforce development and business support." }
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-105">
                          <item.icon className="w-7 h-7 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-600 mb-3 transition-colors duration-200 group-hover:text-primary">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits List */}
                <div className="flex flex-col lg:flex-row-reverse gap-12 items-center py-4">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Why Partner with Us?</h3>
                    <ul className="space-y-4">
                      {[
                        "Tailored growth strategies designed specifically for local and expanding business needs.",
                        "Practical staff training modules that deliver immediate improvements in daily operations.",
                        "Direct access to skilled, job-ready local candidates ready to contribute from day one.",
                        "Continuous strategic guidance and digital tools to keep your business modern and competitive."
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4 p-3.5 sm:p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100/80 transition-all">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                          <span className="font-medium text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 w-full relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                    <img
                      src="/corporate-partnership-collaboration.jpg"
                      alt="Corporate Business Collaboration"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Unified CTA */}
            <div className="mt-20 text-center max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Ready to <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Collaborate?</span>
              </h3>
              <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed font-normal">
                Whether you are an academic institution or a corporate enterprise, let's discuss how we can build a brighter future together.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 font-normal items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg hover:shadow-orange-500/30 gap-2 cursor-pointer"
              >
                Submit MoU <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative animate-in zoom-in-95 duration-200 shadow-2xl my-auto" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-2 sm:p-4">
              <PartnerWithUsForm type={activeTab} onSuccess={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
