import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    return res.json({ success: true, items: readJsonDb("downloads.json") });
});

router.post("/", (req: Request, res: Response) => {
    const { title, description, fileUrl } = req.body;
    if (!title || !fileUrl) return res.status(400).json({ error: "Title and File URL are required" });

    const newItem = {
        id: `dl-${Date.now()}`,
        title,
        description,
        fileUrl,
        createdAt: new Date()
    };
    const db = readJsonDb("downloads.json"); db.unshift(newItem); writeJsonDb("downloads.json", db);
    return res.json({ success: true, item: newItem, items: readJsonDb("downloads.json") });
});

router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, fileUrl } = req.body;

    const idx = readJsonDb("downloads.json").findIndex(i => i.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });

    readJsonDb("downloads.json")[idx] = { ...readJsonDb("downloads.json")[idx], title, description, fileUrl };
    return res.json({ success: true, item: readJsonDb("downloads.json")[idx], items: readJsonDb("downloads.json") });
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readJsonDb("downloads.json").filter(i => i.id !== id); writeJsonDb("downloads.json", db);
    return res.json({ success: true, items: readJsonDb("downloads.json") });
});

export default router;
