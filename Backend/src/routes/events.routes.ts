import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import prisma from "../lib/prisma.js";
import { deleteUploadedFile } from "./upload.routes.js";

const router = Router();

// Helper to fetch unified events from both Prisma DB and CmsData
async function getUnifiedEvents(): Promise<any[]> {
  let dbEvents: any[] = [];
  try {
    dbEvents = await prisma.event.findMany({
      orderBy: { date: "desc" },
    });
  } catch (e) {
    console.warn("[events] Prisma query failed:", e);
  }

  let cmsEvents: any[] = [];
  try {
    cmsEvents = await readJsonDbAsync("events.json");
  } catch (e) {
    console.warn("[events] CmsData query failed:", e);
  }

  const map = new Map<string, any>();

  // 1. Add Prisma DB events
  for (const ev of dbEvents) {
    map.set(ev.id, {
      ...ev,
      time: ev.time || null,
      heading: ev.heading || null,
      state: (ev as any).state || null,
      city: (ev as any).city || null,
      photos: Array.isArray(ev.photos) ? ev.photos : [],
      videos: Array.isArray(ev.videos) ? ev.videos : [],
      date: ev.date ? new Date(ev.date).toISOString() : new Date().toISOString(),
      createdAt: ev.createdAt ? new Date(ev.createdAt).toISOString() : new Date().toISOString(),
    });
  }

  // 2. Add or enrich with CmsData events
  for (const ev of cmsEvents) {
    if (!map.has(ev.id)) {
      map.set(ev.id, {
        ...ev,
        time: ev.time || null,
        heading: ev.heading || null,
        state: ev.state || null,
        city: ev.city || null,
        photos: Array.isArray(ev.photos) ? ev.photos : [],
        videos: Array.isArray(ev.videos) ? ev.videos : [],
        date: ev.date ? new Date(ev.date).toISOString() : new Date().toISOString(),
        createdAt: ev.createdAt ? new Date(ev.createdAt).toISOString() : new Date().toISOString(),
      });
    } else {
      const existing = map.get(ev.id);
      if (ev.time && !existing.time) {
        existing.time = ev.time;
      }
      if (ev.heading && !existing.heading) {
        existing.heading = ev.heading;
      }
      if (ev.state && !existing.state) {
        existing.state = ev.state;
      }
      if (ev.city && !existing.city) {
        existing.city = ev.city;
      }
    }
  }

  // 3. Dynamically enrich events with real feedback ratings (zero dummy/hardcoded values)
  try {
    const feedbackForms = (await readJsonDbAsync<any>("event-feedback-forms.json")) || [];
    const feedbackSubmissions = (await readJsonDbAsync<any>("event-feedback-submissions.json")) || [];

    if (Array.isArray(feedbackForms) && feedbackForms.length > 0) {
      const normalize = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");

      for (const ev of map.values()) {
        const evNorm = normalize(ev.title);
        const matchedForm = feedbackForms.find(
          (f: any) =>
            (f.eventId && String(f.eventId) === String(ev.id)) ||
            (f.eventTitle && normalize(f.eventTitle) === evNorm) ||
            (f.slug && normalize(f.slug) === evNorm)
        );

        if (matchedForm) {
          const formSlug = matchedForm.slug || matchedForm.id;
          const formSubs = feedbackSubmissions.filter(
            (s: any) =>
              s.attended === true &&
              (String(s.formId) === String(matchedForm.id) ||
                (formSlug && String(s.formId) === String(formSlug)))
          );

          const ratings = formSubs
            .map((s: any) => Number(s.rating))
            .filter((r: number) => !isNaN(r) && r > 0);

          if (ratings.length > 0) {
            const avg = Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1));
            ev.rating = avg;
            ev.ratingsCount = ratings.length;
            ev.feedbackFormSlug = formSlug;
          }
        }
      }
    }
  } catch (err) {
    console.warn("[events] Failed to enrich with dynamic ratings:", err);
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  );
}

// GET /api/events
router.get("/", async (_req: Request, res: Response) => {
  try {
    const events = await getUnifiedEvents();
    return res.json({ success: true, events });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e?.message || "Failed to fetch events" });
  }
});

// POST /api/events
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, date, time, heading, type, imageUrl, isFeatured, venue, state, city, speaker, shortDescription, description, photos, videos } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, error: "Event title is required" });
    }
    if (!date) {
      return res.status(400).json({ success: false, error: "Event date is required" });
    }
    if (!type) {
      return res.status(400).json({ success: false, error: "Event type is required" });
    }

    let createdEvent: any = null;

    try {
      // If this new event is featured, un-feature all others first
      if (isFeatured) {
        await prisma.event.updateMany({ data: { isFeatured: false } });
      }
      createdEvent = await prisma.event.create({
        data: {
          title: title.trim(),
          date: new Date(date),
          type: type.trim(),
          imageUrl: imageUrl || null,
          venue: venue || null,
          speaker: speaker || null,
          shortDescription: shortDescription || null,
          description: description || null,
          isFeatured: Boolean(isFeatured),
          photos: Array.isArray(photos) ? photos : [],
          videos: Array.isArray(videos) ? videos : [],
        },
      });
      if (createdEvent) {
        createdEvent = {
          ...createdEvent,
          time: time ? time.trim() : null,
          heading: heading ? heading.trim() : null,
          state: state ? state.trim() : null,
          city: city ? city.trim() : null,
        };
      }
    } catch (dbErr) {
      console.warn("[events] Prisma create failed, using CmsData fallback:", dbErr);
      createdEvent = {
        id: `evt-${Date.now()}`,
        title: title.trim(),
        date: new Date(date).toISOString(),
        time: time ? time.trim() : null,
        heading: heading ? heading.trim() : null,
        state: state ? state.trim() : null,
        city: city ? city.trim() : null,
        type: type.trim(),
        imageUrl: imageUrl || null,
        venue: venue || null,
        speaker: speaker || null,
        shortDescription: shortDescription || null,
        description: description || null,
        isFeatured: Boolean(isFeatured),
        photos: Array.isArray(photos) ? photos : [],
        videos: Array.isArray(videos) ? videos : [],
        createdAt: new Date().toISOString(),
      };
    }

    // Persist to CmsData table in Neon PostgreSQL
    try {
      const cmsEvents = await readJsonDbAsync("events.json");
      if (isFeatured) {
        cmsEvents.forEach((ev: any) => { ev.isFeatured = false; });
      }
      cmsEvents.unshift(createdEvent);
      await writeJsonDbAsync("events.json", cmsEvents);
    } catch (cmsErr) {
      console.warn("[events] CmsData persist notice:", cmsErr);
    }

    const allEvents = await getUnifiedEvents();
    return res.status(201).json({ success: true, event: createdEvent, events: allEvents });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to create event" });
  }
});

