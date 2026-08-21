"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  ChevronDown, Monitor, LineChart, PenTool,
  GraduationCap, Target, Handshake, 
  Trophy, BarChart, Briefcase, TrendingUp, Award, FileText, 
  Image as ImageIcon, Download, HelpCircle, Building2, 
  Compass, MessageSquare, Network, BookOpen, Menu, X, Users, ShieldCheck
} from "lucide-react";


export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveAccordion(null);
  }, [pathname]);

  // Prevent background body scroll when mobile menu is active
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  const toggleAccordion = (name: string) => {
    setActiveAccordion((prev) => (prev === name ? null : name));
  };

  const navCategories = {
    about: {
      label: "About",
      items: [
        { href: "/about", icon: Building2, title: "About BITC", desc: "Who we are" },
        { href: "/about/our-story", icon: BookOpen, title: "Our Story", desc: "Our journey so far" },
        { href: "/about/vision-mission", icon: Compass, title: "Vision & Mission", desc: "Our core purpose" },
        { href: "/about/directors-message", icon: MessageSquare, title: "Director's Message", desc: "Words from leadership" },
        { href: "/about/industry-partnerships", icon: Handshake, title: "Industry Partnerships", desc: "Our collaborations" },
        { href: "/about/our-mentors", icon: Users, title: "Our Mentors", desc: "Learn from the best" },
        { href: "/about/awards-recognition", icon: Trophy, title: "Awards & Recognition", desc: "Our achievements" },
        { href: "/about/careers", icon: Briefcase, title: "Careers", desc: "Join our team" },
        { href: "/about/alumni", icon: GraduationCap, title: "Our Alumni", desc: "Our successful graduates" },
      ],
    },
    certification: {
      label: "Certification",
      items: [
        { href: "/courses/it", icon: Monitor, title: "IT Courses", desc: "Software, Data & Cloud" },
        { href: "/courses/management", icon: LineChart, title: "Management", desc: "Business & Strategy" },
        { href: "/courses/design", icon: PenTool, title: "Design Courses", desc: "UI/UX & Graphics" },
        { href: "/certification/verify", icon: ShieldCheck, title: "Verify Certificate", desc: "Validate student credentials" },
      ],
    },
    placements: {
      label: "Placements",
      items: [
        { href: "/placements/cell", icon: Target, title: "Placement Cell", desc: "Career guidance & support" },
        { href: "/placements/partners", icon: Handshake, title: "Hiring Partners", desc: "Top companies we work with" },
        { href: "/placements/success-stories", icon: Trophy, title: "Success Stories", desc: "Hear from our alumni" },
        { href: "/placements/statistics", icon: BarChart, title: "Placement Statistics", desc: "Our track record" },
      ],
    },
    corporate: {
      label: "Corporate",
      items: [
        { href: "/corporate/training", icon: Briefcase, title: "Corporate Training", desc: "Customized team training" },
        { href: "/corporate/upskilling", icon: TrendingUp, title: "Employee Upskilling", desc: "Boost workforce skills" },
        { href: "/corporate/leadership", icon: Award, title: "Leadership Programs", desc: "Executive development" },
      ],
    },
    partnership: {
      label: "Partnership",
      items: [
        { href: "/partnership/mou", icon: FileText, title: "MoU", desc: "Academic collaborations" },
        { href: "/partnership/workshops", icon: Users, title: "Workshops", desc: "Skill-building sessions" },
        { href: "/partnership/fdp", icon: GraduationCap, title: "Faculty Development", desc: "Training for educators" },
        { href: "/partnership/industrial-visits", icon: Building2, title: "Industrial Visits", desc: "Real-world exposure" },
      ],
    },
    resources: {
      label: "Resources",
      items: [
        { href: "/resources/blog", icon: BookOpen, title: "Blog", desc: "Latest news & articles" },
        { href: "/resources/gallery", icon: ImageIcon, title: "Gallery", desc: "Photos from our campus" },
        { href: "/resources/downloads", icon: Download, title: "Downloads", desc: "Brochures & materials" },
        { href: "/resources/faqs", icon: HelpCircle, title: "FAQs", desc: "Questions & answers" },
      ],
    },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container max-w-[1400px] mx-auto flex h-[65px] sm:h-[75px] items-center justify-between px-3 sm:px-4 lg:px-6 w-full">

        {/* Left Section: Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 xl:gap-8 h-full">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logos.png"
              alt="BITC Logo"
              width={260}
              height={85}
              className="h-[50px] sm:h-[65px] md:h-[75px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-6 text-[14px] font-semibold text-[#191E27] h-full">
            {Object.entries(navCategories).map(([key, cat]) => (
              <div key={key} className="relative group h-full flex items-center cursor-pointer">
                <span className="flex items-center hover:text-primary transition-colors py-2">
                  {cat.label} <ChevronDown className="ml-1 h-3.5 w-3.5 text-gray-500 group-hover:rotate-180 transition-transform duration-300" />
                </span>
                <div className="absolute top-[75px] left-0 hidden group-hover:block w-[280px] bg-white border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-2xl p-3 z-50 transition-all opacity-0 group-hover:opacity-100 animate-in fade-in slide-in-from-top-4 duration-300">
                  {cat.items.map((item, i) => (
                    <Link key={i} href={item.href} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group/link">
                      <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-slate-900 group-hover/link:text-primary transition-colors leading-tight">{item.title}</div>
                        <div className="text-[11px] text-gray-500 font-normal mt-0.5 leading-tight">{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <Link href="/events" className="h-full flex items-center hover:text-primary transition-colors font-medium">
              Events
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors font-medium">
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Section: Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger Icon on Mobile (< lg) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Backdrop & Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 top-[65px] sm:top-[75px] z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200" 
          onClick={() => setMobileOpen(false)}
        >
          <div 
            className="w-full max-w-[340px] mr-auto h-[calc(100vh-65px)] sm:h-[calc(100vh-75px)] bg-white shadow-2xl overflow-y-auto p-4 sm:p-6 flex flex-col justify-between animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              {Object.entries(navCategories).map(([key, cat]) => {
                const isOpen = activeAccordion === key;
                return (
                  <div key={key} className="border-b border-slate-100 pb-2">
                    <button
                      onClick={() => toggleAccordion(key)}
                      className="w-full flex items-center justify-between py-2 text-slate-900 font-bold text-base hover:text-primary transition-colors text-left"
                    >
                      <span>{cat.label}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                    </button>
                    
                    {isOpen && (
                      <div className="pl-2 pr-1 py-1.5 space-y-1 bg-slate-50 rounded-xl my-1 animate-in slide-in-from-top-2 duration-200">
                        {cat.items.map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
                          >
                            <item.icon className="w-4 h-4 text-primary shrink-0" />
                            <span>{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-2 space-y-3 border-t border-slate-100">
                <Link
                  href="/events"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-slate-900 font-bold text-base hover:text-primary transition-colors"
                >
                  Events
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-slate-900 font-bold text-base hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>


          </div>
        </div>
      )}
    </header>
  );
}
