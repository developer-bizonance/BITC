import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // 1. Fetch from Express Backend API first (/api/certifications is the dashboard source of truth)
    try {
      const apiBase = getApiBase();
      const url = `${apiBase}/certifications${category ? `?category=${encodeURIComponent(category)}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const certs = data.certifications || data.courses || [];
        if (Array.isArray(certs) && certs.length > 0) {
          return NextResponse.json({
            success: true,
            source: "backend-api",
            certifications: certs,
            courses: certs,
          });
        }
      }
    } catch (apiError) {
      console.warn("Express backend certifications fetch failed in /api/certifications:", apiError);
    }

    // 2. Fetch directly from Neon PostgreSQL CmsData table (master certifications.json)
    try {
      const cmsRecord = await prisma.cmsData.findUnique({
        where: { key: "certifications.json" },
      });
      if (cmsRecord && cmsRecord.data) {
        let certsList: any[] = Array.isArray(cmsRecord.data)
          ? cmsRecord.data
          : typeof cmsRecord.data === "string"
          ? JSON.parse(cmsRecord.data)
          : [];

        if (certsList.length > 0) {
          if (category && typeof category === "string" && category !== "All") {
            const cleanReq = category.trim().toLowerCase().replace(/ programs?$/, "");
            certsList = certsList.filter((c: any) => {
              const cat = (c.category || "").trim().toLowerCase();
              return cat === category.toLowerCase() || cat.replace(/ programs?$/, "") === cleanReq;
            });
          }

          return NextResponse.json({
            success: true,
            source: "database-cms",
            certifications: certsList,
            courses: certsList,
          });
        }
      }
    } catch (cmsErr) {
      console.warn("Neon DB CmsData query failed in Next.js route:", cmsErr);
    }

    // 3. Fallback: Fetch from Neon PostgreSQL Course table
    try {
      const dbCourses = await prisma.course.findMany({
        where: category && category !== "All"
          ? {
              OR: [
                { category: { equals: category, mode: "insensitive" } },
                { category: { contains: category.replace(/ programs?$/i, ""), mode: "insensitive" } },
              ],
            }
          : undefined,
      });

      if (dbCourses && dbCourses.length > 0) {
        return NextResponse.json({
          success: true,
          source: "database-course",
          certifications: dbCourses,
          courses: dbCourses,
        });
      }
    } catch (dbError) {
      console.warn("Neon DB Course query failed in Next.js route:", dbError);
    }

    return NextResponse.json({
      success: true,
      source: "database",
      certifications: [],
      courses: [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch certifications" },
      { status: 500 }
    );
  }
}
