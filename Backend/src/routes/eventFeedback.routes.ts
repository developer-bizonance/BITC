import express from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import prisma from "../lib/prisma.js";

const router = express.Router();

const FORMS_KEY = "event-feedback-forms.json";
const SUBMISSIONS_KEY = "event-feedback-submissions.json";

// Helper to convert event title into a clean URL-friendly slug
export function slugify(title: string): string {
  return (title || "")
    .toLowerCase()
    .trim()
    .replace(/ & /g, "-")
    .replace(/[\/\s_]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isGhostForm(f: any): boolean {
  if (!f) return true;
  const title = String(f.eventTitle || "").trim();
  const id = String(f.id || "").trim();
  if (!title) return true;

  const t = title.toLowerCase();
  if (/^efb[-_\s0-9]/i.test(t)) return true;
  if (/^form[-_\s0-9]/i.test(t) && !t.includes("summit") && !t.includes("workshop") && !t.includes("program") && !t.includes("event") && !t.includes("hackathon") && !t.includes("conference") && !t.includes("seminar")) return true;
  if (/^form\s+[a-z0-9]{6,}/i.test(title)) return true;
  if (t.startsWith("form corporatecommunication")) return true;
  if (t.startsWith("form industry40")) return true;
  if (/^form-[a-z0-9]{12,}/i.test(id) && /^form\s+/i.test(title)) return true;

  return false;
}

export function matchSubmissionToForm(s: any, form: any): boolean {
  if (!s || !form) return false;
  const norm = (str: any) => String(str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const stripPrefix = (str: any) => norm(str).replace(/^(form|efb|sub)/, "");

  const subFormId = norm(s.formId);
  const subClean = stripPrefix(s.formId);
  const subTitle = norm(s.eventTitle);
  const subEventId = norm(s.eventId);

  const formId = norm(form.id);
  const formClean = stripPrefix(form.id);
  const formSlug = norm(form.slug || slugify(form.eventTitle));
  const formSlugClean = stripPrefix(form.slug);
  const formTitle = norm(form.eventTitle);
  const formEventId = norm(form.eventId);

  // 1. Direct key matches
  if (formId && subFormId === formId) return true;
  if (formSlug && (subFormId === formSlug || subClean === formSlug)) return true;
  if (formEventId && (subFormId === formEventId || subEventId === formEventId)) return true;
  if (subTitle && formTitle && (subTitle === formTitle || subTitle.includes(formTitle) || formTitle.includes(subTitle))) return true;

  // 2. Stripped prefix / slug equality
  if (subClean && formClean && (subClean === formClean || subClean === formSlugClean)) return true;

  // 3. Substring containment across title and form ID
  if (subClean && subClean.length >= 6) {
    if (formTitle && (formTitle.includes(subClean) || subClean.includes(formTitle))) return true;
    if (formSlug && (formSlug.includes(subClean) || subClean.includes(formSlug))) return true;
    if (formClean && (formClean.includes(subClean) || subClean.includes(formClean))) return true;
  }

  return false;
}

// Helper to find a form by ID, slug, or slugified title
function findFormByIdOrSlug(forms: any[], idOrSlug: string) {
  if (!idOrSlug) return undefined;
  const decoded = decodeURIComponent(idOrSlug).trim().toLowerCase().replace(/\/+$/, "");
  const cleanTarget = decoded.replace(/[^a-z0-9]/g, "");
  const strippedTarget = cleanTarget.replace(/^(form|efb)/, "");

  return (forms || []).find((f: any) => {
    if (!f || isGhostForm(f)) return false;
    // 1. Direct ID match
    if (f.id && String(f.id).toLowerCase() === decoded) return true;
    // 2. Direct Slug match
    if (f.slug && String(f.slug).toLowerCase() === decoded) return true;
    // 3. Computed slug from title match
    const computedSlug = slugify(f.eventTitle);
    if (computedSlug && computedSlug === decoded) return true;
    // 4. Normalized alphanumeric match
    const cleanTitle = (f.eventTitle || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanTitle && cleanTarget && cleanTitle === cleanTarget) return true;

    if (strippedTarget && strippedTarget.length >= 6) {
      if (cleanTitle && (cleanTitle.includes(strippedTarget) || strippedTarget.includes(cleanTitle))) return true;
    }
    return false;
  });
}

// Helper to auto-create or find form across DB events if not yet created by admin
async function findOrAutoCreateFormAsync(idOrSlug: string): Promise<any | null> {
  if (!idOrSlug) return null;
  const forms = (await readJsonDbAsync(FORMS_KEY)) || [];
  const found = findFormByIdOrSlug(forms, idOrSlug);
  const submissions = (await readJsonDbAsync(SUBMISSIONS_KEY)) || [];

  if (found) {
    return enrichFormWithStats(found, submissions);
  }

  const decoded = decodeURIComponent(idOrSlug).trim().toLowerCase().replace(/\/+$/, "");
  const stripped = decoded.replace(/^(form|efb)-+/i, "");
  const cleanTarget = decoded.replace(/[^a-z0-9]/g, "");
  const cleanStripped = stripped.replace(/[^a-z0-9]/g, "");

  // Look in Prisma and CmsData events
  let dbEvents: any[] = [];
  try {
    dbEvents = await prisma.event.findMany({ orderBy: { date: "desc" } });
  } catch {}

  let cmsEvents: any[] = [];
  try {
    cmsEvents = (await readJsonDbAsync("events.json")) || [];
  } catch {}

  const allEvents = [...dbEvents, ...cmsEvents];
  const matchedEvent = allEvents.find((ev: any) => {
    if (!ev || !ev.title) return false;
    if (ev.id && String(ev.id).toLowerCase() === decoded) return true;
    const evSlug = slugify(ev.title);
    if (evSlug && (evSlug === decoded || evSlug === stripped)) return true;
    const cleanTitle = ev.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanTitle && cleanTarget && cleanTitle === cleanTarget) return true;
    if (cleanTitle && cleanStripped && cleanTitle === cleanStripped) return true;
    if (cleanTitle && cleanStripped && cleanStripped.length >= 6 && (cleanTitle.includes(cleanStripped) || cleanStripped.includes(cleanTitle))) return true;
    return false;
  });

  if (matchedEvent) {
    const cleanSlug = slugify(matchedEvent.title);
    const existing = forms.find(
      (f: any) =>
        f &&
        !isGhostForm(f) &&
        ((matchedEvent.id && String(f.eventId) === String(matchedEvent.id)) ||
          f.slug === cleanSlug ||
          String(f.eventTitle || "").trim().toLowerCase() === matchedEvent.title.trim().toLowerCase())
    );

    if (existing) {
      return enrichFormWithStats(existing, submissions);
    }

    const newForm = {
      id: matchedEvent.id ? `form-${matchedEvent.id}` : `form-${Date.now()}`,
      eventId: matchedEvent.id ? String(matchedEvent.id) : null,
      eventTitle: matchedEvent.title,
      speakerName: matchedEvent.speaker || "Expert Speaker / Faculty",
      eventDate: matchedEvent.date ? new Date(matchedEvent.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      posterUrl: matchedEvent.imageUrl || null,
      description: matchedEvent.shortDescription || matchedEvent.description || `Attendee feedback form for ${matchedEvent.title}`,
      slug: cleanSlug,
      createdAt: new Date().toISOString(),
    };

    try {
      await writeJsonDbAsync(FORMS_KEY, [newForm, ...forms]);
    } catch {}

    return enrichFormWithStats(newForm, submissions);
  }

  return null;
}

// Helper to calculate statistics for a form
function enrichFormWithStats(form: any, allSubmissions: any[]) {
  const formSlug = form.slug || slugify(form.eventTitle) || form.id;

  const formSubmissions = (allSubmissions || []).filter((s: any) => matchSubmissionToForm(s, form));

  const attendedSubmissions = formSubmissions.filter((s: any) => s.attended === true);
  const notAttendedSubmissions = formSubmissions.filter((s: any) => s.attended === false);

  const ratings = attendedSubmissions
    .map((s: any) => Number(s.rating))
    .filter((r: number) => !isNaN(r) && r > 0);

  const averageRating =
    ratings.length > 0
      ? Number((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1))
      : 0;

  // Star breakdown counts (1 to 5)
  const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratings.forEach((r: number) => {
    const star = Math.round(r);
    if (star >= 1 && star <= 5) {
      starCounts[star as 1 | 2 | 3 | 4 | 5]++;
    }
  });

  return {
    ...form,
    slug: formSlug,
    totalSubmissions: formSubmissions.length,
    attendedCount: attendedSubmissions.length,
    notAttendedCount: notAttendedSubmissions.length,
    averageRating,
    ratingsCount: ratings.length,
    starCounts,
  };
}

// 1. GET /api/event-feedback/forms — List all forms with dynamic stats
router.get("/forms", async (_req, res) => {
  try {
    const rawForms = await readJsonDbAsync(FORMS_KEY);
    let submissions = await readJsonDbAsync(SUBMISSIONS_KEY);

    const safeForms = Array.isArray(rawForms) ? rawForms : [];
    const safeSubmissions = Array.isArray(submissions) ? submissions : [];

    const normalize = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");

    const cleanedForms = safeForms.filter((f: any) => !isGhostForm(f));
    const ghostForms = safeForms.filter((f: any) => isGhostForm(f));

    // Re-link submissions from ghost forms to real events
    let submissionsModified = false;
    for (const gf of ghostForms) {
      const gfClean = normalize(gf.id || gf.slug || gf.eventTitle).replace(/^(form|efb)/, "");
      const matchedForm = cleanedForms.find((cf: any) => {
        const cfNorm = normalize(cf.eventTitle);
        const cfSlug = normalize(cf.slug || slugify(cf.eventTitle));
        return cfNorm.includes(gfClean) || gfClean.includes(cfNorm) || cfSlug.includes(gfClean) || gfClean.includes(cfSlug);
      });

      if (matchedForm) {
        safeSubmissions.forEach((s: any) => {
          if (s && (String(s.formId) === String(gf.id) || String(s.formId) === String(gf.slug))) {
            s.formId = matchedForm.id;
            s.eventId = matchedForm.eventId || null;
            s.eventTitle = matchedForm.eventTitle;
            s.eventSlug = matchedForm.slug;
            submissionsModified = true;
          }
        });
      }
    }

    if (submissionsModified) {
      try {
        await writeJsonDbAsync(SUBMISSIONS_KEY, safeSubmissions);
      } catch {}
    }

    if (ghostForms.length > 0) {
      try {
        await writeJsonDbAsync(FORMS_KEY, cleanedForms);
      } catch {}
    }

    const enriched = cleanedForms
      .map((f: any) => enrichFormWithStats(f, safeSubmissions))
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return res.json({ success: true, forms: enriched });
  } catch (error: any) {
    console.error("[eventFeedback] GET /forms error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch feedback forms" });
  }
});

// 2. POST /api/event-feedback/forms — Create a new feedback form
router.post("/forms", async (req, res) => {
  try {
    const { eventId, eventTitle, speakerName, eventDate, posterUrl, description } = req.body;

    if (!eventTitle || typeof eventTitle !== "string" || !eventTitle.trim()) {
      return res.status(400).json({ success: false, error: "Event title is required" });
    }

    if (!speakerName || typeof speakerName !== "string" || !speakerName.trim()) {
      return res.status(400).json({ success: false, error: "Speaker name is required" });
    }

    const forms = (await readJsonDbAsync(FORMS_KEY)) || [];
    const newId = `efb-${Date.now()}`;
    const slug = slugify(eventTitle) || newId;

    const newForm = {
      id: newId,
      slug,
      eventId: eventId || null,
      eventTitle: eventTitle.trim(),
      speakerName: speakerName.trim(),
      eventDate: eventDate || new Date().toISOString(),
      posterUrl: posterUrl || null,
      description: description ? description.trim() : null,
      createdAt: new Date().toISOString(),
    };

    forms.unshift(newForm);
    await writeJsonDbAsync(FORMS_KEY, forms);

    const enriched = enrichFormWithStats(newForm, []);
    return res.status(201).json({ success: true, form: enriched });
  } catch (error: any) {
    console.error("[eventFeedback] POST /forms error:", error);
    return res.status(500).json({ success: false, error: "Failed to create feedback form" });
  }
});

// 3. GET /api/event-feedback/forms/:id — Public/Admin details of a single form (matches by ID or Event Slug)
router.get("/forms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const form = await findOrAutoCreateFormAsync(id);

    if (!form) {
      return res.status(404).json({ success: false, error: "Feedback form not found" });
    }

    return res.json({ success: true, form });
  } catch (error: any) {
    console.error("[eventFeedback] GET /forms/:id error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch form details" });
  }
});

