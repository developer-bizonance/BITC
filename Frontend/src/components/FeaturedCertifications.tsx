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

const initialCoursesData: Record<string, CourseCardItem[]> = {
  "Information Technology": [
    { title: "MERN Stack", duration: "6 Months", icon: Database, image: "/MERN.jpg", fees: "₹36,000" },
    { title: "MEAN Stack", duration: "6 Months", icon: Database, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop", fees: "₹36,000" },
    { title: "Full Stack Java", duration: "6 Months", icon: Coffee, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop", fees: "₹36,000" },
    { title: "Full Stack Python", duration: "6 Months", icon: Terminal, image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop", fees: "₹36,000" },
    { title: "AI & Machine Learning", duration: "6 Months", icon: BrainCircuit, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop", fees: "₹36,000", badge: "Top Rated" },
    { title: "Data Science", duration: "6 Months", icon: BarChart, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop", fees: "₹36,000", badge: "High Demand" },
    { title: "Complete DevOps & Cloud Computing", duration: "6 Months", icon: Cloud, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", fees: "₹36,000", badge: "AWS / Azure" },
  ],
  "Management": [
    { title: "Digital Marketing", duration: "3 Months", icon: TrendingUp, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", fees: "₹36,000", badge: "Placement Assistance" },
    { title: "Business Analytics", duration: "6 Months", icon: PieChart, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop", fees: "₹36,000" },
    { title: "Finance", duration: "6 Months", icon: Landmark, image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop", fees: "₹36,000" },
    { title: "HR", duration: "3 Months", icon: Users, image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop", fees: "₹36,000" },
    { title: "Sales", duration: "3 Months", icon: TrendingUp, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop", fees: "₹36,000" },
  ],
  "Design": [
    { title: "UI/UX Design", duration: "6 Months", icon: LayoutTemplate, image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop", fees: "₹36,000", badge: "Figma & Prototyping" },
    { title: "Graphic Design", duration: "3 Months", icon: PenTool, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop", fees: "₹36,000", badge: "Adobe Suite" },
    { title: "Motion Graphics", duration: "3 Months", icon: Video, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop", fees: "₹36,000", badge: "After Effects" },
    { title: "Video Editing", duration: "3 Months", icon: Film, image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop", fees: "₹36,000", badge: "Premiere Pro" },
    { title: "Animation", duration: "6 Months", icon: Clapperboard, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", fees: "₹36,000" },
  ]
};

const categoryRoutes: Record<string, string> = {
  "Information Technology": "/courses/it",
  "Management": "/courses/management",
  "Design": "/courses/design",
};

const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:5000/api";
  }
  return "https://bitc-backend-theta.vercel.app/api";
};

export default function FeaturedCertifications() {
  const [coursesData, setCoursesData] = useState<Record<string, CourseCardItem[]>>(initialCoursesData);
  const [imgError, setImgError] = useState<Record<string | number, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("Information Technology");

  useEffect(() => {
    async function loadData() {
      try {
        const API_URL = getApiUrl();
        const [certsRes, catsRes] = await Promise.allSettled([
          fetch(`${API_URL}/certifications`),
          fetch(`${API_URL}/categories`),
        ]);

        let certsList: any[] = [];
        let catNames: string[] = [];

        if (certsRes.status === "fulfilled" && certsRes.value.ok) {
          const certsData = await certsRes.value.json();
          if (certsData.certifications) {
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

        if (catNames.length > 0 || certsList.length > 0) {
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
              image: c.image || "",
              icon: Database,
            });
          });

          setCoursesData(grouped);
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
            <TabsTrigger key={category} value={category} className="cursor-pointer rounded-full px-6 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 data-active:bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] data-active:text-white data-active:shadow-md transition-all">
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
                return (
                <Card key={i} className="group p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between h-full relative hover:-translate-y-1.5">
                  {/* Top Image Section */}
                  <div className="h-48 relative w-full overflow-hidden bg-slate-900">
                    <img 
                      src={course.image && !imgError[course.id || i] ? course.image : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"} 
                      alt={course.title} 
                      onError={() => setImgError((prev) => ({ ...prev, [course.id || i]: true }))}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" 
                    />
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

                    {/* Bottom Section: Certification Fees & View Program Button */}
                    <div className="mt-auto pt-2.5 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span className="font-medium text-slate-500">Certification Fees:</span>
                        <span className="text-slate-900 font-extrabold text-xs bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
                          {course.fees || "₹36,000"}
                        </span>
                      </div>

                      <Link href={`/courses/${course.title.toLowerCase().replace(/ & /g, '-').replace(/[\/\s]+/g, '-')}`} className="block w-full">
                        <Button className="w-full h-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:opacity-90 text-white font-medium text-xs transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center gap-2 group/btn">
                          <span>View Program</span>
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
                <Link href={categoryRoutes[category] || "/courses"}>
                  <Button variant="outline" className="rounded-full px-8 py-5 bg-transparent border-2 border-amber-500 text-amber-600 hover:bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:text-white hover:border-transparent font-medium transition-all duration-300 flex items-center gap-2.5 text-sm md:text-base cursor-pointer shadow-none">
                    <span>See More Certifications</span>
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

