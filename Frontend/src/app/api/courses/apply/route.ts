import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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
    const {
      courseId,
      courseTitle,
      name,
      email,
      phone,
      city,
      qualification,
      specialization,
      message,
    } = body;

    // 1. Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400, headers: corsHeaders }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
    if (!phone || typeof phone !== "string" || cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400, headers: corsHeaders }
      );
    }

    const selectedCourseTitle = (courseTitle || "Certification Course").trim();
    const selectedCourseId = (courseId || selectedCourseTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim();

    const appId = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApplication: any = {
      id: appId,
      fullId: appId,
      userId: `user-${Date.now()}`,
      userName: name.trim(),
      userEmail: email.trim().toLowerCase(),
      userPhone: cleanPhone,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      city: city?.trim() || "",
      qualification: qualification?.trim() || "",
      specialization: specialization?.trim() || "",
      message: message?.trim() || "",
      courseId: selectedCourseId,
      courseTitle: selectedCourseTitle,
      status: "UNDER_REVIEW",
      appliedAt: new Date().toISOString(),
    };

    // 2. Persist to Neon DB CmsData store
    if (process.env.DATABASE_URL) {
      try {
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
      } catch (dbErr) {
        console.warn("[COURSE APPLY API] DB fallback notice:", dbErr);
      }
    }

    // 3. Delegate and dual-sync to Central Backend API
    try {
      const backendBase = getApiBase();
      await fetch(`${backendBase}/courses/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, id: appId, fullId: appId }),
      }).catch(() => {});

      const cmsRes = await fetch(`${backendBase}/cms/course-applications`).catch(() => null);
      let curList: any[] = [];
      if (cmsRes && cmsRes.ok) {
        const d = await cmsRes.json().catch(() => ({}));
        curList = Array.isArray(d) ? d : (d.data || []);
      }
      const mergedList = [newApplication, ...curList.filter((a) => a.id !== appId && a.fullId !== appId)];
      await fetch(`${backendBase}/cms/course-applications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: mergedList }),
      }).catch(() => {});
    } catch (backendErr) {
      console.warn("[COURSE APPLY API] Backend sync notice:", backendErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        application: newApplication,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[COURSE APPLY API ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit course application" },
      { status: 500, headers: corsHeaders }
    );
  }
}
