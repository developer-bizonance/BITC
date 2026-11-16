import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { verifyJWT } from "../lib/jwt.js";
import { applicationsDb } from "../lib/userStore.js";
import { readJsonDbAsync, writeJsonDbAsync, isDbConnectionDown, recordDbFailure, recordDbSuccess } from "../dataStore.js";
import { sendCourseApplicationEmail } from "../lib/email.js";

function getSlugVariants(rawSlug: string): string[] {
  if (!rawSlug) return [];
  const decoded = decodeURIComponent(rawSlug).trim().toLowerCase();
  const cleaned = decoded
    .replace(/ & /g, "-")
    .replace(/[\/\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const variants = new Set<string>();
  if (cleaned) variants.add(cleaned);
  if (decoded) variants.add(decoded);
  if (cleaned) variants.add(cleaned.replace(/[^a-z0-9]/g, ""));

  // Strip common suffixes: -certificate, -certification, -development, -masterclass, -program, -course
  const stripped = cleaned.replace(/-(certificate|certification|development|masterclass|programs?|courses?)$/g, "");
  if (stripped && stripped !== cleaned) {
    variants.add(stripped);
    variants.add(stripped.replace(/[^a-z0-9]/g, ""));
  }

  // Also add with -certificate
  if (stripped) {
    variants.add(`${stripped}-certificate`);
  }

  return Array.from(variants).filter(Boolean);
}

const router = Router();

// GET /api/courses
router.get("/", async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;

    let dbCourses: any[] = [];
    if (!isDbConnectionDown()) {
      try {
        dbCourses = await prisma.course.findMany({
          where: category
            ? {
                OR: [
                  { category: { equals: category, mode: "insensitive" } },
                  { category: { contains: category, mode: "insensitive" } },
                ],
              }
            : undefined,
        });
        recordDbSuccess();
      } catch (dbErr: any) {
        recordDbFailure(dbErr);
        console.warn("[courses] DB query notice (quota/error), falling back to certifications.json:", dbErr?.message || dbErr);
      }
    }

    let certsDb: any[] = [];
    try {
      certsDb = await readJsonDbAsync("certifications.json");
    } catch {}

    if (dbCourses.length === 0 && Array.isArray(certsDb) && certsDb.length > 0) {
      dbCourses = certsDb.map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug || c.title.trim().toLowerCase().replace(/[\s_]+/g, "-"),
        category: c.category || "Information Technology",
        duration: c.duration || "6 Months",
        fees: c.fees || "₹36,000",
        image: c.image || "/MERN.jpg",
        badge: c.badge || "",
        description: c.description || "",
        featuresText: c.featuresText || "",
        createdAt: c.createdAt || new Date(),
        updatedAt: c.updatedAt || new Date(),
      }));
    }

    // Ensure the sequence matches the master order from certifications.json and enrich images
    try {
      if (Array.isArray(certsDb) && certsDb.length > 0) {
        const orderMap = new Map<string, number>();
        certsDb.forEach((c: any, index: number) => {
          if (c.slug) orderMap.set(String(c.slug).toLowerCase(), index);
          if (c.id) orderMap.set(String(c.id).toLowerCase(), index);
          if (c.title) {
            orderMap.set(c.title.trim().toLowerCase(), index);
            orderMap.set(c.title.trim().toLowerCase().replace(/[\s_]+/g, "-"), index);
          }
        });

        // Enrich any missing or outdated course images from master certifications
        for (const c of dbCourses) {
          const matchedCert = certsDb.find((cert: any) => {
            if (!cert) return false;
            const certTitle = (cert.title || "").trim().toLowerCase();
            const certSlug = (cert.slug || certTitle.replace(/ & /g, "-").replace(/[\/\s_]+/g, "-")).toLowerCase();
            const courseTitle = (c.title || "").trim().toLowerCase();
            const courseSlug = (c.slug || "").toLowerCase();
            return (
              (cert.slug && courseSlug && cert.slug.toLowerCase() === courseSlug) ||
              certTitle === courseTitle ||
              certSlug === courseSlug ||
              certTitle.replace(/[^a-z0-9]/g, "") === courseTitle.replace(/[^a-z0-9]/g, "")
            );
          });

          if (matchedCert) {
            if (!c.image || c.image === "" || c.image === "/MERN.jpg") {
              if (matchedCert.image) {
                c.image = matchedCert.image;
              }
            }
            if (matchedCert.fees !== undefined) {
              c.fees = matchedCert.fees;
            }
            if (matchedCert.duration && !c.duration) {
              c.duration = matchedCert.duration;
            }
          }
        }

        dbCourses.sort((a, b) => {
          const slugA = (a.slug || "").toLowerCase();
          const slugB = (b.slug || "").toLowerCase();
          const titleA = (a.title || "").trim().toLowerCase();
          const titleB = (b.title || "").trim().toLowerCase();

          const posA = orderMap.has(slugA) ? orderMap.get(slugA)! : (orderMap.has(titleA) ? orderMap.get(titleA)! : 999);
          const posB = orderMap.has(slugB) ? orderMap.get(slugB)! : (orderMap.has(titleB) ? orderMap.get(titleB)! : 999);

          return posA - posB;
        });
      }
    } catch (orderErr) {
      console.warn("Could not enrich/sort dbCourses by certifications.json:", orderErr);
    }

    return res.json({
      success: true,
      source: "database",
      courses: dbCourses,
    });
  } catch (error) {
    console.error("Failed to fetch courses from database:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch courses" });
  }
});

