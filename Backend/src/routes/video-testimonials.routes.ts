import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

export interface VideoTestimonialItem {
  id: string;
  title: string;
  name: string;
  youtubeUrl: string;
  createdAt: string;
}

const router = Router();

// GET /api/video-testimonials
router.get("/", async (_req: Request, res: Response) => {
  try {
    const testimonials = await readJsonDbAsync<VideoTestimonialItem>("video-testimonials.json");
    return res.json({
      success: true,
      testimonials,
    });
  } catch (error: any) {
    console.error("[video-testimonials] Failed to get testimonials:", error);
    return res.status(500).json({ error: "Failed to fetch video testimonials" });
  }
});

// POST /api/video-testimonials
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, name, youtubeUrl } = req.body;

    if (!title || !name || !youtubeUrl) {
      return res.status(400).json({ error: "Title, name, and YouTube URL are required." });
    }

    const newItem: VideoTestimonialItem = {
      id: `vt-${Date.now()}`,
      title: String(title).trim(),
      name: String(name).trim(),
      youtubeUrl: String(youtubeUrl).trim(),
      createdAt: new Date().toISOString(),
    };

    const db = await readJsonDbAsync<VideoTestimonialItem>("video-testimonials.json");
    db.push(newItem);
    await writeJsonDbAsync("video-testimonials.json", db);

    return res.status(201).json({
      success: true,
      message: "Video testimonial added successfully",
      testimonial: newItem,
      testimonials: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add video testimonial" });
  }
});

// PUT /api/video-testimonials/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, name, youtubeUrl } = req.body;

    const db = await readJsonDbAsync<VideoTestimonialItem>("video-testimonials.json");
    const index = db.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Video testimonial not found" });
    }

    const current = db[index];
    const updated: VideoTestimonialItem = {
      ...current,
      title: title !== undefined ? String(title).trim() : current.title,
      name: name !== undefined ? String(name).trim() : current.name,
      youtubeUrl: youtubeUrl !== undefined ? String(youtubeUrl).trim() : current.youtubeUrl,
    };

    db[index] = updated;
    await writeJsonDbAsync("video-testimonials.json", db);

    return res.json({
      success: true,
      message: "Video testimonial updated successfully",
      testimonial: updated,
      testimonials: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update video testimonial" });
  }
});

// DELETE /api/video-testimonials/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await readJsonDbAsync<VideoTestimonialItem>("video-testimonials.json");
    const filtered = db.filter((t) => t.id !== id);

    if (filtered.length === db.length) {
      return res.status(404).json({ error: "Video testimonial not found" });
    }

    await writeJsonDbAsync("video-testimonials.json", filtered);

    return res.json({
      success: true,
      message: "Video testimonial removed successfully",
      testimonials: filtered,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete video testimonial" });
  }
});

// PUT /api/video-testimonials/reorder
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const db = await readJsonDbAsync<VideoTestimonialItem>("video-testimonials.json");
    const newOrder: VideoTestimonialItem[] = [];
    const idSet = new Set(orderedIds);

    // 1. Add items in the new order
    orderedIds.forEach((id: string) => {
      const item = db.find((c) => c.id === id);
      if (item) {
        newOrder.push(item);
      }
    });

    // 2. Append any items that were missed
    db.forEach((item) => {
      if (!idSet.has(item.id)) {
        newOrder.push(item);
      }
    });

    await writeJsonDbAsync("video-testimonials.json", newOrder);

    return res.json({
      success: true,
      message: "Video testimonials reordered successfully",
      testimonials: newOrder,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder video testimonials" });
  }
});

export default router;
