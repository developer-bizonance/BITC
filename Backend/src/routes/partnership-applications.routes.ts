import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import prisma from "../lib/prisma.js";

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
  mouFile?: string;
  mouFileName?: string;
  mouFileSize?: string;
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
      mouFile,
      mouFileName,
      mouFileSize,
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
      partnershipType: partnershipType?.trim() || "MoU Collaboration",
      mouFile: mouFile?.trim() || "",
      mouFileName: mouFileName?.trim() || "",
      mouFileSize: mouFileSize?.trim() || "",
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

// PATCH /api/partnership-applications/:id or /api/partnership-applications
const handlePatch = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || req.body?.id || req.query?.id;
    const { status } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Application ID is required" });
    }
    const cleanId = String(id).trim().toLowerCase();
    const appsDb = await readJsonDbAsync<PartnershipApplication>("partnership-applications.json");
    const app = appsDb.find((a) => {
      const aId = String(a.id || "").trim().toLowerCase();
      const aUnderscoreId = String((a as any)._id || "").trim().toLowerCase();
      return aId === cleanId || aUnderscoreId === cleanId;
    });

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
};

router.patch("/:id", handlePatch);
router.patch("/", handlePatch);

// Helper for delete
const handleDelete = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || req.body?.id || req.query?.id;
    if (!id) {
      return res.status(400).json({ error: "Application ID is required" });
    }
    const cleanId = String(id).trim().toLowerCase();

    // 1. Direct Prisma delete from PostgreSQL
    try {
      await prisma.partnershipApplication.deleteMany({
        where: {
          OR: [
            { id: String(id) },
            { id: { equals: cleanId, mode: "insensitive" } },
          ],
        },
      });
    } catch (dbErr) {
      console.warn("[partnership-applications] DB DELETE notice:", dbErr);
    }

    const appsDb = await readJsonDbAsync<PartnershipApplication>("partnership-applications.json");
    const updatedDb = appsDb.filter((a) => {
      const aId = String(a.id || "").trim().toLowerCase();
      const aUnderscoreId = String((a as any)._id || "").trim().toLowerCase();
      return aId !== cleanId && aUnderscoreId !== cleanId;
    });

    await writeJsonDbAsync("partnership-applications.json", updatedDb);

    return res.json({
      success: true,
      message: "Partnership application deleted successfully",
      applications: updatedDb,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to delete application" });
  }
};

// DELETE & POST delete fallbacks
router.delete("/:id", handleDelete);
router.delete("/", handleDelete);
router.post("/delete", handleDelete);
router.post("/delete/:id", handleDelete);
router.post("/:id/delete", handleDelete);

export default router;
