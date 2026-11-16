import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET /api/careers/applications
export async function GET() {
  try {
    const record = await prisma.cmsData.findUnique({
      where: { key: "applications.json" },
    });

    const applications = Array.isArray(record?.data) ? record.data : [];
    return NextResponse.json(
      {
        success: true,
        applications,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.warn("[GET /api/careers/applications] notice:", error);
    return NextResponse.json(
      { success: true, applications: [] },
      { headers: corsHeaders }
    );
  }
}

// DELETE /api/careers/applications (Delete application by id)
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id parameter is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const record = await prisma.cmsData.findUnique({
      where: { key: "applications.json" },
    });

    const list: any[] = Array.isArray(record?.data) ? (record.data as any[]) : [];
    const cleanId = String(id).trim().toLowerCase();
    const filtered = list.filter((a) => {
      const aId = String(a.id || "").toLowerCase();
      const aUnderscoreId = String(a._id || "").toLowerCase();
      const aFullId = String(a.fullId || "").toLowerCase();
      return aId !== cleanId && aUnderscoreId !== cleanId && aFullId !== cleanId;
    });

    await prisma.cmsData.upsert({
      where: { key: "applications.json" },
      update: { data: filtered as any },
      create: { key: "applications.json", data: filtered as any },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application deleted successfully",
        applications: filtered,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete career application" },
      { status: 500, headers: corsHeaders }
    );
  }
}
