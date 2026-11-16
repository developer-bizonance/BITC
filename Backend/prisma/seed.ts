import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const dataDir = path.resolve(__dirname, "../src/data");

function getItemKey(item: any): string | null {
  if (!item || typeof item !== "object") return null;
  return item.id || item._id || item.fullId || item.slug || item.email || item.title || item.name || null;
}

function mergeArrays(dbList: any[], fileList: any[]): any[] {
  const mergedMap = new Map<string, any>();
  const unkeyed: any[] = [];

  for (const item of dbList) {
    const key = getItemKey(item);
    if (key) {
      mergedMap.set(String(key).toLowerCase(), item);
    } else {
      unkeyed.push(item);
    }
  }

  for (const item of fileList) {
    const key = getItemKey(item);
    if (key) {
      const lowerKey = String(key).toLowerCase();
      if (!mergedMap.has(lowerKey)) {
        mergedMap.set(lowerKey, item);
      }
    } else {
      unkeyed.push(item);
    }
  }

  return [...Array.from(mergedMap.values()), ...unkeyed];
}

// Fallback baseline courses in case a fresh database has zero courses
const defaultBaselineCourses = [
  {
    slug: "mean-stack",
    title: "MEAN Stack",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Master enterprise full-stack web development using MongoDB, Express.js, Angular, and Node.js (MEAN) for building robust dynamic applications.",
    features: [
      "Angular 17+ Enterprise Architecture",
      "RESTful API & Microservices with Node/Express",
      "NoSQL Data Modeling with MongoDB & Mongoose",
      "Full Stack Deployment & Cloud CI/CD"
    ],
    image: "",
    curriculum: [
      {
        module: "Phase 1 — Web Fundamentals",
        topics: ["HTML5 Semantic Structure", "CSS3 Modern Layouts & Flexbox/Grid", "JavaScript ES6+ Deep Dive", "DOM Manipulation & Event Loop", "Asynchronous JavaScript & Promises", "Git & GitHub Version Control", "Package Managers (npm, pnpm)", "Browser DevTools & Debugging", "Responsive Design & Mobile First", "Web Performance & Core Web Vitals"]
      },
      {
        module: "Phase 2 — Angular Framework Mastery",
        topics: ["Angular CLI & Project Scaffolding", "Components, Templates & Data Binding", "Directives & Custom Pipes", "Services & Dependency Injection", "Angular Routing & Route Guards", "Reactive Forms & Validation", "RxJS Observables & Reactive Programming"]
      },
      {
        module: "Phase 3 — Backend with Node & Express",
        topics: ["Node.js Architecture & Event Loop", "Express Server & RESTful APIs", "Middleware Pipeline & Error Handling", "JWT Authentication & Role-Based Access", "MongoDB Schema Design & Mongoose ODM", "File Uploads & Third-Party Integrations"]
      },
      {
        module: "Phase 4 — Production, Security & Deployment",
        topics: ["Database Indexing & Query Optimization", "Application Security (CORS, Helmet, Rate Limiting)", "Dockerizing MEAN Stack Apps", "Cloud Deployment (AWS / DigitalOcean / Render)", "CI/CD Pipeline Setup", "Capstone Project Review & Interview Prep"]
      }
    ]
  },
  {
    slug: "mern-stack",
    title: "MERN Stack",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Build modern, highly responsive full-stack applications using MongoDB, Express.js, React, and Node.js with industry best practices.",
    features: [
      "React 18+ Hooks & State Management",
      "Full Stack REST APIs with Node & Express",
      "MongoDB & Mongoose Schema Architecture",
      "Production Deployment & Cloud Hosting"
    ],
    image: "",
    curriculum: [
      {
        module: "Phase 1 — Web Fundamentals",
        topics: ["Modern HTML5 & CSS3", "JavaScript ES6+ & TypeScript Basics", "Git Collaboration & CLI"]
      },
      {
        module: "Phase 2 — React Frontend",
        topics: ["React Components & JSX", "Hooks (useState, useEffect, useMemo)", "Context API & Zustand / Redux", "Tailwind CSS & Component Libraries"]
      },
      {
        module: "Phase 3 — Node.js & Express Backend",
        topics: ["Node.js Runtime & Express APIs", "MongoDB & Mongoose", "Authentication & Security"]
      },
      {
        module: "Phase 4 — Full Stack Project & Deployment",
        topics: ["Integration & End-to-End Testing", "Docker & Cloud Deployment", "Portfolio Capstone Project"]
      }
    ]
  },
  {
    slug: "full-stack-python",
    title: "Full Stack Python Development",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Comprehensive Python development covering core programming, Django/FastAPI backend frameworks, PostgreSQL, and modern frontend integration.",
    features: [
      "Python Core & Advanced OOP",
      "Django & Django REST Framework / FastAPI",
      "PostgreSQL Database Design & ORM",
      "Full Stack Deployment & Docker"
    ],
    image: "",
    curriculum: [
      {
        module: "Phase 1 — Python Mastery",
        topics: ["Python Fundamentals & Data Structures", "Object-Oriented Programming (OOP)", "File Handling, Generators & Decorators"]
      },
      {
        module: "Phase 2 — Database & Backend Architecture",
        topics: ["Relational Database Design with PostgreSQL", "Django Framework & ORM", "FastAPI for High-Performance APIs", "Authentication & JWT"]
      },
      {
        module: "Phase 3 — Frontend Integration & Deployment",
        topics: ["Frontend Integration with React", "Docker & CI/CD Pipelines", "Production Cloud Deployment"]
      }
    ]
  },
  {
    slug: "data-science-ai",
    title: "Data Science & Artificial Intelligence",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹42,000",
    price: 42000,
    description: "From data wrangling to deep learning and LLMs: master Python, Pandas, Machine Learning algorithms, and Generative AI workflows.",
    features: [
      "Python for Data Science (NumPy, Pandas)",
      "Machine Learning with Scikit-Learn",
      "Deep Learning with PyTorch / TensorFlow",
      "Generative AI & LLM Engineering"
    ],
    image: "",
    curriculum: [
      {
        module: "Phase 1 — Data Analysis & Statistics",
        topics: ["Python for Data Analysis", "NumPy & Pandas In-Depth", "Data Visualization with Matplotlib & Seaborn", "Descriptive & Inferential Statistics"]
      },
      {
        module: "Phase 2 — Machine Learning",
        topics: ["Supervised & Unsupervised Learning", "Feature Engineering & Model Evaluation", "Ensemble Methods (Random Forest, XGBoost)"]
      },
      {
        module: "Phase 3 — Deep Learning & Generative AI",
        topics: ["Neural Networks with PyTorch", "Computer Vision & NLP Fundamentals", "LLMs, LangChain, & RAG Pipelines"]
      }
    ]
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design Masterclass",
    category: "Design",
    duration: "4 Months",
    fees: "₹28,000",
    price: 28000,
    description: "Learn human-centered design, user research, wireframing, high-fidelity prototyping in Figma, and design systems.",
    features: [
      "User Research & Journey Mapping",
      "Figma Advanced Prototyping & Auto-Layout",
      "Design Systems & Component Libraries",
      "Portfolio Review & Client Case Studies"
    ],
    image: "",
    curriculum: [
      {
        module: "Phase 1 — Design Thinking & UX Research",
        topics: ["UX Fundamentals & Design Thinking", "User Research & Personas", "Information Architecture & User Flows"]
      },
      {
        module: "Phase 2 — UI Design & Figma Mastery",
        topics: ["Figma Mastery & Auto-Layout", "Typography, Color Theory & Spacing", "Design Systems & Token Architecture"]
      },
      {
        module: "Phase 3 — Interactive Prototyping & Portfolio",
        topics: ["Micro-interactions & Animations", "Usability Testing & Iteration", "End-to-End Case Study Presentation"]
      }
    ]
  }
];