// 4. PUT /api/event-feedback/forms/:id — Update form details
router.put("/forms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { eventTitle, speakerName, eventDate, posterUrl, description } = req.body;

    const forms = (await readJsonDbAsync(FORMS_KEY)) || [];
    const target = findFormByIdOrSlug(forms, id);

    if (!target) {
      return res.status(404).json({ success: false, error: "Feedback form not found" });
    }

    const index = forms.findIndex((f: any) => String(f.id) === String(target.id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Feedback form not found" });
    }

    const updatedTitle = eventTitle !== undefined ? eventTitle.trim() : forms[index].eventTitle;

    forms[index] = {
      ...forms[index],
      eventTitle: updatedTitle,
      slug: slugify(updatedTitle) || forms[index].slug || forms[index].id,
      ...(speakerName !== undefined && { speakerName: speakerName.trim() }),
      ...(eventDate !== undefined && { eventDate }),
      ...(posterUrl !== undefined && { posterUrl }),
      ...(description !== undefined && { description: description ? description.trim() : null }),
      updatedAt: new Date().toISOString(),
    };

    await writeJsonDbAsync(FORMS_KEY, forms);

    const submissions = (await readJsonDbAsync(SUBMISSIONS_KEY)) || [];
    const enriched = enrichFormWithStats(forms[index], submissions);

    return res.json({ success: true, form: enriched });
  } catch (error: any) {
    console.error("[eventFeedback] PUT /forms/:id error:", error);
    return res.status(500).json({ success: false, error: "Failed to update feedback form" });
  }
});

