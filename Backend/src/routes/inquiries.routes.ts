import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";
import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/inquiries
router.get("/", async (_req: Request, res: Response) => {
  try {
    let dbInquiries: any[] = [];
    try {
      dbInquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        include: { course: true },
      });
    } catch (error) {
      console.warn("Failed to fetch inquiries from DB, falling back to JSON");
    }

    const inMemory = readJsonDb("inquiries.json") || [];

    // Merge and deduplicate
    const merged = [...dbInquiries, ...inMemory];
    const uniqueIds = new Set();
    const uniqueInquiries = merged.filter((i) => {
      const id = i.id || i.fullId;
      if (uniqueIds.has(id)) return false;
      uniqueIds.add(id);
      return true;
    });

    return res.json({ success: true, inquiries: uniqueInquiries });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch inquiries" });
  }
});

// POST /api/inquiries
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, courseId, courseSlug, enquiryType } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone number are required" });
    }

    let savedInquiry = null;

    const id = `INQ-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const dataObj: any = {
        id,
        name,
        email,
        phone,
        enquiryType: enquiryType || "General Inquiry",
        message: message || "Interested in BITC Certification Courses",
        status: "PENDING",
        courseId: courseId || null,
        createdAt
    };

    try {
      let targetCourseId = courseId;
      if (!targetCourseId && courseSlug) {
        const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
        if (course) targetCourseId = course.id;
      }

      dataObj.courseId = targetCourseId || null;

      savedInquiry = await prisma.inquiry.create({
        data: dataObj,
      });
    } catch (dbError) {
      console.warn("DB inquiry save notice:", dbError);
    }

    const fallbackInquiry = savedInquiry || dataObj;

    // Always append to JSON fallback
    const inquiries = readJsonDb("inquiries.json") || [];
    writeJsonDb("inquiries.json", [fallbackInquiry, ...inquiries]);

    return res.json({
      success: true,
      message: "Thank you for contacting BITC! Our team will reach out to you within 24 hours.",
      inquiry: fallbackInquiry,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to record inquiry" });
  }
});

// PATCH /api/inquiries/:id
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updated = null;
    try {
      updated = await prisma.inquiry.update({
        where: { id },
        data: { status: String(status).toUpperCase() },
      });
    } catch (dbErr) {
      // Ignore DB error for local dev
    }

    // Fallback JSON update
    let inquiries = readJsonDb("inquiries.json") || [];
    let fallbackUpdated = null;
    inquiries = inquiries.map((inq: any) => {
      if (inq.id === id) {
        fallbackUpdated = { ...inq, status: String(status).toUpperCase() };
        return fallbackUpdated;
      }
      return inq;
    });
    writeJsonDb("inquiries.json", inquiries);

    return res.json({ success: true, inquiry: updated || fallbackUpdated || { id, status } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to update inquiry" });
  }
});

// DELETE /api/inquiries/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    try {
      await prisma.inquiry.delete({ where: { id } });
    } catch (err) {}

    // Fallback JSON
    let inquiries = readJsonDb("inquiries.json") || [];
    inquiries = inquiries.filter((inq: any) => inq.id !== id);
    writeJsonDb("inquiries.json", inquiries);

    return res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete inquiry" });
  }
});

export default router;