// GET /api/courses/:slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const variants = getSlugVariants(slug);
    const primarySlug = variants[0] || slug;

    // 1. Primary check: Neon Postgres Course table
    const orFilters: any[] = variants.map((v) => ({ slug: v }));
    variants.forEach((v) => {
      orFilters.push({ slug: { equals: v, mode: "insensitive" } });
      orFilters.push({ title: { equals: v.replace(/-/g, " "), mode: "insensitive" } });
    });

    const dbCourse = await prisma.course.findFirst({
      where: { OR: orFilters },
    });

    if (dbCourse) {
      // Merge latest features and metadata from certifications.json if updated via admin dashboard
      try {
        const certsDb = await readJsonDbAsync<any>("certifications.json");
        const dynamicCert = certsDb.find((c: any) => {
          if (!c || !c.title) return false;
          const cId = String(c.id || "").toLowerCase();
          const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
          const cTitle = String(c.title || "").trim();
          const cTitleSlug = cTitle.toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
          const cClean = cTitle.toLowerCase().replace(/[^a-z0-9]/g, "");
          return (
            variants.includes(cId) ||
            variants.includes(cSlug) ||
            variants.includes(cTitleSlug) ||
            variants.some((v) => v.replace(/[^a-z0-9]/g, "") === cClean)
          );
        });

        if (dynamicCert) {
          if (dynamicCert.image && (!dbCourse.image || dbCourse.image === "/MERN.jpg")) {
            dbCourse.image = dynamicCert.image;
          }
          if (Array.isArray(dynamicCert.features) && dynamicCert.features.length > 0) {
            (dbCourse as any).features = dynamicCert.features;
          }
          if (dynamicCert.fees) {
            dbCourse.fees = dynamicCert.fees;
          }
          if (
            Array.isArray(dynamicCert.curriculum) &&
            dynamicCert.curriculum.length > 0 &&
            (!Array.isArray(dbCourse.curriculum) || (dbCourse.curriculum as any[]).length === 0)
          ) {
            (dbCourse as any).curriculum = dynamicCert.curriculum;
          }
        }
      } catch (mergeErr) {}

      return res.json({ success: true, course: dbCourse });
    }

    // 2. Check certifications.json (dashboard-managed certifications)
    try {
      const certsDb = await readJsonDbAsync<any>("certifications.json");
      const dynamicCert = certsDb.find((c: any) => {
        if (!c || !c.title) return false;
        const cId = String(c.id || "").toLowerCase();
        const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
        const cTitle = String(c.title || "").trim();
        const cTitleSlug = cTitle.toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
        const cClean = cTitle.toLowerCase().replace(/[^a-z0-9]/g, "");
        return (
          variants.includes(cId) ||
          variants.includes(cSlug) ||
          variants.includes(cTitleSlug) ||
          variants.some((v) => v.replace(/[^a-z0-9]/g, "") === cClean)
        );
      });

      if (dynamicCert) {
        return res.json({
          success: true,
          course: {
            slug: dynamicCert.slug || primarySlug,
            title: dynamicCert.title,
            category: dynamicCert.category || "Information Technology",
            duration: dynamicCert.duration || "",
            fees: dynamicCert.fees || "",
            price: parseInt(String(dynamicCert.fees || "0").replace(/[^0-9]/g, "")) || 0,
            description: dynamicCert.description || "",
            features: Array.isArray(dynamicCert.features) ? dynamicCert.features : [],
            image: dynamicCert.image || "",
            curriculum: Array.isArray(dynamicCert.curriculum) ? dynamicCert.curriculum : [],
          },
        });
      }
    } catch (e) {}

    return res.status(404).json({ success: false, error: "Course not found" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch course details" });
  }
});

