import { NextResponse } from "next/server";
import {
  getFeedbackForms,
  getFeedbackSubmissions,
  findOrAutoCreateForm,
  enrichFormWithStats,
  matchSubmissionToForm,
} from "@/lib/eventFeedbackStore";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/event-feedback/forms/:id/submissions
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

    const allSubmissions = (await getFeedbackSubmissions()) || [];
    const formSubmissions = allSubmissions
      .filter((s: any) => matchSubmissionToForm(s, form))
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    const enriched = enrichFormWithStats(form, allSubmissions);

    return NextResponse.json(
      {
        success: true,
        form: enriched,
        submissions: formSubmissions,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[GET /api/event-feedback/forms/:id/submissions] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch submissions" }, { status: 500, headers: corsHeaders });
  }
}

