import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Hiring Partners & Corporate Network | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
  description: "Explore BITC's network of 250+ top hiring partners including TCS, Infosys, Wipro, Accenture, Cognizant, IBM, and leading tech startups recruiting our certified students.",
  openGraph: {
    title: "Hiring Partners & Corporate Network | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Explore BITC's network of 250+ top hiring partners hiring our industry-ready graduates.",
  },
};
import {
  Building2, Monitor, LineChart, PenTool,
  CheckCircle2, Users, Briefcase, Award
} from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { resolveImageUrl, getApiBase } from "@/lib/utils";
import TopRecruitersGrid from "@/components/TopRecruitersGrid";
import { SubmitMouButton } from "@/components/SubmitMouModal";

const industries = [
  { name: "Information Technology", icon: Monitor, count: "50+" },
  { name: "Business Development", icon: LineChart, count: "50+" },
  { name: "Design & Media", icon: PenTool, count: "50+" },
  { name: "Corporate & Management", icon: Building2, count: "50+" },
];

const whyHire = [
  {
    title: "Industry-Ready Candidates",
    desc: "Our students are trained on the latest technologies and tools used in the industry today, requiring minimal onboarding time.",
    icon: Award,
  },
  {
    title: "Work On Live Projects",
    desc: "Every BITC student builds a portfolio through real-world projects, ensuring they have practical, applicable skills.",
    icon: Briefcase,
  },
  {
    title: "Certified Professionals",
    desc: "Candidates hold recognized certifications that validate their expertise and commitment to their domain.",
    icon: CheckCircle2,
  },
  {
    title: "Skill Orianted",
    desc: "We rigorously train our students in communication, teamwork, and corporate etiquette to fit seamlessly into any culture.",
    icon: Users,
  }
];

export const dynamic = 'force-dynamic';

export default async function HiringPartnersPage() {
  let partners: { id?: string; name: string; logo?: string; isActive?: boolean }[] = [];

  try {
    // 1. Direct Neon PostgreSQL query for lightning-fast SSR
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "hiring-partners.json" },
      });
      if (Array.isArray(record?.data) && record.data.length > 0) {
        partners = (record.data as any[])
          .filter((p: any) => p && p.isActive !== false && p.isActive !== "false" && p.status !== "hidden")
          .map((apiPartner: any) => ({
            ...apiPartner,
            logo: apiPartner.logo ? resolveImageUrl(apiPartner.logo) : undefined,
          }));
      }
    } catch (dbErr) {
      console.warn("[HiringPartnersPage] Direct DB query notice:", dbErr);
    }

    // 2. Fallback to API if DB is empty
    if (partners.length === 0) {
      const backendUrl = getApiBase();
      const res = await fetch(`${backendUrl}/hiring-partners?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.partners) && data.partners.length > 0) {
          partners = data.partners
            .filter((p: any) => p && p.isActive !== false && p.isActive !== "false" && p.status !== "hidden")
            .map((apiPartner: any) => ({
              ...apiPartner,
              logo: apiPartner.logo ? resolveImageUrl(apiPartner.logo) : undefined,
            }));
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch hiring partners:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. Hero Banner */}
      <section className="relative w-full lg:min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 sm:py-14 md:py-12 bg-white overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10 text-center flex flex-col items-center justify-center h-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Hiring Partners
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.2]">
            Top Companies <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Hire From BITC</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-[800px] mx-auto leading-relaxed font-normal">
            We are proud to partner with leading MNCs, innovative startups, and top corporate firms to provide outstanding career opportunities for our students.
          </p>
          <div className="mt-8 flex justify-center">
            <SubmitMouButton />
          </div>
        </div>
      </section>

      {/* 2. Top Recruiters Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-white relative z-20">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-2">Our Top <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Recruiters</span></h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-normal">Graduates from BITC are placed at these prestigious organizations.</p>
          </div>

          <TopRecruitersGrid initialPartners={partners} />

          <div className="mt-12 text-center text-sm font-semibold text-slate-600 uppercase tracking-widest">
            And 100+ more startups and mid-size companies...
          </div>
        </div>
      </section>

      {/* 3. Industries We Serve */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Industries we <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Serve</span></h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-normal">Our diverse talent pool meets the demands of various high-growth sectors.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind, i) => (
              <Card key={i} className="border-0 shadow-lg bg-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group rounded-2xl">
                <CardContent className="p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white text-slate-900 group-hover:text-orange-500 group-hover:shadow-md flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-all duration-300">
                    <ind.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-medium mb-2 group-hover:text-orange-500 text-gray-600 transition-colors duration-300">{ind.name}</h3>
                  <p className="text-sm text-gray-500 group-hover:text-orange-500/80 uppercase tracking-wider font-semibold transition-colors duration-300">
                    {ind.count} Partners
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Hire BITC Trained */}
      <section className="py-20 bg-white text-slate-900 relative overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium rounded-full px-4 py-1.5 text-sm uppercase tracking-wider mb-6">
                For Employers
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Why Should You Hire <br />
                <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">BITC Certified?</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed font-normal">
                We don't just teach theory; we build professionals. Partnering with BITC means gaining access to a curated pool of talent that is ready to contribute to your company's success from day one.
              </p>

              <ul className="space-y-6">
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-slate-700 font-medium">Zero cost recruitment process</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-slate-700 font-medium">Pre-screened and assessed candidates</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-slate-700 font-medium">Customized campus drives tailored to your needs</span>
                </li>
              </ul>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {whyHire.map((item, i) => (
                <div key={i} className="bg-white border border-slate-200/80 shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <item.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. CTA for Companies */}
      <section className="py-20 bg-white text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-[1.2]">Looking for Top <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Talent?</span></h2>
          <p className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed font-normal">
            Connect with our Placement Cell to organize a campus drive or share your requirements for off-campus recruitment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <SubmitMouButton />
          </div>
        </div>
      </section>

    </div>
  );
}
