"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userStore_js_1 = require("../lib/userStore.js");
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const router = (0, express_1.Router)();
// GET /api/students - List all student users
router.get("/", async (_req, res) => {
    try {
        let dbStudents = [];
        try {
            dbStudents = await prisma_js_1.default.user.findMany({
                where: { role: "STUDENT" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            });
        }
        catch (e) {
            // Prisma optional fallback
        }
        const inMemoryStudents = userStore_js_1.usersDb
            .filter((u) => u.role === "student")
            .map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || "",
            role: "student",
            createdAt: u.createdAt,
        }));
        // Merge without duplicates
        const dbEmails = new Set(dbStudents.map((s) => s.email.toLowerCase()));
        const merged = [
            ...dbStudents,
            ...inMemoryStudents.filter((s) => !dbEmails.has(s.email.toLowerCase())),
        ];
        return res.json({
            success: true,
            students: merged,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch students" });
    }
});
// POST /api/students - Add new student account
router.post("/", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email) {
            return res.status(400).json({ success: false, error: "Name and Email are required" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existing = userStore_js_1.usersDb.find((u) => u.email.toLowerCase() === normalizedEmail);
        if (existing) {
            return res.status(409).json({ success: false, error: "Student with this email already exists" });
        }
        const passwordHash = await bcryptjs_1.default.hash(password || "Student@123", 10);
        const newStudent = {
            id: `usr_stu_${Date.now()}`,
            name: name.trim(),
            email: normalizedEmail,
            phone: phone ? phone.trim() : "",
            passwordHash,
            role: "student",
            createdAt: new Date().toISOString(),
        };
        try {
            await prisma_js_1.default.user.create({
                data: {
                    name: newStudent.name,
                    email: newStudent.email,
                    phone: newStudent.phone,
                    passwordHash: newStudent.passwordHash,
                    role: "STUDENT",
                },
            });
        }
        catch (e) {
            // Memory fallback
        }
        userStore_js_1.usersDb.unshift(newStudent);
        return res.status(201).json({
            success: true,
            student: {
                id: newStudent.id,
                name: newStudent.name,
                email: newStudent.email,
                phone: newStudent.phone,
                role: newStudent.role,
                createdAt: newStudent.createdAt,
            },
            message: "Student account created successfully",
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to create student" });
    }
});
// PUT /api/students/:id - Update student account
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const idx = userStore_js_1.usersDb.findIndex((u) => u.id === id);
        if (idx !== -1) {
            userStore_js_1.usersDb[idx] = {
                ...userStore_js_1.usersDb[idx],
                name: name ? name.trim() : userStore_js_1.usersDb[idx].name,
                email: email ? email.trim().toLowerCase() : userStore_js_1.usersDb[idx].email,
                phone: phone !== undefined ? phone.trim() : userStore_js_1.usersDb[idx].phone,
            };
        }
        try {
            await prisma_js_1.default.user.update({
                where: { id },
                data: {
                    ...(name && { name: name.trim() }),
                    ...(email && { email: email.trim().toLowerCase() }),
                    ...(phone !== undefined && { phone: phone.trim() }),
                },
            });
        }
        catch (e) { }
        return res.json({
            success: true,
            message: "Student account updated successfully",
            student: idx !== -1 ? userStore_js_1.usersDb[idx] : { id, name, email, phone },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to update student" });
    }
});
// DELETE /api/students/:id - Delete student account
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const idx = userStore_js_1.usersDb.findIndex((u) => u.id === id);
        if (idx !== -1) {
            userStore_js_1.usersDb.splice(idx, 1);
        }
        try {
            await prisma_js_1.default.user.delete({ where: { id } });
        }
        catch (e) { }
        return res.json({
            success: true,
            message: "Student account deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to delete student" });
    }
});
exports.default = router;
