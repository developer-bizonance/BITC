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
      fullName,
      email,
      phone,
      city,
      category,
      course,
      message,
      cvBase64,
      cvFileName,
    } = body;

    // 1. Validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
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

    if (!city || typeof city !== "string" || !city.trim()) {
      return NextResponse.json(
        { error: "Please enter your city." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!course || typeof course !== "string" || !course.trim()) {
      return NextResponse.json(
        { error: "Please select a certification course." },
        { status: 400, headers: corsHeaders }
      );
    }

    const appId = `SCH-${Date.now().toString().slice(-5)}`;
    const newApp = {
      _id: `sch-${Date.now()}`,
      id: appId,
      fullName: fullName.trim(),
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      city: city.trim(),
      category: category?.trim() || "Information Technology",
      course: course.trim(),
      message: message?.trim() || "",
      cvFileName: cvFileName || "",
      cvBase64: cvBase64 || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    // 2. Delegate to Central Backend API
    try {
      const backendBase = getApiBase();
      const res = await fetch(`${backendBase}/scholarships/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, { status: 201, headers: corsHeaders });
      }
    } catch (backendErr) {
      console.warn("[SCHOLARSHIP APPLY API] Backend sync notice:", backendErr);
    }

    // 3. Fallback to direct DB query if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const existingRecord = await prisma.cmsData.findUnique({
          where: { key: "scholarships.json" },
        });
        const currentList: any[] = Array.isArray(existingRecord?.data)
          ? (existingRecord.data as any[])
          : [];

        const updatedList = [newApp, ...currentList.filter((a) => a.id !== appId)];
        await prisma.cmsData.upsert({
          where: { key: "scholarships.json" },
          update: { data: updatedList as any },
          create: { key: "scholarships.json", data: updatedList as any },
        });

        // Sync to central API store
        try {
          const backendBase = getApiBase();
          await fetch(`${backendBase}/cms/scholarships`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: updatedList }),
          });
        } catch {}
      } catch (dbErr) {
        console.warn("[SCHOLARSHIP APPLY API] DB fallback notice:", dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Scholarship application submitted successfully! Our counseling team will review it and contact you.",
        application: newApp,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[SCHOLARSHIP APPLY API ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit scholarship application" },
      { status: 500, headers: corsHeaders }
    );
  }
}
