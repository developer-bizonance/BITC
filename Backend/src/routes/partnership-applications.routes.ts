import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

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
  status: "Pending" | "Reviewed" | "Contacted" | "Approved" | "Rejected";
  createdAt: string;
}

const router = Router();

// GET /api/partnership-applications
router.get("/", async (_req: Request, res: Response) => {
  try {
    const apps = await readJsonDbAsync<PartnershipApplication>("partnership-applications.json");
    return res.json({ success: true, applications: apps });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to fetch applications" });
  }
});

// POST /api/partnership-applications (Apply from frontend)
router.post("/", async (req: Request, res: Response) => {
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

    const appsDb = await readJsonDbAsync<PartnershipApplication>("partnership-applications.json");
    appsDb.unshift(newApp);
    await writeJsonDbAsync("partnership-applications.json", appsDb);

    return res.status(201).json({
      success: true,
      message: "Partnership application submitted successfully!",
      application: newApp,
      applications: appsDb,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to submit application" });
  }
});

// PATCH /api/partnership-applications/:id
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appsDb = await readJsonDbAsync<PartnershipApplication>("partnership-applications.json");
    const app = appsDb.find((a) => a.id === id);
    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (status) {
      app.status = status;
    }

    await writeJsonDbAsync("partnership-applications.json", appsDb);

    return res.json({ success: true, application: app, applications: appsDb });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to update application" });
  }
});

// DELETE /api/partnership-applications/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appsDb = await readJsonDbAsync<PartnershipApplication>("partnership-applications.json");
    const initialLen = appsDb.length;
    const updatedDb = appsDb.filter((a) => a.id !== id);

    if (updatedDb.length === initialLen) {
      return res.status(404).json({ error: "Application not found" });
    }

    await writeJsonDbAsync("partnership-applications.json", updatedDb);

    return res.json({
      success: true,
      message: "Partnership application deleted successfully",
      applications: updatedDb,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to delete application" });
  }
});

export default router;
