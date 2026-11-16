import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
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

    const inMemory = (await readJsonDbAsync<any>("inquiries.json")) || [];
    const memoryMap = new Map();
    for (const item of inMemory) {
      const k = item.id || item.fullId;
      if (k) memoryMap.set(k, item);
    }

    // Merge and deduplicate
    const merged = [
      ...dbInquiries.map((dbItem) => {
        const memItem = memoryMap.get(dbItem.id) || {};
        const collegeVal = dbItem.college || dbItem.school || dbItem.collegeName || memItem.college || memItem.school || memItem.collegeName || "";
        const cityVal = dbItem.city || memItem.city || "";
        return {
          ...memItem,
          ...dbItem,
          college: collegeVal,
          school: collegeVal,
          collegeName: collegeVal,
          city: cityVal,
        };
      }),
      ...inMemory.map((memItem) => {
        const collegeVal = memItem.college || memItem.school || memItem.collegeName || "";
        const cityVal = memItem.city || "";
        return {
          ...memItem,
          college: collegeVal,
          school: collegeVal,
          collegeName: collegeVal,
          city: cityVal,
        };
      }),
    ];

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
    const { name, email, phone, message, courseId, courseSlug, enquiryType, college, school, collegeName, city } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone number are required" });
    }

    const schoolOrCollege = (college || school || collegeName || req.body.schoolCollege || req.body.college_name || req.body.school_name || "").trim();
    const cityVal = (city || "").trim();

    let savedInquiry = null;

    const id = `INQ-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const dataObj: any = {
      id,
      name,
      email,
      phone,
      college: schoolOrCollege,
      school: schoolOrCollege,
      collegeName: schoolOrCollege,
      city: cityVal,
      enquiryType: enquiryType || "General Inquiry",
      message: message || "Interested in BITC Certification Courses",
      status: "PENDING",
      courseId: courseId || null,
      createdAt,
    };

    try {
      let targetCourseId = courseId;
      if (!targetCourseId && courseSlug) {
        const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
        if (course) targetCourseId = course.id;
      }

      dataObj.courseId = targetCourseId || null;

      const prismaPayload: any = {
        id: dataObj.id,
        name: dataObj.name,
        email: dataObj.email,
        phone: dataObj.phone,
        college: schoolOrCollege || null,
        school: schoolOrCollege || null,
        collegeName: schoolOrCollege || null,
        city: dataObj.city || null,
        enquiryType: dataObj.enquiryType,
        message: dataObj.message,
        status: dataObj.status,
        courseId: dataObj.courseId,
      };

      savedInquiry = await prisma.inquiry.create({
        data: prismaPayload,
      });
    } catch (dbError) {
      console.warn("DB inquiry save notice:", dbError);
    }

    const fallbackInquiry = {
      ...dataObj,
      ...(savedInquiry || {}),
      college: schoolOrCollege || (savedInquiry as any)?.college || (savedInquiry as any)?.school || "",
      school: schoolOrCollege || (savedInquiry as any)?.school || (savedInquiry as any)?.college || "",
      collegeName: schoolOrCollege || (savedInquiry as any)?.collegeName || "",
      city: cityVal || (savedInquiry as any)?.city || "",
    };

    // Always append to JSON store
    const inquiries = (await readJsonDbAsync<any>("inquiries.json")) || [];
    await writeJsonDbAsync("inquiries.json", [fallbackInquiry, ...inquiries]);

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
        data: { status: String(status).toUpperCase() as any },
      });
    } catch (dbErr) {
      // Ignore DB error for local dev
    }

    // Fallback JSON update
    let inquiries = (await readJsonDbAsync<any>("inquiries.json")) || [];
    let fallbackUpdated = null;
    inquiries = inquiries.map((inq: any) => {
      if (inq.id === id) {
        fallbackUpdated = { ...inq, status: String(status).toUpperCase() };
        return fallbackUpdated;
      }
      return inq;
    });
    await writeJsonDbAsync("inquiries.json", inquiries);

    return res.json({ success: true, inquiry: updated || fallbackUpdated || { id, status } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to update inquiry" });
  }
});

// Helper for deletion
async function handleDeleteInquiry(req: Request, res: Response) {
  try {
    const rawIds = req.body?.ids || req.query?.ids;
    const singleId = req.params?.id || req.body?.id || req.query?.id;
    const email = (req.body?.email || req.query?.email || "").toString().trim().toLowerCase();

    const idList = Array.from(new Set([
      ...(Array.isArray(rawIds) ? rawIds : (rawIds ? String(rawIds).split(",") : [])),
      singleId,
    ].filter(Boolean))).map((x) => String(x).trim());

    if (idList.length === 0 && !email) {
      return res.status(400).json({ success: false, error: "Inquiry ID is required" });
    }

    const cleanIdsLower = idList.map((x) => x.toLowerCase());

    // 1. Delete from Inquiry table
    try {
      const orClauses: any[] = [];
      for (const idVal of idList) {
        orClauses.push({ id: idVal });
        orClauses.push({ id: { equals: idVal, mode: "insensitive" } });
      }
      if (email) {
        orClauses.push({ email: { equals: email, mode: "insensitive" } });
      }
      await prisma.inquiry.deleteMany({
        where: { OR: orClauses },
      });
    } catch (err) {}

    // 2. Also delete from ContactEntry table
    try {
      const orClauses: any[] = [];
      for (const idVal of idList) {
        orClauses.push({ id: idVal });
        orClauses.push({ id: { equals: idVal, mode: "insensitive" } });
      }
      if (email) {
        orClauses.push({ email: { equals: email, mode: "insensitive" } });
      }
      await prisma.contactEntry.deleteMany({
        where: { OR: orClauses },
      });
    } catch (err) {}

    // 3. Update JSON store & CmsData
    let inquiries = (await readJsonDbAsync<any>("inquiries.json")) || [];
    inquiries = inquiries.filter((inq: any) => {
      const inqId = String(inq.id || inq._id || "").trim().toLowerCase();
      const inqEmail = String(inq.email || "").trim().toLowerCase();
      if (cleanIdsLower.includes(inqId)) return false;
      if (email && inqEmail === email) return false;
      return true;
    });
    await writeJsonDbAsync("inquiries.json", inquiries);

    return res.json({ success: true, message: "Inquiry deleted successfully", inquiries });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete inquiry" });
  }
}

// DELETE /api/inquiries/:id
router.delete("/:id", handleDeleteInquiry);
router.delete("/", handleDeleteInquiry);
router.post("/delete", handleDeleteInquiry);

export default router;
