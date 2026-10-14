import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

export interface GalleryItem {
  id: string;
  title: string;
  imgUrl: string;
  type?: "photo" | "video";
  createdAt: string | Date;
}

const router = Router();

// Helper to check if URL or extension represents a video
function checkIsVideo(url: string, explicitType?: string): boolean {
  if (explicitType === "video") return true;
  if (!url || typeof url !== "string") return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.includes("youtube.com") ||
    clean.includes("youtu.be") ||
    clean.includes("vimeo.com") ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(clean)
  );
}

// GET /api/gallery
router.get("/", async (_req: Request, res: Response) => {
  try {
    const items = await readJsonDbAsync<GalleryItem>("gallery.json");
    return res.json({ success: true, items });
  } catch (error: any) {
    console.error("[gallery.routes] Failed to get gallery items:", error);
    return res.status(500).json({ error: "Failed to fetch gallery items" });
  }
});

// POST /api/gallery
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, imgUrl, type } = req.body;
    if (!title || !imgUrl) {
      return res.status(400).json({ error: "Title and Image/Video URL are required" });
    }

    const trimmedTitle = String(title).trim();
    const trimmedImgUrl = String(imgUrl).trim();
    const isVideo = checkIsVideo(trimmedImgUrl, type);

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: trimmedTitle,
      imgUrl: trimmedImgUrl,
      type: isVideo ? "video" : "photo",
      createdAt: new Date().toISOString()
    };

    const db = await readJsonDbAsync<GalleryItem>("gallery.json");
    db.unshift(newItem);
    await writeJsonDbAsync("gallery.json", db);

    return res.status(201).json({ success: true, item: newItem, items: db });
  } catch (error: any) {
    console.error("[gallery.routes] Failed to add gallery item:", error);
    return res.status(500).json({ error: error?.message || "Failed to add gallery item" });
  }
});

// PUT /api/gallery/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, imgUrl, type } = req.body;

    const db = await readJsonDbAsync<GalleryItem>("gallery.json");
    const idx = db.findIndex((i) => i.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    const current = db[idx];
    const newTitle = title !== undefined ? String(title).trim() : current.title;
    const newImgUrl = imgUrl !== undefined ? String(imgUrl).trim() : current.imgUrl;
    const isVideo = checkIsVideo(newImgUrl, type !== undefined ? type : current.type);

    const updatedItem: GalleryItem = {
      ...current,
      title: newTitle,
      imgUrl: newImgUrl,
      type: isVideo ? "video" : "photo"
    };

    db[idx] = updatedItem;
    await writeJsonDbAsync("gallery.json", db);

    return res.json({ success: true, item: updatedItem, items: db });
  } catch (error: any) {
    console.error("[gallery.routes] Failed to update gallery item:", error);
    return res.status(500).json({ error: error?.message || "Failed to update gallery item" });
  }
});

// DELETE /api/gallery/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await readJsonDbAsync<GalleryItem>("gallery.json");
    const filtered = db.filter((i) => i.id !== id);

    if (filtered.length === db.length) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    await writeJsonDbAsync("gallery.json", filtered);
    return res.json({ success: true, items: filtered });
  } catch (error: any) {
    console.error("[gallery.routes] Failed to delete gallery item:", error);
    return res.status(500).json({ error: error?.message || "Failed to delete gallery item" });
  }
});

export default router;
