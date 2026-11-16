import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

export interface AlumniItem {
  id: string;
  name: string;
  role: string;
  company: string;
  photo: string;
  batch?: string;
  linkedin?: string;
  certification?: string;
  createdAt: string;
}

const router = Router();

// GET /api/alumni
router.get("/", async (_req: Request, res: Response) => {
  const alumni = await readJsonDbAsync<AlumniItem>("alumni.json");
  return res.json({
    success: true,
    alumni,
  });
});

// POST /api/alumni (Add new alumni profile)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, role, company, photo, batch, linkedin, certification } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Alumni name is required." });
    }

    const newAlumni: AlumniItem = {
      id: `alumni-${Date.now()}`,
      name: name.trim(),
      role: role?.trim() || "Software Engineer",
      company: company?.trim() || "Tech Leader",
      photo: photo?.trim() || "",
      batch: batch?.trim() || "24-25",
      linkedin: linkedin?.trim() || "",
      certification: certification?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    const db = await readJsonDbAsync<AlumniItem>("alumni.json");
    db.unshift(newAlumni);
    await writeJsonDbAsync("alumni.json", db);

    return res.status(201).json({
      success: true,
      message: "Alumni profile added successfully",
      alumni: db,
      newAlumni,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add alumni" });
  }
});

// PUT /api/alumni/reorder (Reorder alumni)
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const currentDb = await readJsonDbAsync<AlumniItem>("alumni.json");
    const reorderedDb: AlumniItem[] = [];
    for (const id of orderedIds) {
      const item = currentDb.find((m) => m.id === id);
      if (item) reorderedDb.push(item);
    }
    for (const item of currentDb) {
      if (!orderedIds.includes(item.id)) reorderedDb.push(item);
    }

    await writeJsonDbAsync("alumni.json", reorderedDb);

    return res.json({
      success: true,
      message: "Alumni reordered successfully",
      alumni: reorderedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder alumni" });
  }
});

// PUT /api/alumni/:id (Update alumni profile)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, company, photo, batch, linkedin, certification } = req.body;

    const db = await readJsonDbAsync<AlumniItem>("alumni.json");
    const index = db.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Alumni profile not found" });
    }

    const current = db[index];
    const updated: AlumniItem = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      role: role !== undefined ? role.trim() : current.role,
      company: company !== undefined ? company.trim() : current.company,
      photo: photo !== undefined ? photo.trim() : current.photo,
      batch: batch !== undefined ? batch.trim() : current.batch,
      linkedin: linkedin !== undefined ? linkedin.trim() : current.linkedin,
      certification: certification !== undefined ? certification.trim() : current.certification,
    };

    db[index] = updated;
    await writeJsonDbAsync("alumni.json", db);

    return res.json({
      success: true,
      message: "Alumni profile updated successfully",
      alumni: db,
      updatedAlumni: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update alumni profile" });
  }
});

// DELETE /api/alumni/:id (Remove alumni profile)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentDb = await readJsonDbAsync<AlumniItem>("alumni.json");
    const filteredDb = currentDb.filter((a) => a.id !== id);

    if (filteredDb.length === currentDb.length) {
      return res.status(404).json({ error: "Alumni profile not found" });
    }

    await writeJsonDbAsync("alumni.json", filteredDb);

    return res.json({
      success: true,
      message: "Alumni profile removed successfully",
      alumni: filteredDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete alumni" });
  }
});

export default router;
