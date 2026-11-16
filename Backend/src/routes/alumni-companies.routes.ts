import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import { deleteUploadedFile } from "./upload.routes.js";

export interface AlumniCompanyItem {
  id: string;
  name: string;
  logo: string;
  website?: string;
  createdAt: string;
}

const router = Router();

// GET /api/alumni-companies
router.get("/", async (_req: Request, res: Response) => {
  const companies = await readJsonDbAsync<AlumniCompanyItem>("alumni-companies.json");
  return res.json({
    success: true,
    companies,
  });
});

// POST /api/alumni-companies (Add company)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, logo, website } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Company name is required." });
    }

    const newCompany: AlumniCompanyItem = {
      id: `acomp-${Date.now()}`,
      name: name.trim(),
      logo: logo?.trim() || "",
      website: website?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    const db = await readJsonDbAsync<AlumniCompanyItem>("alumni-companies.json");
    db.push(newCompany);
    await writeJsonDbAsync("alumni-companies.json", db);

    return res.status(201).json({
      success: true,
      message: "Company added successfully",
      company: newCompany,
      companies: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add company" });
  }
});

// PUT /api/alumni-companies/:id (Update company)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, logo, website } = req.body;

    const db = await readJsonDbAsync<AlumniCompanyItem>("alumni-companies.json");
    const index = db.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Company not found" });
    }

    const current = db[index];
    const updated: AlumniCompanyItem = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      logo: logo !== undefined ? logo.trim() : current.logo,
      website: website !== undefined ? website.trim() : current.website,
    };

    db[index] = updated;
    await writeJsonDbAsync("alumni-companies.json", db);

    return res.json({
      success: true,
      message: "Company updated successfully",
      company: updated,
      companies: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update company" });
  }
});

// DELETE /api/alumni-companies/:id (Remove company)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await readJsonDbAsync<AlumniCompanyItem>("alumni-companies.json");
    const itemToDelete = db.find((c) => c.id === id);
    if (itemToDelete?.logo) {
      deleteUploadedFile(itemToDelete.logo);
    }
    const filteredDb = db.filter((c) => c.id !== id);

    if (filteredDb.length === db.length) {
      return res.status(404).json({ error: "Company not found" });
    }

    await writeJsonDbAsync("alumni-companies.json", filteredDb);

    return res.json({
      success: true,
      message: "Company removed successfully",
      companies: filteredDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete company" });
  }
});

// PUT /api/alumni-companies/reorder (Reorder companies)
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const currentDb = await readJsonDbAsync<AlumniCompanyItem>("alumni-companies.json");
    const newOrder: AlumniCompanyItem[] = [];
    const idSet = new Set(orderedIds);

    // 1. Add items in the new order
    orderedIds.forEach((id: string) => {
      const item = currentDb.find((c) => c.id === id);
      if (item) {
        newOrder.push(item);
      }
    });

    // 2. Append any items that were missed
    currentDb.forEach((item) => {
      if (!idSet.has(item.id)) {
        newOrder.push(item);
      }
    });

    await writeJsonDbAsync("alumni-companies.json", newOrder);

    return res.json({
      success: true,
      message: "Companies reordered successfully",
      companies: newOrder,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder companies" });
  }
});

export default router;
