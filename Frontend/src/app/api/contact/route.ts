import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET /api/contact
export async function GET() {
  try {
    let inquiries: any[] = [];
    if (process.env.DATABASE_URL) {
      try {
        const dbInqs = await prisma.inquiry.findMany({
          orderBy: { createdAt: "desc" },
        });
        inquiries = dbInqs || [];
      } catch (dbErr) {
        console.warn("[GET /api/contact] DB error:", dbErr);
      }
    }

    if (inquiries.length === 0) {
      try {
        const record = await prisma.cmsData.findUnique({
          where: { key: "contact.json" },
        });
        if (record && Array.isArray(record.data)) {
          inquiries = record.data as any[];
        }
      } catch (cmsErr) {
        console.warn("[GET /api/contact] CMS error:", cmsErr);
      }
    }

    return NextResponse.json({ success: true, inquiries }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[GET /api/contact] error:", error);
    return NextResponse.json({ success: true, inquiries: [] }, { headers: corsHeaders });
  }
}

// POST /api/contact
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, city, enquiryType, message, name } = body;
    const finalName = (fullName || name || "").trim();

    // 1. Server-side Input Validation
    if (!finalName || finalName.length < 2) {
      return NextResponse.json(
        { error: "Full Name must be at least 2 characters long." },
        { status: 400, headers: corsHeaders }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid Email Id (e.g. name@gmail.com)." },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
    if (!phone || typeof phone !== "string" || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!city || typeof city !== "string" || city.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid city name." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!enquiryType || typeof enquiryType !== "string" || !enquiryType.trim()) {
      return NextResponse.json(
        { error: "Please select an enquiry category." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Message content must be at least 5 characters long." },
        { status: 400, headers: corsHeaders }
      );
    }

    const selectedEnquiry = enquiryType?.trim() || "General Inquiry";
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // 2. Delegate to Central Backend API
    try {
      const backendBase = getApiBase();
      const contactEndpoint = backendBase.endsWith("/contact")
        ? backendBase
        : `${backendBase.replace(/\/$/, "")}/contact`;

      const syncRes = await fetch(contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: finalName,
          name: finalName,
          email: email.trim(),
          phone: cleanPhone,
          city: city.trim(),
          enquiryType: selectedEnquiry,
          message: message.trim(),
        }),
      });

      if (syncRes.ok) {
        const resData = await syncRes.json();
        return NextResponse.json(resData, { headers: corsHeaders });
      }
    } catch (backendErr) {
      console.warn("[CONTACT API] Backend sync notice:", backendErr);
    }

    // 3. Fallback to direct DB query if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      try {
        const inq = await prisma.inquiry.create({
          data: {
            id: `inq-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            name: finalName,
            email: email.trim(),
            phone: cleanPhone,
            city: city.trim(),
            enquiryType: selectedEnquiry,
            message: message.trim(),
            status: "PENDING",
          },
        });

        // Also update contact.json in cmsData
        try {
          const record = await prisma.cmsData.findUnique({ where: { key: "contact.json" } });
          const list = Array.isArray(record?.data) ? (record!.data as any[]) : [];
          list.unshift(inq);
          await prisma.cmsData.upsert({
            where: { key: "contact.json" },
            update: { data: list as any },
            create: { key: "contact.json", data: list as any },
          });

          // Sync to central API store
          const backendBase = getApiBase();
          await fetch(`${backendBase}/cms/contact`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: list }),
          }).catch(() => {});
        } catch {}
      } catch (dbErr) {
        console.warn("[CONTACT API] DB fallback notice:", dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Your inquiry has been successfully submitted.`,
        submittedAt: timestamp,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[CONTACT API ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit contact inquiry. Please try again later." },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/contact?id=...
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400, headers: corsHeaders });
    }

    const cleanId = String(id).trim().toLowerCase();

    if (process.env.DATABASE_URL) {
      try {
        await prisma.inquiry.deleteMany({
          where: {
            OR: [
              { id: String(id) },
              { id: { equals: cleanId, mode: "insensitive" } },
            ],
          },
        });
      } catch (dbErr) {
        console.warn("[DELETE /api/contact] DB delete notice:", dbErr);
      }

      try {
        await prisma.contactEntry.deleteMany({
          where: {
            OR: [
              { id: String(id) },
              { id: { equals: cleanId, mode: "insensitive" } },
            ],
          },
        });
      } catch (dbErr) {
        console.warn("[DELETE /api/contact] DB contactEntry notice:", dbErr);
      }
    }

    try {
      const record = await prisma.cmsData.findUnique({ where: { key: "contact.json" } });
      if (record && Array.isArray(record.data)) {
        const filtered = (record.data as any[]).filter((i) => {
          const iId = String(i.id || i._id || "").trim().toLowerCase();
          return iId !== cleanId;
        });
        await prisma.cmsData.upsert({
          where: { key: "contact.json" },
          update: { data: filtered as any },
          create: { key: "contact.json", data: filtered as any },
        });
      }
    } catch (cmsErr) {
      console.warn("[DELETE /api/contact] CMS delete notice:", cmsErr);
    }

    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[DELETE /api/contact] Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete inquiry" }, { status: 500, headers: corsHeaders });
  }
}
