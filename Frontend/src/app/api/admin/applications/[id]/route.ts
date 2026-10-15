import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// DELETE /api/admin/applications/:id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing application id" }, { status: 400 });
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
      }
    } catch (e) {
      console.warn("CmsData delete notice:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete application" },
      { status: 500 }
    );
  }
}
