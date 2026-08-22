"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Building2, Monitor, BookOpen, Shield, Users, Award, ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch dynamic partners from Backend API
  useEffect(() => {
    async function loadPartners() {
      try {
        const res = await fetch("https://bitc-backend-theta.vercel.app/api/partners");
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

  const checkScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollState();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollState);
      window.addEventListener("resize", checkScrollState);
      return () => {
        container.removeEventListener("scroll", checkScrollState);
        window.removeEventListener("resize", checkScrollState);
      };
    }
  }, [partnersList]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const firstCard = scrollContainerRef.current.firstElementChild as HTMLElement;
      const cardWidth = firstCard ? firstCard.offsetWidth + 20 : 220;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScrollState, 350);
    }
  };

  return (
    <section className="py-10 md:py-16 bg-slate-50 relative overflow-hidden">
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center sm:text-left max-w-4xl mx-auto sm:mx-0">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Our Academic Partners</h2>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            We proudly collaborate with leading colleges and universities through strategic Memorandums of Understanding (MoUs) to provide industry-focused training, internships, certifications, workshops, research initiatives, and career development opportunities.
          </p>
        </div>

        {/* Carousel Container with Left & Right side buttons */}
        <div className="relative px-1 sm:px-2">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll("left")}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md hover:shadow-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Scroll Left"
              title="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll("right")}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md hover:shadow-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Scroll Right"
              title="Scroll Right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Scrollable Track */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth py-3 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          >
            {partnersList.map((institute, i) => {
              const key = institute.id || i;
              return (
                <Card
                  key={key}
                  className="snap-start flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[calc(25%-0.875rem)] lg:w-[calc(16.666%-0.85rem)] min-w-[180px] border-none ring-0 shadow-sm hover:shadow-xl transition-all duration-300 group/card bg-white flex flex-col items-center text-center hover:-translate-y-1.5 rounded-2xl overflow-hidden"
                >
                  <div className="w-full aspect-[16/10] flex items-center justify-center bg-white overflow-hidden p-2">
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
                      <Building2 className="w-10 h-10 text-slate-400 group-hover/card:text-primary transition-colors" />
                    )}
                  </div>
                  <div className="p-3 flex-1 flex items-center justify-center w-full min-h-[72px]">
                    <h3 className="text-[13px] font-bold text-slate-700 leading-snug px-1 line-clamp-3" title={institute.name}>
                      {institute.name}
                    </h3>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
