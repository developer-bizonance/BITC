import { Router, Request, Response } from "express";
import { getApplications, saveApplications, CareerApplication } from "./careers.routes.js";

const router = Router();

// GET /api/join-team (Used by Dashboard JoinTeamEntries)
router.get("/", (_req: Request, res: Response) => {
  const applicationsDb = getApplications();
  const formatted = applicationsDb.map((app) => ({
    _id: app._id,
    name: app.fullName,
    email: app.email,
    phone: app.phone,
    role: app.position,
    department: app.subjectCourse,
    experience: app.experience,
    qualification: app.qualification,
    otherQualification: app.otherQualification,
    dateToJoin: app.dateToJoin,
    company: app.currentOrg,
    resume: app.resumeUrl,
    resumeFileName: app.resumeFileName,
    linkedin: app.linkedinUrl,
    message: app.coverNote,
    status: app.status || "New",
    createdAt: app.createdAt,
  }));
  return res.json(formatted);
});

// POST /api/join-team (Apply from frontend)
router.post("/", (req: Request, res: Response) => {
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
    const applicantPosition = position || role || "Faculty / Technical Trainer";
    const applicantCourse = subjectCourse || department || "General";

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
      experience: (experience || "1-3 Years").trim(),
      qualification: (qualification || "B.Tech / M.Tech / MCA").trim(),
      currentOrg: (currentOrg || company || "").trim(),
      resumeUrl: (resumeUrl || resume || "").trim(),
      linkedinUrl: (linkedinUrl || linkedin || "").trim(),
      coverNote: (coverNote || message || "").trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const applicationsDb = getApplications();
    applicationsDb.unshift(newApp);
    saveApplications(applicationsDb);

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
router.patch("/", (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;
    const applicationsDb = getApplications();
    const app = applicationsDb.find((a) => a._id === id || a.id === id);
    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (status) {
      // Normalize status
      app.status = status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    saveApplications(applicationsDb);

    return res.json({ success: true, application: app });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to update application" });
  }
});

export default router;
