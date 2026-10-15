import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

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

    const scholarshipsDb = await readJsonDbAsync<ScholarshipApplication>("scholarships.json");
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

// DELETE /api/scholarships/:id (Delete application)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const scholarshipsDb = await readJsonDbAsync<ScholarshipApplication>("scholarships.json");
    const newDb = scholarshipsDb.filter((a) => a._id !== id && a.id !== id);

    if (newDb.length === scholarshipsDb.length) {
      return res.status(404).json({ error: "Scholarship Application not found." });
    }

    await writeJsonDbAsync("scholarships.json", newDb);

    return res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete application" });
  }
});

export default router;
