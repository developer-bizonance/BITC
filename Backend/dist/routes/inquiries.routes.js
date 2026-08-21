"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const router = (0, express_1.Router)();
// GET /api/inquiries
router.get("/", async (_req, res) => {
    try {
        const inquiries = await prisma_js_1.default.inquiry.findMany({
            orderBy: { createdAt: "desc" },
            include: { course: true },
        });
        return res.json({ success: true, inquiries });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch inquiries" });
    }
});
// POST /api/inquiries
router.post("/", async (req, res) => {
    try {
        const { name, email, phone, message, courseId, courseSlug } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ error: "Name, email, and phone number are required" });
        }
        let savedInquiry = null;
        try {
            let targetCourseId = courseId;
            if (!targetCourseId && courseSlug) {
                const course = await prisma_js_1.default.course.findUnique({ where: { slug: courseSlug } });
                if (course)
                    targetCourseId = course.id;
            }
            savedInquiry = await prisma_js_1.default.inquiry.create({
                data: {
                    name,
                    email,
                    phone,
                    message: message || "Interested in BITC Certification Courses",
                    status: "PENDING",
                    courseId: targetCourseId || null,
                },
            });
        }
        catch (dbError) {
            console.warn("DB inquiry save notice:", dbError);
        }
        return res.json({
            success: true,
            message: "Thank you for contacting BITC! Our team will reach out to you within 24 hours.",
            inquiry: savedInquiry || { name, email, phone, message, status: "PENDING" },
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to record inquiry" });
    }
});
exports.default = router;
