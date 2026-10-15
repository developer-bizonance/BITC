import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

// POST /api/event-registrations
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      city,
      college,
      education,
      course,
      graduationYear,
      eventId,
    } = body;

    // 1. Validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "A valid Email Id is required." }, { status: 400 });
    }

    const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
    if (!phone || typeof phone !== "string" || cleanPhone.length !== 10) {
      return NextResponse.json({ error: "Mobile number must be exactly 10 digits." }, { status: 400 });
    }

    const collegeValue = (college || education || "").trim();

    let registration: any = null;

    // 2. Persist to Neon PostgreSQL EventRegistration table
    try {
      registration = await prisma.eventRegistration.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone,
          college: collegeValue || null,
          course: course?.trim() || null,
          graduationYear: graduationYear?.trim() || null,
          eventId: eventId?.trim() || null,
        },
        include: {
          event: true,
        },
      });
      console.log(`[EVENT REG API] Created event registration ${registration.id} with college/education: "${collegeValue}"`);
    } catch (dbError) {
      console.warn("[EVENT REG API] Prisma insert notice (falling back to CmsData):", dbError);
    }

    if (!registration) {
      registration = {
        id: `reg-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        city: city?.trim() || "",
        college: collegeValue,
        education: collegeValue,
        course: course?.trim() || "",
        graduationYear: graduationYear?.trim() || "",
        eventId: eventId?.trim() || null,
        createdAt: new Date().toISOString(),
      };
    }

    // 3. Persist to Neon CmsData table ("event-registrations.json")
    try {
      const cmsRecord = await prisma.cmsData.findUnique({
        where: { key: "event-registrations.json" },
      });
      const currentList: any[] = Array.isArray(cmsRecord?.data)
        ? (cmsRecord.data as any[])
        : [];
      const updatedList = [registration, ...currentList.filter(r => r.id !== registration.id)];

      await prisma.cmsData.upsert({
        where: { key: "event-registrations.json" },
        update: { data: updatedList as any },
        create: { key: "event-registrations.json", data: updatedList as any },
      });
    } catch (cmsError) {
      console.warn("[EVENT REG API] CmsData upsert notice:", cmsError);
    }

    // 4. Send email alert notification
    try {
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
      const smtpUser = process.env.SMTP_USER || "info@bizonance.in";
      const smtpPass = process.env.SMTP_PASS || "gnazdidlhnootilv";
      const smtpFrom = process.env.SMTP_FROM || `"BITC Events" <info@bizonance.in>`;
      const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || "info@bizonance.in";

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const eventTitle = registration?.event?.title || (eventId ? "Event Registration" : "General Event Updates");

      await transporter.sendMail({
        from: smtpFrom,
        to: recipientEmail,
        replyTo: email.trim(),
        subject: `[BITC] New Event Registration: ${name.trim()} - ${eventTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #2563eb; margin-top: 0;">New Event Registration / Update Request</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr><td style="padding: 8px 12px; font-weight: bold; width: 35%;">Name:</td><td>${name.trim()}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: bold;">Email:</td><td>${email.trim()}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: bold;">Phone:</td><td>${cleanPhone}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: bold;">City:</td><td>${city?.trim() || "Not Specified"}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: bold;">College/University:</td><td><strong>${collegeValue || "Not Specified"}</strong></td></tr>
              <tr><td style="padding: 8px 12px; font-weight: bold;">Event:</td><td>${eventTitle}</td></tr>
            </table>
          </div>
        `,
      });
    } catch (mailErr) {
      console.warn("[EVENT REG API] Email alert notice:", mailErr);
    }

    // 5. Forward to backend VPS if reachable
    try {
      const backendBase = getApiBase();
      if (!backendBase.includes("bitc.bizonance.com")) {
        fetch(`${backendBase}/event-registrations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).catch(() => null);
      }
    } catch {}

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (error: any) {
    console.error("[EVENT REG API ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit event registration." },
      { status: 500 }
    );
  }
}

// GET /api/event-registrations
export async function GET() {
  try {
    let registrations: any[] = [];
    try {
      registrations = await prisma.eventRegistration.findMany({
        orderBy: { createdAt: "desc" },
        include: { event: true },
      });
    } catch (dbError) {
      console.warn("[EVENT REG API] Prisma findMany notice:", dbError);
    }

    let cmsRegs: any[] = [];
    try {
      const cmsRecord = await prisma.cmsData.findUnique({
        where: { key: "event-registrations.json" },
      });
      if (cmsRecord && Array.isArray(cmsRecord.data)) {
        cmsRegs = cmsRecord.data as any[];
      }
    } catch (cmsError) {
      console.warn("[EVENT REG API] CmsData findUnique notice:", cmsError);
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

    return NextResponse.json({ success: true, registrations: unified });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch registrations." },
      { status: 500 }
    );
  }
}
