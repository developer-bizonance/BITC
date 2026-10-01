import { NextResponse } from "next/server";
import { applicationsDb } from "@/lib/userStore";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, courseTitle, name, email, phone } = body;

    if (!courseId || !courseTitle || !name || !email || !phone) {
      return NextResponse.json(
        { error: "All application fields are required" },
        { status: 400 }
      );
    }

    let userId = "";

    try {
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        const randomPassword = Math.random().toString(36).slice(-8) + "A1!";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(randomPassword, salt);
        user = await prisma.user.create({
          data: {
            email,
            name,
            phone,
            passwordHash: hash,
            role: "STUDENT",
          },
        });
      }
      userId = user.id;
    } catch (e) {
      console.warn("Could not create/find user for application:", e);
      userId = `GUEST-${Date.now()}`;
    }

    const newApplication = {
      id: `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: userId,
      userName: name,
      userEmail: email,
      userPhone: phone,
      courseId,
      courseTitle,
      status: "UNDER_REVIEW" as const,
      appliedAt: new Date().toISOString(),
    };

    // Save in memory fallback
    applicationsDb.push(newApplication);

    // Persist into Neon DB
    try {
      // Find course matching slug, ID, or title
      let dbCourse = await prisma.course.findFirst({
        where: {
          OR: [
            { slug: courseId },
            { id: courseId },
            { title: { equals: courseTitle, mode: "insensitive" } },
            { slug: { equals: courseId.toLowerCase().replace(/[\s_]+/g, "-"), mode: "insensitive" } },
          ],
        },
      });

      // If course doesn't exist in DB, fallback to first course or create minimal record
      if (!dbCourse) {
        dbCourse = await prisma.course.findFirst();
      }

      if (dbCourse && !userId.startsWith("GUEST-")) {
        const createdApp = await prisma.application.create({
          data: {
            userId: userId,
            courseId: dbCourse.id,
            name: name,
            email: email,
            phone: phone,
            status: "UNDER_REVIEW",
          },
        });
        console.log("Successfully saved application to Neon DB:", createdApp.id);
      }
    } catch (dbError) {
      console.error("Neon DB application save error:", dbError);
    }

    return NextResponse.json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit course application" },
      { status: 500 }
    );
  }
}
