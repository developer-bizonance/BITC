"use client";

import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

const getCompanyLogo = (companyName: string) => {
  const domains: Record<string, string> = {
    "Google": "google.com",
    "Microsoft": "microsoft.com",
    "Amazon": "amazon.com",
    "IBM": "ibm.com"
  };
  const domain = domains[companyName] || `${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
};

const facultyData = [
  {
    name: "Dr. Ananya Sharma",
    role: "Senior AI Researcher",
    workingAt: "Google",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300",
    expertise: ["Machine Learning", "NLP", "Python", "Deep Learning"],
    linkedin: "https://linkedin.com",
  },
  {
    name: "Rahul Verma",
    role: "Lead Full Stack Developer",
    workingAt: "Microsoft",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=300&h=300",
    expertise: ["React", "Node.js", "System Design", "TypeScript"],
    linkedin: "https://linkedin.com",
  },
  {
    name: "Priya Desai",
    role: "UX Strategy Lead",
    workingAt: "Amazon",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300",
    expertise: ["User Research", "Figma", "UI/UX", "Prototyping"],
    linkedin: "https://linkedin.com",
  },
  {
    name: "Vikram Singh",
    role: "Cyber Security Analyst",
    workingAt: "IBM",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
    expertise: ["Network Security", "Ethical Hacking", "Cryptography"],
    linkedin: "https://linkedin.com",
  },
];

export default function FacultySection() {
  return (
    <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-white relative overflow-hidden">
      <div className="container max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Master your craft with <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">renowned faculty</span>
            </h2>
            <p className="text-slate-700 font-semibold text-[16px] capitalize tracking-wider">Instructors</p>
          </div>
          <button className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-primary transition-colors cursor-pointer">
            See More <span className="text-lg leading-none" aria-hidden="true">&rarr;</span>
          </button>
        </div>

        {/* Marquee Container */}
        <div className="relative overflow-hidden py-4 group">
          {/* Scoped CSS for Animation */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes facultyMarquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              @-webkit-keyframes facultyMarquee {
                0% { -webkit-transform: translateX(0%); }
                100% { -webkit-transform: translateX(-50%); }
              }
              .bitc-faculty-marquee-track {
                display: flex !important;
                width: max-content !important;
                animation: facultyMarquee 40s linear infinite !important;
                -webkit-animation: facultyMarquee 40s linear infinite !important;
                will-change: transform;
              }
              .bitc-faculty-marquee-track:hover {
                animation-play-state: paused !important;
                -webkit-animation-play-state: paused !important;
              }
            `
          }} />

          {/* Fading edges to make it look smooth */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

          {/* Marquee Track */}
          <div className="flex w-max bitc-faculty-marquee-track">
            
            {/* Original Set */}
            <div className="flex gap-6 px-3">
              {facultyData.map((faculty, index) => (
                <div 
                  key={`orig-${index}`} 
                  className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden w-[280px] shrink-0 hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Image Section */}
                  <div className="w-full h-[180px] overflow-hidden bg-gray-100 relative">
                    <img
                      src={faculty.image}
                      alt={faculty.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{faculty.name}</h3>
                    <p className="text-xs font-medium text-slate-500 mb-4">{faculty.role}</p>

                    <div className="mb-4 flex items-center gap-2">
                      <p className="text-[11px] font-bold text-slate-400 capitalize tracking-wider">Working At:</p>
                      <div className="flex items-center gap-1.5">
                        <img src={getCompanyLogo(faculty.workingAt)} alt={faculty.workingAt} className="w-4 h-4 object-contain" title={faculty.workingAt} />
                        <span className="text-sm font-bold text-slate-800">{faculty.workingAt}</span>
                      </div>
                    </div>

                    <div className="mb-6 flex-grow">
                      <p className="text-[11px] font-bold text-slate-400 capitalize tracking-wider mb-2">Technical Expertise</p>
                      <div className="flex flex-wrap gap-1.5">
                        {faculty.expertise.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <a 
                        href={faculty.linkedin} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#0077b5] hover:bg-[#006097] px-4 py-1.5 rounded-full transition-colors self-start mt-2"
                      >
                        <FaLinkedin className="w-3.5 h-3.5" /> LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Duplicate Set for Seamless Loop */}
            <div className="flex gap-6 px-3" aria-hidden="true">
              {facultyData.map((faculty, index) => (
                <div 
                  key={`dup-${index}`} 
                  className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden w-[280px] shrink-0 hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Image Section */}
                  <div className="w-full h-[180px] overflow-hidden bg-gray-100 relative">
                    <img
                      src={faculty.image}
                      alt={faculty.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{faculty.name}</h3>
                    <p className="text-xs font-medium text-slate-500 mb-4">{faculty.role}</p>

                    <div className="mb-4 flex items-center gap-2">
                      <p className="text-[11px] font-bold text-slate-400 capitalize tracking-wider">Working At:</p>
                      <div className="flex items-center gap-1.5">
                        <img src={getCompanyLogo(faculty.workingAt)} alt={faculty.workingAt} className="w-4 h-4 object-contain" title={faculty.workingAt} />
                        <span className="text-sm font-bold text-slate-800">{faculty.workingAt}</span>
                      </div>
                    </div>

                    <div className="mb-6 flex-grow">
                      <p className="text-[11px] font-bold text-slate-400 capitalize tracking-wider mb-2">Technical Expertise</p>
                      <div className="flex flex-wrap gap-1.5">
                        {faculty.expertise.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <a 
                        href={faculty.linkedin} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#0077b5] hover:bg-[#006097] px-4 py-1.5 rounded-full transition-colors self-start mt-2"
                      >
                        <FaLinkedin className="w-3.5 h-3.5" /> LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
