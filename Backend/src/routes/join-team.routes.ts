import { Router, Request, Response } from "express";
import { getApplications, saveApplications, CareerApplication } from "./careers.routes.js";
import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/join-team (Used by Dashboard Faculty Applications)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const applicationsDb = await getApplications();
    const formatted = applicationsDb.map((app) => ({
      _id: app._id,
      id: app.id || app._id,
      fullId: app.id || app._id,
      name: app.fullName,
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      role: app.position,
      position: app.position,
      department: app.subjectCourse,
      subjectCourse: app.subjectCourse,
      experience: app.experience,
      qualification: app.qualification,
      otherQualification: app.otherQualification,
      dateToJoin: app.dateToJoin,
      company: app.currentOrg,
      currentOrg: app.currentOrg,
      resume: app.resumeUrl,
      resumeUrl: app.resumeUrl,
      resumeFileName: app.resumeFileName,
      linkedin: app.linkedinUrl,
      linkedinUrl: app.linkedinUrl,
      message: app.coverNote,
      coverNote: app.coverNote,
      status: app.status || "New",
      createdAt: app.createdAt,
    }));
    return res.json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to fetch applications" });
  }
});

// POST /api/join-team (Apply from frontend)
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      fullName,
      email,
      phone,
      role,
      position,
      subjectCourse,
      department,
      experience,
      qualification,
      company,
      currentOrg,
      resume,
      resumeUrl,
      linkedin,
      linkedinUrl,
      message,
      coverNote,
    } = req.body;

    const applicantName = fullName || name;
    const applicantPosition = position || role || "Industry Expert & Mentor";
    const applicantCourse = subjectCourse || department || "";

    if (!applicantName || !email || !phone) {
      return res.status(400).json({ error: "Name, Email, and Phone are required." });
    }

    const newApp: CareerApplication = {
      _id: `app-${Date.now()}`,
      id: `APP-${Date.now().toString().slice(-4)}`,
      fullName: applicantName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      position: applicantPosition.trim(),
      subjectCourse: applicantCourse.trim(),
      experience: (experience || "").trim(),
      qualification: (qualification || "").trim(),
      currentOrg: (currentOrg || company || "").trim(),
      resumeUrl: (resumeUrl || resume || "").trim(),
      linkedinUrl: (linkedinUrl || linkedin || "").trim(),
      coverNote: (coverNote || message || "").trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const applicationsDb = await getApplications();
    applicationsDb.unshift(newApp);
    await saveApplications(applicationsDb);

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully! Our HR team will contact you.",
      application: newApp,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to submit application" });
  }
});

// PATCH /api/join-team (Update status from Dashboard)
router.patch("/", async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;
    const applicationsDb = await getApplications();
    const app = applicationsDb.find((a) => a._id === id || a.id === id);
    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (status) {
      app.status = (status.charAt(0).toUpperCase() + status.slice(1)) as any;
    }
    
    await saveApplications(applicationsDb);

    return res.json({ success: true, application: app });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to update application" });
  }
});

// DELETE /api/join-team/:id
router.delete("/:id?", async (req: Request, res: Response) => {
  try {
    const id = req.params.id || req.body?.id || req.query?.id;
    if (!id) {
      return res.status(400).json({ error: "Application ID is required" });
    }
    const cleanId = String(id).trim().toLowerCase();

    // 1. Direct Prisma delete from PostgreSQL
    try {
      await prisma.jobApplication.deleteMany({
        where: {
          OR: [
            { id: String(id) },
            { id: { equals: cleanId, mode: "insensitive" } },
          ],
        },
      });
    } catch (dbErr) {
      console.warn("[join-team] DB DELETE notice:", dbErr);
    }

    const applicationsDb = await getApplications();
    const filtered = applicationsDb.filter((a) => {
      const aId = String(a.id || "").trim().toLowerCase();
      const aUnderscoreId = String(a._id || "").trim().toLowerCase();
      return aId !== cleanId && aUnderscoreId !== cleanId;
    });
    
    await saveApplications(filtered);
    return res.json({ success: true, message: "Application deleted successfully", applications: filtered });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to delete application" });
  }
});

export default router;
