"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const userStore_js_1 = require("../lib/userStore.js");
const courses_js_1 = require("../data/courses.js");
const router = (0, express_1.Router)();
// GET /api/admin/stats
router.get("/stats", async (_req, res) => {
    try {
        let totalUsers = 0;
        let totalInquiries = 0;
        let totalApplications = 0;
        let totalCourses = courses_js_1.courses.length;
        try {
            totalUsers = await prisma_js_1.default.user.count();
            totalInquiries = await prisma_js_1.default.inquiry.count();
            totalApplications = await prisma_js_1.default.application.count();
            const dbCourseCount = await prisma_js_1.default.course.count();
            if (dbCourseCount > 0)
                totalCourses = dbCourseCount;
        }
        catch (e) {
            console.warn("DB stats count fallback:", e);
            totalUsers = userStore_js_1.usersDb.length;
            totalApplications = userStore_js_1.applicationsDb.length;
        }
        return res.json({
            success: true,
            stats: {
                totalStudents: totalUsers,
                totalInquiries,
                totalApplications,
                totalCourses,
                activeBatches: 6,
                placementRate: "94%",
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch admin stats" });
    }
});
// GET /api/admin/applications
router.get("/applications", async (_req, res) => {
    try {
        let applications = [];
        try {
            applications = await prisma_js_1.default.application.findMany({
                include: {
                    user: { select: { name: true, email: true, phone: true } },
                    course: { select: { title: true, slug: true, duration: true, fees: true } },
                },
                orderBy: { appliedAt: "desc" },
            });
        }
        catch (e) {
            applications = userStore_js_1.applicationsDb;
        }
        return res.json({ success: true, applications });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch applications" });
    }
});
// GET /api/admin/students
router.get("/students", async (_req, res) => {
    try {
        let students = [];
        try {
            students = await prisma_js_1.default.user.findMany({
                where: { role: "STUDENT" },
                select: { id: true, name: true, email: true, phone: true, createdAt: true },
                orderBy: { createdAt: "desc" },
            });
        }
        catch (e) {
            students = userStore_js_1.usersDb.filter((u) => u.role === "student");
        }
        return res.json({ success: true, students });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch students" });
    }
});
exports.default = router;
