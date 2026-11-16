import prisma from "@/lib/prisma";
import { Certification } from "@/types/course";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, CheckCircle2, Clock, BookOpen, Target, Briefcase,
  Award, Sparkles, LayoutTemplate, Network, IndianRupee, Download,
  Layers, Cpu, Laptop, Rocket, FileText, Check, ChevronRight, Calendar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ApplyButton } from "@/components/certifications/ApplyButton";
import { FaWhatsapp } from "react-icons/fa";

import type { Metadata } from "next";
import { getApiBase, resolveImageUrl } from "@/lib/utils";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function mapCertToCourse(cert: any, fallbackSlug: string): Certification {
  const feesRaw = cert.fees || "";
  const numPrice = parseInt(String(feesRaw).replace(/[^0-9]/g, ""), 10) || 0;
  const slug = cert.slug || fallbackSlug;

  return {
    slug,
    title: cert.title || "",
    category: cert.category || "Information Technology",
    duration: cert.duration || "",
    fees: feesRaw,
    price: numPrice,
    description: cert.description || "",
    features: Array.isArray(cert.features) ? cert.features : [],
    image: resolveImageUrl(cert.image),
    curriculum: Array.isArray(cert.curriculum) ? cert.curriculum : [],
  };
}

function normalizeFeatures(raw: any): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => (typeof item === "string" ? item.trim() : (item?.text || "").trim())).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

