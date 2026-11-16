import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import prisma from "../lib/prisma.js";

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

export async function getCareers(): Promise<JobOpening[]> {
  return await readJsonDbAsync<JobOpening>("careers.json");
}

export async function saveCareers(data: JobOpening[]): Promise<void> {
  await writeJsonDbAsync("careers.json", data);
}

export async function getApplications(): Promise<CareerApplication[]> {
  return await readJsonDbAsync<CareerApplication>("applications.json");
}

export async function saveApplications(data: CareerApplication[]): Promise<void> {
  await writeJsonDbAsync("applications.json", data);
}

export function formatExperience(exp?: string): string {
  if (!exp) return "1+ Years";
  const trimmed = exp.trim();
  if (!trimmed) return "1+ Years";
  if (/fresher/i.test(trimmed)) return trimmed;
  if (/years?/i.test(trimmed)) return trimmed;
  if (trimmed.endsWith("+")) return `${trimmed} Years`;
  if (/^\d+\s*(-|to)\s*\d+$/i.test(trimmed)) return `${trimmed} Years`;
  if (/^\d+$/.test(trimmed)) return `${trimmed}+ Years`;
  return `${trimmed}+ Years`;
}

const router = Router();

// GET /api/careers
router.get("/", async (_req: Request, res: Response) => {
  const careersDb = await getCareers();
  return res.json({
    success: true,
    openings: careersDb,
  });
});

// POST /api/careers (Add new job opening)
router.post("/", async (req: Request, res: Response) => {
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
      experience: formatExperience(experience),
      department: department?.trim() || "Academic & Training",
      description: description?.trim() || "",
      specialities: (specialities || req.body.specialization || "")?.trim(),
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    const careersDb = await getCareers();

    // Prevent duplicate entries within 30 seconds
    const isDuplicate = careersDb.some((job) => {
      const sameTitle = (job.title || "").toLowerCase().trim() === title.trim().toLowerCase();
      const sameDept = (job.department || "").toLowerCase().trim() === (department || "").trim().toLowerCase();
      const diffSecs = Math.abs(Date.now() - new Date(job.createdAt || 0).getTime()) / 1000;
      return sameTitle && sameDept && diffSecs < 30;
    });

    if (isDuplicate) {
      return res.status(200).json({
        success: true,
        message: "Job opening already exists",
        opening: careersDb.find((job) => (job.title || "").toLowerCase().trim() === title.trim().toLowerCase()),
        openings: careersDb,
      });
    }

    careersDb.unshift(newJob);
    await saveCareers(careersDb);

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
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const careersDb = await getCareers();
    const reorderedDb: JobOpening[] = [];
    for (const id of orderedIds) {
      const item = careersDb.find((m) => m.id === id);
      if (item) reorderedDb.push(item);
    }
    for (const item of careersDb) {
      if (!orderedIds.includes(item.id)) reorderedDb.push(item);
    }

    await saveCareers(reorderedDb);

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
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, type, location, experience, department, description, specialities, status } = req.body;

    const careersDb = await getCareers();
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
      experience: experience !== undefined ? formatExperience(experience) : current.experience,
      department: department !== undefined ? department.trim() : current.department,
      description: description !== undefined ? description.trim() : current.description,
      specialities: specialities !== undefined ? specialities.trim() : (req.body.specialization !== undefined ? req.body.specialization.trim() : current.specialities),
      status: status !== undefined ? status : current.status,
    };

    careersDb[index] = updated;
    await saveCareers(careersDb);

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
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const careersDb = await getCareers();
    const initialLen = careersDb.length;
    const filteredDb = careersDb.filter((j) => j.id !== id);

    if (filteredDb.length === initialLen) {
      return res.status(404).json({ error: "Job opening not found" });
    }
    
    await saveCareers(filteredDb);

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
router.post("/apply", async (req: Request, res: Response) => {
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

    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: "Full Name, Email, and Phone are required." });
    }

    const appId = `APP-${Date.now().toString().slice(-4)}`;
    const finalQualification = qualification === "Other" && otherQualification ? `Other (${otherQualification.trim()})` : (qualification?.trim() || "");

    const newApplication: CareerApplication = {
      _id: `app-${Date.now()}`,
      id: appId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      position: position?.trim() || "Industry Expert & Mentor",
      subjectCourse: (subjectCourse?.trim()) || "",
      experience: experience?.trim() || "",
      qualification: finalQualification,
      otherQualification: otherQualification?.trim() || "",
      dateToJoin: dateToJoin?.trim() || "",
      currentOrg: currentOrg?.trim() || "",
      resumeUrl: resumeUrl?.trim() || "",
      resumeFileName: resumeFileName?.trim() || "",
      linkedinUrl: linkedinUrl?.trim() || "",
      coverNote: coverNote?.trim() || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const applicationsDb = await getApplications();
    const isDuplicate = applicationsDb.some((a) => {
      const isSame = (a.email || "").toLowerCase() === email.trim().toLowerCase() && (a.phone || "") === phone.trim();
      if (isSame) {
        const diff = Math.abs(new Date().getTime() - new Date(a.createdAt || 0).getTime());
        if (diff < 30000) return true;
      }
      return false;
    });

    if (isDuplicate) {
      return res.status(200).json({
        success: true,
        message: "Application already received",
      });
    }

    applicationsDb.unshift(newApplication);
    await saveApplications(applicationsDb);

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
router.get("/applications", async (_req: Request, res: Response) => {
  const applicationsDb = await getApplications();
  return res.json({
    success: true,
    applications: applicationsDb,
  });
});

// PATCH /api/careers/applications/:id (Update application status)
router.patch("/applications/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const applicationsDb = await getApplications();
    const app = applicationsDb.find((a) => a._id === id || a.id === id);
    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    if (status) {
      app.status = status;
    }
    await saveApplications(applicationsDb);

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

// DELETE /api/careers/applications/:id (Delete application)
router.delete("/applications/:id?", async (req: Request, res: Response) => {
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
      console.warn("[careers.routes] DB DELETE notice:", dbErr);
    }

    const applicationsDb = await getApplications();
    const filtered = applicationsDb.filter((a) => {
      const aId = String(a.id || "").trim().toLowerCase();
      const aUnderscoreId = String(a._id || "").trim().toLowerCase();
      return aId !== cleanId && aUnderscoreId !== cleanId;
    });

    await saveApplications(filtered);
    return res.json({
      success: true,
      message: "Application deleted successfully",
      applications: filtered,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete application" });
  }
});

export default router;
