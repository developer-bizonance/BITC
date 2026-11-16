"use client";

import React, { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { resolveImageUrl, getApiBase } from "@/lib/utils";

export interface Partner {
  id?: string;
  name: string;
  logo: string;
  cover?: boolean;
  isActive?: boolean;
}

export interface IndustrialPartnersProps {
  className?: string;
  animated?: boolean;
  type?: "corporate" | "home";
  title?: React.ReactNode;
  subtitle?: string;
}

function PartnerLogoImage({ partner }: { partner: Partner }) {
  const rawLogo = partner.logo?.trim() || "";
  const [imgSrc, setImgSrc] = useState<string>(() => (rawLogo ? resolveImageUrl(rawLogo) : ""));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fresh = partner.logo?.trim() || "";
    setImgSrc(fresh ? resolveImageUrl(fresh) : "");
    setHasError(false);
  }, [partner.logo]);

  const handleError = () => {
    setHasError(true);
  };

  if (!imgSrc || hasError) {
    return <Building2 className="w-8 h-8 text-slate-400" />;
  }

  return (
    <img
      src={imgSrc}
      alt={partner.name}
      title={partner.name}
      onError={handleError}
      className={
        partner.cover
          ? "w-full h-full object-cover"
          : "max-h-11 md:max-h-12 w-auto object-contain filter drop-shadow-xs"
      }
    />
  );
}

export default function IndustrialPartners({
  className = "",
  animated = true,
  type = "corporate",
  title,
  subtitle,
}: IndustrialPartnersProps = {}) {
  const [partnersList, setPartnersList] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const endpoint = "industry-partners";

  // Fetch dynamic partners strictly from Database / Backend API
  useEffect(() => {
    let isMounted = true;
    async function loadPartners() {
      try {
        let partners: Partner[] = [];

        // 1. Fetch from local Next.js API (Neon PostgreSQL CmsData)
        try {
          const res = await fetch(`/api/${endpoint}?t=${Date.now()}`, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            const list = Array.isArray(data?.partners)
              ? data.partners
              : Array.isArray(data)
                ? data
                : [];
            if (list.length > 0) {
              partners = list;
            }
          }
        } catch (localErr) {
          console.warn("[IndustrialPartners] Local API notice:", localErr);
        }

        // 2. Fallback to Express backend API if needed
        if (partners.length === 0) {
          try {
            const apiUrl = getApiBase();
            const res = await fetch(`${apiUrl}/${endpoint}?t=${Date.now()}`, { cache: "no-store" });
            if (res.ok) {
              const data = await res.json();
              const list = Array.isArray(data?.partners)
                ? data.partners
                : Array.isArray(data)
                  ? data
                  : [];
              if (list.length > 0) {
                partners = list;
              }
            }
          } catch (backendErr) {
            console.warn("[IndustrialPartners] Backend API notice:", backendErr);
          }
        }

        // Filter unique and visible partners (isActive !== false)
        const uniquePartners: Partner[] = [];
        const seen = new Set();
        for (const p of partners) {
          if ((p as any)?.isActive === false) continue;
          const norm = p.name?.trim().toLowerCase();
          if (norm && !seen.has(norm)) {
            seen.add(norm);
            uniquePartners.push(p);
          }
        }

        if (isMounted) {
          setPartnersList(uniquePartners);
        }
      } catch (err) {
        console.warn("Failed to load hiring partners:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadPartners();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  if (!loading && partnersList.length === 0) {
    return null;
  }

  const renderCard = (partner: Partner, i: number, isDuplicate = false, isMarquee = true) => {
    const key = isDuplicate ? `dup-${partner.id || i}` : (partner.id || i);

    return (
      <div
        key={key}
        title={partner.name}
        className={`bg-transparent border-0 shadow-none ring-0 flex items-center justify-center text-center cursor-default ${isMarquee
          ? "flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] p-2"
          : "w-full h-20 md:h-24 p-2 sm:p-3"
          }`}
      >
        <div className="w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
          <PartnerLogoImage partner={partner} />
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full py-4 ${className}`}>
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-10 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {title ? (
              title
            ) : (
              <>
                Our{" "}
                <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">
                  Corporate Partners
                </span>
              </>
            )}
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed font-normal">
            {subtitle ||
              "We collaborate with local businesses, startups, and growing enterprises to drive business expansion, workforce training, digital enablement, and skilled talent acquisition."}
          </p>
        </div>

        {/* Without Animation: Show 5 cards per horizontal line in a clean static grid */}
        {!animated ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 items-center justify-items-center py-4">
            {partnersList.map((partner, i) => (
              <div key={partner.id || i} className="w-full flex items-center justify-center">
                {renderCard(partner, i, false, false)}
              </div>
            ))}
          </div>
        ) : partnersList.length <= 4 ? (
          /* Display static centered cards if 4 or fewer partners to prevent duplicates when animated */
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-4">
            {partnersList.map((partner, i) => renderCard(partner, i, false, true))}
          </div>
        ) : (
          /* Marquee Container when more than 4 partners on landing page */
          <div className="relative px-1 sm:px-2 overflow-hidden py-3 group">
            {/* Scoped CSS for Guaranteed Production Animation */}
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes bitcIndustrialMarqueeScroll {
                  0% { transform: translateX(0%); }
                  100% { transform: translateX(-50%); }
                }
                @-webkit-keyframes bitcIndustrialMarqueeScroll {
                  0% { -webkit-transform: translateX(0%); }
                  100% { -webkit-transform: translateX(-50%); }
                }
                .bitc-industrial-marquee-track {
                  display: flex !important;
                  width: max-content !important;
                  animation: bitcIndustrialMarqueeScroll 28s linear infinite !important;
                  -webkit-animation: bitcIndustrialMarqueeScroll 28s linear infinite !important;
                  will-change: transform;
                }
                .bitc-industrial-marquee-track:hover {
                  animation-play-state: paused !important;
                  -webkit-animation-play-state: paused !important;
                }
              `
            }} />

            {/* Fading edges to make it look smooth */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Marquee Track */}
            <div className="flex w-max bitc-industrial-marquee-track animate-marquee">
              <div className="flex gap-3 md:gap-4 px-2">
                {partnersList.map((partner, i) => renderCard(partner, i, false, true))}
              </div>
              {/* Duplicate track for seamless looping only in continuous marquee */}
              <div className="flex gap-3 md:gap-4 px-2" aria-hidden="true">
                {partnersList.map((partner, i) => renderCard(partner, i, true, true))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
