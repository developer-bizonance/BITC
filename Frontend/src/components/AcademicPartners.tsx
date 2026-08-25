"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface Partner {
  id?: string;
  name: string;
  logo: string;
  cover?: boolean;
}

const defaultPartners: Partner[] = [
  {
    name: "Sant Gadge Baba Amravati University",
    logo: "/univercity.png",
  },
  {
    name: "Government College of Engineering, Amravati",
    logo: "/Govt.Engg.png",
  },
  {
    name: "P. R. Pote Patil College of Engineering and Management",
    logo: "/PR Pote.png",
  },
  {
    name: "Sipna College of Engineering & Technology",
    logo: "/Sipna.png",
  },
  {
    name: "Prof. Ram Meghe College of Engineering & Management",
    logo: "/Ram Mege.png",
  },
  {
    name: "Prof. Ram Meghe Institute of Technology and Research, Badnera - Amravati",
    logo: "/Ram Mege.png",
  },
  {
    name: "Shri H.V.P. Mandal's College of Engineering & Technology",
    logo: "/HUPM.png",
  },
];

export default function AcademicPartners() {
  const [partnersList, setPartnersList] = useState<Partner[]>(defaultPartners);
  const [imgError, setImgError] = useState<{ [key: string | number]: boolean }>({});

  // Fetch dynamic partners from Backend API
  useEffect(() => {
    async function loadPartners() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
          (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? "http://localhost:5000/api"
            : "https://bitc-backend-theta.vercel.app/api");

        const res = await fetch(`${apiUrl}/partners`);
        if (res.ok) {
          const data = await res.json();
          if (data.partners && data.partners.length > 0) {
            setPartnersList(data.partners);
          }
        }
      } catch (err) {
        console.warn("Failed to load dynamic partners, using fallback:", err);
      }
    }
    loadPartners();
  }, []);

  const renderCard = (institute: Partner, i: number, isDuplicate = false) => {
    const key = isDuplicate ? `dup-${institute.id || i}` : (institute.id || i);
    return (
      <Card
        key={key}
        className="flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] border border-slate-100 ring-0 shadow-sm hover:shadow-xl transition-all duration-300 group/card bg-slate-50 flex flex-col items-center text-center hover:-translate-y-1.5 rounded-2xl overflow-hidden"
      >
        <div className="w-full aspect-[16/10] flex items-center justify-center bg-slate-50 overflow-hidden p-2">
          {institute.logo && !imgError[key] ? (
            <img
              src={institute.logo}
              alt={institute.name}
              onError={() => setImgError((prev) => ({ ...prev, [key]: true }))}
              className={
                institute.cover
                  ? "w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  : "max-w-full max-h-full object-contain p-1 mix-blend-multiply group-hover/card:scale-105 transition-transform duration-300"
              }
            />
          ) : (
            <Building2 className="w-8 h-8 text-slate-400 group-hover/card:text-primary transition-colors" />
          )}
        </div>
        <div className="p-2 sm:p-3 flex-1 flex items-center justify-center w-full min-h-[60px]">
          <h3 className="text-[11px] sm:text-[12px] font-bold text-slate-700 leading-snug px-1 line-clamp-3" title={institute.name}>
            {institute.name}
          </h3>
        </div>
      </Card>
    );
  };

  return (
    <section className="py-8 md:py-12 bg-white relative overflow-hidden">
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 text-center sm:text-left max-w-4xl mx-auto sm:mx-0">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Our Academic Partners</h2>
          <p className="text-gray-600 text-[14px] leading-relaxed">
            We proudly collaborate with leading colleges and universities through strategic Memorandums of Understanding (MoUs) to provide industry-focused training, internships, certifications, workshops, research initiatives, and career development opportunities.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative px-1 sm:px-2 overflow-hidden py-3 group">
          {/* Fading edges to make it look smooth */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            <div className="flex gap-3 md:gap-4 px-2">
              {partnersList.map((institute, i) => renderCard(institute, i, false))}
            </div>
            {/* Duplicate track for seamless looping */}
            <div className="flex gap-3 md:gap-4 px-2" aria-hidden="true">
              {partnersList.map((institute, i) => renderCard(institute, i, true))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
