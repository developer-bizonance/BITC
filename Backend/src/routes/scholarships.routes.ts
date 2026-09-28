import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

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
  status: "Pending" | "Reviewed" | "Approved" | "Rejected";
  createdAt: string;
}

export function getScholarships(): ScholarshipApplication[] {
  return readJsonDb<ScholarshipApplication>("scholarships.json");
}

export function saveScholarships(data: ScholarshipApplication[]) {
  writeJsonDb("scholarships.json", data);
}

const router = Router();

// GET /api/scholarships
router.get("/", (_req: Request, res: Response) => {
  const scholarshipsDb = getScholarships();
  return res.json({
    success: true,
    applications: scholarshipsDb,
  });
});

// POST /api/scholarships/apply (Submit Scholarship Application)
router.post("/apply", (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      city,
      category,
      course,
      message,
      cvBase64,
      cvFileName
    } = req.body;

    if (!fullName || !email || !phone || !city || !course) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const appId = `SCH-${Date.now().toString().slice(-5)}`;

    const newApplication: ScholarshipApplication = {
      _id: `sch-${Date.now()}`,
      id: appId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: city.trim(),
      category: category?.trim() || "",
      course: course.trim(),
      message: message?.trim() || "",
      cvBase64: cvBase64 || "",
      cvFileName: cvFileName || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const scholarshipsDb = getScholarships();
    scholarshipsDb.unshift(newApplication);
    saveScholarships(scholarshipsDb);

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
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const scholarshipsDb = getScholarships();
    const app = scholarshipsDb.find((a) => a._id === id || a.id === id);
    if (!app) {
      return res.status(404).json({ error: "Scholarship Application not found." });
    }

    if (status) {
      app.status = status;
    }
    saveScholarships(scholarshipsDb);

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

export default router;
