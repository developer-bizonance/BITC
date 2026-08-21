"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../data/blogs.json");
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
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const router = (0, express_1.Router)();
// In-memory fallback
// GET /api/blogs
router.get("/", async (req, res) => {
    try {
        let dbBlogs = null;
        try {
            dbBlogs = await prisma_js_1.default.blog.findMany({
                orderBy: { createdAt: "desc" },
            });
        }
        catch (e) {
            console.warn("Prisma query failed, falling back to in-memory blogs:", e);
        }
        if (dbBlogs && dbBlogs.length > 0) {
            return res.json({ success: true, blogs: dbBlogs });
        }
        return res.json({ success: true, blogs: getDb() });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch blogs" });
    }
});
// POST /api/blogs
router.post("/", async (req, res) => {
    try {
        const { title, content, author, publishedAt, slug } = req.body;
        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ success: false, error: "Blog title is required" });
        }
        const blogSlug = slug?.trim() || title.trim().toLowerCase().replace(/[\s_]+/g, "-");
        const newBlog = {
            id: `blg-${Date.now()}`,
            title: title.trim(),
            slug: blogSlug,
            content: content || "",
            author: author || "Admin",
            publishedAt: publishedAt ? new Date(publishedAt) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const db = getDb();
        db.unshift(newBlog);
        saveDb(db);
        try {
            const dbBlog = await prisma_js_1.default.blog.create({
                data: {
                    title: newBlog.title,
                    slug: newBlog.slug,
                    content: newBlog.content,
                    author: newBlog.author,
                    publishedAt: newBlog.publishedAt,
                },
            });
            return res.status(201).json({ success: true, blog: dbBlog, blogs: getDb() });
        }
        catch (e) {
            // Prisma optional in development
        }
        return res.status(201).json({ success: true, blog: newBlog, blogs: getDb() });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to create blog" });
    }
});
// PUT /api/blogs/:id
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author, publishedAt, slug } = req.body;
        const blogIndex = getDb().findIndex((b) => b.id === id);
        let currentBlog = blogIndex !== -1 ? getDb()[blogIndex] : null;
        try {
            const dbBlog = await prisma_js_1.default.blog.findUnique({ where: { id } });
            if (dbBlog)
                currentBlog = dbBlog;
        }
        catch (e) {
            // ignore
        }
        if (!currentBlog) {
            return res.status(404).json({ success: false, error: "Blog not found" });
        }
        const updated = {
            ...currentBlog,
            title: title !== undefined ? title.trim() : currentBlog.title,
            slug: slug !== undefined ? slug.trim() : currentBlog.slug,
            content: content !== undefined ? content : currentBlog.content,
            author: author !== undefined ? author.trim() : currentBlog.author,
            publishedAt: publishedAt !== undefined ? (publishedAt ? new Date(publishedAt) : null) : currentBlog.publishedAt,
            updatedAt: new Date(),
        };
        if (blogIndex !== -1) {
            getDb()[blogIndex] = updated;
        }
        try {
            const dbUpdated = await prisma_js_1.default.blog.update({
                where: { id },
                data: {
                    title: updated.title,
                    slug: updated.slug,
                    content: updated.content,
                    author: updated.author,
                    publishedAt: updated.publishedAt,
                },
            });
            return res.json({ success: true, blog: dbUpdated, blogs: getDb() });
        }
        catch (e) {
            // ignore
        }
        return res.json({ success: true, blog: updated, blogs: getDb() });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to update blog" });
    }
});
// DELETE /api/blogs/:id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const blogIndex = getDb().findIndex((b) => b.id === id);
        if (blogIndex !== -1) {
            getDb().splice(blogIndex, 1);
        }
        try {
            await prisma_js_1.default.blog.delete({ where: { id } });
        }
        catch (e) {
            if (blogIndex === -1) {
                return res.status(404).json({ success: false, error: "Blog not found" });
            }
        }
        return res.json({ success: true, message: "Blog deleted successfully", blogs: getDb() });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error?.message || "Failed to delete blog" });
    }
});
exports.default = router;
