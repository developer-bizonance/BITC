import prisma from "./lib/prisma.js";

// In-memory cache for fast access
const memoryCache = new Map<string, any[]>();

// Circuit-breaker / Cooldown for DB unreachable or quota-exceeded states
let lastDbFailureTime = 0;
const DB_FAILURE_COOLDOWN_MS = 30000; // 30 seconds

export function isDbConnectionDown(): boolean {
  return Date.now() - lastDbFailureTime < DB_FAILURE_COOLDOWN_MS;
}

export function recordDbFailure(err?: any) {
  lastDbFailureTime = Date.now();
}

export function recordDbSuccess() {
  lastDbFailureTime = 0;
}

/**
 * Reads data directly from the dedicated PostgreSQL relational table.
 */
async function queryRelationalTable<T>(key: string): Promise<T[] | null> {
  if (isDbConnectionDown()) {
    return null;
  }
  try {
    switch (key) {
      case "partners.json": {
        const rows = await prisma.academicPartner.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
        return rows as any;
      }
      case "industry-partners.json": {
        const rows = await prisma.industryPartner.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
        return rows as any;
      }
      case "hiring-partners.json": {
        const rows = await prisma.topRecruiter.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
        return rows as any;
      }
      case "faq.json": {
        const rows = await prisma.faq.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
        return rows as any;
      }
      case "testimonials.json": {
        const rows = await prisma.testimonial.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
        return rows as any;
      }
      case "employee-testimonials.json": {
        const rows = await prisma.employeeTestimonial.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
        return rows as any;
      }
      case "video-testimonials.json": {
        const rows = await prisma.videoTestimonial.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
        return rows as any;
      }
      case "mentors.json": {
        const rows = await prisma.mentor.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
        return rows.map((r: any) => ({
          ...r,
          companyLogo: r.companyLogo || "",
          category: r.category || r.area || "Industry Expert",
          area: r.category || r.area || "Industry Expert",
        })) as any;
      }
      case "careers.json": {
        const rows = await prisma.career.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
        return rows as any;
      }
      case "applications.json":
      case "join-team.json": {
        const rows = await prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" } });
        return rows as any;
      }
      case "scholarships.json": {
        const rows = await prisma.scholarshipApplication.findMany({ orderBy: { createdAt: "desc" } });
        return rows as any;
      }
      case "partnership-applications.json": {
        const rows = await prisma.partnershipApplication.findMany({ orderBy: { createdAt: "desc" } });
        return rows as any;
      }
      case "contact.json": {
        const rows = await prisma.contactEntry.findMany({ orderBy: { createdAt: "desc" } });
        return rows as any;
      }
      case "inquiries.json": {
        const rows = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
        return rows as any;
      }
      case "course-applications.json": {
        const rows = await prisma.application.findMany({ orderBy: { appliedAt: "desc" } });
        return rows as any;
      }
      case "gallery.json": {
        const rows = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
        return rows as any;
      }
      case "downloads.json": {
        const rows = await prisma.downloadItem.findMany({ orderBy: { createdAt: "desc" } });
        return rows as any;
      }
      case "alumni.json": {
        const rows = await prisma.alumni.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
        return rows as any;
      }
      case "alumni-companies.json": {
        const rows = await prisma.alumniCompany.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
        return rows as any;
      }
      case "categories.json": {
        const rows = await prisma.category.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
        return rows as any;
      }
      case "enquiryTypes.json": {
        try {
          const cmsRecord = await prisma.cmsData.findUnique({
            where: { key: "enquiryTypes.json" },
          });
          if (cmsRecord && Array.isArray(cmsRecord.data) && cmsRecord.data.length > 0) {
            const list = (cmsRecord.data as any[]).map((r) => (typeof r === "string" ? r.trim() : r.name || String(r))).filter(Boolean);
            if (list.length > 0) return list as any;
          }
        } catch (cmsErr) {
          console.warn("[dataStore] Failed to read enquiryTypes.json from CmsData:", cmsErr);
        }
        const rows = await prisma.enquiryType.findMany({ orderBy: { createdAt: "asc" } });
        return rows.map((r) => r.name) as any;
      }
      case "events.json": {
        try {
          const cmsRecord = await prisma.cmsData.findUnique({
            where: { key: "events.json" },
          });
          if (cmsRecord && Array.isArray(cmsRecord.data) && cmsRecord.data.length > 0) {
            return cmsRecord.data as any;
          }
        } catch (cmsErr) {
          console.warn("[dataStore] Failed to read events.json from CmsData:", cmsErr);
        }
        const rows = await prisma.event.findMany({ orderBy: { date: "asc" } });
        return rows as any;
      }
      case "event-registrations.json": {
        const rows = await prisma.eventRegistration.findMany({ orderBy: { createdAt: "desc" } });
        return rows as any;
      }
      case "blogs.json": {
        const rows = await prisma.blog.findMany({ orderBy: { publishedAt: "desc" } });
        return rows as any;
      }
      case "event-subscribers.json": {
        if ((prisma as any).eventSubscriber?.findMany) {
          const rows = await (prisma as any).eventSubscriber.findMany({ orderBy: { createdAt: "desc" } });
          return rows as any;
        }
        return null;
      }
      default:
        return null;
    }
  } catch (err: any) {
    recordDbFailure(err);
    console.warn(`[dataStore] Failed to query relational table for ${key}:`, err?.message || err);
    return null;
  }
}

