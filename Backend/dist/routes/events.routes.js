"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/events.json");
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
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const router = (0, express_1.Router)();
// GET /api/events
router.get("/", async (req, res) => {
    try {
        const dbEvents = await prisma_js_1.default.event.findMany({
            orderBy: { date: "desc" },
        });
        return res.json({ success: true, events: dbEvents });
    }
    catch (e) {
        console.warn("Prisma query failed, using in-memory store:", e);
        return res.json({ success: true, events: getDb() });
    }
});
// POST /api/events
router.post("/", async (req, res) => {
    try {
        const { title, date, type, imageUrl, isFeatured, venue, speaker } = req.body;
        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ success: false, error: "Event title is required" });
        }
        if (!date) {
            return res.status(400).json({ success: false, error: "Event date is required" });
        }
        if (!type) {
            return res.status(400).json({ success: false, error: "Event type is required" });
        }
        try {
            // If this new event is featured, un-feature all others first
            if (isFeatured) {
                await prisma_js_1.default.event.updateMany({ data: { isFeatured: false } });
            }
            const dbEvent = await prisma_js_1.default.event.create({
                data: {
                    title: title.trim(),
                    date: new Date(date),
                    type: type.trim(),
                    imageUrl: imageUrl || null,
                    venue: venue || null,
                    speaker: speaker || null,
                    isFeatured: isFeatured || false,
                },
            });
            const allEvents = await prisma_js_1.default.event.findMany({ orderBy: { date: "desc" } });
            return res.status(201).json({ success: true, event: dbEvent, events: allEvents });
        }
        catch (e) {
            // DB failed, use in-memory
            const newEvent = {
                id: `evt-${Date.now()}`,
                title: title.trim(),
                date: new Date(date),
                type: type.trim(),
                imageUrl: imageUrl || null,
                venue: venue || null,
                speaker: speaker || null,
                isFeatured: isFeatured || false,
                createdAt: new Date(),
            };
            const db = getDb();
            db.unshift(newEvent);
            saveDb(db);
            return res.status(201).json({ success: true, event: newEvent, events: getDb() });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to create event" });
    }
});
// PUT /api/events/:id
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, type, imageUrl, isFeatured, venue, speaker } = req.body;
        try {
            // If setting this event as featured, un-feature all others first
            if (isFeatured === true) {
                await prisma_js_1.default.event.updateMany({
                    where: { id: { not: id } },
                    data: { isFeatured: false },
                });
            }
            const dbUpdated = await prisma_js_1.default.event.update({
                where: { id },
                data: {
                    ...(title !== undefined && { title: title.trim() }),
                    ...(date !== undefined && { date: new Date(date) }),
                    ...(type !== undefined && { type: type.trim() }),
                    ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
                    ...(venue !== undefined && { venue: venue || null }),
                    ...(speaker !== undefined && { speaker: speaker || null }),
                    ...(isFeatured !== undefined && { isFeatured }),
                },
            });
            const allEvents = await prisma_js_1.default.event.findMany({ orderBy: { date: "desc" } });
            return res.json({ success: true, event: dbUpdated, events: allEvents });
        }
        catch (e) {
            // fallback: in-memory
            const eventIndex = getDb().findIndex((e) => e.id === id);
            if (eventIndex === -1) {
                return res.status(404).json({ success: false, error: "Event not found" });
            }
            const current = getDb()[eventIndex];
            const updated = {
                ...current,
                ...(title !== undefined && { title: title.trim() }),
                ...(date !== undefined && { date: new Date(date) }),
                ...(type !== undefined && { type: type.trim() }),
                ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
                ...(venue !== undefined && { venue: venue || null }),
                ...(speaker !== undefined && { speaker: speaker || null }),
                ...(isFeatured !== undefined && { isFeatured }),
            };
            getDb()[eventIndex] = updated;
            return res.json({ success: true, event: updated, events: getDb() });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to update event" });
    }
});
// DELETE /api/events/:id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        try {
            await prisma_js_1.default.event.delete({ where: { id } });
            const allEvents = await prisma_js_1.default.event.findMany({ orderBy: { date: "desc" } });
            return res.json({ success: true, message: "Event deleted successfully", events: allEvents });
        }
        catch (e) {
            const eventIndex = getDb().findIndex((e) => e.id === id);
            if (eventIndex === -1) {
                return res.status(404).json({ success: false, error: "Event not found" });
            }
            getDb().splice(eventIndex, 1);
            return res.json({ success: true, message: "Event deleted successfully", events: getDb() });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to delete event" });
    }
});
exports.default = router;
