import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/events
router.get("/", async (req: Request, res: Response) => {
  try {
    const dbEvents = await prisma.event.findMany({
      orderBy: { date: "desc" },
    });
    return res.json({ success: true, events: dbEvents });
  } catch (e) {
    console.warn("Prisma query failed, using in-memory store:", e);
    return res.json({ success: true, events: readJsonDb("events.json") });
  }
});

// POST /api/events
router.post("/", async (req: Request, res: Response) => {
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
        await prisma.event.updateMany({ data: { isFeatured: false } });
      }
      const dbEvent = await prisma.event.create({
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
      const allEvents = await prisma.event.findMany({ orderBy: { date: "desc" } });
      return res.status(201).json({ success: true, event: dbEvent, events: allEvents });
    } catch (e) {
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
      const db = readJsonDb("events.json"); db.unshift(newEvent); writeJsonDb("events.json", db);
      return res.status(201).json({ success: true, event: newEvent, events: readJsonDb("events.json") });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to create event" });
  }
});

// PUT /api/events/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, date, type, imageUrl, isFeatured, venue, speaker } = req.body;

    try {
      // If setting this event as featured, un-feature all others first
      if (isFeatured === true) {
        await prisma.event.updateMany({
          where: { id: { not: id } },
          data: { isFeatured: false },
        });
      }
      const dbUpdated = await prisma.event.update({
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
      const allEvents = await prisma.event.findMany({ orderBy: { date: "desc" } });
      return res.json({ success: true, event: dbUpdated, events: allEvents });
    } catch (e) {
      // fallback: in-memory
      const eventIndex = readJsonDb("events.json").findIndex((e) => e.id === id);
      if (eventIndex === -1) {
        return res.status(404).json({ success: false, error: "Event not found" });
      }
      const current = readJsonDb("events.json")[eventIndex];
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
      readJsonDb("events.json")[eventIndex] = updated;
      return res.json({ success: true, event: updated, events: readJsonDb("events.json") });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to update event" });
  }
});

// DELETE /api/events/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      await prisma.event.delete({ where: { id } });
      const allEvents = await prisma.event.findMany({ orderBy: { date: "desc" } });
      return res.json({ success: true, message: "Event deleted successfully", events: allEvents });
    } catch (e) {
      const eventIndex = readJsonDb("events.json").findIndex((e) => e.id === id);
      if (eventIndex === -1) {
        return res.status(404).json({ success: false, error: "Event not found" });
      }
      readJsonDb("events.json").splice(eventIndex, 1);
      return res.json({ success: true, message: "Event deleted successfully", events: readJsonDb("events.json") });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete event" });
  }
});

export default router;
