import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

export interface EmployeeTestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  rating?: number;
  createdAt: string;
}

// Initial In-Memory Store

const router = Router();

// GET /api/employee-testimonials
router.get("/", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    testimonials: readJsonDb("employee-testimonials.json"),
  });
});

// POST /api/employee-testimonials
router.post("/", (req: Request, res: Response) => {
  try {
    const { name, role, quote, image, rating } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Employee name is required." });
    }

    if (!quote || typeof quote !== "string" || quote.trim().length < 5) {
      return res.status(400).json({ error: "Quote is required." });
    }

    const newTestimonial: EmployeeTestimonialItem = {
      id: `emp-testi-${Date.now()}`,
      name: name.trim(),
      role: role?.trim() || "Employee",
      quote: quote.trim(),
      image: image?.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      rating: typeof rating === "number" ? rating : 5,
      createdAt: new Date().toISOString(),
    };

    const db = readJsonDb("employee-testimonials.json"); db.unshift(newTestimonial); writeJsonDb("employee-testimonials.json", db);

    return res.status(201).json({
      success: true,
      message: "Employee testimonial added successfully",
      testimonial: newTestimonial,
      testimonials: readJsonDb("employee-testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add employee testimonial" });
  }
});

// PUT /api/employee-testimonials/reorder (Reorder employee testimonials)
router.put("/reorder", (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const reorderedDb: EmployeeTestimonialItem[] = [];
    for (const id of orderedIds) {
      const item = readJsonDb("employee-testimonials.json").find((m) => m.id === id);
      if (item) reorderedDb.push(item);
    }
    for (const item of readJsonDb("employee-testimonials.json")) {
      if (!orderedIds.includes(item.id)) reorderedDb.push(item);
    }

    writeJsonDb("employee-testimonials.json", reorderedDb);

    return res.json({
      success: true,
      message: "Employee Testimonials reordered successfully",
      testimonials: readJsonDb("employee-testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder employee testimonials" });
  }
});

// PUT /api/employee-testimonials/:id
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, quote, image, rating } = req.body;

    const index = readJsonDb("employee-testimonials.json").findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Employee testimonial not found" });
    }

    const current = readJsonDb("employee-testimonials.json")[index];
    const updated: EmployeeTestimonialItem = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      role: role !== undefined ? role.trim() : current.role,
      quote: quote !== undefined ? quote.trim() : current.quote,
      image: image !== undefined ? image.trim() : current.image,
      rating: rating !== undefined ? Number(rating) : current.rating,
    };

    const db = readJsonDb("employee-testimonials.json"); db[index] = updated; writeJsonDb("employee-testimonials.json", db);

    return res.json({
      success: true,
      message: "Employee testimonial updated successfully",
      testimonial: updated,
      testimonials: readJsonDb("employee-testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update employee testimonial" });
  }
});

// DELETE /api/employee-testimonials/:id
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const initialLen = readJsonDb("employee-testimonials.json").length;
    const db = readJsonDb("employee-testimonials.json").filter((t) => t.id !== id); writeJsonDb("employee-testimonials.json", db);

    if (readJsonDb("employee-testimonials.json").length === initialLen) {
      return res.status(404).json({ error: "Employee testimonial not found" });
    }

    return res.json({
      success: true,
      message: "Employee testimonial removed successfully",
      testimonials: readJsonDb("employee-testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete employee testimonial" });
  }
});

export default router;
