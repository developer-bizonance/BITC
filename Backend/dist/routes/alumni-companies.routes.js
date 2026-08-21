"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/alumni-companies.json");
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
// GET /api/alumni-companies
router.get("/", (_req, res) => {
    return res.json({
        success: true,
        companies: getDb(),
    });
});
// POST /api/alumni-companies (Add company)
router.post("/", (req, res) => {
    try {
        const { name, logo, website } = req.body;
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return res.status(400).json({ error: "Company name is required." });
        }
        const newCompany = {
            id: `acomp-${Date.now()}`,
            name: name.trim(),
            logo: logo?.trim() || "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            website: website?.trim() || "",
            createdAt: new Date().toISOString(),
        };
        const db = getDb();
        db.push(newCompany);
        saveDb(db);
        return res.status(201).json({
            success: true,
            message: "Company added successfully",
            company: newCompany,
            companies: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to add company" });
    }
});
// PUT /api/alumni-companies/:id (Update company)
router.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { name, logo, website } = req.body;
        const index = getDb().findIndex((c) => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Company not found" });
        }
        const current = getDb()[index];
        const updated = {
            ...current,
            name: name !== undefined ? name.trim() : current.name,
            logo: logo !== undefined ? logo.trim() : current.logo,
            website: website !== undefined ? website.trim() : current.website,
        };
        const db = getDb();
        db[index] = updated;
        saveDb(db);
        return res.json({
            success: true,
            message: "Company updated successfully",
            company: updated,
            companies: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to update company" });
    }
});
// DELETE /api/alumni-companies/:id (Remove company)
router.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const initialLen = getDb().length;
        const db = getDb().filter((c) => c.id !== id);
        saveDb(db);
        if (getDb().length === initialLen) {
            return res.status(404).json({ error: "Company not found" });
        }
        return res.json({
            success: true,
            message: "Company removed successfully",
            companies: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to delete company" });
    }
});
// PUT /api/alumni-companies/reorder (Reorder companies)
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
        // 2. Append any items that were missed (to prevent data loss)
        getDb().forEach((item) => {
            if (!idSet.has(item.id)) {
                newOrder.push(item);
            }
        });
        saveDb(newOrder);
        return res.json({
            success: true,
            message: "Companies reordered successfully",
            companies: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to reorder companies" });
    }
});
exports.default = router;
