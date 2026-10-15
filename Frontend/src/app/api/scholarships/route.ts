import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/scholarships
export async function GET() {
  try {
    const record = await prisma.cmsData.findUnique({
      where: { key: "scholarships.json" },
    });

    const applications = Array.isArray(record?.data) ? record.data : [];
    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error: any) {
    console.error("[GET /api/scholarships] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch scholarship applications" },
      { status: 500 }
    );
  }
}

// PATCH /api/scholarships (Update application status)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const record = await prisma.cmsData.findUnique({
      where: { key: "scholarships.json" },
    });

    const list: any[] = Array.isArray(record?.data) ? (record.data as any[]) : [];
    const index = list.findIndex((a) => a._id === id || a.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Scholarship application not found" }, { status: 404 });
    }

    list[index].status = status;

    await prisma.cmsData.upsert({
      where: { key: "scholarships.json" },
      update: { data: list as any },
      create: { key: "scholarships.json", data: list as any },
    });

    return NextResponse.json({
      success: true,
      message: "Application status updated successfully",
      application: list[index],
      applications: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update scholarship application" },
      { status: 500 }
    );
  }
}

// DELETE /api/scholarships (Delete application)
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    }

    const record = await prisma.cmsData.findUnique({
      where: { key: "scholarships.json" },
    });

    const list: any[] = Array.isArray(record?.data) ? (record.data as any[]) : [];
    const filtered = list.filter((a) => a._id !== id && a.id !== id);

    if (filtered.length === list.length) {
      return NextResponse.json({ error: "Scholarship application not found" }, { status: 404 });
    }

    await prisma.cmsData.upsert({
      where: { key: "scholarships.json" },
      update: { data: filtered as any },
      create: { key: "scholarships.json", data: filtered as any },
    });

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
      applications: filtered,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete scholarship application" },
      { status: 500 }
    );
  }
}
