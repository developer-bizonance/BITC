import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { usersDb, applicationsDb } from "../lib/userStore.js";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

const router = Router();

// GET /api/admin/stats
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    let totalUsers = 0;
    let totalInquiries = 0;
    let totalApplications = 0;
    let totalCourses = 0;

    try {
      totalUsers = await prisma.user.count();
      totalInquiries = await prisma.inquiry.count();
      const dbAppCount = await prisma.application.count();
      const cmsApps = await readJsonDbAsync("course-applications.json");
      totalApplications = Math.max(dbAppCount, cmsApps.length, applicationsDb.length);
      totalCourses = await prisma.course.count();
    } catch (e) {
      console.warn("DB stats count fallback:", e);
      totalUsers = usersDb.length;
      try {
        const cmsApps = await readJsonDbAsync("course-applications.json");
        totalApplications = cmsApps.length || applicationsDb.length;
      } catch {
        totalApplications = applicationsDb.length;
      }
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
      console.warn("CMS application query notice:", e);
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
const handleDeleteApplication = async (req: Request, res: Response) => {
  const id = req.params.id || req.body?.id || req.query?.id;
  if (!id) return res.status(400).json({ success: false, error: "Application ID is required" });
  const cleanId = String(id).trim().toLowerCase();

  try {
    // 1. Prisma delete
    try {
      await prisma.application.deleteMany({
        where: {
          OR: [
            { id: String(id) },
            { id: { equals: cleanId, mode: "insensitive" } },
          ],
        },
      });
    } catch (e) {
      console.warn("DB DELETE notice:", e);
    }

    // 2. CMS delete
    try {
      const cmsApps = await readJsonDbAsync<any>("course-applications.json");
      const filtered = cmsApps.filter(a => {
        const aId = String(a.id || "").trim().toLowerCase();
        const aFullId = String(a.fullId || "").trim().toLowerCase();
        return aId !== cleanId && aFullId !== cleanId;
      });
      await writeJsonDbAsync("course-applications.json", filtered);
    } catch (e) {
      console.warn("CMS DELETE notice:", e);
    }

    // 3. In-memory delete
    const memIndex = applicationsDb.findIndex(a => {
      const aId = String(a.id || "").trim().toLowerCase();
      const aFullId = String((a as any).fullId || "").trim().toLowerCase();
      return aId === cleanId || aFullId === cleanId;
    });
    if (memIndex !== -1) applicationsDb.splice(memIndex, 1);

    return res.json({ success: true, message: "Application deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Failed to delete application" });
  }
};

router.delete("/applications/:id", handleDeleteApplication);
router.delete("/applications", handleDeleteApplication);

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
