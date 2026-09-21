"use client";

import React, { useState, useEffect } from "react";

interface IndustryPartnerItem {
  id?: string;
  name: string;
  category?: string;
  logo?: string;
  website?: string;
}

const defaultPartners: IndustryPartnerItem[] = [
  { name: "TCS", logo: "https://icons.duckduckgo.com/ip3/www.tcs.com.ico" },
  { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
  { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
  { name: "HCL", logo: "https://icons.duckduckgo.com/ip3/hcltech.com.ico" },
  { name: "Tech Mahindra", logo: "https://icons.duckduckgo.com/ip3/techmahindra.com.ico" },
  { name: "Cognizant", logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg" },
  { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Deloitte", logo: "https://icons.duckduckgo.com/ip3/deloitte.com.ico" },
];

export default function IndustryPartnersGrid() {
  const [partners, setPartners] = useState<IndustryPartnerItem[]>(defaultPartners);

  useEffect(() => {
    async function loadIndustryPartners() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
          (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? "http://localhost:5000/api"
            : "https://bitc-backend-theta.vercel.app/api");

        const res = await fetch(`${apiUrl}/industry-partners`);
        if (res.ok) {
          const data = await res.json();
          if (data.partners && data.partners.length > 0) {
            const mergedPartners = data.partners.map((p: any) => {
              const defaultMatch = defaultPartners.find(dp => dp.name.toLowerCase() === p.name.toLowerCase());
              return {
                ...p,
                logo: p.logo || defaultMatch?.logo || `https://www.google.com/s2/favicons?sz=128&domain=${p.name.toLowerCase().replace(/\s+/g, '')}.com`
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
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Our Industry Partners</h2>
        <p className="text-gray-600 max-w-[600px] mx-auto text-lg mb-12">Trusted by leading companies across India.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {partners.map((partner, i) => (
            <div
              key={partner.id || i}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-md hover:border-primary/20 transition-all min-h-[110px] group"
            >
              {partner.logo && (
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="w-14 h-14 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110 mb-3" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
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
