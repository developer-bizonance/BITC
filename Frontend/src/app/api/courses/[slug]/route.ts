import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCourseBySlug } from "@/data/courses";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, '-');

    // Try fetching from Neon DB
    try {
      const dbCourse = await prisma.course.findUnique({
        where: { slug: normalizedSlug },
      });

      if (dbCourse) {
        return NextResponse.json({
          success: true,
          source: "database",
          course: dbCourse,
        });
      }
    } catch (dbError) {
      console.warn(`Neon DB lookup failed for slug '${slug}', using fallback data:`, dbError);
    }

    // Static fallback
    const staticCourse = getCourseBySlug(normalizedSlug);

    if (!staticCourse) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      source: "static",
      course: staticCourse,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch course details" },
      { status: 500 }
    );
  }
}
