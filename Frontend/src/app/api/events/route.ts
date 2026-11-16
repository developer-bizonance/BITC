import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/events
export async function GET() {
  try {
    const map = new Map<string, any>();

    // 1. Prisma Event table
    try {
      const dbEvents = await prisma.event.findMany({
        orderBy: { date: "desc" },
      });
      for (const ev of dbEvents) {
        if (ev && ev.title) {
          map.set(String(ev.id || ev.title), {
            id: String(ev.id),
            title: ev.title,
            type: ev.type || "Event",
            date: ev.date ? new Date(ev.date).toISOString() : new Date().toISOString(),
            time: (ev as any).time || null,
            venue: ev.venue || null,
            state: (ev as any).state || null,
            city: (ev as any).city || null,
            speaker: ev.speaker || null,
            heading: (ev as any).heading || null,
            imageUrl: ev.imageUrl || null,
            description: ev.description || "",
            shortDescription: ev.description || "",
            photos: Array.isArray((ev as any).photos) ? (ev as any).photos : [],
            videos: Array.isArray((ev as any).videos) ? (ev as any).videos : [],
            isFeatured: Boolean((ev as any).isFeatured),
          });
        }
      }
    } catch (e) {
      console.warn("[/api/events] DB query notice:", e);
    }

    // 2. cmsData events.json
    try {
      const rec = await prisma.cmsData.findUnique({
        where: { key: "events.json" },
      });
      if (rec && Array.isArray(rec.data)) {
        for (const ev of rec.data as any[]) {
          if (ev && ev.title) {
            const key = String(ev.id || ev.title);
            if (!map.has(key)) {
              map.set(key, {
                id: String(ev.id || ""),
                title: ev.title,
                type: ev.type || "Event",
                date: ev.date ? new Date(ev.date).toISOString() : new Date().toISOString(),
                time: ev.time || null,
                venue: ev.venue || null,
                state: ev.state || null,
                city: ev.city || null,
                speaker: ev.speaker || null,
                heading: ev.heading || null,
                imageUrl: ev.imageUrl || null,
                description: ev.description || "",
                shortDescription: ev.shortDescription || ev.description || "",
                photos: Array.isArray(ev.photos) ? ev.photos : [],
                videos: Array.isArray(ev.videos) ? ev.videos : [],
                isFeatured: Boolean(ev.isFeatured),
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn("[/api/events] cmsData notice:", e);
    }

    const events = Array.from(map.values()).sort(
      (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    );

    return NextResponse.json({ success: true, events }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[GET /api/events] error:", error);
    return NextResponse.json({ success: true, events: [] }, { headers: corsHeaders });
  }
}

