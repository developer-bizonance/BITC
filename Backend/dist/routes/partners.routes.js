"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/partners.json");
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
// Initial In-Memory / Fallback Default Partners
const router = (0, express_1.Router)();
// GET /api/partners
router.get("/", (_req, res) => {
    return res.json({
        success: true,
        partners: getDb(),
    });
});
// POST /api/partners (Add a new partner)
router.post("/", (req, res) => {
    try {
        const { name, logo, website, city } = req.body;
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return res.status(400).json({ error: "Partner name is required (minimum 2 characters)." });
        }
        const newPartner = {
            id: `partner-${Date.now()}`,
            name: name.trim(),
            logo: logo?.trim() || "/univercity.png",
            website: website?.trim() || "",
            city: city?.trim() || "Amravati",
            createdAt: new Date().toISOString(),
        };
        const db = getDb();
        db.unshift(newPartner);
        saveDb(db);
        return res.status(201).json({
            success: true,
            message: "Academic Partner added successfully",
            partner: newPartner,
            partners: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to add partner" });
    }
});
// PUT /api/partners/reorder (Reorder partners)
router.put("/reorder", (req, res) => {
    try {
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({ error: "orderedIds must be an array" });
        }
        const reorderedDb = [];
        for (const id of orderedIds) {
            const partner = getDb().find((p) => p.id === id);
            if (partner)
                reorderedDb.push(partner);
        }
        for (const partner of getDb()) {
            if (!orderedIds.includes(partner.id))
                reorderedDb.push(partner);
        }
        saveDb(reorderedDb);
        return res.json({
            success: true,
            message: "Academic Partners reordered successfully",
            partners: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to reorder partners" });
    }
});
// PUT /api/partners/:id (Update a partner)
router.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { name, logo, website, city } = req.body;
        const index = getDb().findIndex((p) => p.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Partner not found" });
        }
        const current = getDb()[index];
        const updated = {
            ...current,
            name: name !== undefined ? name.trim() : current.name,
            logo: logo !== undefined ? logo.trim() : current.logo,
            website: website !== undefined ? website.trim() : current.website,
            city: city !== undefined ? city.trim() : current.city,
        };
        const db = getDb();
        db[index] = updated;
        saveDb(db);
        return res.json({
            success: true,
            message: "Academic Partner updated successfully",
            partner: updated,
            partners: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to update partner" });
    }
});
// DELETE /api/partners/:id (Remove a partner)
router.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const initialLength = getDb().length;
        const db = getDb().filter((p) => p.id !== id);
        saveDb(db);
        if (getDb().length === initialLength) {
            return res.status(404).json({ error: "Partner not found" });
        }
        return res.json({
            success: true,
            message: "Academic Partner removed successfully",
            partners: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to remove partner" });
    }
});
exports.default = router;
