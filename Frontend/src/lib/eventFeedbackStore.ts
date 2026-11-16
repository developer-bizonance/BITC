import prisma from "./prisma";
import { getApiBase } from "./utils";

export const FORMS_KEY = "event-feedback-forms.json";
export const SUBMISSIONS_KEY = "event-feedback-submissions.json";

// In-memory fallback in case DB connection is transiently unavailable
let memoryForms: any[] = [];
let memorySubmissions: any[] = [];

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
  if (!title) return true;

  const t = title.toLowerCase();
  if (t === "test" || t === "sdfdf" || t === "dummy") return true;
  if (/^efb[-_\s0-9]{10,}$/i.test(t)) return true;
  if (/^form[-_\s0-9]{10,}$/i.test(t)) return true;
  if (/^form\s+[a-z0-9]{12,}$/i.test(title)) return true;

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

export function findFormByIdOrSlug(forms: any[], idOrSlug: string) {
  if (!idOrSlug) return undefined;
  const decoded = decodeURIComponent(idOrSlug).trim().toLowerCase().replace(/\/+$/, "");
  const cleanTarget = decoded.replace(/[^a-z0-9]/g, "");
  const strippedTarget = cleanTarget.replace(/^(form|efb)/, "");

  return (forms || []).find((f: any) => {
    if (!f || isGhostForm(f)) return false;
    if (f.id && String(f.id).toLowerCase() === decoded) return true;
    if (f.slug && String(f.slug).toLowerCase() === decoded) return true;
    const computedSlug = slugify(f.eventTitle);
    if (computedSlug && computedSlug === decoded) return true;

    const cleanTitle = String(f.eventTitle || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanTitle && cleanTarget && cleanTitle === cleanTarget) return true;

    const cleanId = String(f.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanId && cleanTarget && cleanId === cleanTarget) return true;

    if (strippedTarget && strippedTarget.length >= 6) {
      if (cleanTitle && (cleanTitle.includes(strippedTarget) || strippedTarget.includes(cleanTitle))) return true;
      const cleanSlug = String(f.slug || computedSlug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleanSlug && (cleanSlug.includes(strippedTarget) || strippedTarget.includes(cleanSlug))) return true;
    }

    return false;
  });
}

