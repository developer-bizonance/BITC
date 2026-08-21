import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

export interface VideoTestimonialItem {
  id: string;
  title: string;
  name: string;
  youtubeUrl: string;
  createdAt: string;
}

// Initial In-Memory Store

const router = Router();

// GET /api/video-testimonials
router.get("/", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    testimonials: readJsonDb("video-testimonials.json"),
  });
});

// POST /api/video-testimonials
router.post("/", (req: Request, res: Response) => {
  try {
    const { title, name, youtubeUrl } = req.body;

    if (!title || !name || !youtubeUrl) {
      return res.status(400).json({ error: "Title, name, and YouTube URL are required." });
    }

    const newItem: VideoTestimonialItem = {
      id: `vt-${Date.now()}`,
      title: title.trim(),
      name: name.trim(),
      youtubeUrl: youtubeUrl.trim(),
      createdAt: new Date().toISOString(),
    };

    const db = readJsonDb("video-testimonials.json"); db.push(newItem); writeJsonDb("video-testimonials.json", db);

    return res.status(201).json({
      success: true,
      message: "Video testimonial added successfully",
      testimonial: newItem,
      testimonials: readJsonDb("video-testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add video testimonial" });
  }
});

// PUT /api/video-testimonials/:id
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, name, youtubeUrl } = req.body;

    const index = readJsonDb("video-testimonials.json").findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Video testimonial not found" });
    }

    const current = readJsonDb("video-testimonials.json")[index];
    const updated: VideoTestimonialItem = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      name: name !== undefined ? name.trim() : current.name,
      youtubeUrl: youtubeUrl !== undefined ? youtubeUrl.trim() : current.youtubeUrl,
    };

    const db = readJsonDb("video-testimonials.json"); db[index] = updated; writeJsonDb("video-testimonials.json", db);

    return res.json({
      success: true,
      message: "Video testimonial updated successfully",
      testimonial: updated,
      testimonials: readJsonDb("video-testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update video testimonial" });
  }
});

// DELETE /api/video-testimonials/:id
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const initialLen = readJsonDb("video-testimonials.json").length;
    const db = readJsonDb("video-testimonials.json").filter((t) => t.id !== id); writeJsonDb("video-testimonials.json", db);

    if (readJsonDb("video-testimonials.json").length === initialLen) {
      return res.status(404).json({ error: "Video testimonial not found" });
    }

    return res.json({
      success: true,
      message: "Video testimonial removed successfully",
      testimonials: readJsonDb("video-testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete video testimonial" });
  }
});

// PUT /api/video-testimonials/reorder
router.put("/reorder", (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const newOrder: VideoTestimonialItem[] = [];
    const idSet = new Set(orderedIds);

    // 1. Add items in the new order
    orderedIds.forEach((id: string) => {
      const item = readJsonDb("video-testimonials.json").find((c) => c.id === id);
      if (item) {
        newOrder.push(item);
      }
    });

    // 2. Append any items that were missed
    readJsonDb("video-testimonials.json").forEach((item) => {
      if (!idSet.has(item.id)) {
        newOrder.push(item);
      }
    });

    writeJsonDb("video-testimonials.json", newOrder);

    return res.json({
      success: true,
      message: "Video testimonials reordered successfully",
      testimonials: readJsonDb("video-testimonials.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder video testimonials" });
  }
});

export default router;
