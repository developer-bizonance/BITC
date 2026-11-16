"use client";

import React, { useState, useEffect } from "react";
import { resolveImageUrl, getApiBase } from "@/lib/utils";

interface Partner {
  id?: string;
  name: string;
  logo: string;
  isActive?: boolean;
}

function MarqueeLogoItem({ company, index = 0 }: { company: Partner; index?: number }) {
  const rawLogo = company.logo?.trim() || "";
  const [imgSrc, setImgSrc] = useState<string>(() => (rawLogo ? resolveImageUrl(rawLogo) : ""));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fresh = company.logo?.trim() || "";
    setImgSrc(fresh ? resolveImageUrl(fresh) : "");
    setHasError(false);
  }, [company.logo]);

  const handleImageError = () => {
    setHasError(true);
  };

  // Stagger floating animation delay so logos float organically
  const floatDelay = `${((index % 6) * 0.45).toFixed(2)}s`;

  return (
    <div
      className="flex items-center justify-center transition-all duration-300 shrink-0 px-3 sm:px-4 py-0.5"
      style={{
        animation: "trustedLogoFloat 3.5s ease-in-out infinite",
        animationDelay: floatDelay,
      }}
    >
      {imgSrc && !hasError ? (
        <img
          src={imgSrc}
          alt={company.name}
          title={company.name}
          onError={handleImageError}
          className="h-7 sm:h-8 md:h-9 lg:h-10 w-auto object-contain max-w-[110px] sm:max-w-[130px] md:max-w-[155px] lg:max-w-[170px] hover:scale-105 transition-transform duration-200 filter drop-shadow-xs"
        />
      ) : (
        <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-700 whitespace-nowrap">
          {company.name}
        </span>
      )}
    </div>
  );
}

export default function TrustedBy({ className = "" }: { className?: string }) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchPartners() {
      try {
        let list: Partner[] = [];

        // 1. Fetch from local Next.js API
        try {
          const res = await fetch(`/api/hiring-partners?t=${Date.now()}`, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            const raw = Array.isArray(data?.partners) ? data.partners : [];
            if (raw.length > 0) list = raw;
          }
        } catch (localErr) {
          console.warn("[TrustedBy] Local fetch notice:", localErr);
        }

        // 2. Fallback to Express backend API
        if (list.length === 0) {
          try {
            const apiUrl = getApiBase();
            const res = await fetch(`${apiUrl}/hiring-partners?t=${Date.now()}`, { cache: "no-store" });
            if (res.ok) {
              const data = await res.json();
              const raw = Array.isArray(data?.partners) ? data.partners : [];
              if (raw.length > 0) list = raw;
            }
          } catch (backendErr) {
            console.warn("[TrustedBy] Backend fetch notice:", backendErr);
          }
        }

        if (isMounted) {
          // Strictly filter only visible partners
          const visible = list.filter(
            (p: any) =>
              Boolean(p) &&
              p.isActive !== false &&
              p.isActive !== "false" &&
              p.status !== "hidden" &&
              p.status !== "inactive"
          );
          setPartners(visible);
        }
      } catch (err) {
        console.warn("[TrustedBy] Load partners error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPartners();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || !partners || partners.length === 0) {
    return null;
  }

  // Repeat list enough times so the horizontal marquee is continuous, dense, and seamless
  const repeatCount = Math.max(2, Math.ceil(18 / Math.max(1, partners.length)));
  const singleSet = Array.from({ length: repeatCount }, () => partners).flat();
  const marqueeItems = [...singleSet, ...singleSet];

  return (
    <section className={`py-2 sm:py-3 bg-slate-50 text-slate-800 relative overflow-hidden border-y border-slate-100 ${className}`}>
      <div className="container max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 md:gap-8 overflow-hidden">
          {/* Label Header */}
          <div className="flex items-center gap-2.5 shrink-0 z-10 bg-slate-50 sm:pr-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-xs sm:text-xs md:text-sm font-bold text-slate-800 tracking-[0.2em] uppercase whitespace-nowrap">
              Trusted By
            </p>
          </div>

          {/* Continuous Single Horizontal Line Marquee with Floating Animation */}
          <div className="flex-1 overflow-hidden relative w-full [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes trustedMarqueeScroll {
                  0% { transform: translateX(0%); }
                  100% { transform: translateX(-50%); }
                }
                @keyframes trustedLogoFloat {
                  0%, 100% {
                    transform: translateY(0px);
                  }
                  50% {
                    transform: translateY(-3px);
                  }
                }
                .animate-trusted-marquee-track {
                  display: flex;
                  flex-wrap: nowrap;
                  width: max-content;
                  animation: trustedMarqueeScroll 65s linear infinite;
                  will-change: transform;
                }
                .animate-trusted-marquee-track:hover {
                  animation-play-state: paused;
                }
              `
            }} />
            <div className="animate-trusted-marquee-track items-center gap-6 sm:gap-8 md:gap-10 py-1">
              {marqueeItems.map((company, i) => (
                <MarqueeLogoItem
                  key={`${company.id || company.name}-${i}`}
                  company={company}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