// GET /api/courses/:slug/curriculum
router.get("/:slug/curriculum", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const variants = getSlugVariants(slug);
    const primarySlug = variants[0] || slug;

    // 1. Check Neon DB first
    const orFilters: any[] = variants.map((v) => ({ slug: v }));
    variants.forEach((v) => {
      orFilters.push({ slug: { equals: v, mode: "insensitive" } });
      orFilters.push({ title: { equals: v.replace(/-/g, " "), mode: "insensitive" } });
    });

    const dbCourse = await prisma.course.findFirst({
      where: { OR: orFilters },
    });

    if (dbCourse && Array.isArray(dbCourse.curriculum) && dbCourse.curriculum.length > 0) {
      return res.json({
        success: true,
        slug: dbCourse.slug,
        title: dbCourse.title,
        curriculum: dbCourse.curriculum,
      });
    }

    // 2. Check certifications.json
    try {
      const certsDb = await readJsonDbAsync<any>("certifications.json");
      const dynamicCert = certsDb.find((c: any) => {
        if (!c || !c.title) return false;
        const cId = String(c.id || "").toLowerCase();
        const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
        const cTitle = String(c.title || "").trim();
        const cTitleSlug = cTitle.toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
        const cClean = cTitle.toLowerCase().replace(/[^a-z0-9]/g, "");
        return (
          variants.includes(cId) ||
          variants.includes(cSlug) ||
          variants.includes(cTitleSlug) ||
          variants.some((v) => v.replace(/[^a-z0-9]/g, "") === cClean)
        );
      });

      if (dynamicCert && Array.isArray(dynamicCert.curriculum) && dynamicCert.curriculum.length > 0) {
        if (dbCourse) {
          prisma.course.update({
            where: { id: dbCourse.id },
            data: { curriculum: dynamicCert.curriculum as any },
          }).catch(() => null);
        }
        return res.json({
          success: true,
          slug: dynamicCert.slug || primarySlug,
          title: dynamicCert.title,
          curriculum: dynamicCert.curriculum,
        });
      }
    } catch (e) {}

    if (dbCourse) {
      return res.json({
        success: true,
        slug: dbCourse.slug,
        title: dbCourse.title,
        curriculum: (dbCourse.curriculum as any[]) || [],
      });
    }

    return res.status(404).json({ success: false, error: "Course not found" });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to fetch curriculum" });
  }
});

