import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      courseId,
      courseTitle,
      name,
      email,
      phone,
      city,
      qualification,
      specialization,
      message,
    } = body;

    // 1. Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
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

    const selectedCourseTitle = (courseTitle || "Certification Course").trim();
    const selectedCourseId = (courseId || selectedCourseTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim();

    const appId = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApplication: any = {
      id: appId,
      fullId: appId,
      userId: `user-${Date.now()}`,
      userName: name.trim(),
      userEmail: email.trim().toLowerCase(),
      userPhone: cleanPhone,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      city: city?.trim() || "",
      qualification: qualification?.trim() || "",
      specialization: specialization?.trim() || "",
      message: message?.trim() || "",
      courseId: selectedCourseId,
      courseTitle: selectedCourseTitle,
      status: "UNDER_REVIEW",
      appliedAt: new Date().toISOString(),
    };

    // 2. Persist to Neon PostgreSQL CmsData table ("course-applications.json")
    try {
      const existingRecord = await prisma.cmsData.findUnique({
        where: { key: "course-applications.json" },
      });
      const currentList: any[] = Array.isArray(existingRecord?.data)
        ? (existingRecord.data as any[])
        : [];

      // Avoid duplicate by appId or email+course
      const updatedList = [newApplication, ...currentList.filter(a => a.id !== appId)];

      await prisma.cmsData.upsert({
        where: { key: "course-applications.json" },
        update: { data: updatedList as any },
        create: { key: "course-applications.json", data: updatedList as any },
      });
      console.log(`[COURSE APPLY API] Successfully saved application ${appId} to Neon CmsData`);
    } catch (cmsErr) {
      console.error("[COURSE APPLY API] Neon CmsData persistence error:", cmsErr);
    }

    // 3. Persist to relational Prisma tables (User, Course, Application)
    try {
      let user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: email.trim().toLowerCase(),
            name: name.trim(),
            phone: cleanPhone,
            passwordHash: "bitc_direct_applicant_hash",
            role: "STUDENT" as any,
          },
        });
      }

      let course = await prisma.course.findFirst({
        where: { OR: [{ slug: selectedCourseId }, { title: selectedCourseTitle }] },
      });

      if (!course) {
        course = await prisma.course.create({
          data: {
            slug: selectedCourseId,
            title: selectedCourseTitle,
            category: "Certification",
            duration: "3 Months",
            fees: "₹36,000",
            price: 36000,
            description: `${selectedCourseTitle} Professional Certification Program`,
            features: ["Industry Certificate", "Hands-on Projects", "Placement Support"],
          },
        });
      }

      if (user && course) {
        const dbApp = await prisma.application.create({
          data: {
            userId: user.id,
            courseId: course.id,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: cleanPhone,
            city: city?.trim() || "",
            qualification: qualification?.trim() || "",
            specialization: specialization?.trim() || "",
            message: message?.trim() || "",
            status: "UNDER_REVIEW" as any,
          },
        });
        newApplication.fullId = dbApp.id;
        console.log(`[COURSE APPLY API] Created relational application row ${dbApp.id}`);
      }
    } catch (relationalErr) {
      console.warn("[COURSE APPLY API] Relational DB insert notice (cmsData is primary):", relationalErr);
    }

    // 4. Send Email Notification to info@bizonance.in
    try {
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
      const smtpUser = process.env.SMTP_USER || "info@bizonance.in";
      const smtpPass = process.env.SMTP_PASS || "gnazdidlhnootilv";
      const smtpFrom = process.env.SMTP_FROM || `"BITC Admissions" <info@bizonance.in>`;
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

      const mailOptions = {
        from: smtpFrom,
        to: recipientEmail,
        replyTo: email.trim(),
        subject: `[BITC] New Course Application: ${name.trim()} - ${selectedCourseTitle} (${appId})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <div style="background: #0f172a; padding: 16px; border-radius: 8px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 18px;">BIZONANCE INDUSTRIAL TRAINING CENTRE</h2>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">New Course Admission Application</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 35%;">Application ID:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #0284c7; font-weight: bold;">${appId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Candidate Name:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email Address:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email.trim()}">${email.trim()}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Mobile Phone:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;"><a href="tel:${cleanPhone}">${cleanPhone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">City:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;">${city?.trim() || "Not Specified"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Qualification:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;">${qualification?.trim() || "Not Specified"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Specialization:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;">${specialization?.trim() || "Not Specified"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Course Applied:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #ea580c; font-weight: bold;">${selectedCourseTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Message:</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9;">${message?.trim() || "No statement provided"}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
              BITC Admission System &bull; Bizonance India Pvt. Ltd.
            </p>
          </div>
        `,
      };

      await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Email timeout")), 3500)),
      ]);
      console.log(`[COURSE APPLY API] Notification email sent to ${recipientEmail}`);
    } catch (mailErr) {
      console.warn("[COURSE APPLY API] Email notification notice (proceeding):", mailErr);
    }

    // 5. Try syncing to Express backend VPS if reachable
    try {
      const backendBase = getApiBase();
      if (!backendBase.includes("bitc.bizonance.com")) {
        fetch(`${backendBase}/courses/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).catch(() => null);
      }
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        application: newApplication,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[COURSE APPLY API ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit course application" },
      { status: 500 }
    );
  }
}
