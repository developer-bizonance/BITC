import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    const map = new Map<string, any>();

    // 1. Add DB Applications
    for (const app of dbApps) {
      const id = app.id;
      map.set(id, {
        id,
        fullId: id,
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
      });
    }

    // 2. Add or enrich with CMS Applications (e.g. Yuvraj's application APP-2026-9771 etc.)
    for (const app of cmsApps) {
      const key = app.fullId || app.id || `${app.email}-${app.courseId}`;
      if (map.has(key)) {
        const existing = map.get(key);
        if (!existing.city && app.city) existing.city = app.city;
        if (!existing.qualification && app.qualification) existing.qualification = app.qualification;
        if (!existing.specialization && app.specialization) existing.specialization = app.specialization;
        if (!existing.message && app.message) existing.message = app.message;
        if (app.id && app.id.startsWith("APP-")) existing.id = app.id;
      } else {
        map.set(key, {
          id: app.id || `APP-${Math.floor(1000 + Math.random() * 9000)}`,
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
        });
      }
    }

    const unified = Array.from(map.values()).sort((a, b) => {
      const timeA = new Date(a.appliedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.appliedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({ success: true, applications: unified });
  } catch (error: any) {
    console.error("[ADMIN APPS API ERROR]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/applications
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
      }
    } catch (e) {
      console.warn("CmsData update notice:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update application" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/applications
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing application id" }, { status: 400 });
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
      }
    } catch (e) {
      console.warn("CmsData delete notice:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete application" },
      { status: 500 }
    );
  }
}
