"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import { Briefcase } from "lucide-react";
import { resolveImageUrl, getApiBase } from "@/lib/utils";

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
  area?: string;
  category?: string;
  img: string;
  thought?: string;
  linkedin?: string;
}

export default function FacultySection() {
  const [facultyList, setFacultyList] = useState<MentorItem[]>([]);

  useEffect(() => {
    async function loadMentors() {
      try {
        const res = await fetch(`${getApiBase()}/mentors`);
        if (res.ok) {
          const data = await res.json();
          if (data.mentors && data.mentors.length > 0) {
            setFacultyList(data.mentors);
          }
        }
      } catch (err) {
        console.warn("Failed to load dynamic mentors:", err);
      }
    }
    loadMentors();
  }, []);

  const renderCard = (mentor: MentorItem, key: string, extraClasses: string = "") => (
    <div
      key={key}
      className={`group relative bg-white border border-slate-200/80 shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1.5 transition-all duration-500 flex flex-col ${extraClasses}`}
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
            <h3 className="text-[18px] font-bold text-black group-hover:text-black transition-colors duration-300">
              {mentor.name}
            </h3>
            {mentor.linkedin && (
              <a
                href={mentor.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-[#0077b5] hover:text-[#006097] transition-colors"
                aria-label={`${mentor.name} LinkedIn`}
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            )}
          </div>
          <p className="text-[12px] text-primary font-bold mb-1">{mentor.role}</p>

          {/* Working at: Company name right after Role */}
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
            {mentor.skills?.map((skill, j) => (
              <span
                key={j}
                className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 mt-auto">
          <span className="text-[11px] font-medium text-slate-400 truncate max-w-[170px]">
            {mentor.category || mentor.area || "Industry Expert"}
          </span>
          {mentor.exp && (
            <div className="flex items-center gap-1.5 text-slate-700">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold">{mentor.exp}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-white relative overflow-hidden">
      <div className="container max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header with See More on right */}
        <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Our <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Mentors</span>
            </h2>
          </div>
          <Link
            href="/about/our-mentors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-primary transition-colors cursor-pointer shrink-0"
          >
            See More <span className="text-lg leading-none" aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {facultyList.length > 4 ? (
          /* Marquee Container for more than 4 mentors */
          <div className="relative overflow-hidden py-1 group">
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
                  animation: facultyMarquee 35s linear infinite !important;
                  -webkit-animation: facultyMarquee 35s linear infinite !important;
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
              <div className="flex gap-4 sm:gap-5 px-2.5">
                {facultyList.map((faculty, index) => renderCard(faculty, `orig-${index}`, "w-[275px] shrink-0"))}
              </div>

              {/* Duplicate Set for Seamless Loop */}
              <div className="flex gap-4 sm:gap-5 px-2.5" aria-hidden="true">
                {facultyList.map((faculty, index) => renderCard(faculty, `dup-${index}`, "w-[275px] shrink-0"))}
              </div>
            </div>
          </div>
        ) : (
          /* Clean responsive cards when <= 4 mentors - centered */
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full">
            {facultyList.map((faculty, index) => renderCard(faculty, `grid-${index}`, "w-full sm:w-[280px] max-w-[280px]"))}
          </div>
        )}

      </div>
    </section>
  );
}
