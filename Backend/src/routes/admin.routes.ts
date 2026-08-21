import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { usersDb, applicationsDb } from "../lib/userStore.js";
import { courses as fallbackCourses } from "../data/courses.js";

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
      totalApplications = await prisma.application.count();
      const dbCourseCount = await prisma.course.count();
      if (dbCourseCount > 0) totalCourses = dbCourseCount;
    } catch (e) {
      console.warn("DB stats count fallback:", e);
      totalUsers = usersDb.length;
      totalApplications = applicationsDb.length;
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
    let applications: any[] = [];
    try {
      applications = await prisma.application.findMany({
        include: {
          user: { select: { name: true, email: true, phone: true } },
          course: { select: { title: true, slug: true, duration: true, fees: true } },
        },
        orderBy: { appliedAt: "desc" },
      });
    } catch (e) {
      applications = applicationsDb;
    }

    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch applications" });
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
