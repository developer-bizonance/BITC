import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

export interface EmployeeTestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  rating?: number;
  createdAt: string;
}

const router = Router();

// GET /api/employee-testimonials
router.get("/", async (_req: Request, res: Response) => {
  const testimonials = await readJsonDbAsync<EmployeeTestimonialItem>("employee-testimonials.json");
  return res.json({
    success: true,
    testimonials,
  });
});

// POST /api/employee-testimonials
router.post("/", async (req: Request, res: Response) => {
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

    const db = await readJsonDbAsync<EmployeeTestimonialItem>("employee-testimonials.json");
    db.unshift(newTestimonial);
    await writeJsonDbAsync("employee-testimonials.json", db);

    return res.status(201).json({
      success: true,
      message: "Employee testimonial added successfully",
      testimonial: newTestimonial,
      testimonials: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add employee testimonial" });
  }
});

// PUT /api/employee-testimonials/reorder (Reorder employee testimonials)
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const currentDb = await readJsonDbAsync<EmployeeTestimonialItem>("employee-testimonials.json");
    const reorderedDb: EmployeeTestimonialItem[] = [];
    for (const id of orderedIds) {
      const item = currentDb.find((m) => m.id === id);
      if (item) reorderedDb.push(item);
    }
    for (const item of currentDb) {
      if (!orderedIds.includes(item.id)) reorderedDb.push(item);
    }

    await writeJsonDbAsync("employee-testimonials.json", reorderedDb);

    return res.json({
      success: true,
      message: "Employee Testimonials reordered successfully",
      testimonials: reorderedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder employee testimonials" });
  }
});

// PUT /api/employee-testimonials/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, quote, image, rating } = req.body;

    const db = await readJsonDbAsync<EmployeeTestimonialItem>("employee-testimonials.json");
    const index = db.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Employee testimonial not found" });
    }

    const current = db[index];
    const updated: EmployeeTestimonialItem = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      role: role !== undefined ? role.trim() : current.role,
      quote: quote !== undefined ? quote.trim() : current.quote,
      image: image !== undefined ? image.trim() : current.image,
      rating: rating !== undefined ? Number(rating) : current.rating,
    };

    db[index] = updated;
    await writeJsonDbAsync("employee-testimonials.json", db);

    return res.json({
      success: true,
      message: "Employee testimonial updated successfully",
      testimonial: updated,
      testimonials: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update employee testimonial" });
  }
});

// DELETE /api/employee-testimonials/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentDb = await readJsonDbAsync<EmployeeTestimonialItem>("employee-testimonials.json");
    const filteredDb = currentDb.filter((t) => t.id !== id);

    if (filteredDb.length === currentDb.length) {
      return res.status(404).json({ error: "Employee testimonial not found" });
    }

    await writeJsonDbAsync("employee-testimonials.json", filteredDb);

    return res.json({
      success: true,
      message: "Employee testimonial removed successfully",
      testimonials: filteredDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete employee testimonial" });
  }
});

export default router;
