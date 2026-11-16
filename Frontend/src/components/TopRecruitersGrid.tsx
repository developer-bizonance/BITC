"use client";

import React, { useState, useEffect } from "react";
import { resolveImageUrl, getApiBase } from "@/lib/utils";

export interface RecruiterPartner {
  id?: string;
  name: string;
  logo?: string;
  isActive?: boolean;
}

function RecruiterCard({ company }: { company: RecruiterPartner }) {
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

  return (
    <div className="w-full h-20 sm:h-24 md:h-28 p-2 flex items-center justify-center text-center bg-transparent group cursor-default transition-transform duration-300 hover:scale-105">
      {imgSrc && !hasError ? (
        <img
          src={imgSrc}
          alt={company.name}
          title={company.name}
          onError={handleImageError}
          className="max-h-12 sm:max-h-14 md:max-h-16 lg:max-h-18 max-w-[130px] sm:max-w-[150px] md:max-w-[180px] w-auto object-contain transition-transform duration-300 filter drop-shadow-xs"
        />
      ) : (
        <span className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-primary transition-colors uppercase tracking-wider leading-tight">
          {company.name}
        </span>
      )}
    </div>
  );
}

export default function TopRecruitersGrid({ initialPartners }: { initialPartners?: RecruiterPartner[] }) {
  const [partners, setPartners] = useState<RecruiterPartner[]>(() => {
    if (initialPartners && initialPartners.length > 0) {
      return initialPartners.filter((p) => p && p.isActive !== false);
    }
    return [];
  });
  const [loading, setLoading] = useState(!initialPartners || initialPartners.length === 0);

  useEffect(() => {
    let isMounted = true;

    async function fetchRecruiters() {
      try {
        let list: RecruiterPartner[] = [];

        // 1. Fetch from Next.js API
        try {
          const res = await fetch(`/api/hiring-partners?t=${Date.now()}`, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            const raw = Array.isArray(data?.partners) ? data.partners : [];
            if (raw.length > 0) list = raw;
          }
        } catch (localErr) {
          console.warn("[TopRecruitersGrid] Local fetch notice:", localErr);
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
            console.warn("[TopRecruitersGrid] Backend fetch notice:", backendErr);
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
        console.warn("[TopRecruitersGrid] Failed to fetch partners:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRecruiters();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || partners.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6 items-center justify-items-center w-full">
      {partners.map((company, i) => (
        <RecruiterCard key={company.id || company.name || i} company={company} />
      ))}
    </div>
  );
}
