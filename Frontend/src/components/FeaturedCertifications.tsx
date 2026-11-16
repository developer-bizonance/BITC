"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, ArrowRight, Code, Database, Coffee, Terminal, 
  BrainCircuit, BarChart, ShieldCheck, Cloud, TrendingUp, 
  PieChart, Landmark, Users, LayoutTemplate, 
  PenTool, Video, Film, Clapperboard, GraduationCap, Clock, Download, Award, IndianRupee, Tag, Sparkles, Briefcase, Laptop
} from "lucide-react";
import { resolveImageUrl, getApiBase } from "@/lib/utils";

type CourseCardItem = {
  id?: string;
  slug?: string;
  title: string;
  category?: string;
  duration: string;
  fees?: string;
  badge?: string;
  icon?: any;
  image?: string;
};

const categoryRoutes: Record<string, string> = {
  "Information Technology": "/certifications/it",
  "Digital Media Technology": "/certifications/digital-media",
  "Management Programs": "/certifications/management",
  "Design Programs": "/certifications/design",
};

export const normalizeCategoryName = (name: string): string => {
  return (name || "").trim();
};

export default function FeaturedCertifications() {
  const [coursesData, setCoursesData] = useState<Record<string, CourseCardItem[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<Record<string | number, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const API_URL = getApiBase();
        const [certsRes, catsRes] = await Promise.allSettled([
          fetch(`${API_URL}/certifications`, { cache: "no-store" }),
          fetch(`${API_URL}/categories`, { cache: "no-store" }),
        ]);

        let certsList: any[] = [];
        let catNames: string[] = [];

        if (certsRes.status === "fulfilled" && certsRes.value.ok) {
          const certsData = await certsRes.value.json();
          if (certsData.certifications && certsData.certifications.length > 0) {
            certsList = certsData.certifications;
          }
        }

        if (certsList.length === 0) {
          try {
            const coursesRes = await fetch(`${API_URL}/courses`, { cache: "no-store" });
            if (coursesRes.ok) {
              const coursesData = await coursesRes.json();
              if (Array.isArray(coursesData.courses) && coursesData.courses.length > 0) {
                certsList = coursesData.courses;
              }
            }
          } catch (e) {}
        }

        let catsData: any = null;
        if (catsRes.status === "fulfilled" && catsRes.value.ok) {
          catsData = await catsRes.value.json();
        } else {
          try {
            const localCats = await fetch("/api/categories", { cache: "no-store" });
            if (localCats.ok) {
              catsData = await localCats.json();
            }
          } catch (_) {}
        }

        // Dynamically load categories from API/DB
        if (catsData && catsData.categories && catsData.categories.length > 0) {
          catNames = catsData.categories
            .map((c: any) => (typeof c === "string" ? c : c.name)?.trim())
            .filter(Boolean);
        }

        // Collect all categories present in the courses list
        const courseCategories = new Set<string>();
        certsList.forEach((c: any) => {
          if (c.category && typeof c.category === "string" && c.category.trim()) {
            courseCategories.add(c.category.trim());
          }
        });

        // If categories from API were empty, populate from courses
        if (catNames.length === 0) {
          catNames = Array.from(courseCategories);
        } else {
          // If any course has a category not recognized, append it dynamically
          courseCategories.forEach((cCat) => {
            const hasMatch = catNames.some(
              (cn) =>
                cn.toLowerCase() === cCat.toLowerCase() ||
                cn.toLowerCase().replace(/ programs?$/i, "") === cCat.toLowerCase().replace(/ programs?$/i, "")
            );
            if (!hasMatch) {
              catNames.push(cCat);
            }
          });
        }

        // Helper to find the best category tab for a course
        const findMatchingCategory = (courseCat: string): string => {
          if (!courseCat) return catNames[0] || "General";
          const raw = courseCat.trim();
          // 1. Exact match
          const exact = catNames.find((cn) => cn === raw);
          if (exact) return exact;
          // 2. Case-insensitive match
          const caseMatch = catNames.find((cn) => cn.toLowerCase() === raw.toLowerCase());
          if (caseMatch) return caseMatch;
          // 3. Suffix-tolerant match (e.g. "Design" -> "Design Programs", "Management" -> "Management Programs")
          const normMatch = catNames.find(
            (cn) =>
              cn.toLowerCase().replace(/ programs?$/i, "") ===
              raw.toLowerCase().replace(/ programs?$/i, "")
          );
          if (normMatch) return normMatch;
          return raw;
        };

        if (certsList.length > 0) {
          const grouped: Record<string, CourseCardItem[]> = {};

          catNames.forEach((cat) => {
            grouped[cat] = [];
          });

          certsList.forEach((c: any) => {
            const cat = findMatchingCategory(c.category);
            if (!grouped[cat]) {
              grouped[cat] = [];
              if (!catNames.includes(cat)) {
                catNames.push(cat);
              }
            }
            grouped[cat].push({
              id: c.id,
              slug: c.slug || (c.id && !String(c.id).startsWith("cert-") ? c.id : null) || c.title.toLowerCase().replace(/ & /g, '-').replace(/[\/\s_]+/g, '-'),
              title: c.title,
              category: cat,
              duration: c.duration || "6 Months",
              fees: (c.fees && typeof c.fees === "string") ? c.fees.trim() : (c.fees || ""),
              badge: c.badge && c.badge !== "Integrated with AI" ? c.badge : "",
              image: c.image ? resolveImageUrl(c.image) : "",
              icon: Database,
            });
          });

          setCoursesData(grouped);
          setCategories(catNames);
          setImgError({});
          if (catNames.length > 0) {
            setActiveTab((current) => (current && catNames.includes(current) ? current : catNames[0]));
          }
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic certifications from API:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const tabCategories = categories.length > 0 ? categories : Object.keys(coursesData);

  if (loading) {
    return (
      <div className="w-full space-y-8 animate-pulse">
        <div className="flex justify-start sm:justify-center gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-10 w-36 rounded-full bg-slate-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-slate-100 border border-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (tabCategories.length === 0) {
    return null;
  }

  const selectedTab = activeTab && tabCategories.includes(activeTab) ? activeTab : (tabCategories[0] || "");
  const currentCourses = coursesData[selectedTab] || [];
  const visibleCourses = currentCourses.slice(0, 8);
  const hasMore = currentCourses.length > 8;

  return (
    <div className="w-full space-y-8">
      {/* Category Tabs Pill Bar */}
      <div className="flex justify-start sm:justify-center overflow-x-auto pb-2 no-scrollbar gap-3">
        {tabCategories.map((category) => {
          const isActive = selectedTab === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveTab(category)}
              className={`cursor-pointer rounded-full px-6 py-2.5 text-sm transition-all shrink-0 font-medium ${
                isActive
                  ? "bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 shadow-md font-semibold"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Courses Grid */}
      {visibleCourses.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No certifications found in this category.
        </div>
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleCourses.map((course, i) => {
              const Icon = course.icon || CheckCircle2;
              const resolvedCourseImg = course.image;
              const imgKey = course.id ? String(course.id) : `${selectedTab}-${course.title}-${i}`;
              const certSlug = (course as any).slug || (course.id && !String(course.id).startsWith("cert-") ? course.id : null) || course.title.toLowerCase().replace(/ & /g, '-').replace(/[\/\s_]+/g, '-');

              return (
                <Card key={course.id || `${selectedTab}-${i}`} className="group p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between h-full relative hover:-translate-y-1.5">
                  {/* Top Image Section */}
                  <div className="h-48 relative w-full overflow-hidden bg-slate-900">
                    {resolvedCourseImg && !imgError[imgKey] ? (
                      <img 
                        src={resolvedCourseImg} 
                        alt={course.title} 
                        referrerPolicy="no-referrer"
                        onError={() => setImgError((prev) => ({ ...prev, [imgKey]: true }))}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 group-hover:scale-108 transition-transform duration-700">
                        <Icon className="w-16 h-16 opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors flex items-center leading-snug mb-3">
                        {course.title}
                      </h3>

                      {/* Features List */}
                      <div className="space-y-2 mb-4">
                        {/* 1. Duration */}
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Duration: <strong className="text-slate-900 font-semibold">{course.duration}</strong></span>
                        </div>

                        {/* 2. Learn from Experts */}
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Learn from Experts</span>
                        </div>

                        {/* 3. Assignments & Live Projects */}
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Laptop className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Assignments & Live Projects</span>
                        </div>

                        {/* 4. Internship Opportunity */}
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Internship Opportunity</span>
                        </div>

                        {/* 5. Become Certified */}
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Become a Certified</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section: Certification Fees & View Certification Button */}
                    <div className="mt-auto pt-2.5 border-t border-slate-100 space-y-2">
                      {(() => {
                        const fee = course.fees?.trim();
                        if (!fee || fee === "0" || fee === "₹0" || fee.toLowerCase().includes("hidden") || fee.toLowerCase().includes("optional")) return null;
                        const formatted = fee.startsWith("₹") || isNaN(Number(fee.replace(/,/g, "")))
                          ? fee
                          : `₹${Number(fee.replace(/,/g, "")).toLocaleString("en-IN")}`;
                        return (
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span className="font-medium text-slate-500">Certification Fees:</span>
                            <span className="text-slate-900 font-extrabold text-xs bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
                              {formatted}
                            </span>
                          </div>
                        );
                      })()}

                      <Link href={`/certifications/${certSlug}`} className="block w-full">
                        <Button className="w-full h-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:opacity-90 text-slate-800 font-normal text-xs transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center gap-2 group/btn">
                          <span>View Certification</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <Link href={categoryRoutes[selectedTab] || `/certifications?category=${encodeURIComponent(selectedTab)}`}>
                <Button variant="outline" className="rounded-full px-8 py-5 bg-transparent border-2 border-amber-500 text-slate-800 hover:bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:text-slate-800 hover:border-transparent font-normal transition-all duration-300 flex items-center gap-2.5 text-sm md:text-base cursor-pointer shadow-none">
                  <span>See more certifications</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

