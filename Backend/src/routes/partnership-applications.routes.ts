import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

export interface PartnershipApplication {
  id: string;
  type: "educational" | "corporate";
  organizationName: string;
  website: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  partnershipType: string;
  message: string;
  status: "Pending" | "Reviewed" | "Contacted" | "Rejected";
  createdAt: string;
}

function getApplications(): PartnershipApplication[] {
  return readJsonDb<PartnershipApplication>("partnership-applications.json");
}

function saveApplications(data: PartnershipApplication[]) {
  writeJsonDb("partnership-applications.json", data);
}

const router = Router();

// GET /api/partnership-applications
router.get("/", (_req: Request, res: Response) => {
  const apps = getApplications();
  return res.json({ success: true, applications: apps });
});

// POST /api/partnership-applications (Apply from frontend)
router.post("/", (req: Request, res: Response) => {
  try {
    const {
      type,
      organizationName,
      website,
      contactPerson,
      designation,
      email,
      phone,
      partnershipType,
      message,
    } = req.body;

    if (!organizationName || !email || !phone) {
      return res.status(400).json({ error: "Organization Name, Email, and Phone are required." });
    }

    const newApp: PartnershipApplication = {
      id: `partnerapp-${Date.now()}`,
      type: type || "corporate",
      organizationName: organizationName.trim(),
      website: website?.trim() || "",
      contactPerson: contactPerson?.trim() || "",
      designation: designation?.trim() || "",
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      partnershipType: partnershipType?.trim() || "Other",
      message: message?.trim() || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const appsDb = getApplications();
    appsDb.unshift(newApp);
    saveApplications(appsDb);

    return res.status(201).json({
      success: true,
      message: "Partnership application submitted successfully!",
      application: newApp,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to submit application" });
  }
});

// PATCH /api/partnership-applications/:id
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appsDb = getApplications();
    const app = appsDb.find((a) => a.id === id);
    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (status) {
      app.status = status;
    }
    
    saveApplications(appsDb);

    return res.json({ success: true, application: app });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to update application" });
  }
});

export default router;
