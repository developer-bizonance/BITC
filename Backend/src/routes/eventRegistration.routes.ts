import express from "express";
import prisma from "../lib/prisma.js";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";

const router = express.Router();

// POST /api/event-registrations
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, eventId, college, education, course, graduationYear, city, profession, area, address } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required." });
    }

    const collegeValue = (profession || college || education || "").trim();
    const cleanArea = (area || address || "").trim();
    const cleanCity = cleanArea && city && !city.includes(cleanArea) ? `${city} (${cleanArea})` : (city || cleanArea || "");

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
      console.warn("[eventRegistration] Prisma create failed, falling back to CmsData:", dbError);
    }

    if (!registration) {
      registration = {
        id: `reg-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: cleanCity,
        college: collegeValue,
        education: collegeValue,
        course: course || "",
        graduationYear: graduationYear || "",
        eventId: eventId || null,
        createdAt: new Date().toISOString(),
      };
    }

    // Persist to Neon PostgreSQL CmsData table
    try {
      const cmsRegs = await readJsonDbAsync<any>("event-registrations.json");
      cmsRegs.unshift(registration);
      await writeJsonDbAsync("event-registrations.json", cmsRegs);
    } catch (cmsErr) {
      console.warn("[eventRegistration] CmsData write notice:", cmsErr);
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
      console.warn("[eventRegistration] Prisma findMany failed, falling back to CmsData:", dbError);
    }

    let cmsRegs: any[] = [];
    try {
      cmsRegs = await readJsonDbAsync<any>("event-registrations.json");
    } catch (cmsErr) {
      console.warn("[eventRegistration] CmsData read notice:", cmsErr);
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

// DELETE /api/event-registrations/:id? or ?id=...
const handleDeleteRegistration = async (req: express.Request, res: express.Response) => {
  try {
    const id = (req.params.id || req.query.id || req.body?.id) as string;

    if (!id) {
      return res.status(400).json({ error: "Registration ID is required." });
    }

    // 1. Delete from Prisma
    try {
      await prisma.eventRegistration.deleteMany({
        where: { OR: [{ id }, { id: String(id) }] },
      });
    } catch (dbErr) {
      console.warn("[eventRegistration] Prisma delete notice:", dbErr);
    }

    // 2. Delete from CmsData
    try {
      const cmsRegs = await readJsonDbAsync<any>("event-registrations.json");
      const filtered = cmsRegs.filter((r) => r.id !== id && r._id !== id);
      if (filtered.length !== cmsRegs.length) {
        await writeJsonDbAsync("event-registrations.json", filtered);
      }
    } catch (cmsErr) {
      console.warn("[eventRegistration] CmsData delete notice:", cmsErr);
    }

    return res.status(200).json({ success: true, message: "Registration deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/event-registrations] Error:", error);
    return res.status(500).json({ error: "Failed to delete registration." });
  }
};

router.delete("/:id", handleDeleteRegistration);
router.delete("/", handleDeleteRegistration);

export default router;
