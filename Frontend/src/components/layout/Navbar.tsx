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
  const [currentQuery, setCurrentQuery] = useState("");
  const pathname = usePathname();

  // Track query params safely on client without de-opting Suspense
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentQuery(window.location.search);
    }
  }, [pathname]);

  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== "undefined") {
        setCurrentQuery(window.location.search);
      }
    };
    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("click", () => {
      setTimeout(handleUrlChange, 60);
    });
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("click", handleUrlChange);
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent background body scroll when mobile menu is active
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  // Hide Navbar completely on event feedback pages
  if (pathname?.includes("/feedback")) {
    return null;
  }

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
        { href: "/about/careers", icon: Briefcase, title: "Careers", desc: "Join our team" },
        { href: "/about/alumni", icon: GraduationCap, title: "Our Students Alumni", desc: "Our successful graduates" },
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
    partnership: {
      label: "Partnership",
      items: [
        { href: "/partnership/educational", icon: GraduationCap, title: "Educational Partnership", desc: "Collaborate with institutions" },
        { href: "/partnership/corporate", icon: Briefcase, title: "Corporate Partnership", desc: "Build corporate workforces" },
      ],
    },
  };

  const isItemActive = (itemHref: string) => {
    // 1. Items with query parameters (e.g., /partnership?tab=educational)
    if (itemHref.includes("?")) {
      const [targetPath, targetQuery] = itemHref.split("?");
      if (pathname !== targetPath) return false;
      const targetParams = new URLSearchParams(targetQuery);
      const currentParams = new URLSearchParams(currentQuery);

      const targetTab = targetParams.get("tab");
      const currentTab = currentParams.get("tab") || "educational"; // default tab
      return targetTab === currentTab;
    }

    // 2. Exact match
    if (pathname === itemHref) return true;

    // 3. Sub-route match (e.g., /resources/blog/my-post highlights /resources/blog, but NOT /about for /about/vision-mission)
    if (
      itemHref !== "/" &&
      itemHref !== "/about" &&
      itemHref !== "/certifications" &&
      itemHref !== "/partnership" &&
      pathname.startsWith(`${itemHref}/`)
    ) {
      return true;
    }

    return false;
  };

  const isCategoryActive = (catKey: string, cat: { items: { href: string }[] }) => {
    if (catKey === "about" && (pathname === "/about" || pathname.startsWith("/about/"))) return true;
    if (catKey === "certification" && (pathname.startsWith("/certification") || pathname.startsWith("/certifications"))) return true;
    if (catKey === "placements" && pathname.startsWith("/placements")) return true;
    if (catKey === "resources" && pathname.startsWith("/resources")) return true;
    if (catKey === "partnership" && pathname.startsWith("/partnership")) return true;
    return cat.items.some((item) => isItemActive(item.href));
  };

  // Auto-expand active accordion when mobile drawer opens
  useEffect(() => {
    if (mobileOpen) {
      for (const [key, cat] of Object.entries(navCategories)) {
        if (isCategoryActive(key, cat)) {
          setActiveAccordion(key);
          break;
        }
      }
    }
  }, [mobileOpen, pathname]);

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
              className="h-[23px] sm:h-[26px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] font-normal text-[#555] h-full">
            {Object.entries(navCategories).map(([key, cat]) => {
              const isActive = isCategoryActive(key, cat);
              return (
                <div key={key} className="relative group h-full flex items-center cursor-pointer">
                  <span className={`flex items-center hover:text-primary transition-colors py-1.5 ${isActive ? 'text-primary font-semibold' : ''}`}>
                    {cat.label} <ChevronDown className={`ml-1 h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-300 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                  </span>
                  <div className={`absolute bottom-[14px] left-0 right-0 h-[2px] bg-[#f5a300] transition-transform duration-300 origin-center ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block w-[290px] bg-white border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] rounded-2xl p-2.5 z-50 transition-all opacity-0 group-hover:opacity-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    {cat.items.map((item, i) => {
                      const itemActive = isItemActive(item.href);
                      return (
                        <Link
                          key={i}
                          href={item.href}
                          className="flex items-center gap-2.5 p-2 transition-colors group/link relative"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${itemActive
                            ? "bg-primary text-white shadow-xs"
                            : "bg-primary/10 text-primary group-hover/link:bg-primary group-hover/link:text-white"
                            }`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-[14px] leading-tight transition-colors ${itemActive ? "font-bold text-primary" : "font-medium text-gray-700 group-hover/link:text-primary"
                              }`}>
                              {item.title}
                            </div>
                            <div className={`text-[12px] font-normal mt-0.5 leading-tight ${itemActive ? "text-primary/75 font-medium" : "text-gray-500"
                              }`}>
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <Link href="/events" className={`group h-full flex items-center hover:text-primary transition-colors relative ${pathname.startsWith('/events') ? 'text-primary font-semibold' : ''}`}>
              Events
              <div className={`absolute bottom-[14px] left-0 right-0 h-[2px] bg-[#f5a300] transition-transform duration-300 origin-center ${pathname.startsWith('/events') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
            <Link href="/contact" className={`group h-full flex items-center hover:text-primary transition-colors relative ${pathname.startsWith('/contact') ? 'text-primary font-semibold' : ''}`}>
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
          className="fixed inset-0 top-[64px] z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-full max-w-[340px] mr-auto h-[calc(100dvh-64px)] bg-white shadow-2xl overflow-y-auto p-4 sm:p-6 flex flex-col justify-between animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              {Object.entries(navCategories).map(([key, cat]) => {
                const isOpen = activeAccordion === key;
                const catActive = isCategoryActive(key, cat);
                return (
                  <div key={key} className="border-b border-slate-100 pb-2">
                    <button
                      onClick={() => toggleAccordion(key)}
                      className={`w-full flex items-center justify-between py-2 text-base transition-colors text-left ${catActive ? "text-primary font-semibold" : "text-slate-700 font-normal hover:text-primary"
                        }`}
                    >
                      <span>{cat.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : catActive ? "text-primary" : "text-slate-500"}`} />
                    </button>

                    {isOpen && (
                      <div className="pl-2 pr-1 py-1.5 space-y-1 bg-slate-50 rounded-xl my-1 animate-in slide-in-from-top-2 duration-200">
                        {cat.items.map((item, i) => {
                          const itemActive = isItemActive(item.href);
                          return (
                            <Link
                              key={i}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center gap-3 p-2 text-xs sm:text-sm transition-colors group/mob ${itemActive
                                ? "text-primary font-semibold"
                                : "text-slate-600 font-normal hover:text-primary"
                                }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${itemActive ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover/mob:bg-primary group-hover/mob:text-white"
                                }`}>
                                <item.icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="flex-1">{item.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-2 space-y-3 border-t border-slate-100">
                <Link
                  href="/events"
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 text-base transition-colors ${pathname.startsWith('/events') ? 'text-primary font-bold' : 'text-slate-700 font-normal hover:text-primary'
                    }`}
                >
                  Events
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 text-base transition-colors ${pathname.startsWith('/contact') ? 'text-primary font-bold' : 'text-slate-700 font-normal hover:text-primary'
                    }`}
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
