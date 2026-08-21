"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_js_1 = require("../lib/jwt.js");
const userStore_js_1 = require("../lib/userStore.js");
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const router = (0, express_1.Router)();
// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        let user = null;
        // Try finding user in Neon PostgreSQL DB
        try {
            const dbUser = await prisma_js_1.default.user.findUnique({
                where: { email: normalizedEmail },
            });
            if (dbUser) {
                user = {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    passwordHash: dbUser.passwordHash,
                    phone: dbUser.phone || "",
                    role: dbUser.role.toLowerCase(),
                };
            }
        }
        catch (e) {
            console.warn("Database lookup notice:", e);
        }
        // Fallback to in-memory store
        if (!user) {
            user = userStore_js_1.usersDb.find((u) => u.email.toLowerCase() === normalizedEmail);
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const passwordMatches = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!passwordMatches) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = (0, jwt_js_1.signJWT)({
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
        const userProfile = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };
        return res.json({
            message: "Login successful",
            user: userProfile,
            token,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal Server Error during login" });
    }
});
// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        // Check if user already exists
        let existingUser = null;
        try {
            existingUser = await prisma_js_1.default.user.findUnique({ where: { email: normalizedEmail } });
        }
        catch (e) {
            existingUser = userStore_js_1.usersDb.find((u) => u.email.toLowerCase() === normalizedEmail);
        }
        if (existingUser) {
            return res.status(409).json({ error: "User with this email already exists" });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const userId = `usr_${Date.now()}`;
        let newUser = {
            id: userId,
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            phone: phone || "",
            role: "student",
            createdAt: new Date().toISOString(),
        };
        try {
            const created = await prisma_js_1.default.user.create({
                data: {
                    name: name.trim(),
                    email: normalizedEmail,
                    passwordHash,
                    phone: phone || "",
                    role: "STUDENT",
                },
            });
            newUser = {
                id: created.id,
                name: created.name,
                email: created.email,
                phone: created.phone || "",
                role: created.role.toLowerCase(),
            };
        }
        catch (dbError) {
            console.warn("DB user creation fallback to memory:", dbError);
            userStore_js_1.usersDb.push(newUser);
        }
        const token = (0, jwt_js_1.signJWT)({
            userId: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        });
        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
            },
            token,
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Registration failed" });
    }
});
// GET /api/auth/me
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const payload = (0, jwt_js_1.verifyJWT)(token);
        if (!payload) {
            return res.status(401).json({ error: "Invalid token" });
        }
        return res.json({
            user: {
                id: payload.userId,
                name: payload.name,
                email: payload.email,
                role: payload.role,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to verify session" });
    }
});
// POST /api/auth/logout
router.post("/logout", (_req, res) => {
    return res.json({ message: "Logged out successfully" });
});
exports.default = router;