/**
 * Helper to sync deleted records with PostgreSQL table.
 * If currentIds has items, delete items NOT in currentIds.
 * If currentIds is empty, delete ALL items in the table.
 */
async function syncTableIds(model: any, currentIds: Set<string>, idField: string = "id") {
  if (!model?.deleteMany) return;
  try {
    if (currentIds.size > 0) {
      await model.deleteMany({ where: { [idField]: { notIn: Array.from(currentIds) } } });
    } else {
      await model.deleteMany({});
    }
  } catch (err: any) {
    console.warn(`[dataStore] syncTableIds for ${idField} notice:`, err.message);
  }
}

/**
 * Persists data array into the dedicated PostgreSQL relational table.
 */
async function syncToRelationalTable(key: string, data: any[]): Promise<void> {
  if (!Array.isArray(data)) return;

  try {
    switch (key) {
      case "partners.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.academicPartner, currentIds);
        for (let idx = 0; idx < data.length; idx++) {
          const item = data[idx];
          const id = item.id || `partner-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.academicPartner.upsert({
            where: { id },
            update: {
              name: item.name || "Academic Partner",
              city: item.city || "",
              logo: item.logo || "",
              isActive: typeof item.isActive === "boolean" ? item.isActive : true,
              order: typeof item.order === "number" ? item.order : idx,
            },
            create: {
              id,
              name: item.name || "Academic Partner",
              city: item.city || "",
              logo: item.logo || "",
              isActive: typeof item.isActive === "boolean" ? item.isActive : true,
              order: typeof item.order === "number" ? item.order : idx,
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "industry-partners.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.industryPartner, currentIds);
        for (const item of data) {
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
          });
        }
        break;
      }
      case "hiring-partners.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.topRecruiter, currentIds);
        for (const item of data) {
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
          });
        }
        break;
      }
      case "faq.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.faq, currentIds);
        for (const item of data) {
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
          });
        }
        break;
      }
      case "testimonials.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.testimonial, currentIds);
        for (const item of data) {
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
          });
        }
        break;
      }
      case "employee-testimonials.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.employeeTestimonial, currentIds);
        for (const item of data) {
          const id = item.id || `emp-testi-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.employeeTestimonial.upsert({
            where: { id },
            update: {
              name: item.name || "Faculty Member",
              role: item.role || "",
              image: item.image || "",
              quote: item.quote || "",
              rating: typeof item.rating === "number" ? item.rating : 5,
            },
            create: {
              id,
              name: item.name || "Faculty Member",
              role: item.role || "",
              image: item.image || "",
              quote: item.quote || "",
              rating: typeof item.rating === "number" ? item.rating : 5,
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "video-testimonials.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.videoTestimonial, currentIds);
        for (const item of data) {
          const id = item.id || `vt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.videoTestimonial.upsert({
            where: { id },
            update: {
              name: item.name || "Student Video",
              title: item.title || "",
              youtubeUrl: item.youtubeUrl || "",
            },
            create: {
              id,
              name: item.name || "Student Video",
              title: item.title || "",
              youtubeUrl: item.youtubeUrl || "",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "mentors.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.mentor, currentIds);
        for (const item of data) {
          const id = item.id || `mentor-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const chosenCategory = item.category || item.area || "Industry Expert";
          await prisma.mentor.upsert({
            where: { id },
            update: {
              name: item.name || "Mentor",
              role: item.role || "Instructor",
              company: item.company || "",
              companyLogo: item.companyLogo || "",
              bio: item.bio || "",
              exp: item.exp || "",
              img: item.img || "",
              area: chosenCategory,
              skills: Array.isArray(item.skills) ? item.skills : [],
              thought: item.thought || "",
              linkedin: item.linkedin || "",
            },
            create: {
              id,
              name: item.name || "Mentor",
              role: item.role || "Instructor",
              company: item.company || "",
              companyLogo: item.companyLogo || "",
              bio: item.bio || "",
              exp: item.exp || "",
              img: item.img || "",
              area: chosenCategory,
              skills: Array.isArray(item.skills) ? item.skills : [],
              thought: item.thought || "",
              linkedin: item.linkedin || "",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "careers.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.career, currentIds);
        for (const item of data) {
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
          });
        }
        break;
      }
      case "applications.json":
      case "join-team.json": {
        const currentIds = new Set(data.map((x) => x.id || x._id || (x as any).fullId).filter(Boolean));
        await syncTableIds(prisma.jobApplication, currentIds);
        for (const item of data) {
          const id = item.id || item._id || `jobapp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.jobApplication.upsert({
            where: { id },
            update: {
              fullName: item.fullName || item.name || "Applicant",
              role: item.role || item.position || "",
              position: item.position || item.role || "",
              email: item.email || "",
              phone: item.phone || "",
              status: item.status || "Pending",
              currentOrg: item.currentOrg || "",
              dateToJoin: item.dateToJoin || "",
              department: item.department || "",
              experience: item.experience || "",
              qualification: item.qualification || "",
              otherQualification: item.otherQualification || "",
              subjectCourse: item.subjectCourse || "",
              linkedinUrl: item.linkedinUrl || "",
              resumeUrl: item.resumeUrl || "",
              resumeFileName: item.resumeFileName || "",
              message: item.message || "",
              coverNote: item.coverNote || "",
            },
            create: {
              id,
              fullName: item.fullName || item.name || "Applicant",
              role: item.role || item.position || "",
              position: item.position || item.role || "",
              email: item.email || "",
              phone: item.phone || "",
              status: item.status || "Pending",
              currentOrg: item.currentOrg || "",
              dateToJoin: item.dateToJoin || "",
              department: item.department || "",
              experience: item.experience || "",
              qualification: item.qualification || "",
              otherQualification: item.otherQualification || "",
              subjectCourse: item.subjectCourse || "",
              linkedinUrl: item.linkedinUrl || "",
              resumeUrl: item.resumeUrl || "",
              resumeFileName: item.resumeFileName || "",
              message: item.message || "",
              coverNote: item.coverNote || "",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "scholarships.json": {
        const currentIds = new Set(data.map((x) => x.id || x._id || (x as any).fullId).filter(Boolean));
        await syncTableIds(prisma.scholarshipApplication, currentIds);
        for (const item of data) {
          const id = item.id || item._id || `sch-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.scholarshipApplication.upsert({
            where: { id },
            update: {
              fullName: item.fullName || item.name || "Scholarship Applicant",
              email: item.email || "",
              phone: item.phone || "",
              city: item.city || "",
              course: item.course || "",
              category: item.category || "",
              cvUrl: item.cvUrl || "",
              cvFileName: item.cvFileName || "",
              cvBase64: item.cvBase64 || "",
              message: item.message || "",
              status: item.status || "Pending",
            },
            create: {
              id,
              fullName: item.fullName || item.name || "Scholarship Applicant",
              email: item.email || "",
              phone: item.phone || "",
              city: item.city || "",
              course: item.course || "",
              category: item.category || "",
              cvUrl: item.cvUrl || "",
              cvFileName: item.cvFileName || "",
              cvBase64: item.cvBase64 || "",
              message: item.message || "",
              status: item.status || "Pending",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "partnership-applications.json": {
        const currentIds = new Set(data.map((x) => x.id || (x as any)._id || (x as any).fullId).filter(Boolean));
        await syncTableIds(prisma.partnershipApplication, currentIds);
        for (const item of data) {
          const id = item.id || `partnerapp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.partnershipApplication.upsert({
            where: { id },
            update: {
              type: item.type || "corporate",
              organizationName: item.organizationName || "",
              contactPerson: item.contactPerson || "",
              designation: item.designation || "",
              email: item.email || "",
              phone: item.phone || "",
              website: item.website || "",
              partnershipType: item.partnershipType || "",
              mouFile: item.mouFile || item.mou || "",
              message: item.message || "",
              status: item.status || "Pending",
            },
            create: {
              id,
              type: item.type || "corporate",
              organizationName: item.organizationName || "",
              contactPerson: item.contactPerson || "",
              designation: item.designation || "",
              email: item.email || "",
              phone: item.phone || "",
              website: item.website || "",
              partnershipType: item.partnershipType || "",
              mouFile: item.mouFile || item.mou || "",
              message: item.message || "",
              status: item.status || "Pending",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "contact.json": {
        const currentIds = new Set(data.map((x) => x.id || (x as any)._id || (x as any).fullId).filter(Boolean));
        await syncTableIds(prisma.contactEntry, currentIds);
        for (const item of data) {
          const id = item.id || `contact-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.contactEntry.upsert({
            where: { id },
            update: {
              name: item.name || "Contact Entry",
              email: item.email || "",
              phone: item.phone || "",
              city: item.city || "",
              enquiryType: item.enquiryType || "",
              message: item.message || "",
              status: item.status || "PENDING",
            },
            create: {
              id,
              name: item.name || "Contact Entry",
              email: item.email || "",
              phone: item.phone || "",
              city: item.city || "",
              enquiryType: item.enquiryType || "",
              message: item.message || "",
              status: item.status || "PENDING",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "inquiries.json": {
        const currentIds = new Set(data.map((x) => x.id || (x as any)._id || (x as any).fullId).filter(Boolean));
        await syncTableIds(prisma.inquiry, currentIds);
        for (const item of data) {
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
          });
        }
        break;
      }
      case "course-applications.json": {
        const currentIds = new Set(data.map((x) => x.id || (x as any).fullId || (x as any)._id).filter(Boolean));
        await syncTableIds(prisma.application, currentIds);
        for (const item of data) {
          const id = item.id || item.fullId || `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.application.upsert({
            where: { id },
            update: {
              name: item.name || item.userName || "",
              email: item.email || item.userEmail || "",
              phone: item.phone || item.userPhone || "",
              city: item.city || "",
              qualification: item.qualification || "",
              specialization: item.specialization || "",
              message: item.message || "",
              courseTitle: item.courseTitle || "",
              userName: item.userName || item.name || "",
              userEmail: item.userEmail || item.email || "",
              userPhone: item.userPhone || item.phone || "",
            },
            create: {
              id,
              courseId: item.courseId || null,
              name: item.name || item.userName || "",
              email: item.email || item.userEmail || "",
              phone: item.phone || item.userPhone || "",
              city: item.city || "",
              qualification: item.qualification || "",
              specialization: item.specialization || "",
              message: item.message || "",
              courseTitle: item.courseTitle || "",
              userName: item.userName || item.name || "",
              userEmail: item.userEmail || item.email || "",
              userPhone: item.userPhone || item.phone || "",
              status: "UNDER_REVIEW",
              appliedAt: item.appliedAt ? new Date(item.appliedAt) : new Date(),
            },
          });
        }
        break;
      }
      case "gallery.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.galleryItem, currentIds);
        for (const item of data) {
          const id = item.id || `gal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.galleryItem.upsert({
            where: { id },
            update: {
              title: item.title || "",
              type: item.type || "image",
              imgUrl: item.imgUrl || "",
            },
            create: {
              id,
              title: item.title || "",
              type: item.type || "image",
              imgUrl: item.imgUrl || "",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "downloads.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.downloadItem, currentIds);
        for (const item of data) {
          const id = item.id || `dl-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.downloadItem.upsert({
            where: { id },
            update: {
              title: item.title || "",
              description: item.description || "",
              fileUrl: item.fileUrl || "",
            },
            create: {
              id,
              title: item.title || "",
              description: item.description || "",
              fileUrl: item.fileUrl || "",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "alumni.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.alumni, currentIds);
        for (const item of data) {
          const id = item.id || `alumni-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.alumni.upsert({
            where: { id },
            update: {
              name: item.name || "Alumni",
              role: item.role || "",
              company: item.company || "",
              batch: item.batch || "",
              photo: item.photo || "",
              linkedin: item.linkedin || "",
              certification: item.certification || "",
            },
            create: {
              id,
              name: item.name || "Alumni",
              role: item.role || "",
              company: item.company || "",
              batch: item.batch || "",
              photo: item.photo || "",
              linkedin: item.linkedin || "",
              certification: item.certification || "",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "alumni-companies.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.alumniCompany, currentIds);
        for (const item of data) {
          const id = item.id || `acomp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await prisma.alumniCompany.upsert({
            where: { id },
            update: {
              name: item.name || "Company",
              logo: item.logo || "",
            },
            create: {
              id,
              name: item.name || "Company",
              logo: item.logo || "",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "categories.json": {
        const currentNames = new Set(data.map((x) => (typeof x === "string" ? x : x.name)).filter(Boolean));
        await syncTableIds(prisma.category, currentNames, "name");
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const name = typeof item === "string" ? item : item.name;
          const id = (typeof item === "object" && item.id) || `cat-${name.toLowerCase().replace(/[\s_]+/g, "-")}`;
          if (!name) continue;
          await prisma.category.upsert({
            where: { name },
            update: { order: i },
            create: { id, name, order: i },
          });
        }
        break;
      }
      case "enquiryTypes.json": {
        const currentNames = new Set(data.map((x: any) => (typeof x === "string" ? x.trim() : x.name)).filter(Boolean));
        for (const name of currentNames) {
          const id = `enq-${name.toLowerCase().replace(/[\s_]+/g, "-")}`;
          await prisma.enquiryType.upsert({
            where: { name },
            update: {},
            create: { id, name },
          }).catch(() => null);
        }
        try {
          const allInDb = await prisma.enquiryType.findMany({ select: { id: true, name: true } });
          for (const row of allInDb) {
            if (!currentNames.has(row.name)) {
              await prisma.enquiryType.delete({ where: { id: row.id } }).catch(() => null);
            }
          }
        } catch {}
        break;
      }
      case "events.json": {
        const currentIds = new Set(data.map((x) => x.id).filter(Boolean));
        await syncTableIds(prisma.event, currentIds);
        for (const item of data) {
          if (!item.id || !item.title) continue;
          await prisma.event.upsert({
            where: { id: item.id },
            update: {
              title: item.title,
              date: item.date ? new Date(item.date) : new Date(),
              type: item.type || "WORKSHOP",
              imageUrl: item.imageUrl || "",
              venue: item.venue || "",
              speaker: item.speaker || "",
              shortDescription: item.shortDescription || "",
              description: item.description || "",
              isFeatured: !!item.isFeatured,
            },
            create: {
              id: item.id,
              title: item.title,
              date: item.date ? new Date(item.date) : new Date(),
              type: item.type || "WORKSHOP",
              imageUrl: item.imageUrl || "",
              venue: item.venue || "",
              speaker: item.speaker || "",
              shortDescription: item.shortDescription || "",
              description: item.description || "",
              isFeatured: !!item.isFeatured,
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "event-registrations.json": {
        const currentIds = new Set(data.map((x) => x.id || (x as any)._id).filter(Boolean));
        await syncTableIds(prisma.eventRegistration, currentIds);
        for (const item of data) {
          if (!item.id) continue;
          await prisma.eventRegistration.upsert({
            where: { id: item.id },
            update: {
              name: item.name || "",
              email: item.email || "",
              phone: item.phone || "",
              college: item.college || item.education || "",
              course: item.course || "",
              graduationYear: item.graduationYear || "",
              eventId: item.eventId || null,
            },
            create: {
              id: item.id,
              name: item.name || "",
              email: item.email || "",
              phone: item.phone || "",
              college: item.college || item.education || "",
              course: item.course || "",
              graduationYear: item.graduationYear || "",
              eventId: item.eventId || null,
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      case "event-subscribers.json": {
        const currentIds = new Set(data.map((x) => x.id || (x as any)._id).filter(Boolean));
        if ((prisma as any).eventSubscriber) {
          await syncTableIds((prisma as any).eventSubscriber, currentIds);
        }
        break;
      }
      case "blogs.json": {
        const currentSlugs = new Set(data.map((x) => x.slug || x.title?.trim().toLowerCase().replace(/[\s_]+/g, "-")).filter(Boolean));
        await syncTableIds(prisma.blog, currentSlugs, "slug");
        for (const item of data) {
          const slug = item.slug || item.title?.trim().toLowerCase().replace(/[\s_]+/g, "-");
          if (!slug || !item.title) continue;
          await prisma.blog.upsert({
            where: { slug },
            update: {
              title: item.title,
              content: item.content || "",
              author: item.author || "BITC Editorial Team",
              image: item.image || "",
              category: item.category || "Technology",
              publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
            },
            create: {
              id: item.id || undefined,
              title: item.title,
              slug,
              content: item.content || "",
              author: item.author || "BITC Editorial Team",
              image: item.image || "",
              category: item.category || "Technology",
              publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (syncErr: any) {
    console.warn(`[dataStore] Background sync to relational table for ${key} warning:`, syncErr.message);
  }
}

/**
 * Async read: checks dedicated relational PostgreSQL table first, falling back to CmsData table and memory cache.
 */
export async function readJsonDbAsync<T = any>(key: string): Promise<T[]> {
  // If DB connection is down/in cooldown, serve directly from cache immediately without blocking
  if (isDbConnectionDown()) {
    if (memoryCache.has(key)) {
      return memoryCache.get(key)!;
    }
    return [];
  }

  try {
    // 1. Check relational table first
    const relationalResult = await queryRelationalTable<T>(key);
    if (relationalResult !== null) {
      recordDbSuccess();
      memoryCache.set(key, relationalResult);
      return relationalResult;
    }

    // 2. Check CmsData table fallback only if DB connection did not fail
    if (!isDbConnectionDown()) {
      const dbRecord = await prisma.cmsData.findUnique({
        where: { key },
      });
      if (dbRecord && dbRecord.data !== null && dbRecord.data !== undefined) {
        recordDbSuccess();
        const data = Array.isArray(dbRecord.data) ? (dbRecord.data as T[]) : (dbRecord.data as any);
        const arr = Array.isArray(data) ? data : [];
        memoryCache.set(key, arr);
        return arr;
      }
    }

    if (memoryCache.has(key)) {
      return memoryCache.get(key)!;
    }
    return [];
  } catch (err: any) {
    recordDbFailure(err);
    console.warn(`[dataStore] Error fetching ${key} from DB, fallback to cache:`, err?.message || err);
    if (memoryCache.has(key)) {
      return memoryCache.get(key)!;
    }
    return [];
  }
}

/**
 * Async write: writes directly to relational PostgreSQL table, persists to CmsData table, and updates cache.
 */
export async function writeJsonDbAsync<T = any>(key: string, data: T[]): Promise<void> {
  memoryCache.set(key, data);

  // 1. Persist directly to dedicated Relational Table
  await syncToRelationalTable(key, data);

  // 2. Persist to Neon PostgreSQL CmsData table for backup
  try {
    await prisma.cmsData.upsert({
      where: { key },
      update: { data: data as any },
      create: { key, data: data as any },
    });
  } catch (dbErr) {
    console.error(`[dataStore] Failed to persist ${key} to CmsData:`, dbErr);
  }
}

/**
 * Synchronous read wrapper
 */
export function readJsonDb<T = any>(key: string): T[] {
  if (memoryCache.has(key)) {
    return memoryCache.get(key)!;
  }
  return [];
}

/**
 * Synchronous write wrapper
 */
export function writeJsonDb<T = any>(key: string, data: T[]): void {
  writeJsonDbAsync(key, data).catch((err) => {
    console.error(`[dataStore] Background write error for ${key}:`, err);
  });
}
