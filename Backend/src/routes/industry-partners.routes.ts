import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

export interface IndustryPartnerItem {
  id: string;
  name: string;
  category?: string;
  logo?: string;
  website?: string;
  createdAt: string;
}

// Initial In-Memory Store

const router = Router();

// GET /api/industry-partners
router.get("/", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    partners: readJsonDb("industry-partners.json"),
  });
});

// POST /api/industry-partners (Add new partner)
router.post("/", (req: Request, res: Response) => {
  try {
    const { name, category, logo, website } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Company name is required." });
    }

    const newPartner: IndustryPartnerItem = {
      id: `ip-${Date.now()}`,
      name: name.trim(),
      category: category?.trim() || "Industry Partner",
      logo: logo?.trim() || "",
      website: website?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    const db = readJsonDb("industry-partners.json"); db.push(newPartner); writeJsonDb("industry-partners.json", db);

    return res.status(201).json({
      success: true,
      message: "Industry Partner added successfully",
      partner: newPartner,
      partners: readJsonDb("industry-partners.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add partner" });
  }
});

// PUT /api/industry-partners/reorder (Reorder industry partners)
router.put("/reorder", (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const reorderedDb: IndustryPartnerItem[] = [];
    for (const id of orderedIds) {
      const item = readJsonDb("industry-partners.json").find((m) => m.id === id);
      if (item) reorderedDb.push(item);
    }
    for (const item of readJsonDb("industry-partners.json")) {
      if (!orderedIds.includes(item.id)) reorderedDb.push(item);
    }

    writeJsonDb("industry-partners.json", reorderedDb);

    return res.json({
      success: true,
      message: "Industry Partners reordered successfully",
      industryPartners: readJsonDb("industry-partners.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder industry partners" });
  }
});

// PUT /api/industry-partners/:id (Update partner)
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, logo, website } = req.body;

    const index = readJsonDb("industry-partners.json").findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Industry partner not found" });
    }

    const current = readJsonDb("industry-partners.json")[index];
    const updated: IndustryPartnerItem = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      category: category !== undefined ? category.trim() : current.category,
      logo: logo !== undefined ? logo.trim() : current.logo,
      website: website !== undefined ? website.trim() : current.website,
    };

    const db = readJsonDb("industry-partners.json"); db[index] = updated; writeJsonDb("industry-partners.json", db);

    return res.json({
      success: true,
      message: "Industry Partner updated successfully",
      partner: updated,
      partners: readJsonDb("industry-partners.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update partner" });
  }
});

// DELETE /api/industry-partners/:id (Remove partner)
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const initialLen = readJsonDb("industry-partners.json").length;
    const db = readJsonDb("industry-partners.json").filter((p) => p.id !== id); writeJsonDb("industry-partners.json", db);

    if (readJsonDb("industry-partners.json").length === initialLen) {
      return res.status(404).json({ error: "Industry partner not found" });
    }

    return res.json({
      success: true,
      message: "Industry Partner removed successfully",
      partners: readJsonDb("industry-partners.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete partner" });
  }
});

export default router;