// PUT /api/events/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, date, time, heading, type, imageUrl, isFeatured, venue, state, city, speaker, shortDescription, description, photos, videos } = req.body;

    let updatedEvent: any = null;

    try {
      // Fetch current event to check if image was replaced
      const existing = await prisma.event.findUnique({ where: { id }, select: { imageUrl: true } });

      if (isFeatured === true) {
        await prisma.event.updateMany({
          where: { id: { not: id } },
          data: { isFeatured: false },
        });
      }

      updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          ...(title !== undefined && { title: title.trim() }),
          ...(date !== undefined && { date: new Date(date) }),
          ...(type !== undefined && { type: type.trim() }),
          ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
          ...(venue !== undefined && { venue: venue || null }),
          ...(state !== undefined && { state: state ? state.trim() : null }),
          ...(city !== undefined && { city: city ? city.trim() : null }),
          ...(speaker !== undefined && { speaker: speaker || null }),
          ...(shortDescription !== undefined && { shortDescription: shortDescription || null }),
          ...(description !== undefined && { description: description || null }),
          ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
          ...(photos !== undefined && { photos: Array.isArray(photos) ? photos : [] }),
          ...(videos !== undefined && { videos: Array.isArray(videos) ? videos : [] }),
        },
      });

      if (updatedEvent) {
        if (time !== undefined) updatedEvent.time = time ? time.trim() : null;
        if (heading !== undefined) updatedEvent.heading = heading ? heading.trim() : null;
        if (state !== undefined) updatedEvent.state = state ? state.trim() : null;
        if (city !== undefined) updatedEvent.city = city ? city.trim() : null;
      }

      if (imageUrl !== undefined && existing?.imageUrl && existing.imageUrl !== imageUrl) {
        deleteUploadedFile(existing.imageUrl);
      }
    } catch (dbErr) {
      console.warn("[events] Prisma update notice:", dbErr);
    }

    // Synchronize CmsData in Neon PostgreSQL
    try {
      const cmsEvents = await readJsonDbAsync("events.json");
      if (isFeatured === true) {
        cmsEvents.forEach((ev: any) => {
          if (ev.id !== id) ev.isFeatured = false;
        });
      }
      const idx = cmsEvents.findIndex((e: any) => e.id === id);
      if (idx !== -1) {
        cmsEvents[idx] = {
          ...cmsEvents[idx],
          ...(title !== undefined && { title: title.trim() }),
          ...(date !== undefined && { date: new Date(date).toISOString() }),
          ...(time !== undefined && { time: time ? time.trim() : null }),
          ...(heading !== undefined && { heading: heading ? heading.trim() : null }),
          ...(type !== undefined && { type: type.trim() }),
          ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
          ...(venue !== undefined && { venue: venue || null }),
          ...(state !== undefined && { state: state ? state.trim() : null }),
          ...(city !== undefined && { city: city ? city.trim() : null }),
          ...(speaker !== undefined && { speaker: speaker || null }),
          ...(shortDescription !== undefined && { shortDescription: shortDescription || null }),
          ...(description !== undefined && { description: description || null }),
          ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
          ...(photos !== undefined && { photos: Array.isArray(photos) ? photos : [] }),
          ...(videos !== undefined && { videos: Array.isArray(videos) ? videos : [] }),
        };
        if (!updatedEvent) updatedEvent = cmsEvents[idx];
        await writeJsonDbAsync("events.json", cmsEvents);
      }
    } catch (cmsErr) {
      console.warn("[events] CmsData update notice:", cmsErr);
    }

    const allEvents = await getUnifiedEvents();
    return res.json({ success: true, event: updatedEvent, events: allEvents });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to update event" });
  }
});

// DELETE /api/events/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Delete from Prisma DB
    try {
      const existing = await prisma.event.findUnique({ where: { id }, select: { imageUrl: true } });
      await prisma.event.deleteMany({ where: { id } });
      if (existing?.imageUrl) deleteUploadedFile(existing.imageUrl);
    } catch (dbErr) {
      console.warn("[events] Prisma delete notice:", dbErr);
    }

    // 2. Delete from CmsData in Neon PostgreSQL
    try {
      const cmsEvents = await readJsonDbAsync("events.json");
      const filtered = cmsEvents.filter((e: any) => e.id !== id);
      if (filtered.length !== cmsEvents.length) {
        await writeJsonDbAsync("events.json", filtered);
      }
    } catch (cmsErr) {
      console.warn("[events] CmsData delete notice:", cmsErr);
    }

    const allEvents = await getUnifiedEvents();
    return res.json({ success: true, message: "Event deleted successfully", events: allEvents });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete event" });
  }
});

export default router;
