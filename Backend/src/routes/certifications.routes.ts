import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

export interface CertificationItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  fees: string;
  badge?: string;
  image?: string;
  createdAt: string;
}

// Initial In-Memory Store — Only MERN Stack has image

const router = Router();

// GET /api/certifications
router.get("/", (req: Request, res: Response) => {
  const { category } = req.query;
  let result = readJsonDb("certifications.json");

  if (category && typeof category === "string" && category !== "All") {
    result = readJsonDb("certifications.json").filter(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );
  }

  return res.json({
    success: true,
    certifications: result,
  });
});

// POST /api/certifications (Add new certification)
router.post("/", (req: Request, res: Response) => {
  try {
    const { title, category, duration, fees, badge, image } = req.body;

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return res.status(400).json({ error: "Certification title is required." });
    }

    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: title.trim(),
      category: category?.trim() || "Information Technology",
      duration: duration?.trim() || "6 Months",
      fees: fees?.trim() || "₹36,000",
      badge: badge?.trim() || "Integrated with AI",
      image: image?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    const db = readJsonDb("certifications.json"); db.unshift(newCert); writeJsonDb("certifications.json", db);

    return res.status(201).json({
      success: true,
      message: "Featured Certification added successfully",
      certification: newCert,
      certifications: readJsonDb("certifications.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add certification" });
  }
});

// PUT /api/certifications/reorder (Reorder certifications)
router.put("/reorder", (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const reorderedDb: CertificationItem[] = [];
    for (const id of orderedIds) {
      const cert = readJsonDb("certifications.json").find((c) => c.id === id);
      if (cert) reorderedDb.push(cert);
    }
    for (const cert of readJsonDb("certifications.json")) {
      if (!orderedIds.includes(cert.id)) reorderedDb.push(cert);
    }

    writeJsonDb("certifications.json", reorderedDb);

    return res.json({
      success: true,
      message: "Certifications reordered successfully",
      certifications: readJsonDb("certifications.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder certifications" });
  }
});

// PUT /api/certifications/:id (Update certification)
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, duration, fees, badge, image } = req.body;

    const index = readJsonDb("certifications.json").findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Certification not found" });
    }

    const current = readJsonDb("certifications.json")[index];
    const updated: CertificationItem = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      category: category !== undefined ? category.trim() : current.category,
      duration: duration !== undefined ? duration.trim() : current.duration,
      fees: fees !== undefined ? fees.trim() : current.fees,
      badge: badge !== undefined ? badge.trim() : current.badge,
      image: image !== undefined ? image.trim() : current.image,
    };

    const db = readJsonDb("certifications.json"); db[index] = updated; writeJsonDb("certifications.json", db);

    return res.json({
      success: true,
      message: "Certification updated successfully",
      certification: updated,
      certifications: readJsonDb("certifications.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update certification" });
  }
});

// DELETE /api/certifications/:id (Remove certification)
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const initialLen = readJsonDb("certifications.json").length;
    const db = readJsonDb("certifications.json").filter((c) => c.id !== id); writeJsonDb("certifications.json", db);

    if (readJsonDb("certifications.json").length === initialLen) {
      return res.status(404).json({ error: "Certification not found" });
    }

    return res.json({
      success: true,
      message: "Certification removed successfully",
      certifications: readJsonDb("certifications.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete certification" });
  }
});

export default router;

