import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

export interface AcademicPartner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  city?: string;
  createdAt: string;
}

// Initial In-Memory / Fallback Default Partners

const router = Router();

// GET /api/partners
router.get("/", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    partners: readJsonDb("partners.json"),
  });
});

// POST /api/partners (Add a new partner)
router.post("/", (req: Request, res: Response) => {
  try {
    const { name, logo, website, city } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Partner name is required (minimum 2 characters)." });
    }

    const newPartner: AcademicPartner = {
      id: `partner-${Date.now()}`,
      name: name.trim(),
      logo: logo?.trim() || "/univercity.png",
      website: website?.trim() || "",
      city: city?.trim() || "Amravati",
      createdAt: new Date().toISOString(),
    };

    const db = readJsonDb("partners.json"); db.unshift(newPartner); writeJsonDb("partners.json", db);

    return res.status(201).json({
      success: true,
      message: "Academic Partner added successfully",
      partner: newPartner,
      partners: readJsonDb("partners.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add partner" });
  }
});

// PUT /api/partners/reorder (Reorder partners)
router.put("/reorder", (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const reorderedDb: AcademicPartner[] = [];
    for (const id of orderedIds) {
      const partner = readJsonDb("partners.json").find((p) => p.id === id);
      if (partner) reorderedDb.push(partner);
    }
    for (const partner of readJsonDb("partners.json")) {
      if (!orderedIds.includes(partner.id)) reorderedDb.push(partner);
    }

    writeJsonDb("partners.json", reorderedDb);

    return res.json({
      success: true,
      message: "Academic Partners reordered successfully",
      partners: readJsonDb("partners.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder partners" });
  }
});

// PUT /api/partners/:id (Update a partner)
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, logo, website, city } = req.body;

    const index = readJsonDb("partners.json").findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Partner not found" });
    }

    const current = readJsonDb("partners.json")[index];
    const updated: AcademicPartner = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      logo: logo !== undefined ? logo.trim() : current.logo,
      website: website !== undefined ? website.trim() : current.website,
      city: city !== undefined ? city.trim() : current.city,
    };

    const db = readJsonDb("partners.json"); db[index] = updated; writeJsonDb("partners.json", db);

    return res.json({
      success: true,
      message: "Academic Partner updated successfully",
      partner: updated,
      partners: readJsonDb("partners.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update partner" });
  }
});

// DELETE /api/partners/:id (Remove a partner)
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const initialLength = readJsonDb("partners.json").length;
    const db = readJsonDb("partners.json").filter((p) => p.id !== id); writeJsonDb("partners.json", db);

    if (readJsonDb("partners.json").length === initialLength) {
      return res.status(404).json({ error: "Partner not found" });
    }

    return res.json({
      success: true,
      message: "Academic Partner removed successfully",
      partners: readJsonDb("partners.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to remove partner" });
  }
});

export default router;