// PUT /api/courses/:slug/curriculum (Full curriculum update or save from dashboard)
router.put("/:slug/curriculum", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { curriculum, id, title } = req.body;
    const variants = getSlugVariants(slug);
    if (title) {
      getSlugVariants(title).forEach((v) => variants.push(v));
    }
    const paramId = id ? String(id).trim() : "";
    const paramTitle = title ? String(title).trim() : "";

    if (!Array.isArray(curriculum)) {
      return res.status(400).json({ success: false, error: "Curriculum must be an array of modules" });
    }

    // 1. Find course in Neon DB Course table
    const orFilters: any[] = variants.map((v) => ({ slug: v }));
    variants.forEach((v) => {
      orFilters.push({ slug: { equals: v, mode: "insensitive" } });
      orFilters.push({ title: { equals: v.replace(/-/g, " "), mode: "insensitive" } });
    });
    if (paramId) orFilters.push({ id: paramId });
    if (paramTitle) orFilters.push({ title: { equals: paramTitle, mode: "insensitive" } });

    const existingCourse = await prisma.course.findFirst({
      where: { OR: orFilters },
    });

    if (existingCourse) {
      await prisma.course.update({
        where: { id: existingCourse.id },
        data: { curriculum: curriculum as any },
      });
    } else {
      // Find cert metadata from certifications.json
      let matchedCert: any = null;
      try {
        const certsDb = await readJsonDbAsync<any>("certifications.json");
        matchedCert = certsDb.find((c: any) => {
          if (!c) return false;
          const cId = String(c.id || "").toLowerCase();
          const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
          const cTitle = String(c.title || "").trim();
          const cTitleSlug = cTitle.toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
          const cClean = cTitle.toLowerCase().replace(/[^a-z0-9]/g, "");
          return (
            (paramId && cId === paramId.toLowerCase()) ||
            (paramTitle && cTitle.toLowerCase() === paramTitle.toLowerCase()) ||
            variants.includes(cSlug) ||
            variants.includes(cTitleSlug) ||
            variants.some((v) => v.replace(/[^a-z0-9]/g, "") === cClean)
          );
        });
      } catch (err) {}

      const targetSlug = variants.find((v) => !v.endsWith("-certificate")) || variants[0] || `course-${Date.now()}`;

      await prisma.course.create({
        data: {
          slug: matchedCert?.slug || targetSlug,
          title: matchedCert?.title || paramTitle || targetSlug.replace(/-/g, " "),
          category: matchedCert?.category || "Information Technology",
          duration: matchedCert?.duration || "6 Months",
          fees: matchedCert?.fees || "",
          price: parseInt(String(matchedCert?.fees || "0").replace(/[^0-9]/g, ""), 10) || 0,
          description: matchedCert?.description || "",
          features: matchedCert?.features || [],
          image: matchedCert?.image || "",
          curriculum: curriculum as any,
        },
      });
    }

    // 2. Also update certifications.json in CmsData table
    try {
      const certsDb = await readJsonDbAsync<any>("certifications.json");
      const dynamicCertIndex = certsDb.findIndex((c: any) => {
        if (!c) return false;
        const cId = String(c.id || "").toLowerCase();
        const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
        const cTitle = String(c.title || "").trim();
        const cTitleSlug = cTitle.toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
        const cClean = cTitle.toLowerCase().replace(/[^a-z0-9]/g, "");
        return (
          (paramId && cId === paramId.toLowerCase()) ||
          (paramTitle && cTitle.toLowerCase() === paramTitle.toLowerCase()) ||
          variants.includes(cSlug) ||
          variants.includes(cTitleSlug) ||
          variants.some((v) => v.replace(/[^a-z0-9]/g, "") === cClean)
        );
      });

      if (dynamicCertIndex !== -1) {
        certsDb[dynamicCertIndex].curriculum = curriculum;
        await writeJsonDbAsync("certifications.json", certsDb);
      }
    } catch (e) {
      console.warn("Could not sync curriculum to certifications.json:", e);
    }

    return res.json({
      success: true,
      message: "Curriculum saved successfully",
      curriculum,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to save curriculum" });
  }
});

