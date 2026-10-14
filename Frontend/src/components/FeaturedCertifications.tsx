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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resolveImageUrl, getApiBase } from "@/lib/utils";
import { courses as staticCourses } from "@/data/courses";

type CourseCardItem = {
  id?: string;
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

const buildInitialCourses = (): Record<string, CourseCardItem[]> => {
  const grouped: Record<string, CourseCardItem[]> = {
    "Information Technology": [],
    "Digital Media Technology": [],
    "Management Programs": [],
    "Design Programs": [],
  };
  staticCourses.forEach((c) => {
    const cat = c.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({
      id: c.slug,
      title: c.title,
      category: c.category,
      duration: c.duration,
      fees: c.fees,
      badge: "",
      image: resolveImageUrl(c.image),
      icon: Database,
    });
  });
  return grouped;
};

export default function FeaturedCertifications() {
  const [coursesData, setCoursesData] = useState<Record<string, CourseCardItem[]>>(buildInitialCourses);
  const [imgError, setImgError] = useState<Record<string | number, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("Information Technology");

  useEffect(() => {
    async function loadData() {
      try {
        const API_URL = getApiBase();
        const [certsRes, catsRes] = await Promise.allSettled([
          fetch(`${API_URL}/certifications`),
          fetch(`${API_URL}/categories`),
        ]);

        let certsList: any[] = [];
        let catNames: string[] = [];

        if (certsRes.status === "fulfilled" && certsRes.value.ok) {
          const certsData = await certsRes.value.json();
          if (certsData.certifications && certsData.certifications.length > 0) {
            certsList = certsData.certifications;
          }
        }

        if (catsRes.status === "fulfilled" && catsRes.value.ok) {
          const catsData = await catsRes.value.json();
          if (catsData.categories && catsData.categories.length > 0) {
            catNames = catsData.categories.map((c: any) => c.name);
          }
        }

        if (catNames.length === 0 && certsList.length > 0) {
          catNames = Array.from(new Set(certsList.map((c: any) => c.category || "Information Technology")));
        }

        if (certsList.length > 0) {
          const grouped: Record<string, CourseCardItem[]> = {};

          catNames.forEach((cat) => {
            grouped[cat] = [];
          });

          certsList.forEach((c: any) => {
            const cat = c.category || catNames[0] || "Information Technology";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push({
              id: c.id,
              title: c.title,
              category: c.category,
              duration: c.duration || "6 Months",
              fees: c.fees || "₹36,000",
              badge: c.badge && c.badge !== "Integrated with AI" ? c.badge : "",
              image: resolveImageUrl(c.image),
              icon: Database,
            });
          });

          setCoursesData(grouped);
          setImgError({});
          if (catNames.length > 0) {
            setActiveTab((current) => (catNames.includes(current) ? current : catNames[0]));
          }
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic data, using fallback:", err);
      }
    }
    loadData();
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-start mb-5 overflow-x-auto pb-2">
        <TabsList className="bg-transparent p-0 gap-3">
          {Object.keys(coursesData).map((category) => (
            <TabsTrigger key={category} value={category} className="cursor-pointer rounded-full px-6 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 data-active:bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] data-active:text-black data-active:shadow-md transition-all">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {Object.entries(coursesData).map(([category, courses]) => {
        const visibleCourses = courses.slice(0, 8);
        const hasMore = courses.length > 8;

        return (
          <TabsContent key={category} value={category} className="mt-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleCourses.map((course, i) => {
                const Icon = course.icon || CheckCircle2;
                const resolvedCourseImg = resolveImageUrl(course.image);
                const imgKey = course.id ? String(course.id) : `${category}-${course.title}-${i}`;
                return (
                <Card key={course.id || `${category}-${i}`} className="group p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between h-full relative hover:-translate-y-1.5">
                  {/* Top Image Section */}
                  <div className="h-48 relative w-full overflow-hidden bg-slate-900">
                    {resolvedCourseImg && !imgError[imgKey] ? (
                      <img 
                        src={resolvedCourseImg} 
                        alt={course.title} 
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
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span className="font-medium text-slate-500">Certification Fees:</span>
                        <span className="text-slate-900 font-extrabold text-xs bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
                          {course.fees || "₹36,000"}
                        </span>
                      </div>

                      {(() => {
                        const certSlug = (course as any).slug || (course.id && !String(course.id).startsWith("cert-") ? course.id : null) || course.title.toLowerCase().replace(/ & /g, '-').replace(/[\/\s_]+/g, '-');
                        return (
                          <Link href={`/certifications/${certSlug}`} className="block w-full">
                            <Button className="w-full h-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:opacity-90 text-black font-medium text-xs transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center gap-2 group/btn">
                              <span>View Certification</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        );
                      })()}
                    </div>
                  </div>
                </Card>
                );
              })}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <Link href={categoryRoutes[category] || "/certifications"}>
                  <Button variant="outline" className="rounded-full px-8 py-5 bg-transparent border-2 border-amber-500 text-amber-600 hover:bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:text-black hover:border-transparent font-medium transition-all duration-300 flex items-center gap-2.5 text-sm md:text-base cursor-pointer shadow-none">
                    <span>See more certifications</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

