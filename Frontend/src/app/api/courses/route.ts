import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { courses as fallbackCourses } from "@/data/courses";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Try fetching from Neon PostgreSQL database
    let dbCourses = null;
    try {
      dbCourses = await prisma.course.findMany({
        where: category ? { category } : undefined,
        orderBy: { title: "asc" },
      });
    } catch (dbError) {
      console.warn("Neon DB query failed, falling back to static course data:", dbError);
    }

    if (dbCourses && dbCourses.length > 0) {
      return NextResponse.json({
        success: true,
        source: "database",
        courses: dbCourses,
      });
    }

    // Fallback to static courses
    const filteredCourses = category
      ? fallbackCourses.filter(c => c.category.toLowerCase() === category.toLowerCase())
      : fallbackCourses;

    return NextResponse.json({
      success: true,
      source: "static",
      courses: filteredCourses,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