// 5. DELETE /api/event-feedback/forms/:id — Delete form and its submissions
router.delete("/forms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const forms = (await readJsonDbAsync(FORMS_KEY)) || [];
    const target = findFormByIdOrSlug(forms, id);

    if (!target) {
      return res.status(404).json({ success: false, error: "Feedback form not found" });
    }

    const filteredForms = forms.filter((f: any) => String(f.id) !== String(target.id));
    await writeJsonDbAsync(FORMS_KEY, filteredForms);

    // Also delete submissions
    const submissions = (await readJsonDbAsync(SUBMISSIONS_KEY)) || [];
    const filteredSubmissions = submissions.filter(
      (s: any) =>
        String(s.formId) !== String(target.id) &&
        String(s.formId) !== String(target.slug) &&
        String(s.formId) !== String(id)
    );
    await writeJsonDbAsync(SUBMISSIONS_KEY, filteredSubmissions);

    return res.json({ success: true, message: "Feedback form and submissions removed" });
  } catch (error: any) {
    console.error("[eventFeedback] DELETE /forms/:id error:", error);
    return res.status(500).json({ success: false, error: "Failed to delete feedback form" });
  }
});

// 6. POST /api/event-feedback/forms/:id/submit — Public attendee feedback submission
router.post("/forms/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { attended, name, phone, rating, feedback } = req.body;

    const form = await findOrAutoCreateFormAsync(id);

    if (!form) {
      return res.status(404).json({ success: false, error: "Feedback form not found" });
    }

    const isAttended = attended === true || attended === "true" || attended === "yes";

    // If attended, require Name, Phone, and Rating
    if (isAttended) {
      if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ success: false, error: "Please enter your name" });
      }
      if (!phone || typeof phone !== "string" || !phone.trim()) {
        return res.status(400).json({ success: false, error: "Please enter your contact number" });
      }
      const cleanPhone = String(phone).replace(/\D/g, "");
      if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        return res.status(400).json({ success: false, error: "Please enter a valid 10-digit mobile number" });
      }
      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ success: false, error: "Please provide a star rating between 1 and 5" });
      }
    }

    const submissions = (await readJsonDbAsync(SUBMISSIONS_KEY)) || [];
    const newSubmission = {
      id: `fbs-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      formId: String(form.id),
      eventId: form.eventId ? String(form.eventId) : null,
      eventTitle: form.eventTitle || null,
      eventSlug: form.slug || null,
      attended: isAttended,
      name: isAttended ? name.trim() : null,
      phone: isAttended ? phone.trim() : null,
      rating: isAttended ? Number(rating) : null,
      feedback: isAttended && feedback ? feedback.trim() : null,
      createdAt: new Date().toISOString(),
    };

    submissions.unshift(newSubmission);
    await writeJsonDbAsync(SUBMISSIONS_KEY, submissions);

    return res.status(201).json({
      success: true,
      message: isAttended
        ? "Thank you for your valuable feedback!"
        : "Response recorded.",
      submission: newSubmission,
    });
  } catch (error: any) {
    console.error("[eventFeedback] POST /submit error:", error);
    return res.status(500).json({ success: false, error: "Failed to submit feedback" });
  }
});

// 7. GET /api/event-feedback/forms/:id/submissions — View all attendee submissions
router.get("/forms/:id/submissions", async (req, res) => {
  try {
    const { id } = req.params;
    const form = await findOrAutoCreateFormAsync(id);

    if (!form) {
      return res.status(404).json({ success: false, error: "Feedback form not found" });
    }

    const allSubmissions = (await readJsonDbAsync(SUBMISSIONS_KEY)) || [];
    const formSubmissions = allSubmissions
      .filter((s: any) => matchSubmissionToForm(s, form))
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    const enriched = enrichFormWithStats(form, allSubmissions);

    return res.json({
      success: true,
      form: enriched,
      submissions: formSubmissions,
    });
  } catch (error: any) {
    console.error("[eventFeedback] GET /submissions error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch submissions" });
  }
});

export default router;
