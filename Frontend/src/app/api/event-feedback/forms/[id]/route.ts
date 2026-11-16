import { NextResponse } from "next/server";
import {
  getFeedbackForms,
  saveFeedbackForms,
  getFeedbackSubmissions,
  saveFeedbackSubmissions,
  findFormByIdOrSlug,
  findOrAutoCreateForm,
  enrichFormWithStats,
  slugify,
} from "@/lib/eventFeedbackStore";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/event-feedback/forms/:id
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const form = await findOrAutoCreateForm(id);

    if (!form) {
      return NextResponse.json({ success: false, error: "Feedback form not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, form }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[GET /api/event-feedback/forms/:id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch form details" }, { status: 500, headers: corsHeaders });
  }
}

// PUT /api/event-feedback/forms/:id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { eventTitle, speakerName, eventDate, posterUrl, description } = body || {};

    const forms = (await getFeedbackForms()) || [];
    const target = findFormByIdOrSlug(forms, id);

    if (!target) {
      return NextResponse.json({ success: false, error: "Feedback form not found" }, { status: 404, headers: corsHeaders });
    }

    const index = forms.findIndex((f: any) => String(f.id) === String(target.id));
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Feedback form not found" }, { status: 404, headers: corsHeaders });
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

    await saveFeedbackForms(forms);

    const submissions = (await getFeedbackSubmissions()) || [];
    const enriched = enrichFormWithStats(forms[index], submissions);

    return NextResponse.json({ success: true, form: enriched }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[PUT /api/event-feedback/forms/:id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update feedback form" }, { status: 500, headers: corsHeaders });
  }
}

// DELETE /api/event-feedback/forms/:id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const forms = (await getFeedbackForms()) || [];
    const target = findFormByIdOrSlug(forms, id);

    if (!target) {
      return NextResponse.json({ success: false, error: "Feedback form not found" }, { status: 404, headers: corsHeaders });
    }

    const filteredForms = forms.filter((f: any) => String(f.id) !== String(target.id));
    await saveFeedbackForms(filteredForms);

    // Also remove associated submissions
    const submissions = (await getFeedbackSubmissions()) || [];
    const filteredSubmissions = submissions.filter(
      (s: any) =>
        String(s.formId) !== String(target.id) &&
        String(s.formId) !== String(target.slug) &&
        String(s.formId) !== String(id)
    );
    await saveFeedbackSubmissions(filteredSubmissions);

    return NextResponse.json({ success: true, message: "Feedback form and submissions removed" }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[DELETE /api/event-feedback/forms/:id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete feedback form" }, { status: 500, headers: corsHeaders });
  }
}

