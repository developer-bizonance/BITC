import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

import prisma from "../lib/prisma.js";

const router = Router();

// In-memory fallback

// GET /api/blogs
router.get("/", async (req: Request, res: Response) => {
  try {
    let dbBlogs = null;
    try {
      dbBlogs = await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.warn("Prisma query failed, falling back to in-memory blogs:", e);
    }

    if (dbBlogs && dbBlogs.length > 0) {
      return res.json({ success: true, blogs: dbBlogs });
    }

    return res.json({ success: true, blogs: readJsonDb("blogs.json") });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: "Failed to fetch blogs" });
  }
});

// POST /api/blogs
router.post("/", async (req: Request, res: Response) => {
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

    const db = readJsonDb("blogs.json"); db.unshift(newBlog); writeJsonDb("blogs.json", db);

    try {
      const dbBlog = await prisma.blog.create({
        data: {
          title: newBlog.title,
          slug: newBlog.slug,
          content: newBlog.content,
          author: newBlog.author,
          publishedAt: newBlog.publishedAt,
        },
      });
      return res.status(201).json({ success: true, blog: dbBlog, blogs: readJsonDb("blogs.json") });
    } catch (e) {
      // Prisma optional in development
    }

    return res.status(201).json({ success: true, blog: newBlog, blogs: readJsonDb("blogs.json") });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to create blog" });
  }
});

// PUT /api/blogs/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, author, publishedAt, slug } = req.body;

    const blogIndex = readJsonDb("blogs.json").findIndex((b) => b.id === id);
    let currentBlog = blogIndex !== -1 ? readJsonDb("blogs.json")[blogIndex] : null;

    try {
      const dbBlog = await prisma.blog.findUnique({ where: { id } });
      if (dbBlog) currentBlog = dbBlog;
    } catch (e) {
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
      readJsonDb("blogs.json")[blogIndex] = updated;
    }

    try {
      const dbUpdated = await prisma.blog.update({
        where: { id },
        data: {
          title: updated.title,
          slug: updated.slug,
          content: updated.content,
          author: updated.author,
          publishedAt: updated.publishedAt,
        },
      });
      return res.json({ success: true, blog: dbUpdated, blogs: readJsonDb("blogs.json") });
    } catch (e) {
      // ignore
    }

    return res.json({ success: true, blog: updated, blogs: readJsonDb("blogs.json") });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to update blog" });
  }
});

// DELETE /api/blogs/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blogIndex = readJsonDb("blogs.json").findIndex((b) => b.id === id);
    if (blogIndex !== -1) {
      readJsonDb("blogs.json").splice(blogIndex, 1);
    }

    try {
      await prisma.blog.delete({ where: { id } });
    } catch (e) {
      if (blogIndex === -1) {
         return res.status(404).json({ success: false, error: "Blog not found" });
      }
    }

    return res.json({ success: true, message: "Blog deleted successfully", blogs: readJsonDb("blogs.json") });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete blog" });
  }
});

export default router;
