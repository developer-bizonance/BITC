import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET /api/event-subscribers
export async function GET() {
  try {
    let subscribers: any[] = [];
    try {
      if ((prisma as any).eventSubscriber?.findMany) {
        subscribers = await (prisma as any).eventSubscriber.findMany({
          orderBy: { createdAt: "desc" },
        });
      }
    } catch (err) {
      console.warn("[NEXT API /event-subscribers] prisma findMany notice:", err);
    }

    if (subscribers.length === 0) {
      try {
        const rows = await (prisma as any).$queryRawUnsafe(`
          SELECT id, name, email, phone, city, college, "createdAt"
          FROM "EventSubscriber"
          ORDER BY "createdAt" DESC
        `);
        subscribers = rows || [];
      } catch (sqlErr) {
        console.warn("[NEXT API /event-subscribers] SQL query notice:", sqlErr);
      }
    }

    if (subscribers.length === 0) {
      try {
        const record = await prisma.cmsData.findUnique({
          where: { key: "event-subscribers.json" },
        });
        if (record && Array.isArray(record.data)) {
          subscribers = record.data as any[];
        }
      } catch {}
    }

    return NextResponse.json({ success: true, subscribers }, { headers: corsHeaders });
  } catch (error) {
    console.error("[NEXT API /event-subscribers GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event subscribers." },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/event-subscribers
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, city, college, profession, area, address } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400, headers: corsHeaders }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || "").trim();
    const cleanPhone = (phone || "").replace(/[^0-9]/g, "").slice(0, 10);
    const cleanArea = (area || address || "").trim();
    let cleanCity = (city || "").trim();
    if (cleanArea && !cleanCity.includes(cleanArea)) {
      cleanCity = cleanCity ? `${cleanCity} (${cleanArea})` : cleanArea;
    }
    const cleanProfession = (profession || college || "").trim();

    let subscriber: any = null;

    try {
      if ((prisma as any).eventSubscriber?.create) {
        subscriber = await (prisma as any).eventSubscriber.create({
          data: {
            name: cleanName || null,
            email: cleanEmail,
            phone: cleanPhone || null,
            city: cleanCity || null,
            college: cleanProfession || null,
          },
        });
        if (subscriber) {
          subscriber.profession = cleanProfession;
        }
      }
    } catch (createErr) {
      console.warn("[NEXT API /event-subscribers] prisma create notice:", createErr);
    }

    if (!subscriber) {
      const id = crypto.randomUUID();
      const now = new Date();
      try {
        await (prisma as any).$executeRawUnsafe(
          `INSERT INTO "EventSubscriber" ("id", "name", "email", "phone", "city", "college", "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          id,
          cleanName || null,
          cleanEmail,
          cleanPhone || null,
          cleanCity || null,
          cleanProfession || null,
          now
        );
      } catch (sqlErr) {
        console.warn("[NEXT API /event-subscribers] SQL insert notice (DB quota/error):", sqlErr);
      }
      subscriber = {
        id,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        city: cleanCity,
        college: cleanProfession,
        profession: cleanProfession,
        createdAt: now.toISOString(),
      };
    }

    // Sync to event-subscribers.json in cmsData & central API
    try {
      try {
        const record = await prisma.cmsData.findUnique({
          where: { key: "event-subscribers.json" },
        });
        const list = Array.isArray(record?.data) ? (record!.data as any[]) : [];
        list.unshift(subscriber);
        await prisma.cmsData.upsert({
          where: { key: "event-subscribers.json" },
          update: { data: list as any },
          create: { key: "event-subscribers.json", data: list as any },
        });
      } catch (cmsDbErr) {
        console.warn("[NEXT API /event-subscribers] cmsData DB write notice:", cmsDbErr);
      }

      const apiBase = getApiBase();
      await fetch(`${apiBase}/cms/event-subscribers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [subscriber] }),
      }).catch(() => {});
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Subscribed successfully to event updates.",
        subscriber,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("[NEXT API /event-subscribers POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to save subscriber record." },
      { status: 500, headers: corsHeaders }
    );
  }
}
