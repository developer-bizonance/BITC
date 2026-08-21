"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/certifications.json");
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
// Initial In-Memory Store — Only MERN Stack has image
const router = (0, express_1.Router)();
// GET /api/certifications
router.get("/", (req, res) => {
    const { category } = req.query;
    let result = getDb();
    if (category && typeof category === "string" && category !== "All") {
        result = getDb().filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }
    return res.json({
        success: true,
        certifications: result,
    });
});
// POST /api/certifications (Add new certification)
router.post("/", (req, res) => {
    try {
        const { title, category, duration, fees, badge, image } = req.body;
        if (!title || typeof title !== "string" || title.trim().length < 2) {
            return res.status(400).json({ error: "Certification title is required." });
        }
        const newCert = {
            id: `cert-${Date.now()}`,
            title: title.trim(),
            category: category?.trim() || "Information Technology",
            duration: duration?.trim() || "6 Months",
            fees: fees?.trim() || "₹36,000",
            badge: badge?.trim() || "Integrated with AI",
            image: image?.trim() || "",
            createdAt: new Date().toISOString(),
        };
        const db = getDb();
        db.unshift(newCert);
        saveDb(db);
        return res.status(201).json({
            success: true,
            message: "Featured Certification added successfully",
            certification: newCert,
            certifications: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to add certification" });
    }
});
// PUT /api/certifications/reorder (Reorder certifications)
router.put("/reorder", (req, res) => {
    try {
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({ error: "orderedIds must be an array" });
        }
        const reorderedDb = [];
        for (const id of orderedIds) {
            const cert = getDb().find((c) => c.id === id);
            if (cert)
                reorderedDb.push(cert);
        }
        for (const cert of getDb()) {
            if (!orderedIds.includes(cert.id))
                reorderedDb.push(cert);
        }
        saveDb(reorderedDb);
        return res.json({
            success: true,
            message: "Certifications reordered successfully",
            certifications: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to reorder certifications" });
    }
});
// PUT /api/certifications/:id (Update certification)
router.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, duration, fees, badge, image } = req.body;
        const index = getDb().findIndex((c) => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Certification not found" });
        }
        const current = getDb()[index];
        const updated = {
            ...current,
            title: title !== undefined ? title.trim() : current.title,
            category: category !== undefined ? category.trim() : current.category,
            duration: duration !== undefined ? duration.trim() : current.duration,
            fees: fees !== undefined ? fees.trim() : current.fees,
            badge: badge !== undefined ? badge.trim() : current.badge,
            image: image !== undefined ? image.trim() : current.image,
        };
        const db = getDb();
        db[index] = updated;
        saveDb(db);
        return res.json({
            success: true,
            message: "Certification updated successfully",
            certification: updated,
            certifications: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to update certification" });
    }
});
// DELETE /api/certifications/:id (Remove certification)
router.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const initialLen = getDb().length;
        const db = getDb().filter((c) => c.id !== id);
        saveDb(db);
        if (getDb().length === initialLen) {
            return res.status(404).json({ error: "Certification not found" });
        }
        return res.json({
            success: true,
            message: "Certification removed successfully",
            certifications: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to delete certification" });
    }
});
exports.default = router;
