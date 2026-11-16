import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import { sendInquiryEmail } from "../lib/email.js";
import prisma from "../lib/prisma.js";

const router = Router();

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  enquiryType: string;
  message: string;
  status: "PENDING" | "CONTACTED" | "RESOLVED" | "ARCHIVED";
  createdAt: string;
}

const toIsoString = (val: any): string => {
  if (!val) return new Date().toISOString();
  if (val instanceof Date) return val.toISOString();
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

// GET /api/contact - List all contact form inquiries (excluding Student Consulting)
router.get("/", async (_req: Request, res: Response) => {
  try {
    let dbInquiries: any[] = [];
    try {
      dbInquiries = await prisma.inquiry.findMany({
        where: {
          NOT: {
            enquiryType: {
              equals: "Student Consulting",
              mode: "insensitive",
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbError) {
      console.warn("[contact.routes] Prisma inquiry.findMany notice:", dbError);
    }

    let jsonInquiries: any[] = [];
    try {
      const loaded = await readJsonDbAsync<ContactInquiry>("contact.json");
      jsonInquiries = Array.isArray(loaded) ? loaded : [];
    } catch (jsonErr) {
      console.warn("[contact.routes] readJsonDbAsync notice:", jsonErr);
    }

    const isContactInquiry = (i: any) => {
      if (!i || typeof i !== "object") return false;
      const type = String(i.enquiryType || "").toLowerCase().trim();
      return type !== "student consulting";
    };

    const cleanDbInquiries = Array.isArray(dbInquiries) ? dbInquiries.filter(isContactInquiry) : [];
    const cleanJsonInquiries = Array.isArray(jsonInquiries) ? jsonInquiries.filter(isContactInquiry) : [];

    const mapInquiry = (i: any) => ({
      id: String(i?.id || `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
      name: String(i?.name || ""),
      email: String(i?.email || ""),
      phone: String(i?.phone || ""),
      city: String(i?.city || "Amravati"),
      enquiryType: String(i?.enquiryType || "General Inquiry"),
      message: String(i?.message || ""),
      status: (i?.status as any) || "PENDING",
      createdAt: toIsoString(i?.createdAt),
    });

    const normalizedDb = cleanDbInquiries.map(mapInquiry);
    const normalizedJson = cleanJsonInquiries.map(mapInquiry);

    // Merge DB inquiries with in-memory ones (avoiding duplicate IDs)
    const dbIds = new Set(normalizedDb.map((i) => i.id));
    const filteredJson = normalizedJson.filter((i) => !dbIds.has(i.id));
    const merged = [...normalizedDb, ...filteredJson];

    // Deduplicate by email, message, and date to prevent double-submissions from showing up twice
    const seen = new Set();
    const uniqueMerged = merged.filter((i) => {
      if (!i) return false;
      const dateKey = i.createdAt ? String(i.createdAt).substring(0, 10) : "";
      const emailKey = String(i.email || "").trim().toLowerCase();
      const messageKey = String(i.message || "").trim().toLowerCase();
      const key = `${emailKey}-${messageKey}-${dateKey}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return res.json({
      success: true,
      source: "database",
      count: uniqueMerged.length,
      inquiries: uniqueMerged,
    });
  } catch (error: any) {
    console.error("GET /api/contact error:", error);
    return res.json({
      success: true,
      source: "fallback",
      count: 0,
      inquiries: [],
    });
  }
});

// POST /api/contact - Submit new contact form inquiry
router.post("/", async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, city, enquiryType, message, name } = req.body;
    const finalName = (fullName || name || "").trim();

    if (!finalName || finalName.length < 2) {
      return res.status(400).json({ success: false, error: "Full Name must be at least 2 characters long." });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: "Please enter a valid email address." });
    }

    const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
    if (!phone || typeof phone !== "string" || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, error: "Please enter a valid 10-digit mobile number." });
    }

    const finalCity = (city || "").trim();
    if (!finalCity || finalCity.length < 2) {
      return res.status(400).json({ success: false, error: "Please enter a valid city name." });
    }

    const finalEnquiryType = (enquiryType || "General Inquiry").trim();
    const finalMessage = (message || "").trim();

    if (!finalMessage || finalMessage.length < 5) {
      return res.status(400).json({ success: false, error: "Message content must be at least 5 characters long." });
    }

    const newInquiry: ContactInquiry = {
      id: `inq-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      name: finalName,
      email: email.trim(),
      phone: cleanPhone,
      city: finalCity,
      enquiryType: finalEnquiryType,
      message: finalMessage,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    // 1. Add to Database store (Prepend to top)
    const existingInquiries = (await readJsonDbAsync<ContactInquiry>("contact.json")) || [];
    await writeJsonDbAsync("contact.json", [newInquiry, ...existingInquiries]);

    // 2. Send Email Notification
    try {
      await sendInquiryEmail({
        fullName: finalName,
        email: email.trim(),
        phone: cleanPhone,
        city: finalCity,
        enquiryType: finalEnquiryType,
        message: finalMessage,
      });
    } catch (mailError) {
      console.warn("Email sending notice:", mailError);
    }

    // 3. Persist in Neon DB
    try {
      await prisma.inquiry.create({
        data: {
          id: newInquiry.id,
          name: finalName,
          email: email.trim(),
          phone: cleanPhone,
          city: finalCity,
          enquiryType: finalEnquiryType,
          message: finalMessage,
          status: "PENDING",
        },
      });
    } catch (dbError) {
      console.warn("DB save inquiry notice:", dbError);
    }

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been successfully submitted and saved to the dashboard.",
      inquiry: newInquiry,
      submittedAt: newInquiry.createdAt,
    });
  } catch (error: any) {
    console.error("POST /api/contact error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Failed to submit contact inquiry." });
  }
});

// PATCH /api/contact/:id or /api/contact/:id/status - Update inquiry status (PENDING, CONTACTED, RESOLVED, ARCHIVED)
router.patch(["/:id", "/:id/status"], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "CONTACTED", "RESOLVED", "ARCHIVED", "New", "Contacted", "Resolved", "Archived"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status value provided." });
    }

    const normalizedStatus = status.toUpperCase() as "PENDING" | "CONTACTED" | "RESOLVED" | "ARCHIVED";

    // Update in Database store
    const db = await readJsonDbAsync<ContactInquiry>("contact.json");
    const inqIndex = db.findIndex((i) => i.id === id);
    if (inqIndex !== -1) {
      db[inqIndex].status = normalizedStatus;
      await writeJsonDbAsync("contact.json", db);
    }

    // Update in DB if present
    try {
      await prisma.inquiry.update({
        where: { id },
        data: { status: normalizedStatus },
      });
    } catch (dbError) {
      // Prisma optional
    }

    return res.json({
      success: true,
      message: "Inquiry status updated successfully.",
      id,
      status: normalizedStatus,
    });
  } catch (error: any) {
    console.error("PATCH /api/contact/:id/status error:", error);
    return res.status(500).json({ success: false, error: "Failed to update inquiry status." });
  }
});

// DELETE /api/contact/:id - Delete an inquiry
router.delete("/:id?", async (req: Request, res: Response) => {
  try {
    const id = req.params.id || req.body?.id || req.query?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: "Inquiry ID is required" });
    }
    const cleanId = String(id).trim().toLowerCase();

    // 1. Delete from ContactEntry table
    try {
      await prisma.contactEntry.deleteMany({
        where: {
          OR: [
            { id: String(id) },
            { id: { equals: cleanId, mode: "insensitive" } },
          ],
        },
      });
    } catch (dbError) {}

    // 2. Also delete from Inquiry table
    try {
      await prisma.inquiry.deleteMany({
        where: {
          OR: [
            { id: String(id) },
            { id: { equals: cleanId, mode: "insensitive" } },
          ],
        },
      });
    } catch (dbError) {}

    // 3. Update JSON store & CmsData
    const db = await readJsonDbAsync<ContactInquiry>("contact.json");
    const filteredDb = db.filter((i) => {
      const iId = String(i.id || (i as any)._id || "").trim().toLowerCase();
      return iId !== cleanId;
    });
    await writeJsonDbAsync("contact.json", filteredDb);

    return res.json({
      success: true,
      message: "Inquiry response deleted successfully.",
      inquiries: filteredDb,
    });
  } catch (error: any) {
    console.error("DELETE /api/contact/:id error:", error);
    return res.status(500).json({ success: false, error: "Failed to delete inquiry." });
  }
});

export default router;
