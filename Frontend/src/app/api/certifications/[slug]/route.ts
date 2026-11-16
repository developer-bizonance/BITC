import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    // 1. Try fetching from Neon DB
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
        return NextResponse.json({
          success: true,
          source: "database",
          course: dbCourse,
        });
      }
    } catch (dbError) {
      console.warn(`Neon DB lookup failed for slug '${slug}', trying backend API:`, dbError);
    }

    // 2. Try fetching from Express Backend API
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/courses/${normalizedSlug}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.course) {
          return NextResponse.json({
            success: true,
            source: "database",
            course: data.course,
          });
        }
      }
    } catch (apiErr) {
      console.warn("Backend API course fetch failed:", apiErr);
    }

    return NextResponse.json(
      { success: false, error: "Certification not found" },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch course details" },
      { status: 500 }
    );
  }
}

