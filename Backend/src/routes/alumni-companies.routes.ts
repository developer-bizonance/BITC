import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

export interface AlumniCompanyItem {
  id: string;
  name: string;
  logo: string;
  website?: string;
  createdAt: string;
}

// Initial In-Memory Store

const router = Router();

// GET /api/alumni-companies
router.get("/", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    companies: readJsonDb("alumni-companies.json"),
  });
});

// POST /api/alumni-companies (Add company)
router.post("/", (req: Request, res: Response) => {
  try {
    const { name, logo, website } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Company name is required." });
    }

    const newCompany: AlumniCompanyItem = {
      id: `acomp-${Date.now()}`,
      name: name.trim(),
      logo: logo?.trim() || "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      website: website?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    const db = readJsonDb("alumni-companies.json"); db.push(newCompany); writeJsonDb("alumni-companies.json", db);

    return res.status(201).json({
      success: true,
      message: "Company added successfully",
      company: newCompany,
      companies: readJsonDb("alumni-companies.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add company" });
  }
});

// PUT /api/alumni-companies/:id (Update company)
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, logo, website } = req.body;

    const index = readJsonDb("alumni-companies.json").findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Company not found" });
    }

    const current = readJsonDb("alumni-companies.json")[index];
    const updated: AlumniCompanyItem = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      logo: logo !== undefined ? logo.trim() : current.logo,
      website: website !== undefined ? website.trim() : current.website,
    };

    const db = readJsonDb("alumni-companies.json"); db[index] = updated; writeJsonDb("alumni-companies.json", db);

    return res.json({
      success: true,
      message: "Company updated successfully",
      company: updated,
      companies: readJsonDb("alumni-companies.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update company" });
  }
});

// DELETE /api/alumni-companies/:id (Remove company)
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const initialLen = readJsonDb("alumni-companies.json").length;
    const db = readJsonDb("alumni-companies.json").filter((c) => c.id !== id); writeJsonDb("alumni-companies.json", db);

    if (readJsonDb("alumni-companies.json").length === initialLen) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.json({
      success: true,
      message: "Company removed successfully",
      companies: readJsonDb("alumni-companies.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete company" });
  }
});

// PUT /api/alumni-companies/reorder (Reorder companies)
router.put("/reorder", (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const newOrder: AlumniCompanyItem[] = [];
    const idSet = new Set(orderedIds);

    // 1. Add items in the new order
    orderedIds.forEach((id: string) => {
      const item = readJsonDb("alumni-companies.json").find((c) => c.id === id);
      if (item) {
        newOrder.push(item);
      }
    });

    // 2. Append any items that were missed (to prevent data loss)
    readJsonDb("alumni-companies.json").forEach((item) => {
      if (!idSet.has(item.id)) {
        newOrder.push(item);
      }
    });

    writeJsonDb("alumni-companies.json", newOrder);

    return res.json({
      success: true,
      message: "Companies reordered successfully",
      companies: readJsonDb("alumni-companies.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder companies" });
  }
});

export default router;
