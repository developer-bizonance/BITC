import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

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

// Initial In-Memory Store

const router = Router();

// GET /api/alumni
router.get("/", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    alumni: readJsonDb("alumni.json"),
  });
});

// POST /api/alumni (Add new alumni profile)
router.post("/", (req: Request, res: Response) => {
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
      photo: photo?.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      batch: batch?.trim() || "24-25",
      linkedin: linkedin?.trim() || "",
      certification: certification?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    const db = readJsonDb("alumni.json"); db.unshift(newAlumni); writeJsonDb("alumni.json", db);

    return res.status(201).json({
      success: true,
      message: "Alumni profile added successfully",
      alumni: readJsonDb("alumni.json"),
      newAlumni,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add alumni" });
  }
});

// PUT /api/alumni/reorder (Reorder alumni)
router.put("/reorder", (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const reorderedDb: AlumniItem[] = [];
    for (const id of orderedIds) {
      const item = readJsonDb("alumni.json").find((m) => m.id === id);
      if (item) reorderedDb.push(item);
    }
    for (const item of readJsonDb("alumni.json")) {
      if (!orderedIds.includes(item.id)) reorderedDb.push(item);
    }

    writeJsonDb("alumni.json", reorderedDb);

    return res.json({
      success: true,
      message: "Alumni reordered successfully",
      alumni: readJsonDb("alumni.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder alumni" });
  }
});

// PUT /api/alumni/:id (Update alumni profile)
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, company, photo, batch, linkedin, certification } = req.body;

    const index = readJsonDb("alumni.json").findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Alumni profile not found" });
    }

    const current = readJsonDb("alumni.json")[index];
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

    const db = readJsonDb("alumni.json"); db[index] = updated; writeJsonDb("alumni.json", db);

    return res.json({
      success: true,
      message: "Alumni profile updated successfully",
      alumni: readJsonDb("alumni.json"),
      updatedAlumni: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update alumni profile" });
  }
});

// DELETE /api/alumni/:id (Remove alumni profile)
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const initialLen = readJsonDb("alumni.json").length;
    const db = readJsonDb("alumni.json").filter((a) => a.id !== id); writeJsonDb("alumni.json", db);

    if (readJsonDb("alumni.json").length === initialLen) {
      return res.status(404).json({ error: "Alumni profile not found" });
    }

    return res.json({
      success: true,
      message: "Alumni profile removed successfully",
      alumni: readJsonDb("alumni.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete alumni" });
  }
});

export default router;
