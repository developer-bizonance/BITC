"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AlumniItem {
  id?: string;
  name: string;
  role: string;
  company: string;
  photo: string;
  batch?: string;
  linkedin?: string;
  certification?: string;
}

const defaultAlumni: AlumniItem[] = [
  { name: "Rahul Sharma", role: "Software Engineer", company: "Google", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", batch: "23-24", linkedin: "https://linkedin.com", certification: "Full Stack Web Development" },
  { name: "Priya Patel", role: "Data Analyst", company: "Microsoft", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", batch: "22-23", linkedin: "https://linkedin.com", certification: "Data Science & AI" },
  { name: "Amit Kumar", role: "Product Manager", company: "Amazon", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", batch: "21-22", linkedin: "https://linkedin.com", certification: "Digital Marketing" },
  { name: "Sara Jones", role: "UX Designer", company: "Apple", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80", batch: "23-24", linkedin: "https://linkedin.com", certification: "UI/UX Design" },
  { name: "Mike Brown", role: "DevOps Engineer", company: "Netflix", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80", batch: "22-23", linkedin: "https://linkedin.com", certification: "Cloud Computing" },
  { name: "Emily Davis", role: "Frontend Dev", company: "Meta", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80", batch: "23-24", linkedin: "https://linkedin.com", certification: "Full Stack Web Development" }
];

interface AlumniCompanyItem {
  id?: string;
  name: string;
  logo: string;
  website?: string;
}

const defaultAlumniCompanies: AlumniCompanyItem[] = [
  { id: "1", name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { id: "2", name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { id: "3", name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { id: "4", name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { id: "5", name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { id: "6", name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" }
];

function FadeUp({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <div className={className} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-600">
      {children}
    </span>
  );
}

/* ═══════ ALUMNI SECTION ═══════ */
function AlumniSection() {
  const [alumniList, setAlumniList] = useState<AlumniItem[]>(defaultAlumni);
  const [companies, setCompanies] = useState<AlumniCompanyItem[]>(defaultAlumniCompanies);
  const [imgError, setImgError] = useState<Record<string | number, boolean>>({});

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://bitc-backend-theta.vercel.app/api";

    async function loadAlumni() {
      try {
        const res = await fetch(`${apiUrl}/alumni`);
        if (res.ok) {
          const data = await res.json();
          if (data.alumni && data.alumni.length > 0) {
            setAlumniList(data.alumni);
          }
        }
      } catch (err) {
        console.warn("Failed to load alumni from API, using default:", err);
      }
    }

    async function loadCompanies() {
      try {
        const res = await fetch(`${apiUrl}/alumni-companies`);
        if (res.ok) {
          const data = await res.json();
          if (data.companies && data.companies.length > 0) {
            setCompanies(data.companies);
          }
        }
      } catch (err) {
        console.warn("Failed to load alumni companies from API, using default:", err);
      }
    }

    loadAlumni();
    loadCompanies();
  }, []);

  return (
    <section className="bg-white px-5 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-20">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <FadeUp className="mb-8 text-center sm:mb-12">
          <Badge>OUR ALUMNI</Badge>
          <h2 className="mt-4 text-2xl font-bold text-[#111] sm:mt-5 sm:text-3xl md:text-4xl">
            Our Alumni{' '}
            <span className="bg-gradient-to-r from-[#ff7b00] to-[#f4b400] bg-clip-text text-transparent">
              Profiles
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#666]">
            Our graduates are building careers at some of the most respected companies across the industry.
          </p>
        </FadeUp>

        {/* Alumni cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {alumniList.map((a, i) => (
            <FadeUp key={a.id || i} delay={i * 0.07}
              className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-2.5 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl sm:gap-3 sm:rounded-2xl sm:p-6"
            >
              <div className="relative">
                {/* Photo */}
                <div className="relative h-14 w-14 overflow-hidden rounded-full shadow-md sm:h-[100px] sm:w-[100px] bg-slate-100">
                  <img
                    src={a.photo}
                    alt={a.name}
                    onError={() => setImgError((prev) => ({ ...prev, [a.id || i]: true }))}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1 w-full text-center mt-1 px-1">
                <div className="flex flex-col gap-1.5 flex-1 items-center">
                  <div className="w-full">
                    <span className="block text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Name</span>
                    <p className="text-[12px] font-bold leading-snug text-[#111]">{a.name}</p>
                  </div>
                  
                  {a.certification && (
                    <div className="w-full">
                      <span className="block text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Certification</span>
                      <p className="text-[11px] font-medium text-orange-600 leading-tight">{a.certification}</p>
                    </div>
                  )}
                  
                  <div className="w-full">
                    <span className="block text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Designation</span>
                    <p className="text-[11px] text-[#555] font-medium leading-tight">{a.role}</p>
                  </div>
                  
                  <div className="w-full">
                    <span className="block text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-1">Company</span>
                    <span className="inline-block mx-auto rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#2f55d4]">
                      {a.company}
                    </span>
                  </div>
                </div>

                <div className="mt-3 w-full border-t border-gray-100 pt-2 flex flex-wrap items-center justify-between gap-1 text-[10px] text-gray-500">
                  {a.batch && (
                    <span className="font-semibold bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">Batch: {a.batch}</span>
                  )}
                  {a.linkedin && (
                    <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline flex items-center bg-blue-50/50 px-1.5 py-0.5 rounded">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Where Alumni Works */}
        <FadeUp delay={0.1} className="mt-10 sm:mt-16">
          <h3 className="text-xl font-bold text-[#111] sm:text-2xl md:text-3xl">
            Where Our Alumni{' '}
            <span className="bg-gradient-to-r from-[#ff7b00] to-[#f4b400] bg-clip-text text-transparent">
              Works
            </span>
          </h3>
          <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-4">
            {companies.map((c, i) => (
              <FadeUp key={c.id || i} delay={i * 0.07}>
                <div className="flex h-14 w-[130px] cursor-pointer items-center justify-center rounded-xl border border-gray-100 bg-white px-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-lg sm:h-[72px] sm:w-[170px] sm:rounded-2xl sm:px-5">
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="h-7 w-auto object-contain sm:h-9"
                  />
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>

      </div>
    </section>
  );
}

export default function AlumniPage() {
  return (
    <main className="min-h-screen bg-white">
      <AlumniSection />
    </main>
  );
}
