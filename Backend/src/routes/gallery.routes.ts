import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    return res.json({ success: true, items: readJsonDb("gallery.json") });
});

router.post("/", (req: Request, res: Response) => {
    const { title, imgUrl } = req.body;
    if (!title || !imgUrl) return res.status(400).json({ error: "Title and Image URL are required" });

    const newItem = {
        id: `gal-${Date.now()}`,
        title,
        imgUrl,
        createdAt: new Date()
    };
    const db = readJsonDb("gallery.json"); db.unshift(newItem); writeJsonDb("gallery.json", db);
    return res.json({ success: true, item: newItem, items: readJsonDb("gallery.json") });
});

router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, imgUrl } = req.body;

    const idx = readJsonDb("gallery.json").findIndex(i => i.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });

    readJsonDb("gallery.json")[idx] = { ...readJsonDb("gallery.json")[idx], title, imgUrl };
    return res.json({ success: true, item: readJsonDb("gallery.json")[idx], items: readJsonDb("gallery.json") });
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readJsonDb("gallery.json").filter(i => i.id !== id); writeJsonDb("gallery.json", db);
    return res.json({ success: true, items: readJsonDb("gallery.json") });
});

export default router;
