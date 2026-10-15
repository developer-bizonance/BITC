import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { courses as fallbackCourses } from "../data/courses.js";
import { verifyJWT } from "../lib/jwt.js";
import { applicationsDb } from "../lib/userStore.js";
import { readJsonDbAsync, writeJsonDbAsync, readJsonDb, writeJsonDb } from "../dataStore.js";

const router = Router();

// GET /api/courses
router.get("/", async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;

    let dbCourses = null;
    try {
      dbCourses = await prisma.course.findMany({
        where: category ? { category } : undefined,
        orderBy: { title: "asc" },
      });
    } catch (dbError) {
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
      ? fallbackCourses.filter((c) => c.category.toLowerCase() === category.toLowerCase())
      : fallbackCourses;

    return res.json({
      success: true,
      source: "static",
      courses: filteredCourses,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch courses" });
  }
});

// GET /api/courses/:slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    // 1. Primary check: Neon Postgres Course table
    let dbCourse = null;
    try {
      dbCourse = await prisma.course.findFirst({
        where: {
          OR: [
            { slug: normalizedSlug },
            { slug: normalizedSlug.replace(/[^a-z0-9]/g, "") },
            { title: { equals: normalizedSlug.replace(/-/g, " "), mode: "insensitive" } },
          ],
        },
      });
    } catch (e) {
      console.warn("DB course lookup notice:", e);
    }

    if (dbCourse) {
      return res.json({ success: true, course: dbCourse });
    }

    // 2. Check certifications.json (dashboard-managed certifications)
    try {
      const certsDb = await readJsonDbAsync("certifications.json");
      const cleanSlug = normalizedSlug.replace(/[^a-z0-9]/g, "");
      const dynamicCert = certsDb.find((c: any) => {
        if (!c || !c.title) return false;
        const cId = String(c.id || "").toLowerCase();
        const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
        const cTitleSlug = c.title.trim().toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
        const cClean = c.title.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        return (
          cId === normalizedSlug ||
          cSlug === normalizedSlug ||
          cTitleSlug === normalizedSlug ||
          (cleanSlug && cClean === cleanSlug)
        );
      });

      if (dynamicCert) {
        return res.json({
          success: true,
          course: {
            slug: dynamicCert.slug || normalizedSlug,
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
    } catch (e) {
      console.warn("Could not check certifications.json for dynamic course:", e);
    }

    // 3. Fallback to static courses
    const staticCourse = fallbackCourses.find((c) => c.slug === normalizedSlug);
    if (staticCourse) {
      return res.json({ success: true, course: staticCourse });
    }

    return res.status(404).json({ success: false, error: "Course not found" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch course details" });
  }
});

// GET /api/courses/:slug/curriculum
router.get("/:slug/curriculum", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    // 1. Check Neon DB first
    try {
      const dbCourse = await prisma.course.findFirst({
        where: {
          OR: [
            { slug: normalizedSlug },
            { slug: normalizedSlug.replace(/[^a-z0-9]/g, "") },
            { title: { equals: normalizedSlug.replace(/-/g, " "), mode: "insensitive" } },
          ],
        },
      });
      if (dbCourse && Array.isArray(dbCourse.curriculum) && dbCourse.curriculum.length > 0) {
        return res.json({
          success: true,
          slug: dbCourse.slug,
          title: dbCourse.title,
          curriculum: dbCourse.curriculum,
        });
      }
    } catch (e) {
      console.warn("DB curriculum fetch notice:", e);
    }

    // 2. Check certifications.json
    try {
      const certsDb = await readJsonDbAsync("certifications.json");
      const cleanSlug = normalizedSlug.replace(/[^a-z0-9]/g, "");
      const dynamicCert = certsDb.find((c: any) => {
        if (!c || !c.title) return false;
        const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
        const cTitleSlug = c.title.trim().toLowerCase().replace(/ & /g, "-").replace(/[\/\s_]+/g, "-");
        const cClean = c.title.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        return cSlug === normalizedSlug || cTitleSlug === normalizedSlug || (cleanSlug && cClean === cleanSlug);
      });
      if (dynamicCert && Array.isArray(dynamicCert.curriculum)) {
        return res.json({
          success: true,
          slug: normalizedSlug,
          title: dynamicCert.title,
          curriculum: dynamicCert.curriculum,
        });
      }
    } catch (e) {}

    // 3. Fallback to static
    const course = fallbackCourses.find((c) => c.slug === normalizedSlug);
    if (course) {
      return res.json({
        success: true,
        slug: course.slug,
        title: course.title,
        curriculum: course.curriculum || [],
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
    const { curriculum } = req.body;
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    if (!Array.isArray(curriculum)) {
      return res.status(400).json({ success: false, error: "Curriculum must be an array of modules" });
    }

    // 1. Update Neon DB Course table
    try {
      await prisma.course.updateMany({
        where: {
          OR: [
            { slug: normalizedSlug },
            { slug: normalizedSlug.replace(/[^a-z0-9]/g, "") },
            { title: { equals: normalizedSlug.replace(/-/g, " "), mode: "insensitive" } },
          ],
        },
        data: { curriculum: curriculum as any },
      });
    } catch (e) {
      console.warn("DB curriculum update notice:", e);
    }

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
        certsDb[dynamicCertIndex].curriculum = curriculum;
        await writeJsonDbAsync("certifications.json", certsDb);
      }
    } catch (e) {
      console.warn("certifications.json curriculum update notice:", e);
    }

    // 3. Update static fallback in memory if present
    const courseIndex = fallbackCourses.findIndex((c) => c.slug === normalizedSlug);
    if (courseIndex !== -1) {
      fallbackCourses[courseIndex].curriculum = curriculum;
    }

    return res.json({
      success: true,
      message: "Curriculum updated successfully",
      curriculum,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to update curriculum" });
  }
});

// POST /api/courses/:slug/curriculum (Add new module)
router.post("/:slug/curriculum", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, topics } = req.body;
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    const course = fallbackCourses.find((c) => c.slug === normalizedSlug);
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

    if (!course.curriculum) course.curriculum = [];
    course.curriculum.push(newModule);

    return res.status(201).json({
      success: true,
      message: "Module added to curriculum successfully",
      newModule,
      curriculum: course.curriculum,
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

    const course = fallbackCourses.find((c) => c.slug === normalizedSlug);
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
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete module" });
  }
});

// POST /api/courses/apply
router.post("/apply", async (req: Request, res: Response) => {
  try {
    const { courseId, courseTitle, name, email, phone, city, qualification, specialization, message } = req.body;
    console.log("RECEIVED BODY:", JSON.stringify(req.body));

    if (!courseId || !courseTitle || !name || !email || !phone) {
      return res.status(400).json({ error: "All application fields are required" });
    }

    let userId = "";

    try {
      // Find or create user to satisfy Database Application constraints
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        const bcrypt = require("bcryptjs");
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

    const newApplication = {
      id: `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: userId,
      userName: name,
      userEmail: email,
      userPhone: phone,
      city,
      qualification,
      specialization,
      message,
      courseId,
      courseTitle,
      status: "UNDER_REVIEW" as const,
      appliedAt: new Date().toISOString(),
    };

    try {
      const localApps = readJsonDb<any>("course-applications.json");
      localApps.unshift(newApplication);
      writeJsonDb("course-applications.json", localApps);
    } catch (e) {
      console.warn("Fallback to applicationsDb");
      applicationsDb.push(newApplication);
    }

    try {
      const dbCourse = await prisma.course.findFirst({
        where: { OR: [{ slug: courseId }, { title: courseTitle }] },
      });

      if (dbCourse && !userId.startsWith("GUEST-")) {
        await prisma.application.create({
          data: {
            userId: userId,
            courseId: dbCourse.id,
            name: name,
            email: email,
            phone: phone,
            city,
            qualification,
            specialization,
            message,
            status: "UNDER_REVIEW",
          },
        });
      }
    } catch (dbError) {
      console.warn("Database application creation notice:", dbError);
    }

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

    const newCourse = {
      slug,
      title: title.trim(),
      category: category || "Information Technology",
      duration: duration || "6 Months",
      fees: fees || "",
      price: price ? parseInt(price) : (fees ? parseInt(String(fees).replace(/[^0-9]/g, "")) || 0 : 0),
      description: description || "",
      features: Array.isArray(features) ? features : [],
      image: image || "",
      curriculum: [],
    };

    // Save to fallback array
    fallbackCourses.push(newCourse as any);

    // Save to DB if available
    try {
      await prisma.course.create({
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
    } catch (e) {
      console.warn("DB course creation notice:", e);
    }

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
      courses: fallbackCourses,
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

    const courseIndex = fallbackCourses.findIndex((c) => c.slug === normalizedSlug);
    if (courseIndex === -1) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    const current = fallbackCourses[courseIndex];
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

    fallbackCourses[courseIndex] = updated as any;

    try {
      await prisma.course.update({
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
    } catch (e) {
      // Ignore Prisma errors in dev
    }

    return res.json({
      success: true,
      message: "Course updated successfully",
      course: updated,
      courses: fallbackCourses,
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

    const courseIndex = fallbackCourses.findIndex((c) => c.slug === normalizedSlug);
    if (courseIndex === -1) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    fallbackCourses.splice(courseIndex, 1);

    try {
      await prisma.course.delete({
        where: { slug: normalizedSlug },
      });
    } catch (e) {
      // Ignore Prisma errors in dev
    }

    return res.json({
      success: true,
      message: "Course deleted successfully",
      courses: fallbackCourses,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete course" });
  }
});

export default router;

