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

// GET /api/event-registrations
export async function GET() {
  try {
    let registrations: any[] = [];
    if (process.env.DATABASE_URL) {
      try {
        const dbRegs = await prisma.eventRegistration.findMany({
          include: { event: true },
          orderBy: { createdAt: "desc" },
        });
        registrations = dbRegs || [];
      } catch (dbErr) {
        console.warn("[GET /api/event-registrations] DB error:", dbErr);
      }
    }

    if (registrations.length === 0) {
      try {
        const record = await prisma.cmsData.findUnique({
          where: { key: "event-registrations.json" },
        });
        if (record && Array.isArray(record.data)) {
          registrations = record.data as any[];
        }
      } catch (cmsErr) {
        console.warn("[GET /api/event-registrations] CMS error:", cmsErr);
      }
    }

    return NextResponse.json({ success: true, registrations }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch event registrations" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/event-registrations
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json(
        { error: "Registration ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Delete from Prisma
    if (process.env.DATABASE_URL) {
      try {
        await prisma.eventRegistration.deleteMany({
          where: { OR: [{ id }, { id: String(id) }] },
        });
      } catch (dbErr) {
        console.warn("[DELETE /api/event-registrations] DB error:", dbErr);
      }

      // 2. Delete from CmsData
      try {
        const record = await prisma.cmsData.findUnique({
          where: { key: "event-registrations.json" },
        });
        if (record && Array.isArray(record.data)) {
          const list = record.data as any[];
          const filtered = list.filter((r) => r.id !== id && r._id !== id);
          if (filtered.length !== list.length) {
            await prisma.cmsData.update({
              where: { key: "event-registrations.json" },
              data: { data: filtered as any },
            });
          }
        }
      } catch (cmsErr) {
        console.warn("[DELETE /api/event-registrations] CMS error:", cmsErr);
      }
    }

    // 3. Forward delete to backend
    try {
      const backendBase = getApiBase();
      await fetch(`${backendBase}/event-registrations/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (backendErr) {
      console.warn("[DELETE /api/event-registrations] Backend error:", backendErr);
    }

    return NextResponse.json(
      { success: true, message: "Registration deleted successfully" },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[DELETE /api/event-registrations] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete registration" },
      { status: 500, headers: corsHeaders }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, eventId, college, education, course, graduationYear, city, profession } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and mobile number are required." },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanPhone = (phone || "").replace(/\D/g, "");
    const collegeValue = (profession || college || education || "").trim();

    // 1. Forward directly to Central Backend API
    try {
      const backendBase = getApiBase();
      const res = await fetch(`${backendBase}/event-registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, { status: 201, headers: corsHeaders });
      }
    } catch (backendErr) {
      console.warn("[EVENT REG API] Backend sync notice:", backendErr);
    }

    let registration: any = {
      id: `reg-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      city: city?.trim() || "",
      college: collegeValue || null,
      course: course || null,
      graduationYear: graduationYear || null,
      eventId: eventId || null,
      createdAt: new Date().toISOString(),
    };

    // 2. Fallback to direct DB query if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        registration = await prisma.eventRegistration.create({
          data: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: cleanPhone,
            college: collegeValue || null,
            course: course || null,
            graduationYear: graduationYear || null,
            eventId: eventId || null,
          },
          include: { event: true },
        });

        const existingRecord = await prisma.cmsData.findUnique({
          where: { key: "event-registrations.json" },
        });
        const currentList: any[] = Array.isArray(existingRecord?.data)
          ? (existingRecord.data as any[])
          : [];
        const updatedList = [registration, ...currentList.filter((r) => r.id !== registration.id)];

        await prisma.cmsData.upsert({
          where: { key: "event-registrations.json" },
          update: { data: updatedList as any },
          create: { key: "event-registrations.json", data: updatedList as any },
        });

        // Sync to central API store
        try {
          const backendBase = getApiBase();
          await fetch(`${backendBase}/cms/event-registrations`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: updatedList }),
          });
        } catch {}
      } catch (dbErr) {
        console.warn("[EVENT REG API] DB fallback notice:", dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "You have successfully registered for this event!",
        registration,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[EVENT REG API ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to register for the event." },
      { status: 500, headers: corsHeaders }
    );
  }
}
