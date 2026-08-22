import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

export interface IndustryPartnerItem {
  id: string;
  name: string;
  category?: string;
  logo?: string;
  website?: string;
  createdAt: string;
}

const router = Router();

// GET /api/industry-partners
router.get("/", async (_req: Request, res: Response) => {
  const partners = await readJsonDbAsync<IndustryPartnerItem>("industry-partners.json");
  return res.json({
    success: true,
    partners,
  });
});

// POST /api/industry-partners (Add new partner)
router.post("/", async (req: Request, res: Response) => {
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

    const db = await readJsonDbAsync<IndustryPartnerItem>("industry-partners.json");
    db.push(newPartner);
    await writeJsonDbAsync("industry-partners.json", db);

    return res.status(201).json({
      success: true,
      message: "Industry Partner added successfully",
      partner: newPartner,
      partners: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add partner" });
  }
});

// PUT /api/industry-partners/reorder (Reorder industry partners)
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const currentDb = await readJsonDbAsync<IndustryPartnerItem>("industry-partners.json");
    const reorderedDb: IndustryPartnerItem[] = [];
    for (const id of orderedIds) {
      const item = currentDb.find((m) => m.id === id);
      if (item) reorderedDb.push(item);
    }
    for (const item of currentDb) {
      if (!orderedIds.includes(item.id)) reorderedDb.push(item);
    }

    await writeJsonDbAsync("industry-partners.json", reorderedDb);

    return res.json({
      success: true,
      message: "Industry Partners reordered successfully",
      industryPartners: reorderedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder industry partners" });
  }
});

// PUT /api/industry-partners/:id (Update partner)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, logo, website } = req.body;

    const db = await readJsonDbAsync<IndustryPartnerItem>("industry-partners.json");
    const index = db.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Industry partner not found" });
    }

    const current = db[index];
    const updated: IndustryPartnerItem = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      category: category !== undefined ? category.trim() : current.category,
      logo: logo !== undefined ? logo.trim() : current.logo,
      website: website !== undefined ? website.trim() : current.website,
    };

    db[index] = updated;
    await writeJsonDbAsync("industry-partners.json", db);

    return res.json({
      success: true,
      message: "Industry Partner updated successfully",
      partner: updated,
      partners: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update partner" });
  }
});

// DELETE /api/industry-partners/:id (Remove partner)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await readJsonDbAsync<IndustryPartnerItem>("industry-partners.json");
    const initialLen = db.length;
    const updatedDb = db.filter((p) => p.id !== id);

    if (updatedDb.length === initialLen) {
      return res.status(404).json({ error: "Industry partner not found" });
    }

    await writeJsonDbAsync("industry-partners.json", updatedDb);

    return res.json({
      success: true,
      message: "Industry Partner removed successfully",
      partners: updatedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete partner" });
  }
});

export default router;
