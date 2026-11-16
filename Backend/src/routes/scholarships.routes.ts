import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import prisma from "../lib/prisma.js";

export interface ScholarshipApplication {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  course: string;
  message: string;
  cvBase64?: string;
  cvFileName?: string;
  cvUrl?: string;
  status: "Pending" | "Reviewed" | "Approved" | "Rejected";
  createdAt: string;
}

const router = Router();

// GET /api/scholarships
router.get("/", async (_req: Request, res: Response) => {
  const scholarshipsDb = await readJsonDbAsync<ScholarshipApplication>("scholarships.json");
  return res.json({
    success: true,
    applications: scholarshipsDb,
  });
});

// POST /api/scholarships/apply (Submit Scholarship Application)
router.post("/apply", async (req: Request, res: Response) => {
  try {
    const {
      id,
      _id,
      fullName,
      name,
      email,
      phone,
      city,
      category,
      course,
      message,
      cvBase64,
      cvFileName,
      cvUrl,
    } = req.body;

    const applicantName = (fullName || name || "").trim();
    if (!applicantName || !email || !phone || !course) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    const normEmail = String(email).trim().toLowerCase();
    const normCourse = String(course).trim().toLowerCase();
    const incomingId = (id || _id || "").trim();

    const scholarshipsDb = await readJsonDbAsync<ScholarshipApplication>("scholarships.json");

    // Deduplication check: check if already exists by ID or applicant identity
    const existingIndex = scholarshipsDb.findIndex((a) => {
      const aId = String(a.id || "").trim();
      const aUnderscoreId = String(a._id || "").trim();

      if (incomingId && (aId === incomingId || aUnderscoreId === incomingId)) {
        return true;
      }

      const aEmail = String(a.email || "").trim().toLowerCase();
      const aPhone = String(a.phone || "").replace(/\D/g, "");
      const aCourse = String(a.course || "").trim().toLowerCase();

      if (aEmail === normEmail && aCourse === normCourse) {
        if (aPhone && cleanPhone && aPhone === cleanPhone) {
          const timeDiff = Math.abs(Date.now() - new Date(a.createdAt || 0).getTime());
          if (timeDiff < 15 * 60 * 1000) return true; // within 15 minutes
        }
      }
      return false;
    });

    if (existingIndex !== -1) {
      // Application already exists - update richer fields if missing without creating a second record
      const existing = scholarshipsDb[existingIndex];
      let updated = false;

      if (cvUrl && !existing.cvUrl) {
        existing.cvUrl = cvUrl;
        updated = true;
      }
      if (cvFileName && !existing.cvFileName) {
        existing.cvFileName = cvFileName;
        updated = true;
      }
      if (cvBase64 && !existing.cvBase64) {
        existing.cvBase64 = cvBase64;
        updated = true;
      }
      if (!existing.fullName && applicantName) {
        existing.fullName = applicantName;
        updated = true;
      }

      if (updated) {
        await writeJsonDbAsync("scholarships.json", scholarshipsDb);
      }

      return res.status(200).json({
        success: true,
        message: "Scholarship application already recorded.",
        application: existing,
      });
    }

    const appId = incomingId.startsWith("SCH-") ? incomingId : `SCH-${Date.now().toString().slice(-5)}`;

    const newApplication: ScholarshipApplication = {
      _id: _id || `sch-${Date.now()}`,
      id: appId,
      fullName: applicantName,
      email: normEmail,
      phone: cleanPhone || String(phone).trim(),
      city: (city || "").trim(),
      category: category?.trim() || "Scholarship",
      course: course.trim(),
      message: message?.trim() || "",
      cvBase64: cvBase64 || "",
      cvFileName: cvFileName || "",
      cvUrl: cvUrl || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    scholarshipsDb.unshift(newApplication);
    await writeJsonDbAsync("scholarships.json", scholarshipsDb);

    return res.status(201).json({
      success: true,
      message: "Scholarship application submitted successfully! Our team will reach out shortly.",
      application: newApplication,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to submit scholarship application." });
  }
});

// PATCH /api/scholarships/:id (Update application status)
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const scholarshipsDb = await readJsonDbAsync<ScholarshipApplication>("scholarships.json");
    const app = scholarshipsDb.find((a) => a._id === id || a.id === id);
    if (!app) {
      return res.status(404).json({ error: "Scholarship Application not found." });
    }

    if (status) {
      app.status = status;
    }
    await writeJsonDbAsync("scholarships.json", scholarshipsDb);

    return res.json({
      success: true,
      message: "Application status updated successfully",
      application: app,
      applications: scholarshipsDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update application" });
  }
});

// Shared delete logic
async function handleDeleteScholarship(req: Request, res: Response) {
  try {
    const rawIds = req.body?.ids || req.query?.ids;
    const singleId = req.params?.id || req.body?.id || req.query?.id || req.body?._id || req.query?._id;
    const email = (req.body?.email || req.query?.email || "").toString().trim().toLowerCase();
    const course = (req.body?.course || req.query?.course || "").toString().trim().toLowerCase();

    const idList = Array.from(new Set([
      ...(Array.isArray(rawIds) ? rawIds : (rawIds ? String(rawIds).split(",") : [])),
      singleId,
    ].filter(Boolean))).map((x) => String(x).trim());

    if (idList.length === 0 && !email) {
      return res.status(400).json({ error: "Application ID or Email is required for deletion." });
    }

    const cleanIdsLower = idList.map((x) => x.toLowerCase());

    // 1. Direct Prisma delete from PostgreSQL relational table
    try {
      const orClauses: any[] = [];
      for (const idVal of idList) {
        orClauses.push({ id: idVal });
        orClauses.push({ id: { equals: idVal, mode: "insensitive" } });
      }
      if (email) {
        if (course) {
          orClauses.push({
            AND: [
              { email: { equals: email, mode: "insensitive" } },
              { course: { equals: course, mode: "insensitive" } },
            ],
          });
        } else {
          orClauses.push({ email: { equals: email, mode: "insensitive" } });
        }
      }

      if (orClauses.length > 0) {
        await prisma.scholarshipApplication.deleteMany({
          where: { OR: orClauses },
        });
      }
    } catch (dbErr) {
      console.warn("[scholarships.routes] DB DELETE notice:", dbErr);
    }

    // 2. Sync to JSON store & CmsData table
    const scholarshipsDb = await readJsonDbAsync<ScholarshipApplication>("scholarships.json");
    const newDb = scholarshipsDb.filter((a) => {
      const aId = String(a.id || "").trim().toLowerCase();
      const aUnderscoreId = String(a._id || "").trim().toLowerCase();
      const aEmail = String(a.email || "").trim().toLowerCase();
      const aCourse = String(a.course || "").trim().toLowerCase();

      // Check ID match
      if (cleanIdsLower.includes(aId) || cleanIdsLower.includes(aUnderscoreId)) {
        return false;
      }

      // Check Email (+ Course) match
      if (email && aEmail === email) {
        if (!course || aCourse === course) {
          return false;
        }
      }

      return true;
    });

    await writeJsonDbAsync("scholarships.json", newDb);

    return res.json({
      success: true,
      message: "Application deleted successfully",
      applications: newDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete application" });
  }
}

// DELETE /api/scholarships/:id
router.delete("/:id", handleDeleteScholarship);
router.delete("/", handleDeleteScholarship);
router.post("/delete", handleDeleteScholarship);

export default router;
