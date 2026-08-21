"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/video-testimonials.json");
function getDb() {
    try {
        if (!fs_1.default.existsSync(dbPath))
            return [];
        return JSON.parse(fs_1.default.readFileSync(dbPath, "utf-8"));
    }
    catch (e) {
        return [];
    }
}
function saveDb(data) {
    try {
        fs_1.default.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
    }
    catch (e) { }
}
// Initial In-Memory Store
const router = (0, express_1.Router)();
// GET /api/video-testimonials
router.get("/", (_req, res) => {
    return res.json({
        success: true,
        testimonials: getDb(),
    });
});
// POST /api/video-testimonials
router.post("/", (req, res) => {
    try {
        const { title, name, youtubeUrl } = req.body;
        if (!title || !name || !youtubeUrl) {
            return res.status(400).json({ error: "Title, name, and YouTube URL are required." });
        }
        const newItem = {
            id: `vt-${Date.now()}`,
            title: title.trim(),
            name: name.trim(),
            youtubeUrl: youtubeUrl.trim(),
            createdAt: new Date().toISOString(),
        };
        const db = getDb();
        db.push(newItem);
        saveDb(db);
        return res.status(201).json({
            success: true,
            message: "Video testimonial added successfully",
            testimonial: newItem,
            testimonials: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to add video testimonial" });
    }
});
// PUT /api/video-testimonials/:id
router.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { title, name, youtubeUrl } = req.body;
        const index = getDb().findIndex((t) => t.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Video testimonial not found" });
        }
        const current = getDb()[index];
        const updated = {
            ...current,
            title: title !== undefined ? title.trim() : current.title,
            name: name !== undefined ? name.trim() : current.name,
            youtubeUrl: youtubeUrl !== undefined ? youtubeUrl.trim() : current.youtubeUrl,
        };
        const db = getDb();
        db[index] = updated;
        saveDb(db);
        return res.json({
            success: true,
            message: "Video testimonial updated successfully",
            testimonial: updated,
            testimonials: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to update video testimonial" });
    }
});
// DELETE /api/video-testimonials/:id
router.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const initialLen = getDb().length;
        const db = getDb().filter((t) => t.id !== id);
        saveDb(db);
        if (getDb().length === initialLen) {
            return res.status(404).json({ error: "Video testimonial not found" });
        }
        return res.json({
            success: true,
            message: "Video testimonial removed successfully",
            testimonials: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to delete video testimonial" });
    }
});
// PUT /api/video-testimonials/reorder
router.put("/reorder", (req, res) => {
    try {
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({ error: "orderedIds must be an array" });
        }
        const newOrder = [];
        const idSet = new Set(orderedIds);
        // 1. Add items in the new order
        orderedIds.forEach((id) => {
            const item = getDb().find((c) => c.id === id);
            if (item) {
                newOrder.push(item);
            }
        });
        // 2. Append any items that were missed
        getDb().forEach((item) => {
            if (!idSet.has(item.id)) {
                newOrder.push(item);
            }
        });
        saveDb(newOrder);
        return res.json({
            success: true,
            message: "Video testimonials reordered successfully",
            testimonials: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to reorder video testimonials" });
    }
});
exports.default = router;
