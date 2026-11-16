import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

export interface IndustryPartnerItem {
  id: string;
  name: string;
  category?: string;
  logo?: string;
  website?: string;
  isActive?: boolean;
  createdAt: string;
}

export function createIndustryPartnersRouter(dbKey: string = "industry-partners.json") {
  const router = Router();

  // GET /api/industry-partners or /api/home-industry-partners
  router.get("/", async (_req: Request, res: Response) => {
    const partners = await readJsonDbAsync<IndustryPartnerItem>(dbKey);
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const uniquePartners: IndustryPartnerItem[] = [];
    for (const p of partners || []) {
      if (!p) continue;
      const id = p.id ? String(p.id).trim() : "";
      const norm = p.name ? p.name.trim().toLowerCase() : "";
      if (id && seenIds.has(id)) continue;
      if (norm && seenNames.has(norm)) continue;
      if (id) seenIds.add(id);
      if (norm) seenNames.add(norm);
      uniquePartners.push(p);
    }
    return res.json({
      success: true,
      partners: uniquePartners,
    });
  });

  // POST (Add new partner)
  router.post("/", async (req: Request, res: Response) => {
    try {
      const { name, category, logo, website, isActive } = req.body;

      if (!name || typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({ error: "Company name is required." });
      }

      const trimmedName = name.trim();
      const db = await readJsonDbAsync<IndustryPartnerItem>(dbKey);

      // Prevent duplicate entries by name
      const existing = db.find(
        (p) => p.name?.trim().toLowerCase() === trimmedName.toLowerCase()
      );
      if (existing) {
        return res.status(400).json({
          error: `A partner named "${trimmedName}" already exists.`,
          partner: existing,
          partners: db,
        });
      }

      const newPartner: IndustryPartnerItem = {
        id: `ip-${Date.now()}`,
        name: trimmedName,
        category: category?.trim() || "Industry Partner",
        logo: logo?.trim() || "",
        website: website?.trim() || "",
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        createdAt: new Date().toISOString(),
      };

      db.push(newPartner);
      await writeJsonDbAsync(dbKey, db);

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

  // PUT /reorder (Reorder industry partners)
  router.put("/reorder", async (req: Request, res: Response) => {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ error: "orderedIds must be an array" });
      }

      const currentDb = await readJsonDbAsync<IndustryPartnerItem>(dbKey);
      const reorderedDb: IndustryPartnerItem[] = [];
      for (const id of orderedIds) {
        const item = currentDb.find((m) => m.id === id);
        if (item) reorderedDb.push(item);
      }
      for (const item of currentDb) {
        if (!orderedIds.includes(item.id)) reorderedDb.push(item);
      }

      await writeJsonDbAsync(dbKey, reorderedDb);

      return res.json({
        success: true,
        message: "Industry Partners reordered successfully",
        industryPartners: reorderedDb,
        partners: reorderedDb,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || "Failed to reorder industry partners" });
    }
  });

  // PATCH /:id/toggle (Toggle show/hide status)
  router.patch("/:id/toggle", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await readJsonDbAsync<IndustryPartnerItem>(dbKey);
      const index = db.findIndex((p) => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Industry partner not found" });
      }

      const current = db[index];
      const newIsActive = current.isActive === false ? true : false;
      current.isActive = newIsActive;

      db[index] = current;
      await writeJsonDbAsync(dbKey, db);

      return res.json({
        success: true,
        message: `Industry Partner is now ${newIsActive ? "visible" : "hidden"} on website`,
        partner: current,
        partners: db,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || "Failed to toggle partner visibility" });
    }
  });

  // PUT /:id (Update partner)
  router.put("/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, category, logo, website, isActive } = req.body;

      const db = await readJsonDbAsync<IndustryPartnerItem>(dbKey);
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
        isActive: isActive !== undefined ? Boolean(isActive) : (current.isActive !== undefined ? current.isActive : true),
      };

      db[index] = updated;
      await writeJsonDbAsync(dbKey, db);

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

  // DELETE /:id (Remove partner)
  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await readJsonDbAsync<IndustryPartnerItem>(dbKey);
      const initialLen = db.length;
      const updatedDb = db.filter((p) => p.id !== id);

      if (updatedDb.length === initialLen) {
        return res.status(404).json({ error: "Industry partner not found" });
      }

      await writeJsonDbAsync(dbKey, updatedDb);

      return res.json({
        success: true,
        message: "Industry Partner removed successfully",
        partners: updatedDb,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || "Failed to delete partner" });
    }
  });

  return router;
}

export const industryPartnersRouter = createIndustryPartnersRouter("industry-partners.json");
export const hiringPartnersRouter = createIndustryPartnersRouter("hiring-partners.json");

export default industryPartnersRouter;
