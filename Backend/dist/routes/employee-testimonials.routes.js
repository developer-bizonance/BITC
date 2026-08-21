"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/employee-testimonials.json");
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
// GET /api/employee-testimonials
router.get("/", (_req, res) => {
    return res.json({
        success: true,
        testimonials: getDb(),
    });
});
// POST /api/employee-testimonials
router.post("/", (req, res) => {
    try {
        const { name, role, quote, image, rating } = req.body;
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return res.status(400).json({ error: "Employee name is required." });
        }
        if (!quote || typeof quote !== "string" || quote.trim().length < 5) {
            return res.status(400).json({ error: "Quote is required." });
        }
        const newTestimonial = {
            id: `emp-testi-${Date.now()}`,
            name: name.trim(),
            role: role?.trim() || "Employee",
            quote: quote.trim(),
            image: image?.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
            rating: typeof rating === "number" ? rating : 5,
            createdAt: new Date().toISOString(),
        };
        const db = getDb();
        db.unshift(newTestimonial);
        saveDb(db);
        return res.status(201).json({
            success: true,
            message: "Employee testimonial added successfully",
            testimonial: newTestimonial,
            testimonials: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to add employee testimonial" });
    }
});
// PUT /api/employee-testimonials/reorder (Reorder employee testimonials)
router.put("/reorder", (req, res) => {
    try {
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({ error: "orderedIds must be an array" });
        }
        const reorderedDb = [];
        for (const id of orderedIds) {
            const item = getDb().find((m) => m.id === id);
            if (item)
                reorderedDb.push(item);
        }
        for (const item of getDb()) {
            if (!orderedIds.includes(item.id))
                reorderedDb.push(item);
        }
        saveDb(reorderedDb);
        return res.json({
            success: true,
            message: "Employee Testimonials reordered successfully",
            testimonials: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to reorder employee testimonials" });
    }
});
// PUT /api/employee-testimonials/:id
router.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, quote, image, rating } = req.body;
        const index = getDb().findIndex((t) => t.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Employee testimonial not found" });
        }
        const current = getDb()[index];
        const updated = {
            ...current,
            name: name !== undefined ? name.trim() : current.name,
            role: role !== undefined ? role.trim() : current.role,
            quote: quote !== undefined ? quote.trim() : current.quote,
            image: image !== undefined ? image.trim() : current.image,
            rating: rating !== undefined ? Number(rating) : current.rating,
        };
        const db = getDb();
        db[index] = updated;
        saveDb(db);
        return res.json({
            success: true,
            message: "Employee testimonial updated successfully",
            testimonial: updated,
            testimonials: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to update employee testimonial" });
    }
});
// DELETE /api/employee-testimonials/:id
router.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const initialLen = getDb().length;
        const db = getDb().filter((t) => t.id !== id);
        saveDb(db);
        if (getDb().length === initialLen) {
            return res.status(404).json({ error: "Employee testimonial not found" });
        }
        return res.json({
            success: true,
            message: "Employee testimonial removed successfully",
            testimonials: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to delete employee testimonial" });
    }
});
exports.default = router;
