import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import prisma from "../lib/prisma.js";

const router = Router();

/**
 * Normalizes a slug or string for consistent case-insensitive matching
 */
function normalizeSlug(str?: string | null): string {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalizes a blog title for fuzzy collision detection
 */
function normalizeTitle(str?: string | null): string {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Helper to robustly merge and deduplicate blogs from Prisma database and JSON store.
 * Merging prioritizes rich data (image & category from JSON store, DB timestamps/content from DB),
 * while strictly ensuring that NO blog appears more than once by matching ID, slug, and title.
 */
function getMergedBlogs(dbBlogs: any[] = [], fileBlogs: any[] = []): any[] {
  const fileBlogById = new Map<string, any>();
  const fileBlogBySlug = new Map<string, any>();
  const fileBlogByTitle = new Map<string, any>();

  for (const fb of fileBlogs) {
    if (fb.id) fileBlogById.set(String(fb.id), fb);
    const slugNorm = normalizeSlug(fb.slug);
    if (slugNorm) fileBlogBySlug.set(slugNorm, fb);
    const titleNorm = normalizeTitle(fb.title);
    if (titleNorm) fileBlogByTitle.set(titleNorm, fb);
  }

  const matchedFileBlogIds = new Set<string>();
  const matchedFileBlogSlugs = new Set<string>();
  const matchedFileBlogTitles = new Set<string>();

  // 1. Enrich dbBlogs with image & category from fileBlogs
  const enrichedDbBlogs = dbBlogs.map((dbB: any) => {
    const dbSlugNorm = normalizeSlug(dbB.slug);
    const dbTitleNorm = normalizeTitle(dbB.title);
    const fb: any =
      fileBlogById.get(String(dbB.id)) ||
      (dbSlugNorm ? fileBlogBySlug.get(dbSlugNorm) : undefined) ||
      (dbTitleNorm ? fileBlogByTitle.get(dbTitleNorm) : undefined) ||
      {};

    if (fb.id) matchedFileBlogIds.add(String(fb.id));
    if (fb.slug) matchedFileBlogSlugs.add(normalizeSlug(fb.slug));
    if (fb.title) matchedFileBlogTitles.add(normalizeTitle(fb.title));

    return {
      ...fb,
      ...dbB,
      // Prefer DB ID, fallback to file ID
      id: dbB.id || fb.id,
      slug: dbB.slug || fb.slug || "",
      image: dbB.image || fb.image || "",
      category: dbB.category || fb.category || "General",
    };
  });

  // 2. Identify fileBlogs that are NOT in dbBlogs
  const remainingFileBlogs = fileBlogs.filter((fb: any) => {
    const idStr = fb.id ? String(fb.id) : null;
    const slugNorm = normalizeSlug(fb.slug);
    const titleNorm = normalizeTitle(fb.title);

    if (idStr && matchedFileBlogIds.has(idStr)) return false;
    if (slugNorm && matchedFileBlogSlugs.has(slugNorm)) return false;
    if (titleNorm && matchedFileBlogTitles.has(titleNorm)) return false;

    // Direct check against any dbBlog
    if (
      dbBlogs.some((dbB: any) => {
        if (idStr && String(dbB.id) === idStr) return true;
        if (slugNorm && normalizeSlug(dbB.slug) === slugNorm) return true;
        if (titleNorm && normalizeTitle(dbB.title) === titleNorm) return true;
        return false;
      })
    ) {
      return false;
    }

    return true;
  });

  // 3. Final deduplication pass (by ID, Slug, and Title)
  const combined = [...enrichedDbBlogs, ...remainingFileBlogs];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenTitles = new Set<string>();
  const finalBlogs: any[] = [];

  for (const item of combined) {
    const idKey = item.id ? String(item.id) : null;
    const slugKey = normalizeSlug(item.slug);
    const titleKey = normalizeTitle(item.title);

    if (idKey && seenIds.has(idKey)) continue;
    if (slugKey && seenSlugs.has(slugKey)) continue;
    if (titleKey && seenTitles.has(titleKey)) continue;

    if (idKey) seenIds.add(idKey);
    if (slugKey) seenSlugs.add(slugKey);
    if (titleKey) seenTitles.add(titleKey);

    finalBlogs.push(item);
  }

  // 4. Sort descending by createdAt or publishedAt
  finalBlogs.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.publishedAt || 0).getTime();
    const timeB = new Date(b.createdAt || b.publishedAt || 0).getTime();
    return timeB - timeA;
  });

  return finalBlogs;
}

