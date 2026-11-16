import { NextResponse } from "next/server";
import {
  getFeedbackForms,
  getFeedbackSubmissions,
  saveFeedbackSubmissions,
  findOrAutoCreateForm,
} from "@/lib/eventFeedbackStore";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// POST /api/event-feedback/forms/:id/submit
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { attended, name, phone, rating, feedback } = body || {};

    const form = await findOrAutoCreateForm(id);

    if (!form) {
      return NextResponse.json({ success: false, error: "Feedback form not found" }, { status: 404, headers: corsHeaders });
    }

    const isAttended = attended === true || attended === "true" || attended === "yes";

    if (isAttended) {
      if (!name || typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ success: false, error: "Please enter your name" }, { status: 400, headers: corsHeaders });
      }
      if (!phone || typeof phone !== "string" || !phone.trim()) {
        return NextResponse.json({ success: false, error: "Please enter your contact number" }, { status: 400, headers: corsHeaders });
      }
      const cleanPhone = String(phone).replace(/\D/g, "");
      if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        return NextResponse.json({ success: false, error: "Please enter a valid 10-digit mobile number" }, { status: 400, headers: corsHeaders });
      }
      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return NextResponse.json({ success: false, error: "Please provide a star rating between 1 and 5" }, { status: 400, headers: corsHeaders });
      }
    }

    const submissions = (await getFeedbackSubmissions()) || [];
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
    await saveFeedbackSubmissions(submissions);

    return NextResponse.json(
      {
        success: true,
        message: isAttended ? "Thank you for your valuable feedback!" : "Response recorded.",
        submission: newSubmission,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[POST /api/event-feedback/forms/:id/submit] error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit feedback" }, { status: 500, headers: corsHeaders });
  }
}