async function getCmsDataArray(key: string): Promise<any[]> {
  const row = await prisma.cmsData.findUnique({ where: { key } });
  if (!row || !row.data) return [];
  if (Array.isArray(row.data)) return row.data as any[];
  if (typeof row.data === "object") return [row.data as any];
  return [];
}

async function syncAllRelationalTables() {
  // 1. Academic Partners (partners.json)
  const partners = await getCmsDataArray("partners.json");
  for (const item of partners) {
    const id = item.id || `partner-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await prisma.academicPartner.upsert({
      where: { id },
      update: {
        name: item.name || "Academic Partner",
        city: item.city || "",
        logo: item.logo || "",
        isActive: typeof item.isActive === "boolean" ? item.isActive : true,
      },
      create: {
        id,
        name: item.name || "Academic Partner",
        city: item.city || "",
        logo: item.logo || "",
        isActive: typeof item.isActive === "boolean" ? item.isActive : true,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    }).catch(() => {});
  }

  // 2. Industry Partners (industry-partners.json)
  const industryPartners = await getCmsDataArray("industry-partners.json");
  for (const item of industryPartners) {
    const id = item.id || `ip-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await prisma.industryPartner.upsert({
      where: { id },
      update: {
        name: item.name || "Industry Partner",
        logo: item.logo || "",
        website: item.website || "",
        category: item.category || "Information Technology",
        isActive: typeof item.isActive === "boolean" ? item.isActive : true,
      },
      create: {
        id,
        name: item.name || "Industry Partner",
        logo: item.logo || "",
        website: item.website || "",
        category: item.category || "Information Technology",
        isActive: typeof item.isActive === "boolean" ? item.isActive : true,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    }).catch(() => {});
  }

  // 3. Top Recruiters (hiring-partners.json)
  const recruiters = await getCmsDataArray("hiring-partners.json");
  for (const item of recruiters) {
    const id = item.id || `recruiter-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await prisma.topRecruiter.upsert({
      where: { id },
      update: {
        name: item.name || "Recruiter",
        logo: item.logo || "",
        website: item.website || "",
        category: item.category || "Information Technology",
        isActive: typeof item.isActive === "boolean" ? item.isActive : true,
      },
      create: {
        id,
        name: item.name || "Recruiter",
        logo: item.logo || "",
        website: item.website || "",
        category: item.category || "Information Technology",
        isActive: typeof item.isActive === "boolean" ? item.isActive : true,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    }).catch(() => {});
  }

  // 4. FAQs (faq.json)
  const faqs = await getCmsDataArray("faq.json");
  for (const item of faqs) {
    const id = item.id || `faq-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await prisma.faq.upsert({
      where: { id },
      update: {
        question: item.question || "",
        answer: item.answer || "",
        category: item.category || "General",
        isActive: typeof item.isActive === "boolean" ? item.isActive : true,
      },
      create: {
        id,
        question: item.question || "",
        answer: item.answer || "",
        category: item.category || "General",
        isActive: typeof item.isActive === "boolean" ? item.isActive : true,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    }).catch(() => {});
  }

  // 5. Testimonials (testimonials.json)
  const testimonials = await getCmsDataArray("testimonials.json");
  for (const item of testimonials) {
    const id = item.id || `testi-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await prisma.testimonial.upsert({
      where: { id },
      update: {
        name: item.name || "Student",
        role: item.role || "",
        company: item.company || "",
        image: item.image || "",
        quote: item.quote || "",
        course: item.course || "",
        rating: typeof item.rating === "number" ? item.rating : 5,
        packageAmt: item.packageAmt || "",
        youtubeUrl: item.youtubeUrl || "",
      },
      create: {
        id,
        name: item.name || "Student",
        role: item.role || "",
        company: item.company || "",
        image: item.image || "",
        quote: item.quote || "",
        course: item.course || "",
        rating: typeof item.rating === "number" ? item.rating : 5,
        packageAmt: item.packageAmt || "",
        youtubeUrl: item.youtubeUrl || "",
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    }).catch(() => {});
  }

  // 6. Mentors (mentors.json)
  const mentors = await getCmsDataArray("mentors.json");
  for (const item of mentors) {
    const id = item.id || `mentor-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await prisma.mentor.upsert({
      where: { id },
      update: {
        name: item.name || "Mentor",
        role: item.role || "Instructor",
        company: item.company || "",
        bio: item.bio || "",
        exp: item.exp || "",
        img: item.img || "",
        area: item.area || "",
        skills: Array.isArray(item.skills) ? item.skills : [],
        thought: item.thought || "",
        linkedin: item.linkedin || "",
      },
      create: {
        id,
        name: item.name || "Mentor",
        role: item.role || "Instructor",
        company: item.company || "",
        bio: item.bio || "",
        exp: item.exp || "",
        img: item.img || "",
        area: item.area || "",
        skills: Array.isArray(item.skills) ? item.skills : [],
        thought: item.thought || "",
        linkedin: item.linkedin || "",
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    }).catch(() => {});
  }

  // 7. Careers (careers.json)
  const careers = await getCmsDataArray("careers.json");
  for (const item of careers) {
    const id = item.id || `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await prisma.career.upsert({
      where: { id },
      update: {
        title: item.title || "Job Position",
        department: item.department || "",
        location: item.location || "On-Site",
        type: item.type || "Full-Time",
        experience: item.experience || "",
        description: item.description || "",
        specialities: item.specialities || "",
        status: item.status || "Active",
      },
      create: {
        id,
        title: item.title || "Job Position",
        department: item.department || "",
        location: item.location || "On-Site",
        type: item.type || "Full-Time",
        experience: item.experience || "",
        description: item.description || "",
        specialities: item.specialities || "",
        status: item.status || "Active",
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    }).catch(() => {});
  }

  // 8. Inquiries (inquiries.json)
  const inquiries = await getCmsDataArray("inquiries.json");
  for (const item of inquiries) {
    const id = item.id || `INQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await prisma.inquiry.upsert({
      where: { id },
      update: {
        name: item.name || "Inquirer",
        email: item.email || "",
        phone: item.phone || "",
        city: item.city || "",
        school: item.school || "",
        college: item.college || item.collegeName || "",
        collegeName: item.collegeName || item.college || "",
        enquiryType: item.enquiryType || "General Inquiry",
        message: item.message || "",
        status: item.status || "PENDING",
      },
      create: {
        id,
        name: item.name || "Inquirer",
        email: item.email || "",
        phone: item.phone || "",
        city: item.city || "",
        school: item.school || "",
        college: item.college || item.collegeName || "",
        collegeName: item.collegeName || item.college || "",
        enquiryType: item.enquiryType || "General Inquiry",
        message: item.message || "",
        status: item.status || "PENDING",
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    }).catch(() => {});
  }
}

async function main() {
  console.log("🚀 Starting database synchronization and seeding...\n");

  // 1. If local src/data directory exists, sync files into DB
  if (fs.existsSync(dataDir)) {
    console.log(`📂 Found local data directory at ${dataDir}. Syncing files...`);
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"));

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      try {
        let rawData = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
        if (!rawData.trim()) continue;
        const fileParsed = JSON.parse(rawData);

        const existingDb = await prisma.cmsData.findUnique({ where: { key: file } });
        let finalData: any;

        if (Array.isArray(fileParsed)) {
          const dbList = existingDb && Array.isArray(existingDb.data) ? (existingDb.data as any[]) : [];
          finalData = mergeArrays(dbList, fileParsed);
        } else {
          finalData = existingDb?.data || fileParsed;
        }

        await prisma.cmsData.upsert({
          where: { key: file },
          update: { data: finalData },
          create: { key: file, data: finalData },
        });

        const count = Array.isArray(finalData) ? finalData.length : 1;
        console.log(`✅ [CmsData] ${file}: synchronized ${count} records into DB`);
      } catch (err: any) {
        console.error(`❌ Failed to sync ${file}:`, err.message);
      }
    }
  } else {
    console.log("ℹ️  Using Neon PostgreSQL as the primary production data store.\n");
  }

  // 2. Ensure default Admin User exists in DB
  try {
    const adminEmail = "admin@bizonance.in";
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          id: "usr_admin_1",
          name: "Admin User",
          email: adminEmail,
          passwordHash: "$2a$10$YLlckrE8zUYTTMzgi7lkm.NREhZDT1LiEbLqyyZ1t049QX2J/60oK", // admin123
          phone: "+91 89567 27311",
          role: "ADMIN",
        },
      });
      console.log(`✅ [User Model] Created default Admin User (${adminEmail})`);
    } else {
      console.log(`✅ [User Model] Admin User verified (${adminEmail})`);
    }
  } catch (err: any) {
    console.error("❌ Failed to verify admin user:", err.message);
  }

  // 3. Ensure Course catalog is populated
  try {
    const courseCount = await prisma.course.count();
    if (courseCount === 0) {
      console.log("ℹ️  Course table is empty. Seeding baseline courses...");
      for (const course of defaultBaselineCourses) {
        await prisma.course.create({ data: course });
      }
      console.log(`✅ [Course Model] Seeded ${defaultBaselineCourses.length} baseline courses`);
    } else {
      console.log(`✅ [Course Model] Verified ${courseCount} active courses in database`);
    }
  } catch (err: any) {
    console.error("❌ Failed to verify courses:", err.message);
  }

  // 4. Synchronize all relational tables from CmsData
  console.log("\n🔄 Synchronizing data into relational SQL tables...");
  await syncAllRelationalTables();

  // 5. Check and report complete overview statistics of real PostgreSQL tables
  try {
    const stats = [
      { table: "User", count: await prisma.user.count() },
      { table: "Course", count: await prisma.course.count() },
      { table: "AcademicPartner", count: await prisma.academicPartner.count() },
      { table: "IndustryPartner", count: await prisma.industryPartner.count() },
      { table: "TopRecruiter", count: await prisma.topRecruiter.count() },
      { table: "Faq", count: await prisma.faq.count() },
      { table: "Testimonial", count: await prisma.testimonial.count() },
      { table: "Mentor", count: await prisma.mentor.count() },
      { table: "Career", count: await prisma.career.count() },
      { table: "JobApplication", count: await prisma.jobApplication.count() },
      { table: "ScholarshipApplication", count: await prisma.scholarshipApplication.count() },
      { table: "PartnershipApplication", count: await prisma.partnershipApplication.count() },
      { table: "ContactEntry", count: await prisma.contactEntry.count() },
      { table: "Inquiry", count: await prisma.inquiry.count() },
      { table: "Application", count: await prisma.application.count() },
      { table: "GalleryItem", count: await prisma.galleryItem.count() },
      { table: "DownloadItem", count: await prisma.downloadItem.count() },
      { table: "Alumni", count: await prisma.alumni.count() },
      { table: "AlumniCompany", count: await prisma.alumniCompany.count() },
      { table: "Category", count: await prisma.category.count() },
      { table: "EnquiryType", count: await prisma.enquiryType.count() },
      { table: "Event", count: await prisma.event.count() },
      { table: "EventRegistration", count: await prisma.eventRegistration.count() },
      { table: "Blog", count: await prisma.blog.count() },
    ];

    console.log("\n📊 Relational SQL Tables Status (Live Neon PostgreSQL):");
    console.log("-------------------------------------------------------");
    for (const s of stats) {
      console.log(`   • ${s.table.padEnd(25)}: ${s.count} rows`);
    }
    console.log("-------------------------------------------------------");
  } catch (err: any) {
    console.warn("⚠️  Could not fetch complete DB stats:", err.message);
  }

  console.log("\n🎉 Database relational table synchronization completed successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Fatal error during seed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
