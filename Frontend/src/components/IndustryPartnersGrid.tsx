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
  { name: "TCS" },
  { name: "Infosys" },
  { name: "Wipro" },
  { name: "HCL" },
  { name: "Tech Mahindra" },
  { name: "Cognizant" },
  { name: "Accenture" },
  { name: "IBM" },
  { name: "Microsoft" },
  { name: "Google" },
  { name: "Amazon" },
  { name: "Deloitte" },
];

export default function IndustryPartnersGrid() {
  const [partners, setPartners] = useState<IndustryPartnerItem[]>(defaultPartners);

  useEffect(() => {
    async function loadIndustryPartners() {
      try {
        const res = await fetch("https://bitc-backend-theta.vercel.app/api/industry-partners");
        if (res.ok) {
          const data = await res.json();
          if (data.partners && data.partners.length > 0) {
            setPartners(data.partners);
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
              <span className="text-lg font-black text-gray-800 tracking-tight group-hover:text-primary transition-colors">
                {partner.name}
              </span>
              {partner.category && (
                <span className="text-[10px] text-gray-400 font-medium mt-1">
                  {partner.category}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
