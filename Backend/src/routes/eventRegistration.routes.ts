import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

// POST /api/event-registrations
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, eventId, college, course, graduationYear } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required." });
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        name,
        email,
        phone,
        college,
        course,
        graduationYear,
        eventId: eventId || null,
      },
    });

    return res.status(201).json({ success: true, registration });
  } catch (error) {
    console.error("[POST /api/event-registrations] Error:", error);
    return res.status(500).json({ error: "Failed to submit event registration." });
  }
});

// GET /api/event-registrations
router.get("/", async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      orderBy: { createdAt: "desc" },
      include: { event: true },
    });
    return res.status(200).json({ success: true, registrations });
  } catch (error) {
    console.error("[GET /api/event-registrations] Error:", error);
    return res.status(500).json({ error: "Failed to fetch registrations." });
  }
});

export default router;
