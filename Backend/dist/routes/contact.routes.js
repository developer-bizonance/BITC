"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/contact.json");
function getDb() {
    try {
        if (!fs_1.default.existsSync(dbPath))
            return [];
        return JSON.parse(fs_1.default.readFileSync(dbPath, "utf-8"));
    }
    catch (e) {
        return [];
    }
}
function saveDb(data) {
    try {
        fs_1.default.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
    }
    catch (e) { }
}
const email_js_1 = require("../lib/email.js");
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const router = (0, express_1.Router)();
// In-Memory store initialized with realistic sample contact inquiries
// GET /api/contact - List all contact form inquiries
router.get("/", async (_req, res) => {
    try {
        let dbInquiries = [];
        try {
            dbInquiries = await prisma_js_1.default.inquiry.findMany({
                orderBy: { createdAt: "desc" },
            });
        }
        catch (dbError) {
            // Prisma optional in development
        }
        if (dbInquiries && dbInquiries.length > 0) {
            // Merge DB inquiries with in-memory ones (avoiding duplicate IDs)
            const dbIds = new Set(dbInquiries.map((i) => i.id));
            const filteredInMemory = getDb().filter((i) => !dbIds.has(i.id));
            const merged = [
                ...dbInquiries.map((i) => ({
                    id: i.id,
                    name: i.name,
                    email: i.email,
                    phone: i.phone,
                    city: i.city || "Amravati",
                    enquiryType: i.enquiryType || "General Inquiry",
                    message: i.message,
                    status: i.status || "PENDING",
                    createdAt: i.createdAt ? new Date(i.createdAt).toISOString() : new Date().toISOString(),
                })),
                ...filteredInMemory,
            ];
            return res.json({
                success: true,
                source: "database",
                count: merged.length,
                inquiries: merged,
            });
        }
        return res.json({
            success: true,
            source: "memory",
            count: getDb().length,
            inquiries: getDb(),
        });
    }
    catch (error) {
        console.error("GET /api/contact error:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch contact inquiries." });
    }
});
// POST /api/contact - Submit new contact form inquiry
router.post("/", async (req, res) => {
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
        const newInquiry = {
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
        // 1. Add to In-Memory store (Prepend to top)
        saveDb([newInquiry, ...getDb()]);
        // 2. Send Email Notification
        try {
            await (0, email_js_1.sendInquiryEmail)({
                fullName: finalName,
                email: email.trim(),
                phone: cleanPhone,
                city: finalCity,
                enquiryType: finalEnquiryType,
                message: finalMessage,
            });
        }
        catch (mailError) {
            console.warn("Email sending notice:", mailError);
        }
        // 3. Persist in Neon DB
        try {
            await prisma_js_1.default.inquiry.create({
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
        }
        catch (dbError) {
            console.warn("DB save inquiry notice:", dbError);
        }
        return res.status(201).json({
            success: true,
            message: "Your inquiry has been successfully submitted and saved to the dashboard.",
            inquiry: newInquiry,
            submittedAt: newInquiry.createdAt,
        });
    }
    catch (error) {
        console.error("POST /api/contact error:", error);
        return res.status(500).json({ success: false, error: error?.message || "Failed to submit contact inquiry." });
    }
});
// PATCH /api/contact/:id/status - Update inquiry status (PENDING, CONTACTED, RESOLVED, ARCHIVED)
router.patch("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ["PENDING", "CONTACTED", "RESOLVED", "ARCHIVED", "New", "Contacted", "Resolved", "Archived"];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status value provided." });
        }
        const normalizedStatus = status.toUpperCase();
        // Update in memory
        const inqIndex = getDb().findIndex((i) => i.id === id);
        if (inqIndex !== -1) {
            getDb()[inqIndex].status = normalizedStatus;
        }
        // Update in DB if present
        try {
            await prisma_js_1.default.inquiry.update({
                where: { id },
                data: { status: normalizedStatus },
            });
        }
        catch (dbError) {
            // Prisma optional
        }
        return res.json({
            success: true,
            message: "Inquiry status updated successfully.",
            id,
            status: normalizedStatus,
        });
    }
    catch (error) {
        console.error("PATCH /api/contact/:id/status error:", error);
        return res.status(500).json({ success: false, error: "Failed to update inquiry status." });
    }
});
// DELETE /api/contact/:id - Delete an inquiry
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb().filter((i) => i.id !== id);
        saveDb(db);
        try {
            await prisma_js_1.default.inquiry.delete({
                where: { id },
            });
        }
        catch (dbError) {
            // Prisma optional
        }
        return res.json({
            success: true,
            message: "Inquiry response deleted successfully.",
            inquiries: getDb(),
        });
    }
    catch (error) {
        console.error("DELETE /api/contact/:id error:", error);
        return res.status(500).json({ success: false, error: "Failed to delete inquiry." });
    }
});
exports.default = router;
