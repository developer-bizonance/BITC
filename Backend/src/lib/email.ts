import nodemailer from "nodemailer";

export interface SendInquiryEmailParams {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  enquiryType: string;
  message: string;
}

export async function sendInquiryEmail(params: SendInquiryEmailParams) {
  const { fullName, email, phone, city, enquiryType, message } = params;

  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || "info@bizonance.in";
  const selectedEnquiry = enquiryType?.trim() || "General Inquiry";
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"BITC Website" <info@bizonance.in>`;

  let transporter: nodemailer.Transporter;

  if (smtpUser && smtpPass) {
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
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
  }

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
      .header { background: #f1f5f9; padding: 18px 20px; text-align: center; border-bottom: 1px solid #e2e8f0; }
      .header-title { font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: 1.5px; text-transform: uppercase; margin: 0; }
      .header-sub { margin: 4px 0 0 0; font-size: 12px; color: #64748b; }
      .body { padding: 24px; }
      .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; margin-bottom: 16px; border: 1px solid #fde68a; }
      .info-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
      .info-table td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
      .info-table tr:last-child td { border-bottom: none; }
      .label { font-weight: 600; color: #64748b; width: 35%; }
      .value { color: #0f172a; font-weight: 500; }
      .message-box { background: #f8fafc; border-left: 4px solid #ff9900; padding: 14px; border-radius: 6px; font-size: 14px; line-height: 1.5; color: #334155; white-space: pre-wrap; margin-top: 4px; border: 1px solid #e2e8f0; }
      .footer { background: #f8fafc; padding: 12px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="header-title">BIZONANCE INDUSTRIAL TRAINING CENTER</div>
        <p class="header-sub">New Website Inquiry</p>
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
        Generated automatically by the BITC Website Contact System for <strong>${recipientEmail}</strong>.
      </div>
    </div>
  </body>
  </html>
  `;

  return transporter.sendMail({
    from: smtpFrom,
    to: recipientEmail,
    replyTo: email.trim(),
    subject: mailSubject,
    text: plainTextBody,
    html: htmlBody,
  });
}