async function fetchCourse(slug: string): Promise<Certification | null> {
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, '-');
  const cleanSlug = normalizedSlug.replace(/[^a-z0-9]/g, '');

  let certData: any = null;
  let courseData: any = null;

  // 1. Fetch dashboard-managed certification (where highlights & fees are edited live in admin dashboard)
  try {
    const apiUrl = getApiBase();
    const certsRes = await fetch(`${apiUrl}/certifications`, { cache: "no-store" });
    if (certsRes.ok) {
      const certsJson = await certsRes.json();
      const certsList: any[] = certsJson.certifications || [];
      certData = certsList.find((c: any) => {
        if (!c) return false;
        const cId = String(c.id || "").toLowerCase();
        const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
        const cTitleSlug = (c.title || "").toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
        const cClean = (c.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        return (
          cId === normalizedSlug ||
          cSlug === normalizedSlug ||
          cTitleSlug === normalizedSlug ||
          (cleanSlug && cClean === cleanSlug)
        );
      });
    }
  } catch (certApiErr) {
    // Continue
  }

  // 2. Fetch full Course details (curriculum modules & topics)
  try {
    const apiUrl = getApiBase();
    const res = await fetch(`${apiUrl}/courses/${normalizedSlug}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.course) {
        courseData = data.course;
      }
    }
    // If not found by direct slug, query full courses list to match by slug alias or title
    if (!courseData) {
      const allRes = await fetch(`${apiUrl}/courses`, { cache: "no-store" });
      if (allRes.ok) {
        const allData = await allRes.json();
        const coursesList = allData.courses || [];
        courseData = coursesList.find((c: any) => {
          if (!c) return false;
          const cSlug = String(c.slug || "").toLowerCase();
          const cTitle = String(c.title || "").toLowerCase();
          const cTitleSlug = cTitle.replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
          const cClean = cSlug.replace(/[^a-z0-9]/g, "");
          return (
            cSlug === normalizedSlug ||
            cTitleSlug === normalizedSlug ||
            (cleanSlug && cClean === cleanSlug) ||
            (certData?.title && cTitle === certData.title.toLowerCase())
          );
        });
      }
    }
  } catch (apiErr) {
    // Fallback to DB
  }

  const defaultCategoryHighlights: Record<string, string[]> = {
    "Information Technology": [
      "Hands-on Live Industry Projects",
      "Real-world Architecture & System Design",
      "1-on-1 Mentorship & Doubt Clearing",
      "Resume Building & Portfolio Review",
      "Exclusive BITC Placement Drive Access"
    ],
    "Design Programs": [
      "Industry-Standard Design Portfolio Building",
      "Live Client Briefs & Visual Asset Production",
      "Interactive UI/UX & High-Fidelity Prototyping",
      "1-on-1 Creative Mentorship & Critiques",
      "Exclusive BITC Placement Drive Access"
    ],
    "Management Programs": [
      "Case Study Driven Practical Learning",
      "Corporate Strategy & Business Analytics",
      "1-on-1 Career Mentorship & Interview Prep",
      "Resume Building & Corporate Grooming",
      "Exclusive BITC Placement Drive Access"
    ],
    "Digital Media Technology": [
      "Hands-on Campaign Execution & ROI Tracking",
      "Live Brand Management & Content Strategy",
      "AI-Powered Digital Media Tools Training",
      "1-on-1 Mentorship & Portfolio Review",
      "Exclusive BITC Placement Drive Access"
    ],
  };

  // If found in either API source, merge and return dynamic data
  if (courseData || certData) {
    const certHighlights = normalizeFeatures(certData?.features);
    const courseHighlights = normalizeFeatures(courseData?.features);
    const category = certData?.category || courseData?.category || "Information Technology";
    let dynamicFeatures = certHighlights.length > 0 ? certHighlights : courseHighlights;

    if (dynamicFeatures.length === 0) {
      dynamicFeatures = defaultCategoryHighlights[category] || defaultCategoryHighlights["Information Technology"];
    }

    const fees = certData?.fees || courseData?.fees || "";
    const numPrice = parseInt(String(fees).replace(/[^0-9]/g, ""), 10) || (courseData?.price || 0);

    return {
      slug: courseData?.slug || certData?.slug || normalizedSlug,
      title: certData?.title || courseData?.title || "",
      category: category,
      duration: certData?.duration || courseData?.duration || "",
      fees: fees,
      price: numPrice,
      description: certData?.description || courseData?.description || "",
      features: dynamicFeatures,
      image: resolveImageUrl(certData?.image || courseData?.image),
      curriculum: Array.isArray(courseData?.curriculum)
        ? courseData.curriculum
        : (Array.isArray(certData?.curriculum) ? certData.curriculum : []),
    };
  }

  // 3. Try Prisma Neon DB Course table
  if (process.env.DATABASE_URL) {
    try {
      const dbCourse = await prisma.course.findFirst({
        where: {
          OR: [
            { slug: normalizedSlug },
            { slug: normalizedSlug.replace(/[^a-z0-9]/g, "") },
            { title: { equals: normalizedSlug.replace(/-/g, " "), mode: "insensitive" } },
          ],
        },
      });
      if (dbCourse) {
        let features: string[] = normalizeFeatures(dbCourse.features);

        // Check if CmsData has latest highlights from admin dashboard
        try {
          const cmsRecords = await (prisma as any).$queryRaw<any[]>`SELECT data FROM "CmsData" WHERE key = 'certifications.json' LIMIT 1`;
          if (cmsRecords && cmsRecords.length > 0 && cmsRecords[0].data) {
            const rawData = cmsRecords[0].data;
            const list: any[] = Array.isArray(rawData) ? rawData : (typeof rawData === "string" ? JSON.parse(rawData) : []);
            const matched = list.find((c: any) => {
              if (!c) return false;
              const cId = String(c.id || "").toLowerCase();
              const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
              const cTitleSlug = (c.title || "").toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
              const cClean = (c.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
              return (
                cId === normalizedSlug ||
                cSlug === normalizedSlug ||
                cTitleSlug === normalizedSlug ||
                (cleanSlug && cClean === cleanSlug)
              );
            });
            if (matched) {
              if (matched.features && matched.features.length > 0) {
                features = normalizeFeatures(matched.features);
              }
              if (matched.image && (!dbCourse.image || dbCourse.image === "/MERN.jpg")) {
                dbCourse.image = matched.image;
              }
            }
          }
        } catch (cmsErr) {
          // Continue
        }

        const curriculum = (dbCourse.curriculum as any[]) || [];
        return {
          slug: dbCourse.slug,
          title: dbCourse.title,
          category: dbCourse.category as any,
          duration: dbCourse.duration || "",
          fees: dbCourse.fees || "",
          price: dbCourse.price || 0,
          description: dbCourse.description || "",
          features: features,
          image: resolveImageUrl(dbCourse.image),
          curriculum: Array.isArray(curriculum) ? curriculum : [],
        };
      }
    } catch (err) {
      console.warn("Neon DB fetch failed for course detail:", err);
    }

    // 4. Try Direct Prisma Raw Query for certifications.json in CmsData table
    if (process.env.DATABASE_URL) {
      try {
        const cmsRecords = await (prisma as any).$queryRaw<any[]>`SELECT data FROM "CmsData" WHERE key = 'certifications.json' LIMIT 1`;
        if (cmsRecords && cmsRecords.length > 0 && cmsRecords[0].data) {
          const rawData = cmsRecords[0].data;
          const list: any[] = Array.isArray(rawData) ? rawData : (typeof rawData === "string" ? JSON.parse(rawData) : []);
          const matched = list.find((c: any) => {
            if (!c) return false;
            const cId = String(c.id || "").toLowerCase();
            const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
            const cTitleSlug = (c.title || "").toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
            const cClean = (c.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            return (
              cId === normalizedSlug ||
              cSlug === normalizedSlug ||
              cTitleSlug === normalizedSlug ||
              (cleanSlug && cClean === cleanSlug)
            );
          });
          if (matched) {
            return mapCertToCourse(matched, normalizedSlug);
          }
        }
      } catch (cmsErr) {
        // Continue
      }

    }
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const course = await fetchCourse(resolvedParams.slug);

  if (!course) {
    return {
      title: "Certification Not Found | BITC",
      description: "The requested certification could not be found.",
    };
  }

  return {
    title: `${course.title} Certification | BITC`,
    description: `${course.description} Duration: ${course.duration}. Learn from industry experts at BITC BIZONANCE with placement assistance.`,
    keywords: [
      course.title,
      `${course.title} Certification Amravati`,
      `${course.category} Certification`,
      "BITC Training",
      "BIZONANCE Industrial Training Centre",
    ],
    openGraph: {
      title: `${course.title} Certification | BIZONANCE Industrial Training Centre. (BITC) | Amravati`,
      description: course.description,
    },
  };
}

export default async function CoursePage({ params }: PageProps) {
  const resolvedParams = await params;
  const course = await fetchCourse(resolvedParams.slug);

  if (!course) {
    notFound();
  }

  const totalModules = Array.isArray(course.curriculum) ? course.curriculum.length : 0;
  const totalTopics = (course.curriculum || []).reduce((acc: number, mod: any) => {
    if (!mod) return acc;
    if (Array.isArray(mod.topics)) return acc + mod.topics.length;
    if (typeof mod.topics === "string") {
      return acc + mod.topics.split(/[\r\n,]+/).map((s: string) => s.trim()).filter(Boolean).length;
    }
    return acc;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative w-full bg-white text-slate-900 py-12 md:py-12 lg:py-14 overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="lg:pt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-medium mb-5">
                <LayoutTemplate className="w-3.5 h-3.5" />
                {course.category}
              </div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.2] text-slate-900"
              >
                {course.title}
              </h1>
              <p className="text-sm md:text-base text-slate-600 mb-6 leading-relaxed font-medium">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-5 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-slate-700">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-slate-700">Daily 2h Classroom Session</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-slate-700">Industry Certification</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <ApplyButton courseId={course.slug} courseTitle={course.title} />
                <Link href="#curriculum" className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-slate-600 text-base font-normal flex items-center justify-center hover:bg-gray-50 border border-gray-200 transition-all shadow-sm">
                  View Curriculum
                </Link>
              </div>
            </div>

            {/* Right Side Stats/Features */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-blue-500/10 to-emerald-500/10 rounded-[2rem] blur-3xl pointer-events-none" />
              <Card className="bg-white border-slate-200/80 shadow-2xl shadow-slate-900/5 relative z-10 overflow-hidden rounded-[2rem]">
                <CardContent className="p-8 md:p-10">
                  {(() => {
                    const fee = course.fees?.trim();
                    if (!fee || fee === "0" || fee === "₹0") return null;
                    const formatted = fee.startsWith("₹") || isNaN(Number(fee.replace(/,/g, "")))
                      ? fee
                      : `₹${Number(fee.replace(/,/g, "")).toLocaleString("en-IN")}`;
                    return (
                      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl flex items-center justify-between border border-slate-700/50">
                        <div>
                          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">Certification Fees</p>
                          <p className="text-3xl md:text-4xl font-black tracking-tight text-white">
                            {formatted}
                          </p>
                        </div>
                        <div className="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold rounded-full backdrop-blur-md">
                          100% Inclusive
                        </div>
                      </div>
                    );
                  })()}

                  {course.features && course.features.length > 0 && (
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-orange-500" />
                        Certification Highlights
                      </h3>
                      <ul className="space-y-3.5">
                        {course.features.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-3.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-slate-700 font-semibold text-[15px]">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Content / Curriculum Section - PREMIUM REDESIGN */}
      <section id="curriculum" className="py-10 sm:py-14 lg:py-28 bg-white relative overflow-hidden">
        <div className="container max-w-[1100px] mx-auto px-4 relative z-10">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-extrabold uppercase tracking-widest mb-4">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>INDUSTRY-DESIGNED SYLLABUS</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-[1.2]">Comprehensive <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Curriculum</span></h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Curated by industry leads and updated quarterly to equip you with production-grade skills, real-world workflows, and AI integration.
            </p>

            {/* Quick Metrics Bar */}
            {totalModules > 0 && (
              <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-800">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>{totalModules} {totalModules === 1 ? "Intensive Module" : "Intensive Modules"}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-800">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>{totalTopics} {totalTopics === 1 ? "Deep-Dive Topic" : "Deep-Dive Topics"}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-800">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span>AI Tools & Workflows</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-800">
                  <Rocket className="w-4 h-4 text-emerald-600" />
                  <span>Live capstone project</span>
                </div>
              </div>
            )}
          </div>

          {/* Accordion List or Clean State */}
          {course.curriculum && course.curriculum.length > 0 ? (
            <Accordion className="w-full space-y-5">
              {course.curriculum.map((module: any, i: number) => {
                const rawTitle = typeof module === "string"
                  ? module
                  : (module?.title || module?.module || module?.name || `Module ${i + 1}`);
                const cleanTitle = typeof rawTitle === "string"
                  ? rawTitle.replace(/^module\s*[\d\w]*:\s*/i, "").trim() || rawTitle
                  : `Module ${i + 1}`;
                const topics: string[] = Array.isArray(module?.topics)
                  ? module.topics
                  : typeof module?.topics === "string"
                    ? module.topics.split(/[\r\n,]+/).map((s: string) => s.trim()).filter(Boolean)
                    : [];

                return (
                  <AccordionItem
                    key={i}
                    value={`module-${i}`}
                    className="border border-slate-200/90 rounded-2xl px-6 md:px-8 py-1.5 bg-white shadow-sm hover:shadow-md data-[state=open]:shadow-xl data-[state=open]:border-slate-300 transition-all duration-300 overflow-hidden group"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5 cursor-pointer items-center">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full pr-4">
                        <div className="flex items-center gap-4">
                          {/* Module Number Badge */}
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-amber-500 flex items-center justify-center shrink-0 shadow-md font-black text-base border border-slate-700/50 group-data-[state=open]:from-amber-500 group-data-[state=open]:to-orange-500 group-data-[state=open]:text-slate-950 transition-all duration-300">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <div>
                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500 block mb-0.5">
                              MODULE {i + 1}
                            </span>
                            <h3 className="text-lg md:text-xl font-medium text-gray-600 group-hover:text-amber-500 group-data-[state=open]:text-amber-500 transition-colors">
                              {cleanTitle}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-start md:self-center">
                          <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200 shrink-0">
                            {topics.length} Key Topics
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-2 pb-7 border-t border-slate-100 mt-2">
                      <div className="space-y-4 pt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          Core Learning Outcomes & Technical Skills:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {topics.map((topic: string, j: number) => (
                            <div
                              key={j}
                              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-amber-500/5 hover:border-amber-500/20 transition-all"
                            >
                              <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                              <span className="text-sm font-semibold text-slate-800 leading-snug">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="text-center py-12 px-6 rounded-3xl bg-slate-50 border border-slate-200/80 max-w-xl mx-auto shadow-xs">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-60" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">Curriculum Under Preparation</h3>
              <p className="text-sm text-slate-600 mb-6 font-medium">The comprehensive module syllabus for this certification program will be published shortly. Connect with us for syllabus details.</p>
              <a
                href="https://wa.me/918956727311?text=Hello%2C%20I%20want%20to%20know%20more%20about%20the%20curriculum%20syllabus"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Inquire on WhatsApp <FaWhatsapp className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          )}

          {/* Real-World Capstone Banner */}
          <div className="mt-14 p-8 md:p-10 bg-slate-50 rounded-3xl border border-slate-200/80 text-slate-900 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-medium mb-4 border border-amber-500/20">
                <Rocket className="w-3.5 h-3.5" />
                <span>HANDS-ON INDUSTRIAL CAPSTONE</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-[1.2]">Build a Production-ready Capstone <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Project</span></h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">
                Apply everything you've learned to construct a real-world enterprise project under the guidance of senior software leads. Review your code, optimize performance, and showcase it directly to top tech recruiters.
              </p>
            </div>

            <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <ApplyButton courseId={course.slug} courseTitle={course.title} />
              <a
                href={`https://wa.me/918956727311?text=${encodeURIComponent(`Hello, I recently visited your official BITC website and i want to know more about your "${course.title}" Certification`)}`}
                target="_blank"
                rel="noreferrer"
                className="h-12 px-8 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-medium text-base flex items-center justify-center gap-2 border border-slate-200 transition-all shadow-sm backdrop-blur-md hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                Chat with us <FaWhatsapp className="w-5 h-5 text-emerald-500" />
              </a>
            </div>
          </div>

          {/* Curriculum Features Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group relative p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300/80 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30">
                <Laptop className="w-6 h-6 transition-transform duration-300" />
              </div>
              <h4 className="font-semibold text-gray-700 group-hover:text-slate-900 transition-colors duration-200 mb-1 text-sm">100% Practical</h4>
              <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-200">Real-world coding exercises and live project builds.</p>
            </div>

            <div className="group relative p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300/80 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-500/30">
                <Cpu className="w-6 h-6 transition-transform duration-300" />
              </div>
              <h4 className="font-semibold text-gray-700 group-hover:text-slate-900 transition-colors duration-200 mb-1 text-sm">Ai Workflows</h4>
              <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-200">Integrated Copilot, Cursor & AI prompt engineering.</p>
            </div>

            <div className="group relative p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300/80 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-500/30">
                <Award className="w-6 h-6 transition-transform duration-300" />
              </div>
              <h4 className="font-semibold text-gray-700 group-hover:text-slate-900 transition-colors duration-200 mb-1 text-sm">BITC Certification</h4>
              <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-200">Recognized industrial certification upon completion.</p>
            </div>

            <div className="group relative p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300/80 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                <Briefcase className="w-6 h-6 transition-transform duration-300" />
              </div>
              <h4 className="font-semibold text-gray-700 group-hover:text-slate-900 transition-colors duration-200 mb-1 text-sm">Placement Support</h4>
              <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-200">Direct interview opportunities with hiring partners.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
