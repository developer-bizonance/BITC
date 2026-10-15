import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      city,
      category,
      course,
      message,
      cvBase64,
      cvFileName,
    } = body;

    // 1. Validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
    if (!phone || typeof phone !== "string" || cleanPhone.length !== 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    }

    if (!city || typeof city !== "string" || !city.trim()) {
      return NextResponse.json({ error: "Please enter your city." }, { status: 400 });
    }

    if (!course || typeof course !== "string" || !course.trim()) {
      return NextResponse.json({ error: "Please select a certification course." }, { status: 400 });
    }

    // 2. Save CV attachment if base64 provided
    let savedCvUrl = "";
    let cvBuffer: Buffer | null = null;
    if (cvBase64 && cvFileName) {
      try {
        const base64Data = cvBase64.replace(/^data:[^;]+;base64,/, "");
        cvBuffer = Buffer.from(base64Data, "base64");
        const uploadsDir = path.join(process.cwd(), "public", "uploads", "scholarships");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const safeFileName = `${Date.now()}-${cvFileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const filePath = path.join(uploadsDir, safeFileName);
        fs.writeFileSync(filePath, cvBuffer);
        savedCvUrl = `/uploads/scholarships/${safeFileName}`;
      } catch (cvErr) {
        console.warn("[SCHOLARSHIP API] Could not save CV to disk (proceeding):", cvErr);
      }
    }

    const appId = `SCH-${Date.now().toString().slice(-5)}`;
    const newApplication = {
      _id: `sch-${Date.now()}`,
      id: appId,
      fullName: fullName.trim(),
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      city: city.trim(),
      category: category?.trim() || "Scholarship",
      course: course.trim(),
      message: message?.trim() || "",
      cvFileName: cvFileName?.trim() || "",
      cvUrl: savedCvUrl,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    // 3. Persist to Neon PostgreSQL CmsData table
    try {
      const existingRecord = await prisma.cmsData.findUnique({
        where: { key: "scholarships.json" },
      });
      const currentList: any[] = Array.isArray(existingRecord?.data)
        ? (existingRecord.data as any[])
        : [];

      const updatedList = [newApplication, ...currentList];

      await prisma.cmsData.upsert({
        where: { key: "scholarships.json" },
        update: { data: updatedList as any },
        create: { key: "scholarships.json", data: updatedList as any },
      });
      console.log(`[SCHOLARSHIP API] Successfully saved application ${appId} to Neon PostgreSQL`);
    } catch (dbErr) {
      console.error("[SCHOLARSHIP API] Neon DB persistence error:", dbErr);
    }

    // 4. Send Email Notification to info@bizonance.in
    try {
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
      const smtpUser = process.env.SMTP_USER || "info@bizonance.in";
      const smtpPass = process.env.SMTP_PASS || "gnazdidlhnootilv";
      const smtpFrom = process.env.SMTP_FROM || `"BITC Scholarships" <info@bizonance.in>`;
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

      const mailOptions: any = {
        from: smtpFrom,
        to: recipientEmail,
        replyTo: email.trim(),
        subject: `[BITC] New Scholarship Application: ${fullName.trim()} - ${course.trim()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #ea580c; margin-top: 0;">New Scholarship Application Received</h2>
            <p style="color: #475569; font-size: 14px;">An applicant has submitted a scholarship request via the BITC website.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 35%;">Application ID:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #0284c7;">${appId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Full Name:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;">${fullName.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email.trim()}">${email.trim()}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;"><a href="tel:${cleanPhone}">${cleanPhone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">City:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;">${city.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Domain / Category:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;">${category?.trim() || "Information Technology"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Course Selected:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #d97706; font-weight: bold;">${course.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Reason / Message:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;">${message?.trim() || "No statement provided"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">CV Attached:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;">${cvFileName ? `Yes (${cvFileName})` : "No"}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
              BITC Admission & Scholarship Portal &bull; Bizonance India Pvt. Ltd.
            </p>
          </div>
        `,
      };

      if (cvBuffer && cvFileName) {
        mailOptions.attachments = [
          {
            filename: cvFileName,
            content: cvBuffer,
          },
        ];
      }

      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Email timeout")), 3500)),
      ]);
      console.log(`[SCHOLARSHIP API] Email sent to ${recipientEmail} for applicant ${email.trim()}`);
    } catch (mailErr) {
      console.warn("[SCHOLARSHIP API] Email dispatch notice (proceeding):", mailErr);
    }

    // 5. Try syncing to Express backend if reachable
    try {
      const backendBase = getApiBase();
      if (!backendBase.includes("bitc.bizonance.com")) {
        fetch(`${backendBase}/scholarships/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).catch(() => null);
      }
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Scholarship application submitted successfully! Our team will reach out shortly.",
        application: newApplication,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[SCHOLARSHIP API ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit scholarship application. Please try again." },
      { status: 500 }
    );
  }
}
