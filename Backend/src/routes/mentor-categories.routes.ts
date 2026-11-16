import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

export interface MentorCategoryItem {
  id: string;
  name: string;
  order?: number;
}

const router = Router();

const DEFAULT_MENTOR_CATEGORIES: MentorCategoryItem[] = [
  { id: "cat-ie", name: "Industry Expert", order: 0 },
  { id: "cat-tc", name: "Technical Consultant", order: 1 },
  { id: "cat-ct", name: "Corporate Trainers", order: 2 },
];

// GET /api/mentor-categories
router.get("/", async (_req: Request, res: Response) => {
  try {
    let result = await readJsonDbAsync<MentorCategoryItem>("mentor-categories.json");

    if (!result || result.length === 0) {
      result = [...DEFAULT_MENTOR_CATEGORIES];
      await writeJsonDbAsync("mentor-categories.json", result);
    }

    // Sort by order ascending
    result.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return res.json({
      success: true,
      categories: result,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch mentor categories" });
  }
});

// POST /api/mentor-categories
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Category name is required." });
    }

    let db = await readJsonDbAsync<MentorCategoryItem>("mentor-categories.json");
    if (!db || db.length === 0) {
      db = [...DEFAULT_MENTOR_CATEGORIES];
    }

    const trimmed = name.trim();
    if (db.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      return res.status(400).json({ error: "Category already exists." });
    }

    const newCategory: MentorCategoryItem = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      order: db.length,
    };

    db.push(newCategory);
    await writeJsonDbAsync("mentor-categories.json", db);

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      category: newCategory,
      categories: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add category" });
  }
});

// PUT /api/mentor-categories/reorder
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds array is required" });
    }

    let currentDb = await readJsonDbAsync<MentorCategoryItem>("mentor-categories.json");
    if (!currentDb || currentDb.length === 0) {
      currentDb = [...DEFAULT_MENTOR_CATEGORIES];
    }

    const reorderedDb: MentorCategoryItem[] = [];
    for (const id of orderedIds) {
      const cat = currentDb.find((c) => c.id === id);
      if (cat) reorderedDb.push(cat);
    }
    for (const cat of currentDb) {
      if (!orderedIds.includes(cat.id)) reorderedDb.push(cat);
    }

    reorderedDb.forEach((cat, idx) => {
      cat.order = idx;
    });

    await writeJsonDbAsync("mentor-categories.json", reorderedDb);

    return res.json({
      success: true,
      message: "Categories reordered successfully",
      categories: reorderedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder categories" });
  }
});

// PUT /api/mentor-categories/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Category name is required." });
    }

    let db = await readJsonDbAsync<MentorCategoryItem>("mentor-categories.json");
    if (!db || db.length === 0) {
      db = [...DEFAULT_MENTOR_CATEGORIES];
    }

    const index = db.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Category not found." });
    }

    db[index] = { ...db[index], name: name.trim() };
    await writeJsonDbAsync("mentor-categories.json", db);

    return res.json({
      success: true,
      message: "Category updated successfully",
      categories: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update category" });
  }
});

// DELETE /api/mentor-categories/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let db = await readJsonDbAsync<MentorCategoryItem>("mentor-categories.json");
    if (!db || db.length === 0) {
      db = [...DEFAULT_MENTOR_CATEGORIES];
    }

    const updated = db.filter((c) => c.id !== id);
    await writeJsonDbAsync("mentor-categories.json", updated);

    return res.json({
      success: true,
      message: "Category deleted successfully",
      categories: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete category" });
  }
});

export default router;

