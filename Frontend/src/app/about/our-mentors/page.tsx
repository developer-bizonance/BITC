"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { resolveImageUrl, getApiBase } from "@/lib/utils";
import { ApplyFormContent } from "@/app/apply/page";
import {
  Users,
  ArrowRight,
  Code,
  Layers,
  Terminal,
  Brain,
  Cloud,
  Shield,
  Palette,
  Briefcase,
  BarChart3,
  Database,
  CheckCircle2,
  Video,
  Megaphone,
  FileText,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

const LOCAL_COMPANY_LOGOS: Record<string, string> = {
  "bizonance": "/logos/bizonance.png",
  "bizonance edtech": "/logos/bizonance.png",
  "bizonance technologies": "/logos/bizonance.png",
  "bizonance pvt ltd": "/logos/bizonance.png",
  "google": "/logos/google.svg",
  "microsoft": "/logos/microsoft.svg",
  "amazon": "/logos/amazon.svg",
  "aws": "/logos/amazon.svg",
  "tcs": "/logos/tcs.svg",
  "tata consultancy services": "/logos/tcs.svg",
  "infosys": "/logos/infosys.svg",
  "wipro": "/logos/wipro.svg",
  "cognizant": "/logos/cognizant.svg",
  "capgemini": "/logos/capgemini.svg",
  "deloitte": "/logos/deloitte.svg",
  "accenture": "/logos/accenture.svg",
  "hcl": "/logos/hcl.svg",
  "hcl tech": "/logos/hcl.svg",
  "hcltech": "/logos/hcl.svg",
  "ibm": "/logos/ibm.svg",
  "tech mahindra": "/logos/tech-mahindra.svg",
  "techmahindra": "/logos/tech-mahindra.svg",
  "apple": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  "meta": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  "facebook": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  "netflix": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "adobe": "https://www.google.com/s2/favicons?domain=adobe.com&sz=128",
  "mckinsey": "https://www.google.com/s2/favicons?domain=mckinsey.com&sz=128",
  "oracle": "https://www.google.com/s2/favicons?domain=oracle.com&sz=128",
  "cisco": "https://www.google.com/s2/favicons?domain=cisco.com&sz=128",
  "salesforce": "https://www.google.com/s2/favicons?domain=salesforce.com&sz=128",
  "intel": "https://www.google.com/s2/favicons?domain=intel.com&sz=128",
  "nvidia": "https://www.google.com/s2/favicons?domain=nvidia.com&sz=128",
  "uber": "https://www.google.com/s2/favicons?domain=uber.com&sz=128",
  "zomato": "https://www.google.com/s2/favicons?domain=zomato.com&sz=128",
  "swiggy": "https://www.google.com/s2/favicons?domain=swiggy.com&sz=128",
  "paytm": "https://www.google.com/s2/favicons?domain=paytm.com&sz=128",
  "flipkart": "https://www.google.com/s2/favicons?domain=flipkart.com&sz=128",
  "phonepe": "https://www.google.com/s2/favicons?domain=phonepe.com&sz=128",
  "razorpay": "https://www.google.com/s2/favicons?domain=razorpay.com&sz=128",
  "cred": "https://www.google.com/s2/favicons?domain=cred.club&sz=128",
  "ola": "https://www.google.com/s2/favicons?domain=olacabs.com&sz=128",
  "zoho": "https://www.google.com/s2/favicons?domain=zoho.com&sz=128",
  "atlassian": "https://www.google.com/s2/favicons?domain=atlassian.com&sz=128",
  "spotify": "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
  "slack": "https://www.google.com/s2/favicons?domain=slack.com&sz=128",
  "stripe": "https://www.google.com/s2/favicons?domain=stripe.com&sz=128",
  "paypal": "https://www.google.com/s2/favicons?domain=paypal.com&sz=128",
};

const getCompanyLogo = (companyName: string, customLogo?: string) => {
  if (customLogo && customLogo.trim()) {
    return resolveImageUrl(customLogo);
  }
  if (!companyName) return "";
  const normalized = companyName.trim().toLowerCase();

  if (LOCAL_COMPANY_LOGOS[normalized]) {
    return LOCAL_COMPANY_LOGOS[normalized];
  }

  for (const [key, logo] of Object.entries(LOCAL_COMPANY_LOGOS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return logo;
    }
  }

  const cleanDomain = normalized.replace(/[^a-z0-9]/g, "");
  return `https://www.google.com/s2/favicons?domain=${cleanDomain}.com&sz=128`;
};

interface MentorItem {
  id?: string;
  name: string;
  role: string;
  company: string;
  companyLogo?: string;
  exp: string;
  skills: string[];
  area: string;
  category?: string;
  img: string;
  thought?: string;
  linkedin?: string;
}

export default function OurMentorsPage() {
  const [mentorsList, setMentorsList] = useState<MentorItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Mentors");
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([
    "All Mentors",
    "Industry Experts",
    "Technical Consultants",
    "Corporate Trainers",
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const [mentorsRes, catsRes] = await Promise.allSettled([
          fetch(`${getApiBase()}/mentors`),
          fetch(`${getApiBase()}/mentor-categories`),
        ]);

        let loadedMentors: MentorItem[] = [];
        if (mentorsRes.status === "fulfilled" && mentorsRes.value.ok) {
          const data = await mentorsRes.value.json();
          if (data.mentors) {
            loadedMentors = data.mentors;
            setMentorsList(data.mentors);
          }
        }

        const dynamicCats: string[] = [];
        if (catsRes.status === "fulfilled" && catsRes.value.ok) {
          const catsData = await catsRes.value.json();
          if (Array.isArray(catsData.categories)) {
            catsData.categories.forEach((c: any) => {
              const name = (typeof c === "string" ? c : c.name)?.trim();
              if (name && !dynamicCats.includes(name)) {
                dynamicCats.push(name);
              }
            });
          }
        }

        // Strictly prioritize dashboard categories so the website is 100% in sync with the dashboard
        if (dynamicCats.length > 0) {
          setCategories(["All Mentors", ...dynamicCats]);
        } else {
          // Fallback if no categories configured yet
          setCategories(["All Mentors", "Industry Experts", "Technical Consultants", "Corporate Trainers"]);
        }
      } catch (err) {
        console.warn("Failed to load dynamic mentors or categories:", err);
      }
    }
    loadData();
  }, []);

  const normalizeCat = (cat: string) => {
    return cat.trim().toLowerCase().replace(/s$/, "");
  };

  const filteredMentors = mentorsList.filter((mentor) => {
    if (selectedCategory === "All Mentors") return true;
    const cat = (mentor.category || mentor.area || "Industry Expert").trim().toLowerCase();
    const target = selectedCategory.trim().toLowerCase();
    return cat === target || normalizeCat(cat) === normalizeCat(target);
  });

  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* ── HERO ── */}
      <section className="relative w-full lg:min-h-[calc(100vh-80px)] bg-white text-slate-900 py-14 sm:py-18 lg:py-28 overflow-hidden flex flex-col items-center justify-center">
        <div className="container max-w-[1000px] mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center lg:my-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium rounded-full px-4 py-1.5 text-sm mb-4 sm:mb-6 border border-primary/20">
            <Users className="w-4 h-4" />
            Our Mentors
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900 leading-[1.2]">
            Learn From <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Industry Experts</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-[900px] mx-auto leading-relaxed">
            At BITC, you learn directly from professionals who have built products, led teams, and solved real problems at the world's leading companies.
          </p>
        </div>
      </section>

      {/* ── WHY EXPERTS MATTER ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          {/* Centered Real-World Impact Tag */}
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Real-World Impact
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Side: Modern Image */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg shadow-slate-300/40 border border-slate-200/80 group">
                <img
                  src="/why-experts-matter.jpg?v=2"
                  alt="Why Experts Matter - Industry Mentors"
                  className="w-full h-[320px] sm:h-[380px] lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

            {/* Right Side: Heading (level with image), Paragraph, and Key Pillars */}
            <div className="lg:col-span-7 flex flex-col justify-start order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-5">
                Why Experts{" "}
                <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffaa00_0%,#ff7700_100%)]">
                  Matter
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal mb-8">
                The difference between knowing a concept and applying it in the real world is expert guidance. Our experts don&apos;t just teach—they share their experiences, failures, and lessons from years of working in the industry. That&apos;s the kind of education that transforms careers.
              </p>

              {/* Key Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200/80">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Battle-Tested Insights</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Knowledge beyond standard classroom textbooks</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Direct Career Guidance</h4>
                    <p className="text-xs text-slate-500 mt-0.5">1-on-1 reviews for code, portfolios & interviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MENTOR CARDS (Clean White Theme) ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Meet Our <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Experts</span>
            </h2>
            <p className="text-gray-600 max-w-none mx-auto text-base sm:text-lg md:text-xl">
              Industry professionals who students to career success.
            </p>
          </div>

          {/* Category Filter Pills (Certification style) */}
          <div className="flex justify-start sm:justify-center mb-10 overflow-x-auto pb-2 no-scrollbar gap-3 px-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer rounded-full px-6 py-2.5 text-sm transition-all shrink-0 ${isActive
                    ? "bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 shadow-md font-medium"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-normal"
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {filteredMentors.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 max-w-md mx-auto">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800 mb-1">
                No Mentors in "{selectedCategory}"
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                We are actively onboarding top industry leaders in this category.
              </p>
              <button
                onClick={() => setSelectedCategory("All Mentors")}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 hover:opacity-90 shadow-sm transition-all cursor-pointer"
              >
                View All Mentors
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredMentors.map((mentor, i) => (
                <div
                  key={mentor.id || i}
                  className="group relative bg-white border border-slate-200/80 shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1.5 transition-all duration-500 flex flex-col w-full"
                >
                  {/* Image Section */}
                  <div className="relative w-full aspect-square sm:aspect-auto sm:h-[220px] overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {mentor.img && resolveImageUrl(mentor.img) ? (
                      <img
                        src={resolveImageUrl(mentor.img)}
                        alt={mentor.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-900 font-bold text-3xl">
                        {mentor.name ? mentor.name.charAt(0).toUpperCase() : "M"}
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-4 sm:p-4.5 flex flex-col flex-1 bg-white justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-[18px] font-bold text-black group-hover:text-black transition-colors duration-300">{mentor.name}</h3>
                        {mentor.linkedin && (
                          <a
                            href={mentor.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#0077b5] hover:text-[#006097] transition-colors"
                          >
                            <FaLinkedin className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                      <p className="text-[12px] text-primary font-bold mb-1">{mentor.role}</p>

                      {mentor.company && (
                        <div className="flex items-center gap-1.5 mb-3 text-slate-700">
                          <span className="text-[11px] font-medium text-slate-500">Working at:</span>
                          <div className="flex items-center gap-1">
                            {getCompanyLogo(mentor.company, mentor.companyLogo) && (
                              <img
                                src={getCompanyLogo(mentor.company, mentor.companyLogo)}
                                alt={mentor.company}
                                className="w-3.5 h-3.5 object-contain rounded-xs"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (mentor.company?.toLowerCase().includes("bizo")) {
                                    target.src = "/logos/bizonance.png";
                                  } else {
                                    target.style.display = "none";
                                  }
                                }}
                                onLoad={(e) => {
                                  if (!mentor.companyLogo && e.currentTarget.naturalWidth <= 16 && e.currentTarget.naturalHeight <= 16) {
                                    e.currentTarget.style.display = "none";
                                  }
                                }}
                              />
                            )}
                            <span className="text-[11px] font-bold text-slate-800">{mentor.company}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {mentor.skills.map((skill, j) => (
                          <span key={j} className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>

                    </div>

                    <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 mt-auto">
                      <span className="text-[11px] font-medium text-slate-400 truncate max-w-[170px]">
                        {mentor.category || mentor.area || "Industry Expert"}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Briefcase className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[11px] font-bold">{mentor.exp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── AREAS OF EXPERTISE ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Areas of <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Expertise</span></h2>
            <p className="text-gray-600 max-w-[600px] mx-auto text-lg">Our mentors cover the most in-demand technology and business domains.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Full Stack Development", icon: Layers, color: "bg-blue-500/5 text-blue-600" },
              { title: "Software Development", icon: Terminal, color: "bg-purple-500/5 text-purple-600" },
              { title: "UI/UX Design", icon: Palette, color: "bg-pink-500/5 text-pink-600" },
              { title: "Database & Backend", icon: Database, color: "bg-indigo-500/5 text-indigo-600" },
              { title: "Cloud Computing", icon: Cloud, color: "bg-sky-500/5 text-sky-600" },
              { title: "Data Science", icon: BarChart3, color: "bg-emerald-500/5 text-emerald-600" },
              { title: "Information Security", icon: Shield, color: "bg-red-500/5 text-red-600" },
              { title: "AI & Machine Learning", icon: Brain, color: "bg-violet-500/5 text-violet-600" },
              { title: "Business Management", icon: Briefcase, color: "bg-amber-500/5 text-amber-600" },
              { title: "Digital Media Management", icon: Video, color: "bg-rose-500/5 text-rose-600" },
              { title: "Advertising And Marketing", icon: Megaphone, color: "bg-orange-500/5 text-orange-600" },
              { title: "Content Management", icon: FileText, color: "bg-teal-500/5 text-teal-600" }
            ].map((area, i) => (
              <div key={i} className={`${area.color.split(" ")[0]} rounded-2xl p-6 text-center hover:shadow-md transition-shadow`}>
                <area.icon className={`w-10 h-10 ${area.color.split(" ")[1]} mx-auto mb-3`} />
                <span className="font-bold text-slate-800 text-sm">{area.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BECOME A MENTOR CTA ── */}
      <section className="py-20 bg-white text-slate-900 relative overflow-hidden">
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Become a <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Mentor</span></h2>
          <p className="text-xl text-gray-600 mb-10">
            Are you an industry professional who wants to give back? Join BITC as a mentor and shape the careers of the next generation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
              <DialogTrigger className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 font-normal flex items-center gap-2 justify-center hover:shadow-xl transition-all text-base sm:text-lg shadow-orange-500/20 cursor-pointer">
                Apply as Mentor <ArrowRight className="w-5 h-5" />
              </DialogTrigger>
              <DialogContent className="max-w-2xl sm:max-w-2xl w-[95vw] p-0 border-none bg-transparent shadow-none max-h-[95vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <Suspense fallback={<div className="p-8 bg-white text-center rounded-xl">Loading form...</div>}>
                  <ApplyFormContent
                    key={isApplyOpen ? "open" : "closed"}
                    defaultRole="Industry Expert & Mentor"
                    subtitle="Join BITC as a mentor to guide students, share industry experience, and shape the next generation of tech talent."
                    onClose={() => setIsApplyOpen(false)}
                  />
                </Suspense>
              </DialogContent>
            </Dialog>
            <Link href="/contact" className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-white text-slate-600 font-normal flex items-center justify-center border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-base sm:text-lg shadow-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
