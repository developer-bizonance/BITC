"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/mentors.json");
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
// GET /api/mentors
router.get("/", (_req, res) => {
    return res.json({
        success: true,
        mentors: getDb(),
    });
});
// POST /api/mentors (Add new mentor)
router.post("/", (req, res) => {
    try {
        const { name, role, company, exp, area, skills, img, bio, linkedin, thought } = req.body;
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return res.status(400).json({ error: "Mentor name is required." });
        }
        const parsedSkills = Array.isArray(skills)
            ? skills
            : typeof skills === "string"
                ? skills.split(",").map((s) => s.trim()).filter(Boolean)
                : ["Industry Professional"];
        const newMentor = {
            id: `mentor-${Date.now()}`,
            name: name.trim(),
            role: role?.trim() || "Industry Expert & Trainer",
            company: company?.trim() || "BiZONANCE Partner",
            exp: exp?.trim() || "5+ Years",
            area: area?.trim() || "Technology",
            skills: parsedSkills.length > 0 ? parsedSkills : ["Software Architecture"],
            img: img?.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
            bio: bio?.trim() || "",
            linkedin: linkedin?.trim() || "",
            thought: thought?.trim() || "",
            createdAt: new Date().toISOString(),
        };
        const db = getDb();
        db.unshift(newMentor);
        saveDb(db);
        return res.status(201).json({
            success: true,
            message: "Mentor added successfully",
            mentor: newMentor,
            mentors: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to add mentor" });
    }
});
// PUT /api/mentors/reorder (Reorder mentors)
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
            message: "Mentors reordered successfully",
            mentors: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to reorder mentors" });
    }
});
// PUT /api/mentors/:id (Update mentor)
router.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, company, exp, area, skills, img, bio, linkedin, thought } = req.body;
        const index = getDb().findIndex((m) => m.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Mentor not found" });
        }
        const current = getDb()[index];
        const parsedSkills = skills !== undefined
            ? Array.isArray(skills)
                ? skills
                : typeof skills === "string"
                    ? skills.split(",").map((s) => s.trim()).filter(Boolean)
                    : current.skills
            : current.skills;
        const updated = {
            ...current,
            name: name !== undefined ? name.trim() : current.name,
            role: role !== undefined ? role.trim() : current.role,
            company: company !== undefined ? company.trim() : current.company,
            exp: exp !== undefined ? exp.trim() : current.exp,
            area: area !== undefined ? area.trim() : current.area,
            skills: parsedSkills,
            img: img !== undefined ? img.trim() : current.img,
            bio: bio !== undefined ? bio.trim() : current.bio,
            linkedin: linkedin !== undefined ? linkedin.trim() : current.linkedin,
            thought: thought !== undefined ? thought.trim() : current.thought,
        };
        const db = getDb();
        db[index] = updated;
        saveDb(db);
        return res.json({
            success: true,
            message: "Mentor updated successfully",
            mentor: updated,
            mentors: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to update mentor" });
    }
});
// DELETE /api/mentors/:id (Remove mentor)
router.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const initialLen = getDb().length;
        const db = getDb().filter((m) => m.id !== id);
        saveDb(db);
        if (getDb().length === initialLen) {
            return res.status(404).json({ error: "Mentor not found" });
        }
        return res.json({
            success: true,
            message: "Mentor removed successfully",
            mentors: getDb(),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || "Failed to delete mentor" });
    }
});
exports.default = router;
