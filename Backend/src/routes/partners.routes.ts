import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import prisma from "../lib/prisma.js";

export interface AcademicPartner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  city?: string;
  isActive?: boolean;
  createdAt: string;
}

const router = Router();

// GET /api/partners
router.get("/", async (_req: Request, res: Response) => {
  const partners = await readJsonDbAsync<AcademicPartner>("partners.json");
  return res.json({
    success: true,
    partners,
  });
});

// POST /api/partners (Add a new partner)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, logo, website, city, isActive } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Partner name is required (minimum 2 characters)." });
    }

    const newPartner: AcademicPartner = {
      id: `partner-${Date.now()}`,
      name: name.trim(),
      logo: logo?.trim() || "/univercity.png",
      website: website?.trim() || "",
      city: city?.trim() || "Amravati",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date().toISOString(),
    };

    const db = await readJsonDbAsync<AcademicPartner>("partners.json");
    db.unshift(newPartner);
    await writeJsonDbAsync("partners.json", db);

    return res.status(201).json({
      success: true,
      message: "Academic Partner added successfully",
      partner: newPartner,
      partners: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add partner" });
  }
});

// PUT /api/partners/reorder (Reorder partners)
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const currentDb = await readJsonDbAsync<AcademicPartner>("partners.json");
    const reorderedDb: AcademicPartner[] = [];
    for (let idx = 0; idx < orderedIds.length; idx++) {
      const id = orderedIds[idx];
      const partner = currentDb.find((p) => String(p.id) === String(id));
      if (partner) {
        reorderedDb.push({ ...partner, order: idx } as any);
        prisma.academicPartner
          .updateMany({
            where: { id: String(id) },
            data: { order: idx },
          })
          .catch(() => null);
      }
    }
    for (const partner of currentDb) {
      if (!orderedIds.includes(partner.id)) reorderedDb.push(partner);
    }

    await writeJsonDbAsync("partners.json", reorderedDb);

    return res.json({
      success: true,
      message: "Academic Partners reordered successfully",
      partners: reorderedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder partners" });
  }
});

// PATCH /api/partners/:id/toggle (Toggle show/hide status)
router.patch("/:id/toggle", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await readJsonDbAsync<AcademicPartner>("partners.json");
    const index = db.findIndex((p) => String(p.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ error: "Partner not found" });
    }

    const current = db[index];
    const newIsActive = req.body?.isActive !== undefined
      ? Boolean(req.body.isActive)
      : (current.isActive === false ? true : false);
    current.isActive = newIsActive;

    db[index] = current;
    await writeJsonDbAsync("partners.json", db);

    try {
      await prisma.academicPartner.updateMany({
        where: { id: String(id) },
        data: { isActive: newIsActive },
      });
    } catch (e) {
      console.warn("[toggle] direct update warning:", e);
    }

    return res.json({
      success: true,
      message: `Academic Partner is now ${newIsActive ? "visible" : "hidden"} on website`,
      partner: current,
      partners: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to toggle partner visibility" });
  }
});

// PUT /api/partners/:id (Update a partner)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, logo, website, city, isActive } = req.body;

    const db = await readJsonDbAsync<AcademicPartner>("partners.json");
    const index = db.findIndex((p) => String(p.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ error: "Partner not found" });
    }

    const current = db[index];
    const updated: AcademicPartner = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      logo: logo !== undefined ? logo.trim() : current.logo,
      website: website !== undefined ? website.trim() : current.website,
      city: city !== undefined ? city.trim() : current.city,
      isActive: isActive !== undefined ? Boolean(isActive) : (current.isActive !== undefined ? current.isActive : true),
    };

    db[index] = updated;
    await writeJsonDbAsync("partners.json", db);

    try {
      await prisma.academicPartner.updateMany({
        where: { id: String(id) },
        data: {
          name: updated.name,
          logo: updated.logo,
          city: updated.city,
          isActive: updated.isActive,
        },
      });
    } catch (e) {
      console.warn("[update] direct update warning:", e);
    }

    return res.json({
      success: true,
      message: "Academic Partner updated successfully",
      partner: updated,
      partners: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update partner" });
  }
});

// DELETE /api/partners/:id (Remove a partner)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await readJsonDbAsync<AcademicPartner>("partners.json");
    const initialLength = db.length;
    const updatedDb = db.filter((p) => p.id !== id);

    if (updatedDb.length === initialLength) {
      return res.status(404).json({ error: "Partner not found" });
    }

    await writeJsonDbAsync("partners.json", updatedDb);

    return res.json({
      success: true,
      message: "Academic Partner removed successfully",
      partners: updatedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to remove partner" });
  }
});

export default router;
