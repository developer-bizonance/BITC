"use client";

import React, { useState, useEffect } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { GraduationCap } from 'lucide-react';
import { getApiBase, resolveImageUrl } from '@/lib/utils';

interface AlumniItem {
  id?: string;
  name: string;
  role: string;
  company: string;
  photo?: string;
  batch?: string;
  linkedin?: string;
  certification?: string;
}

interface AlumniCompanyItem {
  id?: string;
  name: string;
  logo: string;
  website?: string;
}

const FALLBACK_ALUMNI: AlumniItem[] = [
  {
    id: "alumni-6",
    name: "Emily Davis",
    role: "Frontend Dev",
    company: "Meta",
    batch: "23-24",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80",
    linkedin: "https://linkedin.com",
    certification: "Full Stack Web Development",
  },
  {
    id: "alumni-3",
    name: "Amit Kumar",
    role: "Product Manager",
    company: "Amazon",
    batch: "21-22",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
    linkedin: "https://linkedin.com",
    certification: "Digital Marketing",
  },
  {
    id: "alumni-4",
    name: "Sara Jones",
    role: "UX Designer",
    company: "Apple",
    batch: "23-24",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80",
    linkedin: "https://linkedin.com",
    certification: "UI/UX Design",
  },
  {
    id: "alumni-5",
    name: "Mike Brown",
    role: "DevOps Engineer",
    company: "Netflix",
    batch: "22-23",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
    linkedin: "https://linkedin.com",
    certification: "Cloud Computing",
  },
  {
    id: "alumni-1793866151946",
    name: "Yuvraj Bhatkar",
    role: "software Engineer",
    company: "BIZONANCE",
    batch: "2026",
    photo: "https://bitcapi.bizonance.com/uploads/alumni/1793866133510-57566970.png",
    linkedin: "https://bitcadmin.bizonance.com/dashboard",
    certification: "Full stack Java",
  },
];

const FALLBACK_COMPANIES: AlumniCompanyItem[] = [
  { id: "acomp-1", name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { id: "acomp-2", name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { id: "acomp-3", name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { id: "acomp-4", name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { id: "acomp-5", name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { id: "acomp-1793866214316", name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
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
    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-primary">
      <GraduationCap className="w-4 h-4 text-primary" />
      {children}
    </span>
  );
}

const formatBatch = (batch?: string) => {
  if (!batch) return "";
  const clean = batch.toString().replace(/^Batch\s*/i, "").trim();
  const yr = clean.split('-')[0].trim();
  return yr.length === 2 ? `20${yr}` : yr;
};

/* ═══════ ALUMNI SECTION ═══════ */
function AlumniSection() {
  const [alumniList, setAlumniList] = useState<AlumniItem[]>(FALLBACK_ALUMNI);
  const [companies, setCompanies] = useState<AlumniCompanyItem[]>(FALLBACK_COMPANIES);
  const [imgError, setImgError] = useState<Record<string | number, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = getApiBase();

    async function loadAlumni() {
      try {
        const res = await fetch(`${apiUrl}/alumni`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.alumni && Array.isArray(data.alumni) && data.alumni.length > 0) {
            setAlumniList(
              data.alumni.map((a: AlumniItem) => ({
                ...a,
                photo: resolveImageUrl(a.photo),
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Failed to load alumni from API:", err);
      } finally {
        setLoading(false);
      }
    }

    async function loadCompanies() {
      try {
        const res = await fetch(`${apiUrl}/alumni-companies`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.companies && Array.isArray(data.companies) && data.companies.length > 0) {
            setCompanies(
              data.companies.map((c: AlumniCompanyItem) => ({
                ...c,
                logo: resolveImageUrl(c.logo),
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Failed to load alumni companies from API:", err);
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
          <Badge>Our Alumni</Badge>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 sm:mt-5">
            Our Alumni{' '}
            <span className="bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] bg-clip-text text-transparent">
              Profiles
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#666]">
            Our graduates are building careers at some of the most respected companies across the industry.
          </p>
        </FadeUp>

        {/* Alumni cards */}
        {alumniList.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {alumniList.map((a, i) => {
              const photoUrl = resolveImageUrl(a.photo);
              const hasValidPhoto = Boolean(photoUrl && !imgError[a.id || i]);

              return (
                <FadeUp
                  key={a.id || i}
                  delay={i * 0.05}
                  className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs"
                >
                  {/* Photo Area (Circular Avatar) */}
                  <div className="pt-4 pb-1 px-4 flex justify-center w-full">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-sm shrink-0 flex items-center justify-center">
                      {hasValidPhoto ? (
                        <img
                          src={photoUrl}
                          alt={a.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            setImgError((prev) => ({ ...prev, [a.id || i]: true }));
                          }}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-900 font-bold flex items-center justify-center text-2xl sm:text-3xl">
                          {a.name ? a.name.charAt(0).toUpperCase() : "A"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-3 sm:p-3.5 text-center flex flex-col flex-1 justify-between w-full">
                    <div>
                      <p className="text-xs sm:text-sm font-bold leading-snug text-slate-900 line-clamp-1">{a.name}</p>
                      <p className="text-[11px] sm:text-xs text-slate-600 font-medium line-clamp-1 mt-0.5">{a.role}</p>

                      {a.company && (
                        <div className="mt-1">
                          <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#2f55d4]">
                            {a.company}
                          </span>
                        </div>
                      )}

                      {a.certification && (
                        <div className="mt-2">
                          <span
                            className="inline-flex items-center gap-1 rounded-md bg-orange-50 border border-orange-200/80 px-2 py-0.5 text-[10px] font-medium text-orange-700 max-w-full"
                            title={`Course: ${a.certification}`}
                          >
                            <GraduationCap className="w-3 h-3 text-orange-600 shrink-0" />
                            <span className="truncate">Course: {a.certification}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-100 w-full text-[10px] sm:text-[11px] px-0.5">
                      {a.batch ? (
                        <span className="text-slate-500 font-medium">Batch: {formatBatch(a.batch)}</span>
                      ) : (
                        <span />
                      )}
                      {a.linkedin && (
                        <a
                          href={a.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${a.name} LinkedIn Profile`}
                          title="LinkedIn Profile"
                          className="text-[#0A66C2] hover:text-[#084e96] hover:scale-120 transition-all p-0.5 inline-flex items-center justify-center shrink-0 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        ) : !loading ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-sm font-medium">Alumni profiles will appear here once added from the dashboard.</p>
          </div>
        ) : null}

        {/* Where Alumni Works */}
        {companies.length > 0 && (
          <FadeUp delay={0.1} className="mt-12 sm:mt-16 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                Where Our Alumni{' '}
                <span className="bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] bg-clip-text text-transparent">
                  Works
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 items-center">
              {companies.map((c, i) => (
                <FadeUp key={c.id || i} delay={i * 0.05}>
                  <div className="group flex flex-col items-center justify-center bg-transparent hover:bg-slate-50/60 rounded-xl p-3 transition-all duration-200 hover:scale-105 min-h-[75px] w-full cursor-default">
                    <div className="h-8 w-full flex items-center justify-center mb-1.5 px-2">
                      <img
                        src={resolveImageUrl(c.logo)}
                        alt={c.name}
                        className="max-h-7 max-w-full object-contain filter drop-shadow-xs"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 tracking-tight">
                      {c.name}
                    </span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </FadeUp>
        )}

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
