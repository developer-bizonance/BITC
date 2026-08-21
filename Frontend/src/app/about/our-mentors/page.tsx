"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  ExternalLink,
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
}

const defaultMentors: MentorItem[] = [
  { name: "Rahul Sharma", role: "Senior Software Engineer", company: "Google", exp: "12+ Years", skills: ["React", "Node.js", "System Design"], area: "Full Stack Development", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800", thought: "\"The best code is the code you don't have to write.\"" },
  { name: "Priya Patel", role: "Data Science Lead", company: "Microsoft", exp: "10+ Years", skills: ["Python", "TensorFlow", "SQL"], area: "Data Science & AI", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800", thought: "\"Data without context is just noise. Focus on the insights.\"" },
  { name: "Amit Verma", role: "Cloud Architect", company: "Amazon Web Services", exp: "14+ Years", skills: ["AWS", "Azure", "Kubernetes"], area: "Cloud Computing", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800", thought: "\"Architect for failure, and you'll never be surprised when it happens.\"" },
  { name: "Sneha Gupta", role: "Cybersecurity Consultant", company: "Deloitte", exp: "9+ Years", skills: ["Penetration Testing", "SIEM", "Compliance"], area: "Cyber Security", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800", thought: "\"Security is a process, not a product. Always stay vigilant.\"" },
  { name: "Vikram Reddy", role: "UX Design Director", company: "Adobe", exp: "11+ Years", skills: ["Figma", "User Research", "Prototyping"], area: "UI/UX Design", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800", thought: "\"Design is how it works, not just how it looks and feels.\"" },
  { name: "Neha Joshi", role: "Business Strategy Head", company: "McKinsey", exp: "13+ Years", skills: ["Strategy", "Analytics", "Leadership"], area: "Business & Management", img: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=800", thought: "\"Execution eats strategy for breakfast. Build things that matter.\"" },
];

export default function OurMentorsPage() {
  const [mentorsList, setMentorsList] = useState<MentorItem[]>(defaultMentors);

  useEffect(() => {
    async function loadMentors() {
      try {
        const res = await fetch("/api/mentors");
        if (res.ok) {
          const data = await res.json();
          if (data.mentors && data.mentors.length > 0) {
            setMentorsList(data.mentors);
          }
        }
      } catch (err) {
        console.warn("Failed to load dynamic mentors, using fallback:", err);
      }
    }
    loadMentors();
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[calc(100vh-80px)] bg-white text-slate-900 py-20 lg:py-28 overflow-hidden flex flex-col items-center justify-center border-b border-gray-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1000px] mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold rounded-full px-5 py-2 text-sm uppercase tracking-widest mb-8 border border-primary/20">
            <Users className="w-4 h-4" />
            Our Mentors
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Learn from <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">Industry Experts</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-[1.4rem] text-gray-600 max-w-[900px] mx-auto leading-relaxed">
            At BITC, you learn directly from professionals who have built products, led teams, and solved real problems at the world's leading companies.
          </p>
        </div>
      </section>

      {/* ── WHY MENTORS MATTER ── */}
      <section className="py-16 md:py-20 bg-white border-b border-gray-100">
        <div className="container max-w-[900px] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Why Mentors Matter</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-[700px] mx-auto">
            The difference between knowing a concept and applying it in the real world is mentorship. Our mentors don't just teach—they share their experiences, failures, and lessons from years of working in the industry. That's the kind of education that transforms careers.
          </p>
        </div>
      </section>

      {/* ── MENTOR CARDS (Clean White Theme) ── */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-y border-slate-200">
        {/* Subtle Accents */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Experts</span>
            </h2>
            <p className="text-gray-600 max-w-[600px] mx-auto text-xl">
              Industry professionals who guide BITC students to career success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mentorsList.map((mentor, i) => (
              <div 
                key={mentor.id || i} 
                className="group relative bg-white border border-slate-200/80 shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1.5 transition-all duration-500 flex flex-col w-full"
              >
                {/* Image Section */}
                <div className="relative w-full h-[260px] overflow-hidden bg-slate-100 shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={mentor.img} 
                    alt={mentor.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  {/* Company Badge */}
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-white/95 backdrop-blur-md text-[9px] font-bold tracking-wider text-slate-800 shadow-sm uppercase">
                      {mentor.company}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1 bg-white justify-between">
                  <div>
                    <h3 className="text-[18px] font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors duration-300 mb-0.5">{mentor.name}</h3>
                    <p className="text-[12px] text-primary font-bold mb-3">{mentor.role}</p>

                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {mentor.skills.map((skill, j) => (
                        <span key={j} className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {mentor.thought && (
                      <div className="relative mt-2 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-[12px] leading-relaxed italic text-slate-600">"{mentor.thought}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[11px] font-bold">{mentor.exp}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] shadow-sm">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AREAS OF EXPERTISE ── */}
      <section className="py-16 md:py-24 bg-white border-y border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Areas of Expertise</h2>
            <p className="text-gray-600 max-w-[600px] mx-auto text-lg">Our mentors cover the most in-demand technology and business domains.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "AI & Machine Learning", icon: Brain, color: "bg-purple-500/5 text-purple-600" },
              { title: "Full Stack Development", icon: Code, color: "bg-blue-500/5 text-blue-600" },
              { title: "Data Science", icon: BarChart3, color: "bg-green-500/5 text-green-600" },
              { title: "Cloud Computing", icon: Cloud, color: "bg-sky-500/5 text-sky-600" },
              { title: "Cyber Security", icon: Shield, color: "bg-red-500/5 text-red-600" },
              { title: "UI/UX Design", icon: Palette, color: "bg-pink-500/5 text-pink-600" },
              { title: "Business & Strategy", icon: Briefcase, color: "bg-amber-500/5 text-amber-600" },
              { title: "Database & Backend", icon: Database, color: "bg-indigo-500/5 text-indigo-600" },
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
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Become a Mentor</h2>
          <p className="text-xl text-gray-600 mb-10">
            Are you an industry professional who wants to give back? Join BITC as a mentor and shape the careers of the next generation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/apply?role=Industry%20Expert%20%26%20Mentor" className="h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-semibold flex items-center gap-2 justify-center hover:shadow-xl transition-all text-lg shadow-orange-500/20">
              Apply as Mentor <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="h-14 px-8 rounded-full bg-white/80 text-slate-900 font-semibold flex items-center justify-center border border-blue-200/80 hover:bg-white transition-all text-lg shadow-sm backdrop-blur-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
