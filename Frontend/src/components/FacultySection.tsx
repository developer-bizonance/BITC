"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { resolveImageUrl } from "@/lib/utils";

const getCompanyLogo = (companyName: string) => {
  const domains: Record<string, string> = {
    "Google": "google.com",
    "Microsoft": "microsoft.com",
    "Amazon": "amazon.com",
    "IBM": "ibm.com",
    "Adobe": "adobe.com",
    "McKinsey": "mckinsey.com",
    "Deloitte": "deloitte.com"
  };
  const domain = domains[companyName] || `${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

export default function FacultySection() {
  const [facultyList, setFacultyList] = useState<any[]>([]);

  useEffect(() => {
    async function loadMentors() {
      try {
        const res = await fetch("/api/mentors");
        if (res.ok) {
          const data = await res.json();
          if (data.mentors && data.mentors.length > 0) {
            const formatted = data.mentors.map((m: any) => ({
              name: m.name,
              role: m.role,
              workingAt: m.company || m.workingAt || "Independent",
              image: resolveImageUrl(m.img || m.image),
              expertise: m.skills || m.expertise || [],
              linkedin: m.linkedin,
            }));
            setFacultyList(formatted);
          }
        }
      } catch (err) {
        console.warn("Failed to load dynamic mentors:", err);
      }
    }
    loadMentors();
  }, []);

  return (
    <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-white relative overflow-hidden">
      <div className="container max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Master your craft with <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">renowned faculty</span>
            </h2>
            <p className="text-slate-700 font-semibold text-[16px]  tracking-wider">Instructors</p>
          </div>
          <Link href="/about/our-mentors" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-primary transition-colors cursor-pointer">
            See More <span className="text-lg leading-none" aria-hidden="true">&rarr;</span>
          </Link>
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

          {/* Fading edges to make it look smooth (only if marquee is active) */}
          {facultyList.length > 4 && (
            <>
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
            </>
          )}

          {/* Marquee Track */}
          <div className={`${facultyList.length > 4 ? 'flex w-max bitc-faculty-marquee-track' : 'w-full'}`}>
            
            {/* Original Set */}
            <div className={facultyList.length > 4 ? 'flex gap-6 px-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center w-full'}>
              {facultyList.map((faculty, index) => (
                <div 
                  key={`orig-${index}`} 
                  className={`bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden shrink-0 hover:shadow-md transition-shadow flex flex-col ${facultyList.length > 4 ? 'w-[280px]' : 'w-full max-w-[280px]'}`}
                >
                  {/* Image Section */}
                  <div className="w-full h-[240px] overflow-hidden bg-slate-100 relative shrink-0">
                    <img
                      src={faculty.image}
                      alt={faculty.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-medium text-gray-600 leading-tight">{faculty.name}</h3>
                      {faculty.linkedin && (
                        <a 
                          href={faculty.linkedin} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#0077b5] hover:text-[#006097] transition-colors"
                        >
                          <FaLinkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-4">{faculty.role}</p>

                    <div className="mb-4 flex items-center gap-2">
                      <p className="text-[11px] font-bold text-slate-400  tracking-wider">Working at:</p>
                      <div className="flex items-center gap-1.5">
                        <img src={getCompanyLogo(faculty.workingAt)} alt={faculty.workingAt} className="w-4 h-4 object-contain" title={faculty.workingAt} />
                        <span className="text-sm font-bold text-slate-800">{faculty.workingAt}</span>
                      </div>
                    </div>

                    <div className="mb-6 flex-grow">
                      <p className="text-[11px] font-bold text-slate-400  tracking-wider mb-2">Key specialization</p>
                      <div className="flex flex-wrap gap-1.5">
                        {faculty.expertise.map((skill: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Duplicate Set for Seamless Loop */}
            {facultyList.length > 4 && (
              <div className="flex gap-6 px-3" aria-hidden="true">
                {facultyList.map((faculty, index) => (
                  <div 
                    key={`dup-${index}`} 
                    className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden w-[280px] shrink-0 hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="w-full h-[240px] overflow-hidden bg-slate-100 relative shrink-0">
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-medium text-gray-600 leading-tight">{faculty.name}</h3>
                        {faculty.linkedin && (
                          <a 
                            href={faculty.linkedin} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[#0077b5] hover:text-[#006097] transition-colors"
                          >
                            <FaLinkedin className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-500 mb-4">{faculty.role}</p>

                      <div className="mb-4 flex items-center gap-2">
                        <p className="text-[11px] font-bold text-slate-400  tracking-wider">Working at:</p>
                        <div className="flex items-center gap-1.5">
                          <img src={getCompanyLogo(faculty.workingAt)} alt={faculty.workingAt} className="w-4 h-4 object-contain" title={faculty.workingAt} />
                          <span className="text-sm font-bold text-slate-800">{faculty.workingAt}</span>
                        </div>
                      </div>

                      <div className="mb-6 flex-grow">
                        <p className="text-[11px] font-bold text-slate-400  tracking-wider mb-2">Key specialization</p>
                        <div className="flex flex-wrap gap-1.5">
                          {faculty.expertise.map((skill: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
