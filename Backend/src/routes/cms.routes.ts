import express, { Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

const router = express.Router();

/**
 * GET /api/cms/:key
 * Retrieves data from the CmsData table or local JSON fallback.
 */
router.get("/:key", async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const data = await readJsonDbAsync(`${key}.json`);
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching CMS data for key ${req.params.key}:`, error);
    res.status(500).json({ error: "Failed to fetch CMS data" });
  }
});

/**
 * PUT /api/cms/:key
 * Updates data in the CmsData table and caches it.
 */
router.put("/:key", async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: "Data is required" });
    }

    await writeJsonDbAsync(`${key}.json`, data);
    res.status(200).json({ message: "CMS data updated successfully", data });
  } catch (error) {
    console.error(`Error updating CMS data for key ${req.params.key}:`, error);
    res.status(500).json({ error: "Failed to update CMS data" });
  }
});

export default router;
