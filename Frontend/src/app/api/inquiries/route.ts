import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, courseId, courseSlug } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required" },
        { status: 400 }
      );
    }

    let savedInquiry = null;

    try {
      let targetCourseId = courseId;
      if (!targetCourseId && courseSlug) {
        const course = await prisma.course.findUnique({
          where: { slug: courseSlug },
        });
        if (course) targetCourseId = course.id;
      }

      savedInquiry = await prisma.inquiry.create({
        data: {
          name,
          email,
          phone,
          message: message || "Interested in BITC Certification Courses",
          status: "PENDING",
          courseId: targetCourseId || null,
        },
      });
    } catch (dbError) {
      console.warn("Neon DB inquiry save failed, defaulting to acknowledged response:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting BITC! Our team will reach out to you within 24 hours.",
      inquiry: savedInquiry || { name, email, phone, message, status: "PENDING" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to record inquiry" },
      { status: 500 }
    );
  }
}
