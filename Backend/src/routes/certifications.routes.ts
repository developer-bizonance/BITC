import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import prisma from "../lib/prisma.js";

export interface CertificationItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  fees: string;
  slug?: string;
  badge?: string;
  image?: string;
  description?: string;
  features?: string[];
  curriculum?: any[];
  createdAt: string;
}

const router = Router();

// GET /api/certifications
router.get("/", async (req: Request, res: Response) => {
  const { category } = req.query;
  let result = await readJsonDbAsync<CertificationItem>("certifications.json");

  // Enrich certifications with features from Neon Postgres Course table
  try {
    let dbCourses: any[] = [];
    try {
      dbCourses = await prisma.course.findMany();
    } catch (dbErr) {
      // Postgres error fallback
    }

    if (result.length === 0 && dbCourses.length > 0) {
      result = dbCourses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        slug: c.slug,
        duration: c.duration,
        fees: c.fees,
        features: c.features,
        image: c.image || undefined,
        curriculum: (c.curriculum as any[]) || [],
        createdAt: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
      }));
      writeJsonDbAsync("certifications.json", result).catch(console.warn);
    }

    let modified = false;

    result = result.map((cert) => {
      const certTitle = (cert.title || "").trim().toLowerCase();
      const certSlug = certTitle.replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
      const certClean = certTitle.replace(/[^a-z0-9]/g, "");

      // 1. Try Postgres Course
      const matchedDb = dbCourses.find((dc) => {
        if (!dc) return false;
        const dcSlug = (dc.slug || "").toLowerCase();
        const dcTitle = (dc.title || "").toLowerCase().trim();
        const dcClean = dcTitle.replace(/[^a-z0-9]/g, "");
        return dcSlug === certSlug || dcTitle === certTitle || (certClean && dcClean === certClean);
      });

      let updatedCert = { ...cert };

      if (matchedDb) {
        if ((!Array.isArray(cert.features) || cert.features.length === 0) && Array.isArray(matchedDb.features) && matchedDb.features.length > 0) {
          modified = true;
          updatedCert.features = matchedDb.features;
        }
        if (!cert.description && matchedDb.description) {
          modified = true;
          updatedCert.description = matchedDb.description;
        }
        if (!cert.slug && matchedDb.slug) {
          modified = true;
          (updatedCert as any).slug = matchedDb.slug;
        }
        if ((!Array.isArray(cert.curriculum) || cert.curriculum.length === 0) && Array.isArray(matchedDb.curriculum) && (matchedDb.curriculum as any[]).length > 0) {
          modified = true;
          updatedCert.curriculum = matchedDb.curriculum;
        }
      }

      if (!(updatedCert as any).slug) {
        (updatedCert as any).slug = certSlug;
      }
      updatedCert.features = Array.isArray(updatedCert.features) ? updatedCert.features : [];
      return updatedCert;
    });

    if (modified) {
      writeJsonDbAsync("certifications.json", result).catch((err) =>
        console.warn("Failed to update certifications.json features:", err)
      );
    }
  } catch (enrichErr) {
    console.warn("Could not enrich certifications with features:", enrichErr);
  }

    // Deduplicate by title to ensure clean unique items
  const seenTitles = new Set<string>();
  result = result.filter((cert) => {
    const key = (cert.title || cert.id || "").trim().toLowerCase();
    if (!key || seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });

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

function parseFeatures(raw: any): string[] {
  if (Array.isArray(raw)) {
    return raw.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

// POST /api/certifications (Add new certification)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, category, duration, fees, badge, image, features, description, curriculum } = req.body;

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return res.status(400).json({ error: "Certification title is required." });
    }

    const parsedFeatures = parseFeatures(features);

    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: title.trim(),
      category: category?.trim() || "Information Technology",
      duration: duration?.trim() || "6 Months",
      fees: fees?.trim() || "",
      badge: badge?.trim() || "",
      image: image?.trim() || "",
      description: description?.trim() || "",
      features: parsedFeatures,
      curriculum: Array.isArray(curriculum) ? curriculum : [],
      createdAt: new Date().toISOString(),
    };

    const db = await readJsonDbAsync<CertificationItem>("certifications.json");
    db.unshift(newCert);
    await writeJsonDbAsync("certifications.json", db);

    // Also sync to Course model in PostgreSQL so it can be queried as a course
    try {
      const courseSlug = title.trim().toLowerCase().replace(/ & /g, '-').replace(/[\/\s_]+/g, '-');
      const numericPrice = parseInt(String(fees || "0").replace(/[^0-9]/g, ""), 10) || 0;

      const existingCourse = await prisma.course.findFirst({
        where: {
          OR: [
            { slug: courseSlug },
            { slug: courseSlug.replace(/[^a-z0-9]/g, "") },
            { title: { equals: newCert.title, mode: "insensitive" } },
          ],
        },
      });

      if (existingCourse) {
        await prisma.course.update({
          where: { id: existingCourse.id },
          data: {
            title: newCert.title,
            category: newCert.category,
            duration: newCert.duration,
            fees: newCert.fees,
            price: numericPrice,
            image: newCert.image,
            description: newCert.description,
            features: newCert.features,
          },
        });
      } else {
        await prisma.course.create({
          data: {
            slug: courseSlug,
            title: newCert.title,
            category: newCert.category,
            duration: newCert.duration,
            fees: newCert.fees,
            price: numericPrice,
            description: newCert.description || "",
            features: newCert.features || [],
            image: newCert.image,
            curriculum: newCert.curriculum || [],
          },
        });
      }
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
    const { title, category, duration, fees, badge, image, features, description, curriculum } = req.body;

    const db = await readJsonDbAsync<CertificationItem>("certifications.json");
    const index = db.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Certification not found" });
    }

    const current = db[index];
    const parsedFeatures = features !== undefined ? parseFeatures(features) : (current.features || []);

    const updated: CertificationItem = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      category: category !== undefined ? category.trim() : current.category,
      duration: duration !== undefined ? duration.trim() : current.duration,
      fees: fees !== undefined ? fees.trim() : current.fees,
      badge: badge !== undefined ? badge.trim() : current.badge,
      image: image !== undefined ? image.trim() : current.image,
      description: description !== undefined ? description.trim() : (current.description || ""),
      features: parsedFeatures,
      curriculum: curriculum !== undefined && Array.isArray(curriculum) ? curriculum : (current.curriculum || []),
    };

    db[index] = updated;
    await writeJsonDbAsync("certifications.json", db);

    try {
      const slug = updated.title.trim().toLowerCase().replace(/ & /g, '-').replace(/[\/\s_]+/g, "-");
      const numericPrice = parseInt(String(updated.fees || "0").replace(/[^0-9]/g, ""), 10) || 0;

      const existingCourse = await prisma.course.findFirst({
        where: {
          OR: [
            { slug: slug },
            { slug: slug.replace(/[^a-z0-9]/g, "") },
            { title: { equals: updated.title, mode: "insensitive" } },
            { title: { equals: current.title, mode: "insensitive" } },
          ],
        },
      });

      if (existingCourse) {
        await prisma.course.update({
          where: { id: existingCourse.id },
          data: {
            title: updated.title,
            category: updated.category,
            duration: updated.duration,
            fees: updated.fees,
            price: numericPrice,
            image: updated.image,
            description: updated.description,
            features: updated.features,
            curriculum: updated.curriculum || [],
          },
        });
      } else {
        await prisma.course.create({
          data: {
            slug: slug,
            title: updated.title,
            category: updated.category,
            duration: updated.duration,
            fees: updated.fees,
            price: numericPrice,
            description: updated.description || "",
            features: updated.features || [],
            image: updated.image,
            curriculum: updated.curriculum || [],
          },
        });
      }
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

// PUT /api/certifications/:id/highlights (Dedicated endpoint to add/update certification highlight points)
router.put("/:id/highlights", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { highlights, features } = req.body;
    const raw = highlights !== undefined ? highlights : features;
    const featuresList = parseFeatures(raw);

    const db = await readJsonDbAsync<CertificationItem>("certifications.json");
    const index = db.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Certification not found" });
    }

    const current = db[index];
    const updated: CertificationItem = {
      ...current,
      features: featuresList,
    };
    db[index] = updated;
    await writeJsonDbAsync("certifications.json", db);

    try {
      const slug = updated.title.trim().toLowerCase().replace(/ & /g, '-').replace(/[\/\s_]+/g, "-");
      const existingCourse = await prisma.course.findFirst({
        where: {
          OR: [
            { slug: slug },
            { slug: slug.replace(/[^a-z0-9]/g, "") },
            { title: { equals: updated.title, mode: "insensitive" } },
          ],
        },
      });

      if (existingCourse) {
        await prisma.course.update({
          where: { id: existingCourse.id },
          data: { features: featuresList },
        });
      } else {
        await prisma.course.create({
          data: {
            slug: slug,
            title: updated.title,
            category: updated.category,
            duration: updated.duration,
            fees: updated.fees,
            price: parseInt(String(updated.fees || "0").replace(/[^0-9]/g, ""), 10) || 0,
            description: updated.description || "",
            features: featuresList,
            image: updated.image || "",
          },
        });
      }
    } catch (err) {
      console.warn("Could not sync highlights to Course model:", err);
    }

    return res.json({
      success: true,
      message: "Highlights updated successfully",
      certification: updated,
      certifications: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update highlights" });
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
