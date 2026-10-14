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

    let dbCourse = null;
    try {
      dbCourse = await prisma.course.findUnique({ where: { slug: normalizedSlug } });
    } catch (e) {
      console.warn("DB course lookup notice:", e);
    }

    if (dbCourse) {
      try {
        const certsDb = await readJsonDbAsync("certifications.json");
        const matchedCert = certsDb.find((c: any) => {
          if (!c.title) return false;
          const cNorm = c.title.toLowerCase().replace(/[^a-z0-9]/g, "");
          const sSlugNorm = dbCourse.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
          const sTitleNorm = dbCourse.title.toLowerCase().replace(/[^a-z0-9]/g, "");
          return cNorm === sSlugNorm || sSlugNorm.includes(cNorm) || cNorm.includes(sSlugNorm) || cNorm === sTitleNorm || sTitleNorm.includes(cNorm) || cNorm.includes(sTitleNorm);
        });
        if (matchedCert && matchedCert.features && matchedCert.features.length > 0) {
          dbCourse.features = matchedCert.features;
        }
      } catch (e) {
        console.warn("Could not merge features from certifications.json into dbCourse:", e);
      }
      return res.json({ success: true, course: dbCourse });
    }

    const staticCourse = fallbackCourses.find((c) => c.slug === normalizedSlug);
    if (staticCourse) {
      // Merge features from certifications.json if they exist (since Prisma is failing)
      try {
        const certsDb = await readJsonDbAsync("certifications.json");
        const matchedCert = certsDb.find((c: any) => {
          if (!c.title) return false;
          const cNorm = c.title.toLowerCase().replace(/[^a-z0-9]/g, "");
          const sSlugNorm = staticCourse.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
          const sTitleNorm = staticCourse.title.toLowerCase().replace(/[^a-z0-9]/g, "");
          return cNorm === sSlugNorm || sSlugNorm.includes(cNorm) || cNorm.includes(sSlugNorm) || cNorm === sTitleNorm || sTitleNorm.includes(cNorm) || cNorm.includes(sTitleNorm);
        });
        if (matchedCert && matchedCert.features && matchedCert.features.length > 0) {
          staticCourse.features = matchedCert.features;
        }
      } catch (e) {
        console.warn("Could not merge features from certifications.json:", e);
      }
      return res.json({ success: true, course: staticCourse });
    }

    // If not in Prisma AND not in fallbackCourses, check certifications.json directly
    try {
      const certsDb = await readJsonDbAsync("certifications.json");
      const cleanSlug = normalizedSlug.replace(/[^a-z0-9]/g, '');
      const dynamicCert = certsDb.find((c: any) => {
        if (!c || !c.title) return false;
        const cId = String(c.id || "").toLowerCase();
        const cSlug = String(c.slug || "").toLowerCase().replace(/[\s_]+/g, "-");
        const cTitleSlug = c.title.trim().toLowerCase().replace(/ & /g, '-').replace(/[\/\s_]+/g, "-");
        const cClean = c.title.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        return cId === normalizedSlug || cSlug === normalizedSlug || cTitleSlug === normalizedSlug || (cleanSlug && cClean === cleanSlug);
      });
      
      if (dynamicCert) {
        return res.json({
          success: true,
          course: {
            slug: normalizedSlug,
            title: dynamicCert.title,
            category: dynamicCert.category || "Information Technology",
            duration: dynamicCert.duration || "6 Months",
            fees: dynamicCert.fees || "₹36,000",
            price: parseInt(String(dynamicCert.fees || "36000").replace(/[^0-9]/g, "")) || 36000,
            description: dynamicCert.description || "A comprehensive program designed to provide industry-ready skills and hands-on experience.",
            features: dynamicCert.features && dynamicCert.features.length > 0 ? dynamicCert.features : [
              "Practical Industry Training & Live Labs",
              "Hands-On Capstone Projects & Portfolio Building",
              "1-on-1 Mentorship & Code Reviews",
              "Dedicated 100% Placement Assistance",
              "Recognized Industrial Certification"
            ],
            image: dynamicCert.image || "",
            curriculum: dynamicCert.curriculum || []
          }
        });
      }
    } catch (e) {
      console.warn("Could not check certifications.json for dynamic course:", e);
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

    const course = fallbackCourses.find((c) => c.slug === normalizedSlug);
    if (!course) {
      try {
        const certsDb = await readJsonDbAsync("certifications.json");
        const dynamicCert = certsDb.find((c: any) => c.title && c.title.trim().toLowerCase().replace(/[\s_]+/g, "-") === normalizedSlug);
        if (dynamicCert) {
          return res.json({
            success: true,
            slug: normalizedSlug,
            title: dynamicCert.title,
            curriculum: dynamicCert.curriculum || [],
          });
        }
      } catch (e) {}
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    return res.json({
      success: true,
      slug: course.slug,
      title: course.title,
      curriculum: course.curriculum || [],
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to fetch curriculum" });
  }
});

// PUT /api/courses/:slug/curriculum (Full curriculum update or save)
router.put("/:slug/curriculum", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { curriculum } = req.body;
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, "-");

    const courseIndex = fallbackCourses.findIndex((c) => c.slug === normalizedSlug);
    if (courseIndex === -1) {
      try {
        const certsDb = await readJsonDbAsync("certifications.json");
        const dynamicCertIndex = certsDb.findIndex((c: any) => c.title && c.title.trim().toLowerCase().replace(/[\s_]+/g, "-") === normalizedSlug);
        if (dynamicCertIndex !== -1) {
          certsDb[dynamicCertIndex].curriculum = curriculum;
          await writeJsonDbAsync("certifications.json", certsDb);
          return res.json({ success: true, message: "Curriculum updated successfully in JSON fallback" });
        }
      } catch (e) {}
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    if (!Array.isArray(curriculum)) {
      return res.status(400).json({ success: false, error: "Curriculum must be an array of modules" });
    }

    fallbackCourses[courseIndex].curriculum = curriculum;

    try {
      await prisma.course.update({
        where: { slug: normalizedSlug },
        data: { curriculum: curriculum as any },
      });
    } catch (e) {
      // Prisma optional in development
    }

    return res.json({
      success: true,
      message: "Curriculum updated successfully",
      course: fallbackCourses[courseIndex],
      curriculum: fallbackCourses[courseIndex].curriculum,
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
      fees: fees || "₹36,000",
      price: price ? parseInt(price) : 36000,
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

