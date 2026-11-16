"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Building2, Handshake, ArrowRight, X } from "lucide-react";
import { resolveImageUrl, getApiBase } from "@/lib/utils";
import { PartnerWithUsForm } from "@/components/forms/PartnerWithUsForm";

interface Partner {
  id?: string;
  name: string;
  logo: string;
  cover?: boolean;
  isActive?: boolean;
}

interface AcademicPartnersProps {
  className?: string;
  showButton?: boolean;
  animated?: boolean;
}

export default function AcademicPartners({
  className = "",
  showButton = true,
  animated = true,
}: AcademicPartnersProps = {}) {
  const [partnersList, setPartnersList] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState<{ [key: string | number]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch dynamic partners directly from Backend API (same endpoint used by admin Home.jsx)
  useEffect(() => {
    async function fetchPartners() {
      try {
        let list: Partner[] = [];

        // 1. Primary: fetch from local Next.js API (guarantees accurate visibility overrides)
        try {
          const localRes = await fetch(`/api/partners?t=${Date.now()}`, { cache: "no-store" });
          if (localRes.ok) {
            const localData = await localRes.json();
            const rawLocal = Array.isArray(localData?.partners)
              ? localData.partners
              : Array.isArray(localData)
              ? localData
              : [];
            if (rawLocal.length > 0) {
              list = rawLocal;
            }
          }
        } catch (localErr) {
          console.warn("Local /api/partners fetch notice:", localErr);
        }

        // 2. Fallback: central backend API
        if (list.length === 0) {
          try {
            const apiUrl = getApiBase();
            const res = await fetch(`${apiUrl}/partners?t=${Date.now()}`, { cache: "no-store" });
            if (res.ok) {
              const data = await res.json();
              const rawList = Array.isArray(data?.partners)
                ? data.partners
                : Array.isArray(data)
                ? data
                : [];
              if (rawList.length > 0) {
                list = rawList;
              }
            }
          } catch (apiErr) {
            console.warn("Backend /partners fetch notice:", apiErr);
          }
        }

        // Filter to strictly show visible partners (isActive !== false && isActive !== 'false')
        const visiblePartners = list.filter(
          (p: any) =>
            Boolean(p) &&
            p.isActive !== false &&
            p.isActive !== "false" &&
            p.status !== "hidden" &&
            p.status !== "inactive"
        );
        setPartnersList(visiblePartners);
      } catch (err) {
        console.warn("Failed to load dynamic partners:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, []);

  if (!loading && partnersList.length === 0) {
    return null;
  }

  const renderCard = (institute: Partner, i: number, isDuplicate = false, isMarquee = true) => {
    const key = isDuplicate ? `dup-${institute.id || i}` : (institute.id || i);
    const resolvedLogo = resolveImageUrl(institute.logo);

    return (
      <Card
        key={key}
        className={`border border-slate-100 ring-0 shadow-sm hover:shadow-xl transition-all duration-300 group/card bg-slate-50 flex flex-col items-center text-center hover:-translate-y-1.5 rounded-2xl overflow-hidden ${
          isMarquee
            ? "flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px]"
            : "w-full h-full"
        }`}
      >
        <div className="w-full aspect-[16/10] flex items-center justify-center bg-slate-50 overflow-hidden p-2">
          {resolvedLogo && !imgError[key] ? (
            <img
              src={resolvedLogo}
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
    <section className={`py-8 md:py-12 bg-white relative overflow-hidden ${className}`}>
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 md:mb-10 text-center max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Academic Partners</span>
          </h2>
          <p className="text-gray-500 text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed max-w-5xl mx-auto">
            We proudly collaborate with leading colleges and universities through strategic Memorandums of Understanding (MoUs) to provide<br className="hidden md:inline" /> industry-focused training, internships, certifications, workshops, research initiatives, and career development opportunities.
          </p>
        </div>

        {/* Without Animation: Show 5 cards per horizontal line in a clean static grid */}
        {!animated ? (
          partnersList.length < 5 ? (
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5 py-4">
              {partnersList.map((institute, i) => (
                <div key={institute.id || i} className="w-[calc(50%-10px)] sm:w-[calc(33.333%-14px)] md:w-[calc(25%-16px)] lg:w-[calc(20%-16px)] max-w-[240px]">
                  {renderCard(institute, i, false, false)}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 py-4">
              {partnersList.map((institute, i) => (
                <div key={institute.id || i} className="w-full">
                  {renderCard(institute, i, false, false)}
                </div>
              ))}
            </div>
          )
        ) : partnersList.length <= 4 ? (
          /* Display static centered cards if 4 or fewer partners to prevent duplicates when animated */
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-4">
            {partnersList.map((institute, i) => renderCard(institute, i, false, true))}
          </div>
        ) : (
          /* Marquee Container when more than 4 partners on landing page */
          <div className="relative px-1 sm:px-2 overflow-hidden py-3 group">
            {/* Scoped CSS for Guaranteed Production Animation */}
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes bitcMarqueeScroll {
                  0% { transform: translateX(0%); }
                  100% { transform: translateX(-50%); }
                }
                @-webkit-keyframes bitcMarqueeScroll {
                  0% { -webkit-transform: translateX(0%); }
                  100% { -webkit-transform: translateX(-50%); }
                }
                .bitc-academic-marquee-track {
                  display: flex !important;
                  width: max-content !important;
                  animation: bitcMarqueeScroll 28s linear infinite !important;
                  -webkit-animation: bitcMarqueeScroll 28s linear infinite !important;
                  will-change: transform;
                }
                .bitc-academic-marquee-track:hover {
                  animation-play-state: paused !important;
                  -webkit-animation-play-state: paused !important;
                }
              `
            }} />

            {/* Fading edges to make it look smooth */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Marquee Track */}
            <div className="flex w-max bitc-academic-marquee-track animate-marquee">
              <div className="flex gap-3 md:gap-4 px-2">
                {partnersList.map((institute, i) => renderCard(institute, i, false, true))}
              </div>
              {/* Duplicate track for seamless looping only in continuous marquee */}
              <div className="flex gap-3 md:gap-4 px-2" aria-hidden="true">
                {partnersList.map((institute, i) => renderCard(institute, i, true, true))}
              </div>
            </div>
          </div>
        )}

        {/* Propose a Partnership Button */}
        {showButton && (
          <div className="flex justify-center mt-6 md:mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 font-normal text-sm md:text-base shadow-md hover:shadow-xl hover:shadow-orange-500/25 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <Handshake className="w-5 h-5 text-slate-800" />
              <span>Propose a Partnership</span>
              <ArrowRight className="w-4 h-4 text-slate-800" />
            </button>
          </div>
        )}
      </div>

      {/* Partnership Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative animate-in zoom-in-95 duration-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors z-10 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-2 sm:p-4">
              <PartnerWithUsForm type="educational" onSuccess={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