// GET /api/blogs
router.get("/", async (_req: Request, res: Response) => {
  try {
    let dbBlogs: any[] = [];
    try {
      const result = await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (result) dbBlogs = result;
    } catch (e) {
      console.warn("Prisma query failed, falling back to in-memory blogs:", e);
    }

    const fileBlogs = (await readJsonDbAsync("blogs.json")) || [];
    const mergedBlogs = getMergedBlogs(dbBlogs, fileBlogs);

    return res.json({ success: true, blogs: mergedBlogs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: "Failed to fetch blogs" });
  }
});

// GET /api/blogs/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const normalizedId = normalizeSlug(decodeURIComponent(id));

    const fileBlogs = (await readJsonDbAsync("blogs.json")) || [];
    const fileBlog = fileBlogs.find(
      (b: any) => String(b.id) === id || normalizeSlug(b.slug) === normalizedId
    );

    let dbBlog: any = null;
    try {
      dbBlog = await prisma.blog.findFirst({
        where: {
          OR: [{ id }, { slug: id }, { slug: normalizedId }],
        },
      });
    } catch (e) {
      // ignore
    }

    if (!dbBlog && !fileBlog) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    const blog = {
      ...(fileBlog || {}),
      ...(dbBlog || {}),
      id: dbBlog?.id || fileBlog?.id || id,
      image: dbBlog?.image || fileBlog?.image || "",
      category: dbBlog?.category || fileBlog?.category || "General",
    };

    return res.json({ success: true, blog });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: "Failed to fetch blog" });
  }
});

// POST /api/blogs
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, content, author, publishedAt, slug, category, image } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, error: "Blog title is required" });
    }

    const blogSlug = normalizeSlug(slug) || normalizeSlug(title);
    let assignedId = `blg-${Date.now()}`;
    let dbBlog: any = null;

    // 1. Try to create or update in Prisma DB
    try {
      const existingDbBlog = await prisma.blog.findUnique({ where: { slug: blogSlug } });
      if (existingDbBlog) {
        dbBlog = await prisma.blog.update({
          where: { id: existingDbBlog.id },
          data: {
            title: title.trim(),
            content: content || "",
            author: author || "Admin",
            publishedAt: publishedAt ? new Date(publishedAt) : null,
          },
        });
      } else {
        // Try creating with assignedId
        try {
          dbBlog = await prisma.blog.create({
            data: {
              id: assignedId,
              title: title.trim(),
              slug: blogSlug,
              content: content || "",
              author: author || "Admin",
              publishedAt: publishedAt ? new Date(publishedAt) : null,
            },
          });
        } catch {
          // If explicit id is disallowed by database constraint (e.g. strict UUID type), create with auto-generated id
          dbBlog = await prisma.blog.create({
            data: {
              title: title.trim(),
              slug: blogSlug,
              content: content || "",
              author: author || "Admin",
              publishedAt: publishedAt ? new Date(publishedAt) : null,
            },
          });
        }
      }
    } catch (e: any) {
      console.warn("Prisma blog create/update note:", e?.message || e);
    }

    if (dbBlog?.id) {
      assignedId = String(dbBlog.id);
    }

    // 2. Persist into JSON / CmsData store with matching ID and slug
    const newBlog = {
      id: assignedId,
      title: title.trim(),
      slug: blogSlug,
      content: content || "",
      author: author || "Admin",
      category: category || "General",
      image: image || "",
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      createdAt: dbBlog?.createdAt || new Date(),
      updatedAt: dbBlog?.updatedAt || new Date(),
    };

    const fileBlogs = (await readJsonDbAsync("blogs.json")) || [];
    const titleNorm = normalizeTitle(title);
    // Remove any existing entry with the same slug, id, or title to prevent duplicates in JSON store
    const cleanFileBlogs = fileBlogs.filter((b: any) => {
      if (String(b.id) === assignedId) return false;
      if (normalizeSlug(b.slug) === blogSlug) return false;
      if (titleNorm && normalizeTitle(b.title) === titleNorm) return false;
      return true;
    });
    cleanFileBlogs.unshift(newBlog);
    await writeJsonDbAsync("blogs.json", cleanFileBlogs);

    // 3. Return created blog and freshly merged & deduplicated blog list
    let dbBlogs: any[] = [];
    try {
      dbBlogs = (await prisma.blog.findMany({ orderBy: { createdAt: "desc" } })) || [];
    } catch (_) {}

    const allBlogs = getMergedBlogs(dbBlogs, cleanFileBlogs);
    const createdBlog = { ...newBlog, ...(dbBlog || {}), id: assignedId };

    return res.status(201).json({
      success: true,
      blog: createdBlog,
      blogs: allBlogs,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to create blog" });
  }
});

