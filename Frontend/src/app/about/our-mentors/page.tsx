"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { resolveImageUrl } from "@/lib/utils";
import { ApplyFormContent } from "@/app/apply/page";
import {
  Users,
  ArrowRight,
  Code,
  Brain,
  Cloud,
  Shield,
  Palette,
  Briefcase,
  BarChart3,
  Database,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

interface MentorItem {
  id?: string;
  name: string;
  role: string;
  company: string;
  exp: string;
  skills: string[];
  area: string;
  img: string;
  thought?: string;
  linkedin?: string;
}

export default function OurMentorsPage() {
  const [mentorsList, setMentorsList] = useState<MentorItem[]>([]);

  useEffect(() => {
    async function loadMentors() {
      try {
        const res = await fetch("/api/mentors");
        if (res.ok) {
          const data = await res.json();
          if (data.mentors) {
            setMentorsList(data.mentors);
          }
        }
      } catch (err) {
        console.warn("Failed to load dynamic mentors:", err);
      }
    }
    loadMentors();
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[calc(100vh-80px)] bg-white text-slate-900 py-20 lg:py-28 overflow-hidden flex flex-col items-center justify-center">
        <div className="container max-w-[1000px] mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium rounded-full px-5 py-2 text-sm uppercase tracking-widest mb-8 border border-primary/20">
            <Users className="w-4 h-4" />
            Our Mentors
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 leading-[1.2]">
            Learn From <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Industry Experts</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-[900px] mx-auto leading-relaxed">
            At BITC, you learn directly from professionals who have built products, led teams, and solved real problems at the world's leading companies.
          </p>
        </div>
      </section>

      {/* ── WHY MENTORS MATTER ── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container max-w-[1000px] mx-auto px-4">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Decorative accent line */}
            <div className="absolute top-0 left-0 w-2 h-full bg-[linear-gradient(to_bottom,#ffcc00_0%,#ff9900_100%)]" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
              <div className="md:w-1/3 text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500 mb-4 md:hidden">
                  <span className="text-2xl font-serif leading-none mt-2">"</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                  Why Experts <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Matter</span>
                </h2>
              </div>
              <div className="md:w-2/3">
                <div className="relative pl-0 md:pl-6 border-l-0 md:border-l-2 border-slate-200">
                  <div className="hidden md:block absolute -top-4 -left-4 text-5xl text-slate-200 font-serif leading-none bg-slate-50">"</div>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium relative z-10">
                    The difference between knowing a concept and applying it in the real world is expert guidance. Our experts don't just teach—they share their experiences, failures, and lessons from years of working in the industry. That's the kind of education that transforms careers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MENTOR CARDS (Clean White Theme) ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Meet Our <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Experts</span>
            </h2>
            <p className="text-gray-600 max-w-[600px] mx-auto text-xl">
              Industry professionals who guide BITC students to career success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mentorsList.map((mentor, i) => (
              <div 
                key={mentor.id || i} 
                className="group relative bg-white border border-slate-200/80 shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1.5 transition-all duration-500 flex flex-col w-full"
              >
                {/* Image Section */}
                <div className="relative w-full h-[260px] overflow-hidden bg-slate-100 shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={resolveImageUrl(mentor.img)} 
                    alt={mentor.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1 bg-white justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-[18px] font-medium text-gray-600 tracking-tight group-hover:text-primary transition-colors duration-300">{mentor.name}</h3>
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
                    <p className="text-[12px] text-primary font-bold mb-3">{mentor.role}</p>

                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {mentor.skills.map((skill, j) => (
                        <span key={j} className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>

                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[11px] font-bold">{mentor.exp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AREAS OF EXPERTISE ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Areas of <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Expertise</span></h2>
            <p className="text-gray-600 max-w-[600px] mx-auto text-lg">Our mentors cover the most in-demand technology and business domains.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Full stack development", icon: Code, color: "bg-blue-500/5 text-blue-600" },
              { title: "UI/UX Design", icon: Palette, color: "bg-pink-500/5 text-pink-600" },
              { title: "Database & Backend", icon: Database, color: "bg-indigo-500/5 text-indigo-600" },
              { title: "Cloud Computing", icon: Cloud, color: "bg-sky-500/5 text-sky-600" },
              { title: "Data Science", icon: BarChart3, color: "bg-green-500/5 text-green-600" },
              { title: "Information Security", icon: Shield, color: "bg-red-500/5 text-red-600" },
              { title: "AI & Machine Learning", icon: Brain, color: "bg-purple-500/5 text-purple-600" },
              { title: "Business & Strategy", icon: Briefcase, color: "bg-amber-500/5 text-amber-600" },
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Become a <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Mentor</span></h2>
          <p className="text-xl text-gray-600 mb-10">
            Are you an industry professional who wants to give back? Join BITC as a mentor and shape the careers of the next generation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Dialog>
              <DialogTrigger className="h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-black font-medium flex items-center gap-2 justify-center hover:shadow-xl transition-all text-lg shadow-orange-500/20 cursor-pointer">
                Apply as Mentor <ArrowRight className="w-5 h-5" />
              </DialogTrigger>
              <DialogContent className="max-w-3xl sm:max-w-3xl md:max-w-3xl w-[95vw] p-0 border-none bg-transparent shadow-none max-h-[95vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <Suspense fallback={<div className="p-8 bg-white text-center rounded-xl">Loading form...</div>}>
                  <ApplyFormContent />
                </Suspense>
              </DialogContent>
            </Dialog>
            <Link href="/contact" className="h-14 px-8 rounded-full bg-white text-slate-900 font-medium flex items-center justify-center border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-lg shadow-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
