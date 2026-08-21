"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const courses_js_1 = require("../data/courses.js");
const jwt_js_1 = require("../lib/jwt.js");
const userStore_js_1 = require("../lib/userStore.js");
const router = (0, express_1.Router)();
// GET /api/courses
router.get("/", async (req, res) => {
    try {
        const category = req.query.category;
        let dbCourses = null;
        try {
            dbCourses = await prisma_js_1.default.course.findMany({
                where: category ? { category } : undefined,
                orderBy: { title: "asc" },
            });
        }
        catch (dbError) {
            console.warn("Neon DB courses query failed, falling back to static:", dbError);
        }
        if (dbCourses && dbCourses.length > 0) {
            return res.json({
                success: true,
                source: "database",
                courses: dbCourses,
            });
        }
        const filteredCourses = category
            ? courses_js_1.courses.filter((c) => c.category.toLowerCase() === category.toLowerCase())
            : courses_js_1.courses;
        return res.json({
            success: true,
            source: "static",
            courses: filteredCourses,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch courses" });
    }
});
// GET /api/courses/:slug
router.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");
        let dbCourse = null;
        try {
            dbCourse = await prisma_js_1.default.course.findUnique({ where: { slug: normalizedSlug } });
        }
        catch (e) {
            console.warn("DB course lookup notice:", e);
        }
        if (dbCourse) {
            return res.json({ success: true, course: dbCourse });
        }
        const staticCourse = courses_js_1.courses.find((c) => c.slug === normalizedSlug);
        if (staticCourse) {
            return res.json({ success: true, course: staticCourse });
        }
        return res.status(404).json({ success: false, error: "Course not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch course details" });
    }
});
// GET /api/courses/:slug/curriculum
router.get("/:slug/curriculum", async (req, res) => {
    try {
        const { slug } = req.params;
        const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");
        const course = courses_js_1.courses.find((c) => c.slug === normalizedSlug);
        if (!course) {
            return res.status(404).json({ success: false, error: "Course not found" });
        }
        return res.json({
            success: true,
            slug: course.slug,
            title: course.title,
            curriculum: course.curriculum || [],
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to fetch curriculum" });
    }
});
// PUT /api/courses/:slug/curriculum (Full curriculum update or save)
router.put("/:slug/curriculum", async (req, res) => {
    try {
        const { slug } = req.params;
        const { curriculum } = req.body;
        const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");
        const courseIndex = courses_js_1.courses.findIndex((c) => c.slug === normalizedSlug);
        if (courseIndex === -1) {
            return res.status(404).json({ success: false, error: "Course not found" });
        }
        if (!Array.isArray(curriculum)) {
            return res.status(400).json({ success: false, error: "Curriculum must be an array of modules" });
        }
        courses_js_1.courses[courseIndex].curriculum = curriculum;
        try {
            await prisma_js_1.default.course.update({
                where: { slug: normalizedSlug },
                data: { curriculum: curriculum },
            });
        }
        catch (e) {
            // Prisma optional in development
        }
        return res.json({
            success: true,
            message: "Curriculum updated successfully",
            course: courses_js_1.courses[courseIndex],
            curriculum: courses_js_1.courses[courseIndex].curriculum,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to update curriculum" });
    }
});
// POST /api/courses/:slug/curriculum (Add new module)
router.post("/:slug/curriculum", async (req, res) => {
    try {
        const { slug } = req.params;
        const { title, topics } = req.body;
        const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");
        const course = courses_js_1.courses.find((c) => c.slug === normalizedSlug);
        if (!course) {
            return res.status(404).json({ success: false, error: "Course not found" });
        }
        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ success: false, error: "Module title is required" });
        }
        const topicsArray = Array.isArray(topics)
            ? topics.map((t) => String(t).trim()).filter(Boolean)
            : typeof topics === "string"
                ? topics.split(",").map((t) => t.trim()).filter(Boolean)
                : [];
        const newModule = {
            title: title.trim(),
            topics: topicsArray,
        };
        if (!course.curriculum)
            course.curriculum = [];
        course.curriculum.push(newModule);
        return res.status(201).json({
            success: true,
            message: "Module added to curriculum successfully",
            newModule,
            curriculum: course.curriculum,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to add module" });
    }
});
// DELETE /api/courses/:slug/curriculum/:moduleIndex
router.delete("/:slug/curriculum/:moduleIndex", async (req, res) => {
    try {
        const { slug, moduleIndex } = req.params;
        const idx = parseInt(moduleIndex, 10);
        const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");
        const course = courses_js_1.courses.find((c) => c.slug === normalizedSlug);
        if (!course) {
            return res.status(404).json({ success: false, error: "Course not found" });
        }
        if (isNaN(idx) || idx < 0 || idx >= (course.curriculum?.length || 0)) {
            return res.status(400).json({ success: false, error: "Invalid module index" });
        }
        course.curriculum.splice(idx, 1);
        return res.json({
            success: true,
            message: "Module removed from curriculum",
            curriculum: course.curriculum,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to delete module" });
    }
});
// POST /api/courses/apply
router.post("/apply", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Please log in to submit a course application" });
        }
        const payload = (0, jwt_js_1.verifyJWT)(token);
        if (!payload) {
            return res.status(401).json({ error: "Unauthorized: Invalid or expired session token" });
        }
        const { courseId, courseTitle, phone } = req.body;
        if (!courseId || !courseTitle) {
            return res.status(400).json({ error: "Course details are required" });
        }
        const newApplication = {
            id: `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            userId: payload.userId,
            userName: payload.name,
            userEmail: payload.email,
            userPhone: phone || "",
            courseId,
            courseTitle,
            status: "UNDER_REVIEW",
            appliedAt: new Date().toISOString(),
        };
        userStore_js_1.applicationsDb.push(newApplication);
        try {
            const dbCourse = await prisma_js_1.default.course.findFirst({
                where: { OR: [{ slug: courseId }, { title: courseTitle }] },
            });
            if (dbCourse) {
                await prisma_js_1.default.application.create({
                    data: {
                        userId: payload.userId,
                        courseId: dbCourse.id,
                        status: "UNDER_REVIEW",
                    },
                });
            }
        }
        catch (dbError) {
            console.warn("Database application creation notice:", dbError);
        }
        return res.json({
            message: "Application submitted successfully",
            application: newApplication,
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to submit course application" });
    }
});
// POST /api/courses (Create a new course)
router.post("/", async (req, res) => {
    try {
        const { title, category, duration, fees, price, description, features, image } = req.body;
        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ success: false, error: "Course title is required" });
        }
        const slug = title.trim().toLowerCase().replace(/[\s_]+/g, "-");
        const newCourse = {
            slug,
            title: title.trim(),
            category: category || "Information Technology",
            duration: duration || "6 Months",
            fees: fees || "₹36,000",
            price: price ? parseInt(price) : 36000,
            description: description || "",
            features: Array.isArray(features) ? features : [],
            image: image || "",
            curriculum: [],
        };
        // Save to fallback array
        courses_js_1.courses.push(newCourse);
        // Save to DB if available
        try {
            await prisma_js_1.default.course.create({
                data: {
                    slug: newCourse.slug,
                    title: newCourse.title,
                    category: newCourse.category,
                    duration: newCourse.duration,
                    fees: newCourse.fees,
                    price: newCourse.price,
                    description: newCourse.description,
                    features: newCourse.features,
                    image: newCourse.image,
                    curriculum: [],
                },
            });
        }
        catch (e) {
            console.warn("DB course creation notice:", e);
        }
        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            course: newCourse,
            courses: courses_js_1.courses,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to create course" });
    }
});
// PUT /api/courses/:slug (Update a course)
router.put("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const { title, category, duration, fees, price, description, features, image } = req.body;
        const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");
        const courseIndex = courses_js_1.courses.findIndex((c) => c.slug === normalizedSlug);
        if (courseIndex === -1) {
            return res.status(404).json({ success: false, error: "Course not found" });
        }
        const current = courses_js_1.courses[courseIndex];
        const updated = {
            ...current,
            title: title !== undefined ? title.trim() : current.title,
            category: category !== undefined ? category : current.category,
            duration: duration !== undefined ? duration : current.duration,
            fees: fees !== undefined ? fees : current.fees,
            price: price !== undefined ? parseInt(price) : current.price,
            description: description !== undefined ? description : current.description,
            features: features !== undefined && Array.isArray(features) ? features : current.features,
            image: image !== undefined ? image : current.image,
        };
        courses_js_1.courses[courseIndex] = updated;
        try {
            await prisma_js_1.default.course.update({
                where: { slug: normalizedSlug },
                data: {
                    title: updated.title,
                    category: updated.category,
                    duration: updated.duration,
                    fees: updated.fees,
                    price: updated.price,
                    description: updated.description,
                    features: updated.features,
                    image: updated.image,
                },
            });
        }
        catch (e) {
            // Ignore Prisma errors in dev
        }
        return res.json({
            success: true,
            message: "Course updated successfully",
            course: updated,
            courses: courses_js_1.courses,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to update course" });
    }
});
// DELETE /api/courses/:slug (Delete a course)
router.delete("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");
        const courseIndex = courses_js_1.courses.findIndex((c) => c.slug === normalizedSlug);
        if (courseIndex === -1) {
            return res.status(404).json({ success: false, error: "Course not found" });
        }
        courses_js_1.courses.splice(courseIndex, 1);
        try {
            await prisma_js_1.default.course.delete({
                where: { slug: normalizedSlug },
            });
        }
        catch (e) {
            // Ignore Prisma errors in dev
        }
        return res.json({
            success: true,
            message: "Course deleted successfully",
            courses: courses_js_1.courses,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to delete course" });
    }
});
exports.default = router;
