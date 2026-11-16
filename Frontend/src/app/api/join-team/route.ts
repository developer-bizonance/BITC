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

// GET /api/join-team
export async function GET() {
  try {
    let record = await prisma.cmsData.findUnique({
      where: { key: "join-team.json" },
    });

    if (!record || !Array.isArray(record.data) || record.data.length === 0) {
      record = await prisma.cmsData.findUnique({
        where: { key: "applications.json" },
      });
    }

    const applications = Array.isArray(record?.data) ? record.data : [];
    return NextResponse.json(
      {
        success: true,
        applications,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.warn("[GET /api/join-team] notice:", error);
    return NextResponse.json(
      { success: true, applications: [] },
      { headers: corsHeaders }
    );
  }
}

// PATCH /api/join-team
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const keys = ["join-team.json", "applications.json"];
    for (const key of keys) {
      const record = await prisma.cmsData.findUnique({ where: { key } });
      if (record && Array.isArray(record.data)) {
        const list = record.data as any[];
        const updated = list.map((a) => {
          if (a.id === id || a._id === id || a.fullId === id) {
            return { ...a, status };
          }
          return a;
        });
        await prisma.cmsData.upsert({
          where: { key },
          update: { data: updated as any },
          create: { key, data: updated as any },
        });
      }
    }

    return NextResponse.json(
      { success: true, message: "Status updated" },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update status" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/join-team
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanId = String(id).trim().toLowerCase();
    const keys = ["join-team.json", "applications.json"];

    for (const key of keys) {
      const record = await prisma.cmsData.findUnique({ where: { key } });
      if (record && Array.isArray(record.data)) {
        const list = record.data as any[];
        const filtered = list.filter((a) => {
          const aId = String(a.id || "").toLowerCase();
          const aUnderscoreId = String(a._id || "").toLowerCase();
          const aFullId = String(a.fullId || "").toLowerCase();
          return aId !== cleanId && aUnderscoreId !== cleanId && aFullId !== cleanId;
        });
        await prisma.cmsData.upsert({
          where: { key },
          update: { data: filtered as any },
          create: { key, data: filtered as any },
        });
      }
    }

    return NextResponse.json(
      { success: true, message: "Application removed" },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete application" },
      { status: 500, headers: corsHeaders }
    );
  }
}

