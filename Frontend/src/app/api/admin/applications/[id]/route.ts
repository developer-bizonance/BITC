import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// DELETE /api/admin/applications/:id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing application id" }, { status: 400, headers: corsHeaders });
    }

    // 1. Delete from Application table
    try {
      await prisma.application.deleteMany({
        where: { OR: [{ id }, { id: id.toString() }] },
      });
    } catch (e) {
      console.warn("Prisma delete notice:", e);
    }

    // 2. Delete from cmsData
    try {
      const cmsRecord = await prisma.cmsData.findUnique({
        where: { key: "course-applications.json" },
      });
      if (cmsRecord && Array.isArray(cmsRecord.data)) {
        const filtered = (cmsRecord.data as any[]).filter(a => a.id !== id && a.fullId !== id);
        await prisma.cmsData.update({
          where: { key: "course-applications.json" },
          data: { data: filtered as any },
        });

        const apiBase = getApiBase();
        await fetch(`${apiBase}/cms/course-applications`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: filtered }),
        }).catch(() => {});
      }
    } catch (e) {
      console.warn("CmsData delete notice:", e);
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete application" },
      { status: 500, headers: corsHeaders }
    );
  }
}
