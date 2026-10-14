import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import prisma from "../lib/prisma.js";

export interface CertificationItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  fees: string;
  badge?: string;
  image?: string;
  features?: string[];
  createdAt: string;
}

const router = Router();

// GET /api/certifications
router.get("/", async (req: Request, res: Response) => {
  const { category } = req.query;
  let result = await readJsonDbAsync<CertificationItem>("certifications.json");

  if (category && typeof category === "string" && category !== "All") {
    result = result.filter(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );
  }

  return res.json({
    success: true,
    certifications: result,
  });
});

// POST /api/certifications (Add new certification)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, category, duration, fees, badge, image, features } = req.body;

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return res.status(400).json({ error: "Certification title is required." });
    }

    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: title.trim(),
      category: category?.trim() || "Information Technology",
      duration: duration?.trim() || "6 Months",
      fees: fees?.trim() || "₹36,000",
      badge: badge?.trim() || "",
      image: image?.trim() || "",
      features: Array.isArray(features) ? features : [],
      createdAt: new Date().toISOString(),
    };

    const db = await readJsonDbAsync<CertificationItem>("certifications.json");
    db.unshift(newCert);
    await writeJsonDbAsync("certifications.json", db);

    // Also sync to Course model in PostgreSQL so it can be queried as a course
    try {
      const courseSlug = title.trim().toLowerCase().replace(/ & /g, '-').replace(/[\/\s_]+/g, '-');
      const numericPrice = parseInt(String(fees || "36000").replace(/[^0-9]/g, ""), 10) || 36000;
      await prisma.course.upsert({
        where: { slug: courseSlug },
        update: {
          title: newCert.title,
          category: newCert.category,
          duration: newCert.duration,
          fees: newCert.fees,
          price: numericPrice,
          image: newCert.image,
        },
        create: {
          slug: courseSlug,
          title: newCert.title,
          category: newCert.category,
          duration: newCert.duration,
          fees: newCert.fees,
          price: numericPrice,
          description: `Industry-recognized certification in ${newCert.title} by BITC BIZONANCE with live hands-on projects and placement assistance.`,
          features: newCert.features && newCert.features.length > 0 ? newCert.features : [
            "Practical Industry Training & Live Labs",
            "Hands-On Capstone Projects & Portfolio Building",
            "1-on-1 Mentorship & Code Reviews",
            "Dedicated 100% Placement Assistance",
            "Recognized Industrial Certification"
          ],
          image: newCert.image,
          curriculum: [],
        },
      });
    } catch (courseSyncErr) {
      console.warn("Could not sync new certification to Course table:", courseSyncErr);
    }

    return res.status(201).json({
      success: true,
      message: "Featured Certification added successfully",
      certification: newCert,
      certifications: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add certification" });
  }
});

// PUT /api/certifications/reorder (Reorder certifications)
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const currentDb = await readJsonDbAsync<CertificationItem>("certifications.json");
    const reorderedDb: CertificationItem[] = [];
    for (const id of orderedIds) {
      const cert = currentDb.find((c) => c.id === id);
      if (cert) reorderedDb.push(cert);
    }
    for (const cert of currentDb) {
      if (!orderedIds.includes(cert.id)) reorderedDb.push(cert);
    }

    await writeJsonDbAsync("certifications.json", reorderedDb);

    return res.json({
      success: true,
      message: "Certifications reordered successfully",
      certifications: reorderedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder certifications" });
  }
});

// PUT /api/certifications/:id (Update certification)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, duration, fees, badge, image, features } = req.body;

    const db = await readJsonDbAsync<CertificationItem>("certifications.json");
    const index = db.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Certification not found" });
    }

    const current = db[index];
    const updated: CertificationItem = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      category: category !== undefined ? category.trim() : current.category,
      duration: duration !== undefined ? duration.trim() : current.duration,
      fees: fees !== undefined ? fees.trim() : current.fees,
      badge: badge !== undefined ? badge.trim() : current.badge,
      image: image !== undefined ? image.trim() : current.image,
      features: features !== undefined && Array.isArray(features) ? features : current.features,
    };

    db[index] = updated;
    await writeJsonDbAsync("certifications.json", db);

    try {
      const slug = updated.title.trim().toLowerCase().replace(/ & /g, '-').replace(/[\/\s_]+/g, "-");
      const numericPrice = parseInt(String(updated.fees || "36000").replace(/[^0-9]/g, ""), 10) || 36000;
      await prisma.course.upsert({
        where: { slug: slug },
        update: {
          title: updated.title,
          category: updated.category,
          duration: updated.duration,
          fees: updated.fees,
          price: numericPrice,
          image: updated.image,
          features: updated.features && updated.features.length > 0 ? updated.features : undefined,
        },
        create: {
          slug: slug,
          title: updated.title,
          category: updated.category,
          duration: updated.duration,
          fees: updated.fees,
          price: numericPrice,
          description: `Industry-recognized certification in ${updated.title} by BITC BIZONANCE.`,
          features: updated.features || [],
          image: updated.image,
          curriculum: [],
        }
      });
    } catch (err) {
      console.warn("Could not update corresponding Course model:", err);
    }

    return res.json({
      success: true,
      message: "Certification updated successfully",
      certification: updated,
      certifications: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update certification" });
  }
});

// DELETE /api/certifications/:id (Remove certification)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await readJsonDbAsync<CertificationItem>("certifications.json");
    const certToDelete = db.find((c) => c.id === id);
    const initialLen = db.length;
    const updatedDb = db.filter((c) => c.id !== id);

    if (updatedDb.length === initialLen) {
      return res.status(404).json({ error: "Certification not found" });
    }

    await writeJsonDbAsync("certifications.json", updatedDb);

    if (certToDelete) {
      try {
        const slug = certToDelete.title.trim().toLowerCase().replace(/ & /g, '-').replace(/[\/\s_]+/g, "-");
        await prisma.course.delete({ where: { slug } });
      } catch (delErr) {
        // Course may not exist in table
      }
    }

    return res.json({
      success: true,
      message: "Certification removed successfully",
      certifications: updatedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete certification" });
  }
});

export default router;