// GET /api/courses/:slug/highlights (Fetch highlights for a course)
router.get("/:slug/highlights", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    // 1. Check DB Course table
    const dbCourse = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug: normalizedSlug.replace(/[^a-z0-9]/g, "") },
          { title: { equals: normalizedSlug.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
      select: { features: true },
    });

    if (dbCourse && Array.isArray(dbCourse.features) && dbCourse.features.length > 0) {
      return res.json({ success: true, slug: normalizedSlug, features: dbCourse.features, highlights: dbCourse.features });
    }

    // 2. Check certifications.json
    try {
      const certsDb = await readJsonDbAsync("certifications.json");
      const cleanSlug = normalizedSlug.replace(/[^a-z0-9]/g, "");
      const cert = certsDb.find((c: any) => {
        if (!c || !c.title) return false;
        const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
        const cTitleSlug = c.title.trim().toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
        const cClean = c.title.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        return cSlug === normalizedSlug || cTitleSlug === normalizedSlug || (cleanSlug && cClean === cleanSlug);
      });
      if (cert && Array.isArray(cert.features) && cert.features.length > 0) {
        return res.json({ success: true, slug: normalizedSlug, features: cert.features, highlights: cert.features });
      }
    } catch (e) {
      // Ignore
    }

    return res.json({ success: true, slug: normalizedSlug, features: [], highlights: [] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to fetch highlights" });
  }
});

// PUT /api/courses/:slug/highlights (Update highlights for a course)
router.put("/:slug/highlights", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { highlights, features } = req.body;
    const raw = highlights !== undefined ? highlights : features;
    const featuresList = Array.isArray(raw)
      ? raw.map((s: any) => String(s).trim()).filter(Boolean)
      : (typeof raw === "string" ? raw.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean) : []);
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    // 1. Update Neon DB Course table
    await prisma.course.updateMany({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug: normalizedSlug.replace(/[^a-z0-9]/g, "") },
          { title: { equals: normalizedSlug.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
      data: { features: featuresList },
    });

    // 2. Update certifications.json
    try {
      const certsDb = await readJsonDbAsync("certifications.json");
      const cleanSlug = normalizedSlug.replace(/[^a-z0-9]/g, "");
      const dynamicCertIndex = certsDb.findIndex((c: any) => {
        if (!c || !c.title) return false;
        const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
        const cTitleSlug = c.title.trim().toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
        const cClean = c.title.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        return cSlug === normalizedSlug || cTitleSlug === normalizedSlug || (cleanSlug && cClean === cleanSlug);
      });
      if (dynamicCertIndex !== -1) {
        certsDb[dynamicCertIndex].features = featuresList;
        await writeJsonDbAsync("certifications.json", certsDb);
      }
    } catch (e) {
      console.warn("certifications.json highlights update notice:", e);
    }

    return res.json({
      success: true,
      message: "Highlights updated successfully",
      features: featuresList,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to update highlights" });
  }
});

// POST /api/courses/:slug/curriculum (Add new module)
router.post("/:slug/curriculum", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, topics } = req.body;
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug: normalizedSlug.replace(/[^a-z0-9]/g, "") },
          { title: { equals: normalizedSlug.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
    });

    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, error: "Module title is required" });
    }

    const topicsArray = Array.isArray(topics)
      ? topics.map((t: string) => String(t).trim()).filter(Boolean)
      : typeof topics === "string"
      ? topics.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const newModule = {
      title: title.trim(),
      topics: topicsArray,
    };

    const currentCurriculum = Array.isArray(course.curriculum) ? [...(course.curriculum as any[])] : [];
    currentCurriculum.push(newModule);

    await prisma.course.update({
      where: { id: course.id },
      data: { curriculum: currentCurriculum as any },
    });

    return res.status(201).json({
      success: true,
      message: "Module added to curriculum successfully",
      newModule,
      curriculum: currentCurriculum,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to add module" });
  }
});

