import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

export interface JobOpening {
  id: string;
  title: string;
  type: string;
  location: string;
  experience: string;
  department?: string;
  description?: string;
  specialities?: string;
  status: "Active" | "Closed";
  createdAt: string;
}

export interface CareerApplication {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  subjectCourse: string;
  experience: string;
  qualification: string;
  otherQualification?: string;
  dateToJoin?: string;
  currentOrg?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  linkedinUrl?: string;
  coverNote?: string;
  status: "Pending" | "Reviewed" | "Shortlisted" | "Interviewed" | "Rejected" | "Hired";
  createdAt: string;
}

function getCareers(): JobOpening[] {
  return readJsonDb<JobOpening>("careers.json");
}

function saveCareers(data: JobOpening[]) {
  writeJsonDb("careers.json", data);
}

export function getApplications(): CareerApplication[] {
  return readJsonDb<CareerApplication>("applications.json");
}

export function saveApplications(data: CareerApplication[]) {
  writeJsonDb("applications.json", data);
}


const router = Router();

// GET /api/careers
router.get("/", (_req: Request, res: Response) => {
  const careersDb = getCareers();
  return res.json({
    success: true,
    openings: careersDb,
  });
});

// POST /api/careers (Add new job opening)
router.post("/", (req: Request, res: Response) => {
  try {
    const { title, type, location, experience, department, description, specialities } = req.body;

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return res.status(400).json({ error: "Job title is required." });
    }

    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      type: type?.trim() || "Full-Time",
      location: location?.trim() || "On-Site",
      experience: experience?.trim() || "1+ Years",
      department: department?.trim() || "Training & Operations",
      description: description?.trim() || "",
      specialities: specialities?.trim() || "",
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    const careersDb = getCareers();
    careersDb.unshift(newJob);
    saveCareers(careersDb);

    return res.status(201).json({
      success: true,
      message: "Job opening posted successfully",
      opening: newJob,
      openings: careersDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to post job opening" });
  }
});

// PUT /api/careers/reorder (Reorder careers)
router.put("/reorder", (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const careersDb = getCareers();
    const reorderedDb: JobOpening[] = [];
    for (const id of orderedIds) {
      const item = careersDb.find((m) => m.id === id);
      if (item) reorderedDb.push(item);
    }
    for (const item of careersDb) {
      if (!orderedIds.includes(item.id)) reorderedDb.push(item);
    }

    saveCareers(reorderedDb);

    return res.json({
      success: true,
      message: "Careers reordered successfully",
      openings: reorderedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder careers" });
  }
});

// PUT /api/careers/:id (Update job opening)
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, type, location, experience, department, description, specialities, status } = req.body;

    const careersDb = getCareers();
    const index = careersDb.findIndex((j) => j.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Job opening not found" });
    }

    const current = careersDb[index];
    const updated: JobOpening = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      type: type !== undefined ? type.trim() : current.type,
      location: location !== undefined ? location.trim() : current.location,
      experience: experience !== undefined ? experience.trim() : current.experience,
      department: department !== undefined ? department.trim() : current.department,
      description: description !== undefined ? description.trim() : current.description,
      specialities: specialities !== undefined ? specialities.trim() : current.specialities,
      status: status !== undefined ? status : current.status,
    };

    careersDb[index] = updated;
    saveCareers(careersDb);

    return res.json({
      success: true,
      message: "Job opening updated successfully",
      opening: updated,
      openings: careersDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update job opening" });
  }
});

// DELETE /api/careers/:id (Remove job opening)
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const careersDb = getCareers();
    const initialLen = careersDb.length;
    const filteredDb = careersDb.filter((j) => j.id !== id);

    if (filteredDb.length === initialLen) {
      return res.status(404).json({ error: "Job opening not found" });
    }
    
    saveCareers(filteredDb);

    return res.json({
      success: true,
      message: "Job opening removed successfully",
      openings: filteredDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete job opening" });
  }
});

// POST /api/careers/apply (Apply for Faculty / Trainer / Professional position)
router.post("/apply", (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      position,
      subjectCourse,
      experience,
      qualification,
      otherQualification,
      dateToJoin,
      currentOrg,
      resumeUrl,
      resumeFileName,
      linkedinUrl,
      coverNote,
    } = req.body;

    if (!fullName || !email || !phone || !subjectCourse) {
      return res.status(400).json({ error: "Full Name, Email, Phone, and Course Specialization are required." });
    }

    const appId = `APP-${Date.now().toString().slice(-4)}`;
    const finalQualification = qualification === "Other" && otherQualification ? `Other (${otherQualification.trim()})` : (qualification?.trim() || "Graduate");

    const newApplication: CareerApplication = {
      _id: `app-${Date.now()}`,
      id: appId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      position: position?.trim() || "Faculty / Technical Trainer",
      subjectCourse: subjectCourse.trim(),
      experience: experience?.trim() || "Fresher / 0-1 Year",
      qualification: finalQualification,
      otherQualification: otherQualification?.trim() || "",
      dateToJoin: dateToJoin?.trim() || "Immediate",
      currentOrg: currentOrg?.trim() || "",
      resumeUrl: resumeUrl?.trim() || "",
      resumeFileName: resumeFileName?.trim() || "",
      linkedinUrl: linkedinUrl?.trim() || "",
      coverNote: coverNote?.trim() || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const applicationsDb = getApplications();
    applicationsDb.unshift(newApplication);
    saveApplications(applicationsDb);

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully! Our HR team will reach out shortly.",
      application: newApplication,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to submit application." });
  }
});

// GET /api/careers/applications (List all job/faculty applications)
router.get("/applications", (_req: Request, res: Response) => {
  const applicationsDb = getApplications();
  return res.json({
    success: true,
    applications: applicationsDb,
  });
});

// PATCH /api/careers/applications/:id (Update application status)
router.patch("/applications/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const applicationsDb = getApplications();
    const app = applicationsDb.find((a) => a._id === id || a.id === id);
    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    if (status) {
      app.status = status;
    }
    saveApplications(applicationsDb);

    return res.json({
      success: true,
      message: "Application status updated successfully",
      application: app,
      applications: applicationsDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update application" });
  }
});

export default router;
