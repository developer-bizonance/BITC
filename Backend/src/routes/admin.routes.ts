import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { usersDb, applicationsDb } from "../lib/userStore.js";
import { courses as fallbackCourses } from "../data/courses.js";
import { readJsonDb, writeJsonDb, readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

const router = Router();

// GET /api/admin/stats
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    let totalUsers = 0;
    let totalInquiries = 0;
    let totalApplications = 0;
    let totalCourses = fallbackCourses.length;

    try {
      totalUsers = await prisma.user.count();
      totalInquiries = await prisma.inquiry.count();
      const dbAppCount = await prisma.application.count();
      const cmsApps = await readJsonDbAsync("course-applications.json");
      totalApplications = Math.max(dbAppCount, cmsApps.length, applicationsDb.length);
      const dbCourseCount = await prisma.course.count();
      if (dbCourseCount > 0) totalCourses = dbCourseCount;
    } catch (e) {
      console.warn("DB stats count fallback:", e);
      totalUsers = usersDb.length;
      const cmsApps = readJsonDb("course-applications.json");
      totalApplications = cmsApps.length || applicationsDb.length;
    }

    return res.json({
      success: true,
      stats: {
        totalStudents: totalUsers,
        totalInquiries,
        totalApplications,
        totalCourses,
        activeBatches: 6,
        placementRate: "94%",
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch admin stats" });
  }
});

// GET /api/admin/applications
router.get("/applications", async (_req: Request, res: Response) => {
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
      console.warn("DB application query error:", e);
    }

    let cmsApps: any[] = [];
    try {
      cmsApps = await readJsonDbAsync<any>("course-applications.json");
    } catch (e) {
      console.warn("CMS application query error:", e);
      cmsApps = readJsonDb<any>("course-applications.json");
    }

    // Combine and normalize all applications
    const map = new Map<string, any>();

    // 1. Add Prisma DB apps
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

    // 2. Add or enrich with CMS / JSON apps
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

    // 3. In-memory fallback if empty
    if (map.size === 0 && applicationsDb.length > 0) {
      for (const app of applicationsDb) {
        const key = app.id || `${app.userEmail}-${app.courseId}`;
        map.set(key, app);
      }
    }

    const unified = Array.from(map.values()).sort((a, b) => {
      const timeA = new Date(a.appliedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.appliedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return res.json({ success: true, applications: unified });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to fetch applications" });
  }
});

// PATCH /api/admin/applications
router.patch("/applications", async (req: Request, res: Response) => {
  const { id, status } = req.body;
  if (!id || !status) return res.status(400).json({ success: false, error: "Missing required fields" });

  const upperStatus = status.toUpperCase().replace(/\s+/g, "_");

  try {
    // 1. Prisma update
    try {
      await prisma.application.updateMany({
        where: { OR: [{ id }, { id: id.toString() }] },
        data: { status: upperStatus as any },
      });
    } catch (e) {
      console.warn("DB PATCH notice:", e);
    }

    // 2. CMS update
    try {
      const cmsApps = await readJsonDbAsync<any>("course-applications.json");
      let changed = false;
      for (const app of cmsApps) {
        if (app.id === id || app.fullId === id) {
          app.status = upperStatus;
          changed = true;
        }
      }
      if (changed) {
        await writeJsonDbAsync("course-applications.json", cmsApps);
      }
    } catch (e) {
      console.warn("CMS PATCH notice:", e);
    }

    // 3. In-memory update
    const memIndex = applicationsDb.findIndex(a => a.id === id || (a as any).fullId === id);
    if (memIndex !== -1) applicationsDb[memIndex].status = upperStatus as any;

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Failed to update application" });
  }
});

// DELETE /api/admin/applications/:id
router.delete("/applications/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // 1. Prisma delete
    try {
      await prisma.application.deleteMany({
        where: { OR: [{ id }, { id: id.toString() }] },
      });
    } catch (e) {
      console.warn("DB DELETE notice:", e);
    }

    // 2. CMS delete
    try {
      const cmsApps = await readJsonDbAsync<any>("course-applications.json");
      const filtered = cmsApps.filter(a => a.id !== id && a.fullId !== id);
      if (filtered.length !== cmsApps.length) {
        await writeJsonDbAsync("course-applications.json", filtered);
      }
    } catch (e) {
      console.warn("CMS DELETE notice:", e);
    }

    // 3. In-memory delete
    const memIndex = applicationsDb.findIndex(a => a.id === id || (a as any).fullId === id);
    if (memIndex !== -1) applicationsDb.splice(memIndex, 1);

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Failed to delete application" });
  }
});

// GET /api/admin/students
router.get("/students", async (_req: Request, res: Response) => {
  try {
    let students: any[] = [];
    try {
      students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        select: { id: true, name: true, email: true, phone: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      students = usersDb.filter((u) => u.role === "student");
    }

    return res.json({ success: true, students });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch students" });
  }
});

export default router;