// PUT /api/blogs/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, author, publishedAt, slug, category, image } = req.body;
    const normalizedId = normalizeSlug(decodeURIComponent(id));

    const fileBlogs = (await readJsonDbAsync("blogs.json")) || [];
    const blogIndex = fileBlogs.findIndex(
      (b: any) => String(b.id) === id || normalizeSlug(b.slug) === normalizedId
    );
    let currentBlog = blogIndex !== -1 ? fileBlogs[blogIndex] : null;

    let dbBlog: any = null;
    try {
      dbBlog = await prisma.blog.findFirst({
        where: {
          OR: [{ id }, { slug: id }, { slug: normalizedId }],
        },
      });
      if (dbBlog) currentBlog = { ...currentBlog, ...dbBlog };
    } catch (e) {
      // ignore
    }

    if (!currentBlog) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    const updatedSlug = slug !== undefined ? normalizeSlug(slug) : currentBlog.slug;
    const primaryId = dbBlog?.id || currentBlog.id || id;

    const updated = {
      ...currentBlog,
      id: primaryId,
      title: title !== undefined ? title.trim() : currentBlog.title,
      slug: updatedSlug,
      content: content !== undefined ? content : currentBlog.content,
      author: author !== undefined ? author.trim() : currentBlog.author,
      category: category !== undefined ? category.trim() : currentBlog.category,
      image: image !== undefined ? image.trim() : currentBlog.image,
      publishedAt: publishedAt !== undefined ? (publishedAt ? new Date(publishedAt) : null) : currentBlog.publishedAt,
      updatedAt: new Date(),
    };

    // Update in Prisma
    let dbUpdated: any = null;
    if (dbBlog?.id) {
      try {
        dbUpdated = await prisma.blog.update({
          where: { id: dbBlog.id },
          data: {
            title: updated.title,
            slug: updated.slug,
            content: updated.content,
            author: updated.author,
            publishedAt: updated.publishedAt,
          },
        });
      } catch (e) {
        console.warn("Prisma blog update failed:", e);
      }
    }

    // Update in JSON store and deduplicate
    let updatedFileBlogs = [...fileBlogs];
    if (blogIndex !== -1) {
      updatedFileBlogs[blogIndex] = updated;
    } else {
      updatedFileBlogs.unshift(updated);
    }
    const cleanNormSlug = normalizeSlug(updated.slug);
    updatedFileBlogs = updatedFileBlogs.filter(
      (b: any, idx: number) =>
        idx === (blogIndex !== -1 ? blogIndex : 0) ||
        (String(b.id) !== String(primaryId) && normalizeSlug(b.slug) !== cleanNormSlug)
    );
    await writeJsonDbAsync("blogs.json", updatedFileBlogs);

    let dbBlogs: any[] = [];
    try {
      dbBlogs = (await prisma.blog.findMany({ orderBy: { createdAt: "desc" } })) || [];
    } catch (_) {}

    const allBlogs = getMergedBlogs(dbBlogs, updatedFileBlogs);
    const finalBlog = { ...updated, ...(dbUpdated || {}) };

    return res.json({ success: true, blog: finalBlog, blogs: allBlogs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to update blog" });
  }
});

// DELETE /api/blogs/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const normalizedId = normalizeSlug(decodeURIComponent(id));

    let targetSlug: string | null = null;
    let dbBlog: any = null;

    // 1. Delete from Prisma
    try {
      dbBlog = await prisma.blog.findFirst({
        where: {
          OR: [{ id }, { slug: id }, { slug: normalizedId }],
        },
      });
      if (dbBlog) {
        targetSlug = dbBlog.slug;
        await prisma.blog.delete({ where: { id: dbBlog.id } });
      }
    } catch (e) {
      console.warn("Prisma blog delete notice:", e);
    }

    // 2. Delete from JSON store
    const fileBlogs = (await readJsonDbAsync("blogs.json")) || [];
    const targetNormSlug = normalizeSlug(targetSlug || normalizedId);

    const remainingFileBlogs = fileBlogs.filter((b: any) => {
      if (String(b.id) === id) return false;
      if (dbBlog && String(b.id) === String(dbBlog.id)) return false;
      if (normalizeSlug(b.slug) === targetNormSlug) return false;
      return true;
    });

    const wasInFile = remainingFileBlogs.length < fileBlogs.length;
    if (wasInFile) {
      await writeJsonDbAsync("blogs.json", remainingFileBlogs);
    }

    if (!dbBlog && !wasInFile) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    let dbBlogs: any[] = [];
    try {
      dbBlogs = (await prisma.blog.findMany({ orderBy: { createdAt: "desc" } })) || [];
    } catch (_) {}

    const allBlogs = getMergedBlogs(dbBlogs, remainingFileBlogs);

    return res.json({ success: true, message: "Blog deleted successfully", blogs: allBlogs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete blog" });
  }
});

export default router;
