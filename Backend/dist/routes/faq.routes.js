"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/faq.json");
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
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    return res.json({ success: true, items: getDb() });
});
router.post("/", (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer)
        return res.status(400).json({ error: "Question and Answer are required" });
    const newItem = {
        id: `faq-${Date.now()}`,
        question,
        answer,
        createdAt: new Date()
    };
    const db = getDb();
    db.unshift(newItem);
    saveDb(db);
    return res.json({ success: true, item: newItem, items: getDb() });
});
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    const idx = getDb().findIndex(i => i.id === id);
    if (idx === -1)
        return res.status(404).json({ error: "Not found" });
    getDb()[idx] = { ...getDb()[idx], question, answer };
    return res.json({ success: true, item: getDb()[idx], items: getDb() });
});
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const db = getDb().filter(i => i.id !== id);
    saveDb(db);
    return res.json({ success: true, items: getDb() });
});
exports.default = router;
