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
  Compass, MessageSquare, Network, BookOpen, Menu, X, Users, ShieldCheck, Video
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
        { href: "/about/our-mentors", icon: Users, title: "Our Mentors", desc: "Learn from the best" },
        { href: "/about/student-consulting-center", icon: MessageSquare, title: "Student Counseling Centre", desc: "Build success roadmap" },
        { href: "/about/awards-recognition", icon: Trophy, title: "Awards & Recognition", desc: "Our achievements" },
        { href: "/about/careers", icon: Briefcase, title: "Careers", desc: "Join our team" },
        { href: "/about/alumni", icon: GraduationCap, title: "Our Alumni", desc: "Our successful graduates" },
      ],
    },
    certification: {
      label: "Certification",
      items: [
        { href: "/certifications/it", icon: Monitor, title: "Information Technology", desc: "Software, Data & Cloud" },
        { href: "/certifications/digital-media", icon: Video, title: "Digital Media Technology", desc: "Digital Arts & Marketing" },
        { href: "/certifications/management", icon: LineChart, title: "Management Programs", desc: "Business & Strategy" },
        { href: "/certifications/design", icon: PenTool, title: "Design Programs", desc: "UI/UX & Graphics" },
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

    resources: {
      label: "Resources",
      items: [
        { href: "/resources/blog", icon: BookOpen, title: "Blog", desc: "Latest news & articles" },
        { href: "/resources/gallery", icon: ImageIcon, title: "Gallery", desc: "Latest photos and videos" },
        { href: "/resources/faqs", icon: HelpCircle, title: "FAQs", desc: "Questions & answers" },
      ],
    },
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f5f5f5] shadow-md">
      <div className="container max-w-[1400px] mx-auto flex h-[64px] items-center justify-between pl-4 pr-6 w-full">

        {/* Left Section: Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 xl:gap-8 h-full">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/BITC.svg"
              alt="BITC Logo"
              width={260}
              height={85}
              className="h-[24px] sm:h-[27px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] font-normal text-[#555] h-full">
            {Object.entries(navCategories).map(([key, cat]) => {
              const isActive = cat.items.some(item => pathname === item.href || pathname.startsWith(`${item.href}/`));
              return (
                <div key={key} className="relative group h-full flex items-center cursor-pointer">
                  <span className={`flex items-center hover:text-primary transition-colors py-1.5 ${isActive ? 'text-primary' : ''}`}>
                    {cat.label} <ChevronDown className={`ml-1 h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-300 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                  </span>
                  <div className={`absolute bottom-[14px] left-0 right-0 h-[2px] bg-[#f5a300] transition-transform duration-300 origin-center ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block w-[280px] bg-white border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-2xl p-3 z-50 transition-all opacity-0 group-hover:opacity-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    {cat.items.map((item, i) => (
                      <Link key={i} href={item.href} className="flex items-center gap-2.5 p-2 rounded-full hover:bg-gray-50 transition-colors group/link">
                        <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-black group-hover/link:text-primary transition-colors leading-tight">
                            {item.title}
                          </div>
                          <div className="text-[12px] text-gray-500 font-normal mt-0.5 leading-tight">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}

            <Link href="/partnership" className={`group h-full flex items-center hover:text-primary transition-colors relative ${pathname.startsWith('/partnership') ? 'text-primary' : ''}`}>
              Partnership
              <div className={`absolute bottom-[14px] left-0 right-0 h-[2px] bg-[#f5a300] transition-transform duration-300 origin-center ${pathname.startsWith('/partnership') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
            <Link href="/events" className={`group h-full flex items-center hover:text-primary transition-colors relative ${pathname.startsWith('/events') ? 'text-primary' : ''}`}>
              Events
              <div className={`absolute bottom-[14px] left-0 right-0 h-[2px] bg-[#f5a300] transition-transform duration-300 origin-center ${pathname.startsWith('/events') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
            <Link href="/contact" className={`group h-full flex items-center hover:text-primary transition-colors relative ${pathname.startsWith('/contact') ? 'text-primary' : ''}`}>
              Contact
              <div className={`absolute bottom-[14px] left-0 right-0 h-[2px] bg-[#f5a300] transition-transform duration-300 origin-center ${pathname.startsWith('/contact') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
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
          className="fixed inset-0 top-[54px] sm:top-[62px] z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-full max-w-[340px] mr-auto h-[calc(100vh-54px)] sm:h-[calc(100vh-62px)] bg-white shadow-2xl overflow-y-auto p-4 sm:p-6 flex flex-col justify-between animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              {Object.entries(navCategories).map(([key, cat]) => {
                const isOpen = activeAccordion === key;
                return (
                  <div key={key} className="border-b border-slate-100 pb-2">
                    <button
                      onClick={() => toggleAccordion(key)}
                      className="w-full flex items-center justify-between py-2 text-slate-700 font-normal text-base hover:text-primary transition-colors text-left"
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
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white text-slate-600 font-normal text-xs sm:text-sm transition-colors"
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
                  href="/partnership"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-slate-700 font-normal text-base hover:text-primary transition-colors"
                >
                  Partnership
                </Link>
                <Link
                  href="/events"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-slate-700 font-normal text-base hover:text-primary transition-colors"
                >
                  Events
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-slate-700 font-normal text-base hover:text-primary transition-colors"
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
