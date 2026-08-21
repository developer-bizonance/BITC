import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    return res.json({ success: true, items: readJsonDb("faq.json") });
});

router.post("/", (req: Request, res: Response) => {
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ error: "Question and Answer are required" });

    const newItem = {
        id: `faq-${Date.now()}`,
        question,
        answer,
        createdAt: new Date()
    };
    const db = readJsonDb("faq.json"); db.unshift(newItem); writeJsonDb("faq.json", db);
    return res.json({ success: true, item: newItem, items: readJsonDb("faq.json") });
});

router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { question, answer } = req.body;

    const idx = readJsonDb("faq.json").findIndex(i => i.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });

    readJsonDb("faq.json")[idx] = { ...readJsonDb("faq.json")[idx], question, answer };
    return res.json({ success: true, item: readJsonDb("faq.json")[idx], items: readJsonDb("faq.json") });
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readJsonDb("faq.json").filter(i => i.id !== id); writeJsonDb("faq.json", db);
    return res.json({ success: true, items: readJsonDb("faq.json") });
});

export default router;
