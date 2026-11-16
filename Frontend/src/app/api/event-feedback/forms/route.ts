import { NextResponse } from "next/server";
import {
  getFeedbackForms,
  saveFeedbackForms,
  getFeedbackSubmissions,
  saveFeedbackSubmissions,
  getAllEvents,
  enrichFormWithStats,
  slugify,
  isGhostForm,
} from "@/lib/eventFeedbackStore";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/event-feedback/forms
export async function GET() {
  try {
    const rawForms = (await getFeedbackForms()) || [];
    let submissions = (await getFeedbackSubmissions()) || [];
    const events = (await getAllEvents()) || [];

    const normalize = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");

    let cleanedForms = rawForms.filter((f: any) => !isGhostForm(f));
    const ghostForms = rawForms.filter((f: any) => isGhostForm(f));

    // Map existing clean forms
    const formsMap = new Map<string, any>();
    for (const f of cleanedForms) {
      if (!f) continue;
      const key = f.id || f.slug || normalize(f.eventTitle);
      formsMap.set(key, f);
    }

    // Auto-seed feedback form for any real event in DB that doesn't have one yet
    let formsChanged = ghostForms.length > 0;
    for (const ev of events) {
      if (!ev || !ev.title) continue;
      const normTitle = normalize(ev.title);
      const evId = ev.id ? String(ev.id) : "";

      const exists = Array.from(formsMap.values()).some((f: any) => {
        if (evId && f.eventId && String(f.eventId) === evId) return true;
        if (f.eventTitle && normalize(f.eventTitle) === normTitle) return true;
        if (f.slug && (normalize(f.slug) === normTitle || normalize(f.slug) === normalize(slugify(ev.title)))) return true;
        return false;
      });

      if (!exists) {
        const autoForm = {
          id: ev.id ? `form-${ev.id}` : `form-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          eventId: ev.id ? String(ev.id) : null,
          eventTitle: ev.title,
          speakerName: ev.speaker || "Expert Speaker / Faculty",
          eventDate: ev.date ? new Date(ev.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          posterUrl: ev.imageUrl || null,
          description: ev.shortDescription || `Attendee feedback collection for ${ev.title}`,
          slug: slugify(ev.title),
          createdAt: ev.date ? new Date(ev.date).toISOString() : new Date().toISOString(),
        };
        formsMap.set(autoForm.id, autoForm);
        formsChanged = true;
      }
    }

    const mergedForms = Array.from(formsMap.values());

    // Re-link submissions from ghost forms or technical IDs to canonical real events
    let submissionsModified = false;
    for (const s of submissions) {
      if (!s) continue;
      const subFormIdNorm = normalize(s.formId).replace(/^(form|efb)/, "");
      const targetGf = ghostForms.find((gf: any) => String(gf.id) === String(s.formId) || String(gf.slug) === String(s.formId));

      const matchedEvent = events.find((ev: any) => {
        const evNorm = normalize(ev.title);
        const evSlugNorm = normalize(slugify(ev.title));
        if (ev.id && String(ev.id) === String(s.eventId)) return true;
        if (s.eventTitle && normalize(s.eventTitle) === evNorm) return true;
        if (subFormIdNorm && subFormIdNorm.length >= 6) {
          if (evNorm.includes(subFormIdNorm) || subFormIdNorm.includes(evNorm)) return true;
          if (evSlugNorm.includes(subFormIdNorm) || subFormIdNorm.includes(evSlugNorm)) return true;
        }
        if (targetGf) {
          const gfNorm = normalize(targetGf.eventTitle).replace(/^(form|efb)/, "");
          if (gfNorm && gfNorm.length >= 6 && (evNorm.includes(gfNorm) || gfNorm.includes(evNorm))) return true;
        }
        return false;
      });

      if (matchedEvent) {
        const canonicalForm = mergedForms.find((f: any) =>
          (matchedEvent.id && String(f.eventId) === String(matchedEvent.id)) ||
          normalize(f.eventTitle) === normalize(matchedEvent.title) ||
          f.slug === slugify(matchedEvent.title)
        );
        const targetId = canonicalForm?.id || (matchedEvent.id ? `form-${matchedEvent.id}` : `form-${slugify(matchedEvent.title)}`);

        if (s.formId !== targetId || s.eventTitle !== matchedEvent.title) {
          s.formId = targetId;
          s.eventId = matchedEvent.id ? String(matchedEvent.id) : null;
          s.eventTitle = matchedEvent.title;
          s.eventSlug = slugify(matchedEvent.title);
          submissionsModified = true;
        }
      }
    }

    if (submissionsModified) {
      try {
        await saveFeedbackSubmissions(submissions);
      } catch (err) {
        console.warn("[GET /api/event-feedback/forms] save cleaned submissions notice:", err);
      }
    }

    if (formsChanged) {
      try {
        await saveFeedbackForms(mergedForms);
      } catch (err) {
        console.warn("[GET /api/event-feedback/forms] save merged forms notice:", err);
      }
    }

    const enriched = mergedForms
      .map((f: any) => enrichFormWithStats(f, submissions))
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return NextResponse.json({ success: true, forms: enriched }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[GET /api/event-feedback/forms] error:", error);
    return NextResponse.json({ success: true, forms: [] }, { headers: corsHeaders });
  }
}

// POST /api/event-feedback/forms
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, eventTitle, speakerName, eventDate, posterUrl, description } = body || {};

    if (!eventTitle || typeof eventTitle !== "string" || !eventTitle.trim()) {
      return NextResponse.json({ success: false, error: "Event title is required" }, { status: 400, headers: corsHeaders });
    }

    if (!speakerName || typeof speakerName !== "string" || !speakerName.trim()) {
      return NextResponse.json({ success: false, error: "Speaker name is required" }, { status: 400, headers: corsHeaders });
    }

    const forms = (await getFeedbackForms()) || [];
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
    await saveFeedbackForms(forms);

    const enriched = enrichFormWithStats(newForm, []);
    return NextResponse.json({ success: true, form: enriched }, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    console.error("[POST /api/event-feedback/forms] error:", error);
    return NextResponse.json({ success: false, error: "Failed to create feedback form" }, { status: 500, headers: corsHeaders });
  }
}