export function enrichFormWithStats(form: any, allSubmissions: any[]) {
  if (!form) return form;
  const formSlug = form.slug || slugify(form.eventTitle) || form.id;

  const formSubmissions = (allSubmissions || []).filter((s: any) => matchSubmissionToForm(s, form));

  const attendedSubmissions = formSubmissions.filter((s: any) => s?.attended === true);
  const notAttendedSubmissions = formSubmissions.filter((s: any) => s?.attended === false);

  const ratings = attendedSubmissions
    .map((s: any) => Number(s?.rating))
    .filter((r: number) => !isNaN(r) && r > 0);

  const averageRating =
    ratings.length > 0
      ? Number((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1))
      : 0;

  const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratings.forEach((r: number) => {
    const star = Math.round(r);
    if (star >= 1 && star <= 5) {
      starCounts[star]++;
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

export async function getAllEvents(): Promise<any[]> {
  const map = new Map<string, any>();

  // 1. Query Prisma Event table
  try {
    const dbEvents = await prisma.event.findMany({
      orderBy: { date: "desc" },
    });
    for (const ev of dbEvents) {
      if (ev && ev.title) {
        map.set(String(ev.id || ev.title), {
          id: String(ev.id),
          title: ev.title,
          speaker: ev.speaker || "Expert Speaker / Faculty",
          date: ev.date ? new Date(ev.date).toISOString() : new Date().toISOString(),
          imageUrl: ev.imageUrl || null,
          shortDescription: ev.description || "",
        });
      }
    }
  } catch (e) {
    console.warn("[eventFeedbackStore] dbEvents query notice:", e);
  }

  // 2. Query cmsData events.json
  try {
    const rec = await prisma.cmsData.findUnique({
      where: { key: "events.json" },
    });
    if (rec && Array.isArray(rec.data)) {
      for (const ev of rec.data as any[]) {
        if (ev && ev.title) {
          const key = String(ev.id || ev.title);
          if (!map.has(key)) {
            map.set(key, {
              id: String(ev.id || ""),
              title: ev.title,
              speaker: ev.speaker || "Expert Speaker / Faculty",
              date: ev.date ? new Date(ev.date).toISOString() : new Date().toISOString(),
              imageUrl: ev.imageUrl || null,
              shortDescription: ev.shortDescription || ev.description || "",
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn("[eventFeedbackStore] cmsEvents query notice:", e);
  }

  // 3. Fallback: Query central backend API
  if (map.size === 0) {
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/events`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.events && Array.isArray(data.events)) {
          for (const ev of data.events) {
            if (ev && ev.title) {
              map.set(String(ev.id || ev.title), {
                id: String(ev.id),
                title: ev.title,
                speaker: ev.speaker || "Expert Speaker / Faculty",
                date: ev.date ? new Date(ev.date).toISOString() : new Date().toISOString(),
                imageUrl: ev.imageUrl || null,
                shortDescription: ev.shortDescription || ev.description || "",
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn("[eventFeedbackStore] backend API events fallback notice:", e);
    }
  }

  return Array.from(map.values());
}

export async function findOrAutoCreateForm(idOrSlug: string): Promise<any | null> {
  if (!idOrSlug) return null;
  const forms = (await getFeedbackForms()) || [];

  // 1. Direct match in existing forms
  const found = findFormByIdOrSlug(forms, idOrSlug);
  if (found) {
    const submissions = (await getFeedbackSubmissions()) || [];
    return enrichFormWithStats(found, submissions);
  }

  // 2. Search all events in Database
  const decoded = decodeURIComponent(idOrSlug).trim().toLowerCase().replace(/\/+$/, "");
  const stripped = decoded.replace(/^(form|efb)-+/i, "");
  const cleanTarget = decoded.replace(/[^a-z0-9]/g, "");
  const cleanStripped = stripped.replace(/[^a-z0-9]/g, "");

  const allEvents = await getAllEvents();
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
        ((matchedEvent.id && String(f.eventId) === String(matchedEvent.id)) ||
          f.slug === cleanSlug ||
          String(f.eventTitle || "").trim().toLowerCase() === matchedEvent.title.trim().toLowerCase())
    );

    if (existing) {
      const submissions = (await getFeedbackSubmissions()) || [];
      return enrichFormWithStats(existing, submissions);
    }

    const newForm = {
      id: matchedEvent.id ? `form-${matchedEvent.id}` : `form-${Date.now()}`,
      eventId: matchedEvent.id ? String(matchedEvent.id) : null,
      eventTitle: matchedEvent.title,
      speakerName: matchedEvent.speaker || "Expert Speaker / Faculty",
      eventDate: matchedEvent.date ? new Date(matchedEvent.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      posterUrl: matchedEvent.imageUrl || null,
      description: matchedEvent.shortDescription || `Attendee feedback form for ${matchedEvent.title}`,
      slug: cleanSlug,
      createdAt: new Date().toISOString(),
    };

    try {
      const updatedForms = [newForm, ...forms];
      await saveFeedbackForms(updatedForms);
    } catch (e) {
      console.warn("[eventFeedbackStore] auto-create persist notice:", e);
    }

    const submissions = (await getFeedbackSubmissions()) || [];
    return enrichFormWithStats(newForm, submissions);
  }

  // Never synthesize ghost forms with technical IDs or prefixes
  return null;
}

export async function getFeedbackForms(): Promise<any[]> {
  try {
    const rec = await prisma.cmsData.findUnique({
      where: { key: FORMS_KEY },
    });
    if (rec && Array.isArray(rec.data) && rec.data.length > 0) {
      memoryForms = rec.data as any[];
      return memoryForms;
    }
  } catch (e) {
    console.warn("[eventFeedbackStore] read forms notice:", e);
  }

  // Fallback to central backend API
  try {
    const apiBase = getApiBase();
    const res = await fetch(`${apiBase}/event-feedback/forms`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.forms && Array.isArray(data.forms) && data.forms.length > 0) {
        memoryForms = data.forms;
        return memoryForms;
      }
    }
  } catch (e) {
    console.warn("[eventFeedbackStore] backend API forms fallback notice:", e);
  }

  return memoryForms;
}

export async function saveFeedbackForms(forms: any[]): Promise<void> {
  memoryForms = forms;
  try {
    await prisma.cmsData.upsert({
      where: { key: FORMS_KEY },
      update: { data: forms as any, updatedAt: new Date() },
      create: { key: FORMS_KEY, data: forms as any, updatedAt: new Date() },
    });
  } catch (e) {
    console.warn("[eventFeedbackStore] save forms notice:", e);
  }
}

export async function getFeedbackSubmissions(): Promise<any[]> {
  try {
    const rec = await prisma.cmsData.findUnique({
      where: { key: SUBMISSIONS_KEY },
    });
    if (rec && Array.isArray(rec.data)) {
      memorySubmissions = rec.data as any[];
      return memorySubmissions;
    }
  } catch (e) {
    console.warn("[eventFeedbackStore] read submissions notice:", e);
  }
  return memorySubmissions;
}

export async function saveFeedbackSubmissions(submissions: any[]): Promise<void> {
  memorySubmissions = submissions;
  try {
    await prisma.cmsData.upsert({
      where: { key: SUBMISSIONS_KEY },
      update: { data: submissions as any, updatedAt: new Date() },
      create: { key: SUBMISSIONS_KEY, data: submissions as any, updatedAt: new Date() },
    });
  } catch (e) {
    console.warn("[eventFeedbackStore] save submissions notice:", e);
  }
}