// DELETE /api/courses/:slug/curriculum/:moduleIndex
router.delete("/:slug/curriculum/:moduleIndex", async (req: Request, res: Response) => {
  try {
    const { slug, moduleIndex } = req.params;
    const idx = parseInt(moduleIndex, 10);
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug: normalizedSlug.replace(/[^a-z0-9]/g, "") },
          { title: { equals: normalizedSlug.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
    });

    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    const currentCurriculum = Array.isArray(course.curriculum) ? [...(course.curriculum as any[])] : [];

    if (isNaN(idx) || idx < 0 || idx >= currentCurriculum.length) {
      return res.status(400).json({ success: false, error: "Invalid module index" });
    }

    currentCurriculum.splice(idx, 1);

    await prisma.course.update({
      where: { id: course.id },
      data: { curriculum: currentCurriculum as any },
    });

    return res.json({
      success: true,
      message: "Module removed from curriculum",
      curriculum: currentCurriculum,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete module" });
  }
});

// POST /api/courses/apply
router.post("/apply", async (req: Request, res: Response) => {
  try {
    const { id, fullId, courseId, courseTitle, name, email, phone, city, qualification, specialization, message } = req.body;

    if (!courseId || !courseTitle || !name || !email || !phone) {
      return res.status(400).json({ error: "All application fields are required" });
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    const normEmail = String(email).trim().toLowerCase();
    const normCourseId = String(courseId).trim().toLowerCase();
    const normCourseTitle = String(courseTitle).trim().toLowerCase();
    const incomingId = (id || fullId || "").trim();

    // Check existing CMS applications for duplicate within 15 minutes
    const cmsApps = await readJsonDbAsync<any>("course-applications.json");
    const existingIndex = cmsApps.findIndex((a: any) => {
      if (incomingId && (a.id === incomingId || a.fullId === incomingId)) {
        return true;
      }
      const aEmail = String(a.email || a.userEmail || "").trim().toLowerCase();
      const aCourseId = String(a.courseId || "").trim().toLowerCase();
      const aCourseTitle = String(a.courseTitle || "").trim().toLowerCase();
      const aPhone = String(a.phone || a.userPhone || "").replace(/\D/g, "");

      if (aEmail === normEmail && (aCourseId === normCourseId || aCourseTitle === normCourseTitle)) {
        if (aPhone && cleanPhone && aPhone === cleanPhone) {
          const timeDiff = Math.abs(Date.now() - new Date(a.appliedAt || a.createdAt || 0).getTime());
          if (timeDiff < 15 * 60 * 1000) return true;
        }
      }
      return false;
    });

    if (existingIndex !== -1) {
      const existing = cmsApps[existingIndex];
      return res.json({
        success: true,
        message: "Course application already recorded",
        application: existing,
      });
    }

    const appId = incomingId || `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let user: any = null;
    let userId = "";

    try {
      // Find or create user to satisfy Database Application constraints
      user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        const bcrypt = (await import("bcryptjs")).default;
        const randomPassword = Math.random().toString(36).slice(-8) + "A1!";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(randomPassword, salt);
        user = await prisma.user.create({
          data: {
            email,
            name,
            phone,
            passwordHash: hash,
            role: "STUDENT"
          }
        });
      }
      userId = user.id;
    } catch (e) {
      console.warn("Could not create/find user for application:", e);
      userId = `GUEST-${Date.now()}`;
    }

    const newApplication: any = {
      id: appId,
      fullId: appId,
      userId: userId,
      userName: name,
      userEmail: email,
      userPhone: phone,
      name,
      email,
      phone,
      city: city || "",
      qualification: qualification || "",
      specialization: specialization || "",
      message: message || "",
      courseId,
      courseTitle,
      status: "UNDER_REVIEW" as const,
      appliedAt: new Date().toISOString(),
    };

    // 1. Persist to Neon PostgreSQL CmsData table
    try {
      cmsApps.unshift(newApplication);
      await writeJsonDbAsync("course-applications.json", cmsApps);
    } catch (e) {
      console.warn("Async write to course-applications.json notice:", e);
    }
    applicationsDb.push(newApplication);

    // 2. Persist to Prisma Application table
    try {
      let dbCourse = await prisma.course.findFirst({
        where: { OR: [{ slug: courseId }, { title: courseTitle }] },
      });

      if (!dbCourse) {
        // Auto-create course in database if dynamically generated
        dbCourse = await prisma.course.create({
          data: {
            slug: courseId,
            title: courseTitle,
            category: "Certification",
            duration: "3 Months",
            fees: "₹36,000",
            price: 36000,
            description: `${courseTitle} Professional Certification Program`,
            features: ["Industry Certificate", "Hands-on Projects", "Placement Support"],
          },
        });
      }

      if (dbCourse && user && !userId.startsWith("GUEST-")) {
        const existingDbApp = await prisma.application.findFirst({
          where: {
            userId: user.id,
            courseId: dbCourse.id,
            appliedAt: { gte: new Date(Date.now() - 15 * 60 * 1000) }
          }
        });

        if (existingDbApp) {
          newApplication.fullId = existingDbApp.id;
        } else {
          const dbApp = await prisma.application.create({
            data: {
              userId: user.id,
              courseId: dbCourse.id,
              name: name,
              email: email,
              phone: phone,
              city: city || "",
              qualification: qualification || "",
              specialization: specialization || "",
              message: message || "",
              status: "UNDER_REVIEW",
            },
          });
          newApplication.fullId = dbApp.id;
        }
      }
    } catch (dbError) {
      console.warn("Database application creation notice:", dbError);
    }

    // 3. Send email alert in background
    sendCourseApplicationEmail({
      appId,
      name,
      email,
      phone,
      city,
      qualification,
      specialization,
      courseTitle,
      message,
    }).catch(mailErr => console.warn("Failed to send course application email:", mailErr));

    return res.json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to submit course application" });
  }
});

// POST /api/courses (Create a new course)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, category, duration, fees, price, description, features, image } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, error: "Course title is required" });
    }

    const slug = title.trim().toLowerCase().replace(/[\s_]+/g, "-");

    const createdCourse = await prisma.course.create({
      data: {
        slug,
        title: title.trim(),
        category: category || "Information Technology",
        duration: duration || "6 Months",
        fees: fees ? String(fees).trim() : "",
        price: price !== undefined && price !== "" ? parseInt(price) : (fees ? parseInt(String(fees).replace(/[^0-9]/g, "")) || 0 : 0),
        description: description || "",
        features: Array.isArray(features) ? features : [],
        image: image || "",
        curriculum: [],
      },
    });

    const allCourses = await prisma.course.findMany({ orderBy: { title: "asc" } });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: createdCourse,
      courses: allCourses,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to create course" });
  }
});

// PUT /api/courses/:slug (Update a course)
router.put("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, category, duration, fees, price, description, features, image } = req.body;
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    const existing = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug: normalizedSlug.replace(/[^a-z0-9]/g, "") },
          { title: { equals: normalizedSlug.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: existing.id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        category: category !== undefined ? category : existing.category,
        duration: duration !== undefined ? duration : existing.duration,
        fees: fees !== undefined ? String(fees).trim() : existing.fees,
        price: price !== undefined && price !== "" ? parseInt(price) : (fees !== undefined ? (parseInt(String(fees).replace(/[^0-9]/g, "")) || 0) : existing.price),
        description: description !== undefined ? description : existing.description,
        features: features !== undefined && Array.isArray(features) ? features : existing.features,
        image: image !== undefined ? image : existing.image,
      },
    });

    const allCourses = await prisma.course.findMany({ orderBy: { title: "asc" } });

    return res.json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
      courses: allCourses,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to update course" });
  }
});

// DELETE /api/courses/:slug (Delete a course)
router.delete("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    const existing = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug: normalizedSlug.replace(/[^a-z0-9]/g, "") },
          { title: { equals: normalizedSlug.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    await prisma.course.delete({
      where: { id: existing.id },
    });

    const allCourses = await prisma.course.findMany({ orderBy: { title: "asc" } });

    return res.json({
      success: true,
      message: "Course deleted successfully",
      courses: allCourses,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete course" });
  }
});

export default router;

