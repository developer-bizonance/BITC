import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/inquiries
router.get("/", async (_req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: { course: true },
    });
    return res.json({ success: true, inquiries });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch inquiries" });
  }
});

// POST /api/inquiries
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, courseId, courseSlug } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone number are required" });
    }

    let savedInquiry = null;

    try {
      let targetCourseId = courseId;
      if (!targetCourseId && courseSlug) {
        const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
        if (course) targetCourseId = course.id;
      }

      savedInquiry = await prisma.inquiry.create({
        data: {
          name,
          email,
          phone,
          message: message || "Interested in BITC Certification Courses",
          status: "PENDING",
          courseId: targetCourseId || null,
        },
      });
    } catch (dbError) {
      console.warn("DB inquiry save notice:", dbError);
    }

    return res.json({
      success: true,
      message: "Thank you for contacting BITC! Our team will reach out to you within 24 hours.",
      inquiry: savedInquiry || { name, email, phone, message, status: "PENDING" },
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

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status: String(status).toUpperCase() },
    });

    return res.json({ success: true, inquiry: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to update inquiry" });
  }
});

// DELETE /api/inquiries/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.inquiry.delete({ where: { id } });
    return res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete inquiry" });
  }
});

export default router;
