"use client";

import React, { useState, useEffect } from "react";
import { resolveImageUrl, getApiBase } from "@/lib/utils";

interface IndustryPartnerItem {
  id?: string;
  name: string;
  category?: string;
  logo?: string;
  website?: string;
}

const DEFAULT_LOGOS: Record<string, string> = {
  tcs: "/logos/tcs.svg",
  infosys: "/logos/infosys.svg",
  wipro: "/logos/wipro.svg",
  hcl: "/logos/hcl.svg",
  "tech mahindra": "/logos/tech-mahindra.svg",
  techmahindra: "/logos/tech-mahindra.svg",
  cognizant: "/logos/cognizant.svg",
  accenture: "/logos/accenture.svg",
  ibm: "/logos/ibm.svg",
  microsoft: "/logos/microsoft.svg",
  google: "/logos/google.svg",
  amazon: "/logos/amazon.svg",
  deloitte: "/logos/deloitte.svg",
};

export default function IndustryPartnersGrid() {
  const [partners, setPartners] = useState<IndustryPartnerItem[]>([]);

  useEffect(() => {
    async function loadIndustryPartners() {
      try {
        const apiUrl = getApiBase();

        const res = await fetch(`${apiUrl}/industry-partners`);
        if (res.ok) {
          const data = await res.json();
          if (data.partners && data.partners.length > 0) {
            // Remove duplicates by name
            const uniquePartners: IndustryPartnerItem[] = [];
            const seen = new Set();
            for (const p of data.partners) {
              const norm = p.name?.trim().toLowerCase();
              if (!seen.has(norm)) {
                seen.add(norm);
                uniquePartners.push(p);
              }
            }
            
            const mergedPartners = uniquePartners.map((p: any) => {
              const norm = p.name?.trim().toLowerCase();
              const logo = p.logo?.trim() || DEFAULT_LOGOS[norm] || "";
              return {
                ...p,
                logo: logo ? resolveImageUrl(logo) : `https://www.google.com/s2/favicons?sz=128&domain=${norm?.replace(/[^a-z0-9]/g, '')}.com`
              };
            });
            setPartners(mergedPartners);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch industry partners:", err);
      }
    }
    loadIndustryPartners();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white border-y border-gray-100">
      <div className="container max-w-[1200px] mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Our industry partners</h2>
        <p className="text-gray-600 max-w-[600px] mx-auto text-lg mb-12">Trusted by leading companies across India.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {partners.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-md hover:border-primary/20 transition-all min-h-[110px] group"
            >
              {partner.logo && (
                <img 
                  src={resolveImageUrl(partner.logo)} 
                  alt={partner.name} 
                  className="w-14 h-14 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110 mb-3" 
                  onError={(e) => {
                    const norm = partner.name?.trim().toLowerCase();
                    const googleFavicon = norm ? `https://www.google.com/s2/favicons?sz=128&domain=${norm.replace(/[^a-z0-9]/g, '')}.com` : '';
                    if (googleFavicon && e.currentTarget.src !== googleFavicon) {
                      e.currentTarget.src = googleFavicon;
                    } else {
                      e.currentTarget.style.display = 'none';
                    }
                  }}
                />
              )}
              <span className="text-sm md:text-base font-bold text-gray-700 tracking-tight group-hover:text-primary transition-colors text-center">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
