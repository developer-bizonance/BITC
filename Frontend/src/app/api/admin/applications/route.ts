import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET /api/admin/applications
export async function GET() {
  try {
    let dbApps: any[] = [];
    try {
      dbApps = await prisma.application.findMany({
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          course: { select: { id: true, title: true, slug: true, duration: true, fees: true } },
        },
        orderBy: { appliedAt: "desc" },
      });
    } catch (e) {
      console.warn("[ADMIN APPS API] DB findMany notice:", e);
    }

    let cmsApps: any[] = [];
    try {
      const cmsRecord = await prisma.cmsData.findUnique({
        where: { key: "course-applications.json" },
      });
      if (cmsRecord && Array.isArray(cmsRecord.data)) {
        cmsApps = cmsRecord.data as any[];
      }
    } catch (e) {
      console.warn("[ADMIN APPS API] CmsData findUnique notice:", e);
    }

    // Combine, normalize, and deduplicate all applications
    const allCandidates: any[] = [
      ...dbApps.map((app) => ({
        id: app.id,
        fullId: app.id,
        userId: app.userId,
        name: app.name || app.user?.name || "Unknown",
        email: app.email || app.user?.email || "",
        phone: app.phone || app.user?.phone || "",
        city: app.city || "",
        qualification: app.qualification || "",
        specialization: app.specialization || "",
        message: app.message || "",
        courseId: app.course?.slug || app.courseId || "",
        courseTitle: app.course?.title || "Certification Course",
        status: app.status || "UNDER_REVIEW",
        appliedAt: app.appliedAt ? new Date(app.appliedAt).toISOString() : new Date().toISOString(),
        updatedAt: app.updatedAt ? new Date(app.updatedAt).toISOString() : new Date().toISOString(),
      })),
      ...cmsApps.map((app) => ({
        id: app.id || app.fullId,
        fullId: app.fullId || app.id,
        userId: app.userId || "",
        name: app.name || app.userName || "Unknown",
        email: app.email || app.userEmail || "",
        phone: app.phone || app.userPhone || "",
        city: app.city || "",
        qualification: app.qualification || "",
        specialization: app.specialization || "",
        message: app.message || "",
        courseId: app.courseId || "",
        courseTitle: app.courseTitle || app.course?.title || "Certification Course",
        status: app.status || "UNDER_REVIEW",
        appliedAt: app.appliedAt || app.createdAt || new Date().toISOString(),
        updatedAt: app.updatedAt || app.appliedAt || new Date().toISOString(),
      })),
    ];

    const deduped: any[] = [];
    for (const app of allCandidates) {
      const email = String(app.email || "").trim().toLowerCase();
      const phone = String(app.phone || "").replace(/\D/g, "");
      const courseId = String(app.courseId || "").trim().toLowerCase();
      const courseTitle = String(app.courseTitle || "").trim().toLowerCase();
      const id = String(app.id || app.fullId || "").trim();

      const existingIdx = deduped.findIndex((ex) => {
        const exId = String(ex.id || ex.fullId || "").trim();
        if (id && exId && (id === exId || id === String(ex.fullId || "").trim() || String(app.fullId || "").trim() === exId)) {
          return true;
        }
        const exEmail = String(ex.email || "").trim().toLowerCase();
        const exCourseId = String(ex.courseId || "").trim().toLowerCase();
        const exCourseTitle = String(ex.courseTitle || "").trim().toLowerCase();
        const exPhone = String(ex.phone || "").replace(/\D/g, "");

        if (email && exEmail && email === exEmail && (courseId === exCourseId || courseTitle === exCourseTitle)) {
          if (phone && exPhone && phone === exPhone) return true;
          const timeDiff = Math.abs(new Date(ex.appliedAt || 0).getTime() - new Date(app.appliedAt || 0).getTime());
          if (timeDiff < 24 * 60 * 60 * 1000) return true;
        }
        return false;
      });

      if (existingIdx !== -1) {
        const ex = deduped[existingIdx];
        deduped[existingIdx] = {
          ...ex,
          ...app,
          city: ex.city || app.city,
          qualification: ex.qualification || app.qualification,
          specialization: ex.specialization || app.specialization,
          message: ex.message || app.message,
          id: (ex.id && ex.id.startsWith("APP-")) ? ex.id : (app.id && app.id.startsWith("APP-") ? app.id : ex.id),
          fullId: (ex.fullId && !ex.fullId.startsWith("APP-")) ? ex.fullId : (app.fullId || ex.fullId),
        };
      } else {
        deduped.push(app);
      }
    }

    const unified = deduped.sort((a, b) => {
      const timeA = new Date(a.appliedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.appliedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({ success: true, applications: unified }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[ADMIN APPS API ERROR]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch applications" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH /api/admin/applications
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers: corsHeaders });
    }

    const upperStatus = status.toUpperCase().replace(/\s+/g, "_");

    // 1. Update in relational Application table
    try {
      await prisma.application.updateMany({
        where: { OR: [{ id }, { id: id.toString() }] },
        data: { status: upperStatus as any },
      });
    } catch (e) {
      console.warn("Prisma update notice:", e);
    }

    // 2. Update in cmsData
    try {
      const cmsRecord = await prisma.cmsData.findUnique({
        where: { key: "course-applications.json" },
      });
      if (cmsRecord && Array.isArray(cmsRecord.data)) {
        const list = (cmsRecord.data as any[]).map(app => {
          if (app.id === id || app.fullId === id) {
            return { ...app, status: upperStatus };
          }
          return app;
        });
        await prisma.cmsData.update({
          where: { key: "course-applications.json" },
          data: { data: list as any },
        });

        // Sync to central API store
        const apiBase = getApiBase();
        await fetch(`${apiBase}/cms/course-applications`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: list }),
        }).catch(() => {});
      }
    } catch (e) {
      console.warn("CmsData update notice:", e);
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update application" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/admin/applications
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing application id" }, { status: 400, headers: corsHeaders });
    }

    // 1. Delete from Application table
    try {
      await prisma.application.deleteMany({
        where: { OR: [{ id }, { id: id.toString() }] },
      });
    } catch (e) {
      console.warn("Prisma delete notice:", e);
    }

    // 2. Delete from cmsData
    try {
      const cmsRecord = await prisma.cmsData.findUnique({
        where: { key: "course-applications.json" },
      });
      if (cmsRecord && Array.isArray(cmsRecord.data)) {
        const filtered = (cmsRecord.data as any[]).filter(a => a.id !== id && a.fullId !== id);
        await prisma.cmsData.update({
          where: { key: "course-applications.json" },
          data: { data: filtered as any },
        });

        // Sync to central API store
        const apiBase = getApiBase();
        await fetch(`${apiBase}/cms/course-applications`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: filtered }),
        }).catch(() => {});
      }
    } catch (e) {
      console.warn("CmsData delete notice:", e);
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete application" },
      { status: 500, headers: corsHeaders }
    );
  }
}
