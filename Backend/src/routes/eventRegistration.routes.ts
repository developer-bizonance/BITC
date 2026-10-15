import express from "express";
import prisma from "../lib/prisma.js";
import { readJsonDb, writeJsonDb, readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

const router = express.Router();

// POST /api/event-registrations
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, eventId, college, education, course, graduationYear, city } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required." });
    }

    const collegeValue = (college || education || "").trim();

    let registration: any = null;
    try {
      registration = await prisma.eventRegistration.create({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          college: collegeValue || null,
          course: course || null,
          graduationYear: graduationYear || null,
          eventId: eventId || null,
        },
        include: { event: true },
      });
    } catch (dbError) {
      console.warn("Prisma failed for event registration, falling back to JSON:", dbError);
    }

    if (!registration) {
      registration = {
        id: `reg-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city || "",
        college: collegeValue,
        education: collegeValue,
        course: course || "",
        graduationYear: graduationYear || "",
        eventId: eventId || null,
        createdAt: new Date().toISOString(),
      };
    }

    // Persist to JSON / CmsData store as well
    try {
      const cmsRegs = await readJsonDbAsync<any>("event-registrations.json");
      cmsRegs.unshift(registration);
      await writeJsonDbAsync("event-registrations.json", cmsRegs);
    } catch {
      try {
        const db = readJsonDb<any>("event-registrations.json");
        db.unshift(registration);
        writeJsonDb("event-registrations.json", db);
      } catch {}
    }

    return res.status(201).json({ success: true, registration });
  } catch (error) {
    console.error("[POST /api/event-registrations] Error:", error);
    return res.status(500).json({ error: "Failed to submit event registration." });
  }
});

// GET /api/event-registrations
router.get("/", async (req, res) => {
  try {
    let registrations: any[] = [];
    try {
      registrations = await prisma.eventRegistration.findMany({
        orderBy: { createdAt: "desc" },
        include: { event: true },
      });
    } catch (dbError) {
      console.warn("Prisma failed for event registration GET, falling back to JSON:", dbError);
    }

    let cmsRegs: any[] = [];
    try {
      cmsRegs = await readJsonDbAsync<any>("event-registrations.json");
    } catch {
      cmsRegs = readJsonDb<any>("event-registrations.json");
    }

    const map = new Map<string, any>();
    for (const reg of registrations) {
      map.set(reg.id, reg);
    }
    for (const reg of cmsRegs) {
      if (map.has(reg.id)) {
        const existing = map.get(reg.id);
        if (!existing.college && (reg.college || reg.education)) {
          existing.college = reg.college || reg.education;
        }
      } else {
        map.set(reg.id, reg);
      }
    }

    const unified = Array.from(map.values()).sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return res.status(200).json({ success: true, registrations: unified });
  } catch (error) {
    console.error("[GET /api/event-registrations] Error:", error);
    return res.status(500).json({ error: "Failed to fetch registrations." });
  }
});

export default router;
