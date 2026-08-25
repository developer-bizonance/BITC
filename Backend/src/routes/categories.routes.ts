import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

export interface CategoryItem {
  id: string;
  name: string;
}

const router = Router();

// GET /api/categories
router.get("/", async (req: Request, res: Response) => {
  try {
    let result = await readJsonDbAsync<CategoryItem>("categories.json");
    
    // If no categories exist, initialize with default ones
    if (result.length === 0) {
      result = [
        { id: `cat-1`, name: "Information Technology" },
        { id: `cat-2`, name: "Management" },
        { id: `cat-3`, name: "Design" }
      ];
      await writeJsonDbAsync("categories.json", result);
    }

    return res.json({
      success: true,
      categories: result,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST /api/categories (Add new category)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Category name is required." });
    }

    const newCategory: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
    };

    const db = await readJsonDbAsync<CategoryItem>("categories.json");
    
    // Check for duplicates
    if (db.some(c => c.name.toLowerCase() === newCategory.name.toLowerCase())) {
       return res.status(400).json({ error: "Category already exists." });
    }

    db.push(newCategory);
    await writeJsonDbAsync("categories.json", db);

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

// PUT /api/categories/reorder (Reorder categories)
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds array is required" });
    }

    const currentDb = await readJsonDbAsync<CategoryItem>("categories.json");
    const reorderedDb: CategoryItem[] = [];

    for (const id of orderedIds) {
      const cat = currentDb.find((c) => c.id === id);
      if (cat) reorderedDb.push(cat);
    }

    for (const cat of currentDb) {
      if (!orderedIds.includes(cat.id)) reorderedDb.push(cat);
    }

    await writeJsonDbAsync("categories.json", reorderedDb);

    return res.json({
      success: true,
      message: "Categories reordered successfully",
      categories: reorderedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder categories" });
  }
});

// PUT /api/categories/:id (Update category name)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Valid category name is required." });
    }

    const trimmedName = name.trim();
    const db = await readJsonDbAsync<CategoryItem>("categories.json");
    const index = db.findIndex((c) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Category not found." });
    }

    // Check duplicate with another category
    if (db.some((c) => c.id !== id && c.name.toLowerCase() === trimmedName.toLowerCase())) {
      return res.status(400).json({ error: "Another category with this name already exists." });
    }

    const oldName = db[index].name;
    db[index].name = trimmedName;
    await writeJsonDbAsync("categories.json", db);

    // Also update any certifications that had this category name
    try {
      const certsDb = await readJsonDbAsync<any>("certifications.json");
      let updatedCertsCount = 0;
      const updatedCerts = certsDb.map((cert) => {
        if (cert.category && cert.category.toLowerCase() === oldName.toLowerCase()) {
          updatedCertsCount++;
          return { ...cert, category: trimmedName };
        }
        return cert;
      });
      if (updatedCertsCount > 0) {
        await writeJsonDbAsync("certifications.json", updatedCerts);
      }
    } catch (e) {
      console.warn("Could not sync category name to certifications:", e);
    }

    return res.json({
      success: true,
      message: "Category updated successfully",
      category: db[index],
      categories: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update category" });
  }
});

// DELETE /api/categories/:id (Remove category)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await readJsonDbAsync<CategoryItem>("categories.json");
    
    const updatedDb = db.filter((c) => c.id !== id);

    if (updatedDb.length === db.length) {
      return res.status(404).json({ error: "Category not found" });
    }

    await writeJsonDbAsync("categories.json", updatedDb);

    return res.json({
      success: true,
      message: "Category removed successfully",
      categories: updatedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete category" });
  }
});

export default router;
