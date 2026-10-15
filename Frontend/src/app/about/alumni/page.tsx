"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaLinkedin } from 'react-icons/fa';
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

function FadeUp({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <div className={className} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium uppercase tracking-widest text-orange-600">
      {children}
    </span>
  );
}

/* ═══════ ALUMNI SECTION ═══════ */
function AlumniSection() {
  const [alumniList, setAlumniList] = useState<AlumniItem[]>([]);
  const [companies, setCompanies] = useState<AlumniCompanyItem[]>([]);
  const [imgError, setImgError] = useState<Record<string | number, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = getApiBase();

    async function loadAlumni() {
      try {
        const res = await fetch(`${apiUrl}/alumni`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.alumni && Array.isArray(data.alumni)) {
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
          if (data.companies && Array.isArray(data.companies)) {
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
          <Badge>OUR ALUMNI</Badge>
          <h2 className="mt-4 text-2xl font-bold text-[#111] sm:mt-5 sm:text-3xl md:text-4xl">
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {alumniList.map((a, i) => {
              const photoUrl = resolveImageUrl(a.photo);
              const hasValidPhoto = Boolean(photoUrl && !imgError[a.id || i]);

              return (
                <FadeUp key={a.id || i} delay={i * 0.07}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-[#dadce0] bg-white p-4 text-center sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_8px_24px_rgba(255,123,0,0.12)]"
                >
                  {/* Photo */}
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border border-gray-200 shadow-xs sm:h-[88px] sm:w-[88px] bg-slate-100 shrink-0 flex items-center justify-center">
                    {hasValidPhoto ? (
                      <img
                        src={photoUrl}
                        alt={a.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          setImgError((prev) => ({ ...prev, [a.id || i]: true }));
                        }}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-900 font-bold flex items-center justify-center text-xl sm:text-2xl">
                        {a.name ? a.name.charAt(0).toUpperCase() : "A"}
                      </div>
                    )}
                  </div>

                  {/* Name & Role */}
                  <p className="mt-1 text-[13px] font-bold leading-snug text-[#111] sm:text-sm">{a.name}</p>
                  <p className="text-[11px] font-medium text-[#666] sm:text-xs leading-tight">{a.role}</p>

                  {/* Batch badge */}
                  {a.batch && (
                    <span className="mt-1 inline-block rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-[#ff7b00] border border-orange-200/80">
                      Batch {a.batch.includes('-') ? `20${a.batch.split('-')[1]}` : a.batch}
                    </span>
                  )}

                  {/* LinkedIn button */}
                  {a.linkedin && (
                    <a
                      href={a.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-1.5 rounded-full bg-[#0A66C2] px-3.5 py-1.5 text-[11px] font-semibold text-white transition-all duration-200 hover:bg-[#084e96] hover:shadow-sm hover:scale-105"
                    >
                      <FaLinkedin className="w-3.5 h-3.5" />
                      LinkedIn
                    </a>
                  )}
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
          <FadeUp delay={0.1} className="mt-10 sm:mt-16">
            <h3 className="text-xl font-bold text-[#111] sm:text-2xl md:text-3xl">
              Where Our Alumni{' '}
              <span className="bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] bg-clip-text text-transparent">
                Works
              </span>
            </h3>
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-4">
              {companies.map((c, i) => (
                <FadeUp key={c.id || i} delay={i * 0.07}>
                  <div className="flex h-14 w-[130px] cursor-pointer items-center justify-center rounded-xl border border-gray-100 bg-white px-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-lg sm:h-[72px] sm:w-[170px] sm:rounded-2xl sm:px-5">
                    <img
                      src={resolveImageUrl(c.logo)}
                      alt={c.name}
                      className="h-7 w-auto object-contain sm:h-9"
                    />
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
