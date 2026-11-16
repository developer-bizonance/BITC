import express from "express";
import crypto from "crypto";
import prisma from "../lib/prisma.js";

const router = express.Router();

// Helper to get all subscribers directly from database with CMS fallback
async function getAllSubscribers() {
  try {
    if ((prisma as any).eventSubscriber?.findMany) {
      return await (prisma as any).eventSubscriber.findMany({
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (err) {
    console.warn("[eventSubscriber] prisma.eventSubscriber.findMany notice:", err);
  }

  // Fallback to direct PostgreSQL query on EventSubscriber table
  try {
    const rows = await (prisma as any).$queryRawUnsafe(`
      SELECT id, name, email, phone, city, college, "createdAt"
      FROM "EventSubscriber"
      ORDER BY "createdAt" DESC
    `);
    if (rows && rows.length > 0) return rows;
  } catch (rawErr) {
    console.warn("[eventSubscriber] Direct SQL query notice:", rawErr);
  }

  // Fallback to CMS data store / memory cache
  try {
    const { readJsonDbAsync } = await import("../dataStore.js");
    const cmsSubs = await readJsonDbAsync("event-subscribers.json");
    if (Array.isArray(cmsSubs) && cmsSubs.length > 0) {
      return cmsSubs;
    }
  } catch (cmsErr) {
    console.warn("[eventSubscriber] readJsonDbAsync fallback notice:", cmsErr);
  }

  return [];
}

// POST /api/event-subscribers
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, city, college, profession, area, address } = req.body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || "").trim();
    const cleanPhone = (phone || "").replace(/[^0-9]/g, "").slice(0, 10);
    const cleanArea = (area || address || "").trim();
    let cleanCity = (city || "").trim();
    if (cleanArea && !cleanCity.includes(cleanArea)) {
      cleanCity = cleanCity ? `${cleanCity} (${cleanArea})` : cleanArea;
    }
    const cleanCollege = (profession || college || "").trim();
    const id = crypto.randomUUID();
    const now = new Date();

    let subscriber: any = null;

    // 1. Try Prisma client create
    try {
      if ((prisma as any).eventSubscriber?.create) {
        subscriber = await (prisma as any).eventSubscriber.create({
          data: {
            name: cleanName || null,
            email: cleanEmail,
            phone: cleanPhone || null,
            city: cleanCity || null,
            college: cleanCollege || null,
          },
        });
        if (subscriber) {
          subscriber.profession = cleanCollege;
        }
      }
    } catch (createErr) {
      console.warn("[eventSubscriber] prisma.eventSubscriber.create notice:", createErr);
    }

    // 2. Direct PostgreSQL INSERT if client method not ready
    if (!subscriber) {
      try {
        await (prisma as any).$executeRawUnsafe(
          `INSERT INTO "EventSubscriber" ("id", "name", "email", "phone", "city", "college", "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          id,
          cleanName || null,
          cleanEmail,
          cleanPhone || null,
          cleanCity || null,
          cleanCollege || null,
          now
        );
        subscriber = {
          id,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          city: cleanCity,
          college: cleanCollege,
          profession: cleanCollege,
          createdAt: now.toISOString(),
        };
      } catch (sqlErr) {
        console.warn("[eventSubscriber] SQL insert notice (DB quota/error):", sqlErr);
      }
    }

    // 3. Resilient fallback: ensure subscriber object exists even if DB write was rejected
    if (!subscriber) {
      subscriber = {
        id,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        city: cleanCity,
        college: cleanCollege,
        profession: cleanCollege,
        createdAt: now.toISOString(),
      };
    }

    // 4. Always sync to event-subscribers.json in CMS / cache
    try {
      const { readJsonDbAsync, writeJsonDbAsync } = await import("../dataStore.js");
      const cmsSubs = await readJsonDbAsync("event-subscribers.json");
      const list = Array.isArray(cmsSubs) ? cmsSubs : [];
      list.unshift(subscriber);
      await writeJsonDbAsync("event-subscribers.json", list);
    } catch (cmsErr) {
      console.warn("[eventSubscriber] CMS fallback save notice:", cmsErr);
    }

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully to event updates.",
      subscriber,
    });
  } catch (error) {
    console.error("[POST /api/event-subscribers] Error:", error);
    return res.status(500).json({ error: "Failed to save subscriber record." });
  }
});

// GET /api/event-subscribers
router.get("/", async (req, res) => {
  try {
    let subscribers = await getAllSubscribers();

    // Auto-seed/migrate existing general update registrations from EventRegistration where eventId IS NULL
    if (subscribers.length === 0) {
      try {
        const generalRegs = await (prisma as any).eventRegistration.findMany({
          where: { eventId: null },
          orderBy: { createdAt: "desc" },
        });

        if (generalRegs && generalRegs.length > 0) {
          for (const reg of generalRegs) {
            try {
              await (prisma as any).$executeRawUnsafe(
                `INSERT INTO "EventSubscriber" ("id", "name", "email", "phone", "city", "college", "createdAt")
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT ("id") DO NOTHING`,
                reg.id,
                reg.name || null,
                reg.email,
                reg.phone || null,
                reg.city || null,
                reg.college || null,
                new Date(reg.createdAt)
              );
            } catch (seedErr) {
              console.warn("[eventSubscriber] Seed entry notice:", seedErr);
            }
          }
          subscribers = await getAllSubscribers();
        }
      } catch (migrationErr) {
        console.warn("[eventSubscriber] Auto-migration check notice:", migrationErr);
      }
    }

    return res.status(200).json({
      success: true,
      subscribers,
    });
  } catch (error) {
    console.error("[GET /api/event-subscribers] Error:", error);
    return res.status(500).json({ error: "Failed to fetch event subscribers." });
  }
});

// DELETE /api/event-subscribers/:id
router.delete("/:id?", async (req, res) => {
  try {
    const id = req.params.id || req.body?.id || req.query?.id;
    if (!id) {
      return res.status(400).json({ error: "Subscriber ID is required." });
    }

    try {
      if ((prisma as any).eventSubscriber?.deleteMany) {
        await (prisma as any).eventSubscriber.deleteMany({
          where: { OR: [{ id }, { id: String(id) }] },
        });
      } else {
        await (prisma as any).$executeRawUnsafe(
          `DELETE FROM "EventSubscriber" WHERE "id" = $1`,
          id
        );
      }
    } catch (delErr) {
      try {
        await (prisma as any).$executeRawUnsafe(
          `DELETE FROM "EventSubscriber" WHERE "id" = $1`,
          id
        );
      } catch (sqlErr) {}
    }

    // Also delete from EventRegistration table
    try {
      await (prisma as any).eventRegistration.deleteMany({
        where: { OR: [{ id }, { id: String(id) }] },
      });
    } catch (regErr) {}

    // Also remove from CmsData backup
    try {
      const cmsRecord = await prisma.cmsData.findUnique({
        where: { key: "event-subscribers.json" },
      });
      if (cmsRecord && Array.isArray(cmsRecord.data)) {
        const filtered = (cmsRecord.data as any[]).filter((s) => s.id !== id && s._id !== id);
        await prisma.cmsData.upsert({
          where: { key: "event-subscribers.json" },
          update: { data: filtered as any },
          create: { key: "event-subscribers.json", data: filtered as any },
        });
      }
    } catch (cmsErr) {}

    return res.status(200).json({
      success: true,
      message: "Subscriber removed successfully.",
    });
  } catch (error) {
    console.error("[DELETE /api/event-subscribers/:id] Error:", error);
    return res.status(500).json({ error: "Failed to delete subscriber record." });
  }
});

export default router;
