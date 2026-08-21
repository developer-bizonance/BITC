import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company?: string;
  course?: string;
  packageAmt?: string;
  quote: string;
  image: string;
  rating?: number;
  createdAt: string;
}

// Initial In-Memory Store

const router = Router();

// GET /api/testimonials
router.get("/", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    testimonials: readJsonDb("testimonials.json"),
  });
});

// POST /api/testimonials (Add new testimonial)
router.post("/", (req: Request, res: Response) => {
  try {
    const { name, role, company, course, packageAmt, quote, image, rating } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Student name is required." });
    }

    if (!quote || typeof quote !== "string" || quote.trim().length < 5) {
      return res.status(400).json({ error: "Review / quote is required." });
    }

    const newTestimonial: TestimonialItem = {
      id: `testi-${Date.now()}`,
      name: name.trim(),
      role: role?.trim() || "Alumni",
      company: company?.trim() || "Tech Corp",
      course: course?.trim() || "Certification",
      packageAmt: packageAmt?.trim() || "N/A",
      quote: quote.trim(),
      image: image?.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      rating: typeof rating === "number" ? rating : 5,
      createdAt: new Date().toISOString(),
    };

    const db = readJsonDb("testimonials.json"); db.unshift(newTestimonial); writeJsonDb("testimonials.json", db);

    return res.status(201).json({
      success: true,
      message: "Testimonial added successfully",
      testimonial: newTestimonial,
      testimonials: readJsonDb("testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add testimonial" });
  }
});

// PUT /api/testimonials/reorder (Reorder testimonials)
router.put("/reorder", (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const reorderedDb: TestimonialItem[] = [];
    for (const id of orderedIds) {
      const testi = readJsonDb("testimonials.json").find((t) => t.id === id);
      if (testi) reorderedDb.push(testi);
    }
    for (const testi of readJsonDb("testimonials.json")) {
      if (!orderedIds.includes(testi.id)) reorderedDb.push(testi);
    }

    writeJsonDb("testimonials.json", reorderedDb);

    return res.json({
      success: true,
      message: "Testimonials reordered successfully",
      testimonials: readJsonDb("testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder testimonials" });
  }
});

// PUT /api/testimonials/:id (Update testimonial)
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, company, course, packageAmt, quote, image, rating } = req.body;

    const index = readJsonDb("testimonials.json").findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    const current = readJsonDb("testimonials.json")[index];
    const updated: TestimonialItem = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      role: role !== undefined ? role.trim() : current.role,
      company: company !== undefined ? company.trim() : current.company,
      course: course !== undefined ? course.trim() : current.course,
      packageAmt: packageAmt !== undefined ? packageAmt.trim() : current.packageAmt,
      quote: quote !== undefined ? quote.trim() : current.quote,
      image: image !== undefined ? image.trim() : current.image,
      rating: rating !== undefined ? Number(rating) : current.rating,
    };

    const db = readJsonDb("testimonials.json"); db[index] = updated; writeJsonDb("testimonials.json", db);

    return res.json({
      success: true,
      message: "Testimonial updated successfully",
      testimonial: updated,
      testimonials: readJsonDb("testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update testimonial" });
  }
});

// DELETE /api/testimonials/:id (Remove testimonial)
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const initialLen = readJsonDb("testimonials.json").length;
    const db = readJsonDb("testimonials.json").filter((t) => t.id !== id); writeJsonDb("testimonials.json", db);

    if (readJsonDb("testimonials.json").length === initialLen) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    return res.json({
      success: true,
      message: "Testimonial removed successfully",
      testimonials: readJsonDb("testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete testimonial" });
  }
});

export default router;
