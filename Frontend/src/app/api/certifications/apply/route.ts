import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getApiBase } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, courseTitle, name, email, phone, city, qualification, specialization, message } = body;

    if (!courseId || !courseTitle || !name || !email || !phone) {
      return NextResponse.json(
        { error: "All application fields are required" },
        { status: 400, headers: corsHeaders }
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

    const appId = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApplication = {
      id: appId,
      fullId: appId,
      userId: userId,
      userName: name,
      userEmail: email,
      userPhone: phone,
      name,
      email,
      phone,
      city: city || "",
      qualification: qualification || "",
      specialization: specialization || "",
      message: message || "",
      courseId,
      courseTitle,
      status: "UNDER_REVIEW" as const,
      appliedAt: new Date().toISOString(),
    };

    // Persist into Neon DB
    try {
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

      if (!dbCourse) {
        dbCourse = await prisma.course.findFirst();
      }

      if (dbCourse && !userId.startsWith("GUEST-")) {
        await prisma.application.create({
          data: {
            userId: userId,
            courseId: dbCourse.id,
            name: name,
            email: email,
            phone: phone,
            status: "UNDER_REVIEW",
          },
        });
      }

      const existingRecord = await prisma.cmsData.findUnique({
        where: { key: "course-applications.json" },
      });
      const currentList: any[] = Array.isArray(existingRecord?.data)
        ? (existingRecord.data as any[])
        : [];
      const updatedList = [newApplication, ...currentList.filter((a) => a.id !== appId)];
      await prisma.cmsData.upsert({
        where: { key: "course-applications.json" },
        update: { data: updatedList as any },
        create: { key: "course-applications.json", data: updatedList as any },
      });

      // Sync to central API store
      const backendBase = getApiBase();
      await fetch(`${backendBase}/cms/course-applications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: updatedList }),
      }).catch(() => {});
    } catch (dbError) {
      console.error("Neon DB application save error:", dbError);
    }

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application: newApplication,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit course application" },
      { status: 500, headers: corsHeaders }
    );
  }
}
