import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  createdAt?: string | Date;
}

const router = Router();

// GET /api/faq
router.get("/", async (_req: Request, res: Response) => {
  try {
    const items = await readJsonDbAsync<FaqItem>("faq.json");
    return res.json({ success: true, items });
  } catch (error: any) {
    console.error("[faq.routes] Failed to get FAQs:", error);
    return res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

// POST /api/faq
router.post("/", async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: "Question and Answer are required" });
    }

    const newItem: FaqItem = {
      id: `faq-${Date.now()}`,
      question: String(question).trim(),
      answer: String(answer).trim(),
      createdAt: new Date().toISOString(),
    };

    const db = await readJsonDbAsync<FaqItem>("faq.json");
    db.unshift(newItem);
    await writeJsonDbAsync("faq.json", db);

    return res.status(201).json({ success: true, item: newItem, items: db });
  } catch (error: any) {
    console.error("[faq.routes] Failed to add FAQ:", error);
    return res.status(500).json({ error: error?.message || "Failed to add FAQ" });
  }
});

// PUT /api/faq/reorder (Must be defined before /:id)
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const db = await readJsonDbAsync<FaqItem>("faq.json");
    const newOrder: FaqItem[] = [];
    const idSet = new Set(orderedIds);

    // 1. Add items in the requested new order
    orderedIds.forEach((id: string) => {
      const item = db.find((f) => f.id === id);
      if (item) {
        newOrder.push(item);
      }
    });

    // 2. Append any items not in orderedIds (safety fallback)
    db.forEach((item) => {
      if (!idSet.has(item.id)) {
        newOrder.push(item);
      }
    });

    await writeJsonDbAsync("faq.json", newOrder);

    return res.json({
      success: true,
      message: "FAQs reordered successfully",
      items: newOrder,
    });
  } catch (error: any) {
    console.error("[faq.routes] Failed to reorder FAQs:", error);
    return res.status(500).json({ error: error?.message || "Failed to reorder FAQs" });
  }
});

// PUT /api/faq/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const db = await readJsonDbAsync<FaqItem>("faq.json");
    const idx = db.findIndex((i) => i.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    const current = db[idx];
    const updatedItem: FaqItem = {
      ...current,
      question: question !== undefined ? String(question).trim() : current.question,
      answer: answer !== undefined ? String(answer).trim() : current.answer,
    };

    db[idx] = updatedItem;
    await writeJsonDbAsync("faq.json", db);

    return res.json({ success: true, item: updatedItem, items: db });
  } catch (error: any) {
    console.error("[faq.routes] Failed to update FAQ:", error);
    return res.status(500).json({ error: error?.message || "Failed to update FAQ" });
  }
});

// DELETE /api/faq/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await readJsonDbAsync<FaqItem>("faq.json");
    const filtered = db.filter((i) => i.id !== id);

    if (filtered.length === db.length) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    await writeJsonDbAsync("faq.json", filtered);
    return res.json({ success: true, items: filtered });
  } catch (error: any) {
    console.error("[faq.routes] Failed to delete FAQ:", error);
    return res.status(500).json({ error: error?.message || "Failed to delete FAQ" });
  }
});

export default router;
