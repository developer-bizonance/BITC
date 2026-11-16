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
      position,
      subjectCourse,
      experience,
      qualification,
      otherQualification,
      dateToJoin,
      currentOrg,
      resumeUrl,
      resumeFileName,
      linkedinUrl,
      coverNote,
    } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Full Name, Email, and Mobile number are required." },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanPhone = (phone || "").replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400, headers: corsHeaders }
      );
    }

    const finalQual =
      qualification === "Other" && otherQualification
        ? `Other (${otherQualification.trim()})`
        : qualification?.trim() || "";

    const appId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApplication = {
      _id: `app-${Date.now()}`,
      id: appId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      position: position?.trim() || "Industry Expert & Mentor",
      subjectCourse: subjectCourse?.trim() || "",
      experience: experience?.trim() || "",
      qualification: finalQual,
      otherQualification: otherQualification?.trim() || "",
      dateToJoin: dateToJoin?.trim() || "",
      currentOrg: currentOrg?.trim() || "",
      resumeUrl: resumeUrl?.trim() || "",
      resumeFileName: resumeFileName?.trim() || "",
      linkedinUrl: linkedinUrl?.trim() || "",
      coverNote: coverNote?.trim() || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    // 1. Forward directly to Central Backend API
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/careers/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(
          data.application ? data : { success: true, application: newApplication },
          { status: 201, headers: corsHeaders }
        );
      }
    } catch (apiErr) {
      console.warn("[CAREERS APPLY] Backend API proxy notice:", apiErr);
    }

    // 2. Direct Prisma DB fallback if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const record = await prisma.cmsData.findUnique({
          where: { key: "applications.json" },
        });

        let appList: any[] = [];
        if (Array.isArray(record?.data)) {
          appList = [...(record!.data as any[])];
        }

        const isDuplicate = appList.some((a) => {
          const isSame = (a.email || "").toLowerCase() === email.trim().toLowerCase() && a.phone === cleanPhone;
          if (isSame) {
            const diff = Math.abs(new Date().getTime() - new Date(a.createdAt || 0).getTime());
            if (diff < 30000) return true;
          }
          return false;
        });

        if (!isDuplicate) {
          appList.unshift(newApplication);
          await prisma.cmsData.upsert({
            where: { key: "applications.json" },
            update: { data: appList as any },
            create: { key: "applications.json", data: appList as any },
          });

          await prisma.cmsData.upsert({
            where: { key: "join-team.json" },
            update: { data: appList as any },
            create: { key: "join-team.json", data: appList as any },
          });

          // Sync to central API store
          try {
            const apiBase = getApiBase();
            await fetch(`${apiBase}/cms/applications`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ data: appList }),
            });
            await fetch(`${apiBase}/cms/join-team`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ data: appList }),
            });
          } catch {}
        }
      } catch (dbErr) {
        console.warn("[CAREERS APPLY] DB fallback notice:", dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully! Our HR team will reach out shortly.",
        application: newApplication,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[CAREERS APPLY ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit application" },
      { status: 500, headers: corsHeaders }
    );
  }
}
