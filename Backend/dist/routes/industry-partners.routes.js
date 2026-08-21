"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/industry-partners.json");
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
// GET /api/industry-partners
router.get("/", (_req, res) => {
    return res.json({
        success: true,
        partners: getDb(),
    });
});
// POST /api/industry-partners (Add new partner)
router.post("/", (req, res) => {
    try {
        const { name, category, logo, website } = req.body;
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return res.status(400).json({ error: "Company name is required." });
        }
        const newPartner = {
            id: `ip-${Date.now()}`,
            name: name.trim(),
            category: category?.trim() || "Industry Partner",
            logo: logo?.trim() || "",
            website: website?.trim() || "",
            createdAt: new Date().toISOString(),
        };
        const db = getDb();
        db.push(newPartner);
        saveDb(db);
        return res.status(201).json({
            success: true,
            message: "Industry Partner added successfully",
            partner: newPartner,
            partners: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to add partner" });
    }
});
// PUT /api/industry-partners/reorder (Reorder industry partners)
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
            message: "Industry Partners reordered successfully",
            industryPartners: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to reorder industry partners" });
    }
});
// PUT /api/industry-partners/:id (Update partner)
router.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, logo, website } = req.body;
        const index = getDb().findIndex((p) => p.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Industry partner not found" });
        }
        const current = getDb()[index];
        const updated = {
            ...current,
            name: name !== undefined ? name.trim() : current.name,
            category: category !== undefined ? category.trim() : current.category,
            logo: logo !== undefined ? logo.trim() : current.logo,
            website: website !== undefined ? website.trim() : current.website,
        };
        const db = getDb();
        db[index] = updated;
        saveDb(db);
        return res.json({
            success: true,
            message: "Industry Partner updated successfully",
            partner: updated,
            partners: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to update partner" });
    }
});
// DELETE /api/industry-partners/:id (Remove partner)
router.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const initialLen = getDb().length;
        const db = getDb().filter((p) => p.id !== id);
        saveDb(db);
        if (getDb().length === initialLen) {
            return res.status(404).json({ error: "Industry partner not found" });
        }
        return res.json({
            success: true,
            message: "Industry Partner removed successfully",
            partners: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to delete partner" });
    }
});
exports.default = router;
