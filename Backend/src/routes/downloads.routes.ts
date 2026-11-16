import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const items = await readJsonDbAsync("downloads.json");
  return res.json({ success: true, items });
});

router.post("/", async (req: Request, res: Response) => {
  const { title, description, fileUrl } = req.body;
  if (!title || !fileUrl) return res.status(400).json({ error: "Title and File URL are required" });

  const newItem = {
    id: `dl-${Date.now()}`,
    title,
    description,
    fileUrl,
    createdAt: new Date(),
  };
  const db = await readJsonDbAsync<any>("downloads.json");
  db.unshift(newItem);
  await writeJsonDbAsync("downloads.json", db);
  return res.json({ success: true, item: newItem, items: db });
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, fileUrl } = req.body;

  const db = await readJsonDbAsync<any>("downloads.json");
  const idx = db.findIndex((i: any) => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  db[idx] = { ...db[idx], title, description, fileUrl };
  await writeJsonDbAsync("downloads.json", db);
  return res.json({ success: true, item: db[idx], items: db });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const db = await readJsonDbAsync<any>("downloads.json");
  const filtered = db.filter((i: any) => i.id !== id);
  await writeJsonDbAsync("downloads.json", filtered);
  return res.json({ success: true, items: filtered });
});

export default router;
