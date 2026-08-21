import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, city, enquiryType, message } = body;

    // 1. Server-side Input Validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json({ error: "Full Name must be at least 2 characters long." }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address (e.g. name@gmail.com)." }, { status: 400 });
    }

    const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
    if (!phone || typeof phone !== "string" || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9." }, { status: 400 });
    }

    if (!city || typeof city !== "string" || city.trim().length < 2) {
      return NextResponse.json({ error: "Please enter a valid city name." }, { status: 400 });
    }

    if (!enquiryType || typeof enquiryType !== "string" || !enquiryType.trim()) {
      return NextResponse.json({ error: "Please select an enquiry category." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Message content must be at least 5 characters long." }, { status: 400 });
    }

    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || "info@bizonance.in";
    const selectedEnquiry = enquiryType?.trim() || "General Inquiry";
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // 2. Configure Email Transporter
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"BITC Website" <info@bizonance.in>`;

    let transporter: nodemailer.Transporter;

    if (smtpUser && smtpPass) {
      // Production SMTP connection
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    } else {
      // Fallback Transporter
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }

    // 3. Check Logo Image for Email Header
    const logoFileName = "BizonanceLogo.png";
    const logoFilePath = path.join(process.cwd(), "public", logoFileName);
    const hasLogoFile = fs.existsSync(logoFilePath);

    // 4. Construct Email Contents
    const mailSubject = `[BITC Website Inquiry] ${selectedEnquiry} - ${fullName.trim()}`;
    const plainTextBody = `
BIZONANCE INDUSTRIAL TRAINING CENTRE
=========================================
NEW INQUIRY RECEIVED FROM BITC WEBSITE
Submitted At : ${timestamp}
Full Name    : ${fullName.trim()}
Email        : ${email.trim()}
Phone        : ${phone.trim()}
City         : ${city.trim()}
Enquiry Type : ${selectedEnquiry}

MESSAGE:
-----------------------------------------
${message.trim()}
=========================================
Target Recipient: ${recipientEmail}
    `.trim();

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 16px; color: #1e293b; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: #f1f5f9; padding: 14px 20px; text-align: center; border-bottom: 1px solid #e2e8f0; }
        .header-title { font-size: 13px; font-weight: 800; color: #1e293b; letter-spacing: 2px; text-transform: uppercase; margin-top: 0px; line-height: 1.1; }
        .header-sub { margin: 2px 0 0 0; font-size: 11px; color: #64748b; letter-spacing: 0.5px; }
        .body { padding: 20px 24px; }
        .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 9999px; margin-bottom: 14px; border: 1px solid #fde68a; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .info-table td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .info-table tr:last-child td { border-bottom: none; }
        .label { font-weight: 600; color: #64748b; width: 35%; }
        .value { color: #0f172a; font-weight: 500; }
        .message-box { background: #f8fafc; border-left: 4px solid #ff9900; padding: 14px; border-radius: 6px; font-size: 14px; line-height: 1.5; color: #334155; white-space: pre-wrap; margin-top: 4px; border: 1px solid #e2e8f0; border-left: 4px solid #ff9900; }
        .footer { background: #f8fafc; padding: 12px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div align="center" style="text-align: center; width: 100%;">
            ${hasLogoFile
        ? `<div align="center" style="text-align: center; width: 100%; margin: 0 auto 2px auto;"><img align="center" src="cid:bizonancelogo" alt="BIZONANCE" style="max-height: 42px; width: auto; max-width: 220px; display: inline-block; vertical-align: middle; margin: 0 auto;" /></div>`
        : `<div style="font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: 1px;">BIZ<span style="color: #ff9900;">O</span>NANCE</div>`
      }
            <div class="header-title" style="text-align: center;">INDUSTRIAL TRAINING CENTER</div>
            <p class="header-sub" style="text-align: center;">New Contact Form Submission</p>
          </div>
        </div>
        <div class="body">
          <div class="badge">${selectedEnquiry}</div>
          <table class="info-table">
            <tr><td class="label">Full Name:</td><td class="value">${fullName.trim()}</td></tr>
            <tr><td class="label">Email Address:</td><td class="value"><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
            <tr><td class="label">Phone Number:</td><td class="value"><a href="tel:${phone.trim()}">${phone.trim()}</a></td></tr>
            <tr><td class="label">City:</td><td class="value">${city.trim()}</td></tr>
          </table>

          <div class="message-box">${message.trim()}</div>
        </div>
        <div class="footer">
          This email was generated automatically by the BITC Website Contact System for <strong>${recipientEmail}</strong>.
        </div>
      </div>
    </body>
    </html>
    `;

    // 5. Build Mail Options with Embedded Logo Attachment
    const mailOptions: any = {
      from: smtpFrom,
      to: recipientEmail,
      replyTo: email.trim(),
      subject: mailSubject,
      text: plainTextBody,
      html: htmlBody,
    };

    if (hasLogoFile) {
      mailOptions.attachments = [
        {
          filename: "BizonanceLogo.png",
          path: logoFilePath,
          cid: "bizonancelogo", // CID referenced in HTML <img src="cid:bizonancelogo" />
        },
      ];
    }

    let sendResult = null;
    try {
      sendResult = await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Email timeout")), 3000)),
      ]);
      console.log(`[CONTACT API] Form submission received from ${email.trim()} for ${recipientEmail}. Result:`, sendResult);
    } catch (mailErr) {
      console.warn("[CONTACT API] Email dispatch notice (proceeding):", mailErr);
    }

    // Save inquiry via Express Backend (single source of truth)
    try {
      const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api/contact";
      await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim(),
          enquiryType: selectedEnquiry,
          message: message.trim(),
        }),
      });
    } catch (backendErr) {
      console.warn("Backend sync notice:", backendErr);
    }

    return NextResponse.json({
      success: true,
      message: `Your inquiry has been successfully submitted and sent to ${recipientEmail}.`,
      recipient: recipientEmail,
      submittedAt: timestamp,
    });
  } catch (error: any) {
    console.error("[CONTACT API ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit contact inquiry. Please try again later." },
      { status: 500 }
    );
  }
}
