"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/alumni.json");
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
// GET /api/alumni
router.get("/", (_req, res) => {
    return res.json({
        success: true,
        alumni: getDb(),
    });
});
// POST /api/alumni (Add new alumni profile)
router.post("/", (req, res) => {
    try {
        const { name, role, company, photo, batch, linkedin, certification } = req.body;
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return res.status(400).json({ error: "Alumni name is required." });
        }
        const newAlumni = {
            id: `alumni-${Date.now()}`,
            name: name.trim(),
            role: role?.trim() || "Software Engineer",
            company: company?.trim() || "Tech Leader",
            photo: photo?.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
            batch: batch?.trim() || "24-25",
            linkedin: linkedin?.trim() || "",
            certification: certification?.trim() || "",
            createdAt: new Date().toISOString(),
        };
        const db = getDb();
        db.unshift(newAlumni);
        saveDb(db);
        return res.status(201).json({
            success: true,
            message: "Alumni profile added successfully",
            alumni: getDb(),
            newAlumni,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to add alumni" });
    }
});
// PUT /api/alumni/reorder (Reorder alumni)
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
            message: "Alumni reordered successfully",
            alumni: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to reorder alumni" });
    }
});
// PUT /api/alumni/:id (Update alumni profile)
router.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, company, photo, batch, linkedin, certification } = req.body;
        const index = getDb().findIndex((a) => a.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Alumni profile not found" });
        }
        const current = getDb()[index];
        const updated = {
            ...current,
            name: name !== undefined ? name.trim() : current.name,
            role: role !== undefined ? role.trim() : current.role,
            company: company !== undefined ? company.trim() : current.company,
            photo: photo !== undefined ? photo.trim() : current.photo,
            batch: batch !== undefined ? batch.trim() : current.batch,
            linkedin: linkedin !== undefined ? linkedin.trim() : current.linkedin,
            certification: certification !== undefined ? certification.trim() : current.certification,
        };
        const db = getDb();
        db[index] = updated;
        saveDb(db);
        return res.json({
            success: true,
            message: "Alumni profile updated successfully",
            alumni: getDb(),
            updatedAlumni: updated,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to update alumni profile" });
    }
});
// DELETE /api/alumni/:id (Remove alumni profile)
router.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const initialLen = getDb().length;
        const db = getDb().filter((a) => a.id !== id);
        saveDb(db);
        if (getDb().length === initialLen) {
            return res.status(404).json({ error: "Alumni profile not found" });
        }
        return res.json({
            success: true,
            message: "Alumni profile removed successfully",
            alumni: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to delete alumni" });
    }
});
exports.default = router;
