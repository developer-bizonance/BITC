import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET /api/scholarships
export async function GET() {
  try {
    const record = await prisma.cmsData.findUnique({
      where: { key: "scholarships.json" },
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
    console.error("[GET /api/scholarships] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch scholarship applications" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH /api/scholarships (Update application status)
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

    const record = await prisma.cmsData.findUnique({
      where: { key: "scholarships.json" },
    });

    const list: any[] = Array.isArray(record?.data) ? (record.data as any[]) : [];
    const index = list.findIndex((a) => a._id === id || a.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Scholarship application not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    list[index].status = status;

    await prisma.cmsData.upsert({
      where: { key: "scholarships.json" },
      update: { data: list as any },
      create: { key: "scholarships.json", data: list as any },
    });

    // Sync to central API store
    try {
      const apiBase = getApiBase();
      await fetch(`${apiBase}/cms/scholarships`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: list }),
      });
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Application status updated successfully",
        application: list[index],
        applications: list,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update scholarship application" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Helper for deletion
async function executeDelete(request: Request) {
  try {
    const url = new URL(request.url);
    const queryId = url.searchParams.get("id");
    const queryIds = url.searchParams.get("ids");
    const queryEmail = url.searchParams.get("email");
    const queryCourse = url.searchParams.get("course");

    let bodyData: any = {};
    try {
      bodyData = await request.json();
    } catch {}

    const rawIds = bodyData.ids || queryIds;
    const singleId = bodyData.id || bodyData._id || queryId;
    const email = (bodyData.email || queryEmail || "").toString().trim().toLowerCase();
    const course = (bodyData.course || queryCourse || "").toString().trim().toLowerCase();

    const idList = Array.from(new Set([
      ...(Array.isArray(rawIds) ? rawIds : (rawIds ? String(rawIds).split(",") : [])),
      singleId,
    ].filter(Boolean))).map((x) => String(x).trim().toLowerCase());

    // 1. Direct Prisma relational table delete if available
    try {
      const orClauses: any[] = [];
      for (const idVal of idList) {
        orClauses.push({ id: idVal });
        orClauses.push({ id: { equals: idVal, mode: "insensitive" } });
      }
      if (email) {
        if (course) {
          orClauses.push({
            AND: [
              { email: { equals: email, mode: "insensitive" } },
              { course: { equals: course, mode: "insensitive" } },
            ],
          });
        } else {
          orClauses.push({ email: { equals: email, mode: "insensitive" } });
        }
      }
      if (orClauses.length > 0 && (prisma as any)?.scholarshipApplication?.deleteMany) {
        await (prisma as any).scholarshipApplication.deleteMany({
          where: { OR: orClauses },
        });
      }
    } catch (dbErr) {
      console.warn("[DELETE /api/scholarships] DB delete notice:", dbErr);
    }

    // 2. Filter from cmsData table
    let filtered: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "scholarships.json" },
      });
      const list: any[] = Array.isArray(record?.data) ? (record.data as any[]) : [];
      filtered = list.filter((a) => {
        const aId = String(a.id || "").trim().toLowerCase();
        const aUnderscoreId = String(a._id || "").trim().toLowerCase();
        const aEmail = String(a.email || "").trim().toLowerCase();
        const aCourse = String(a.course || "").trim().toLowerCase();

        if (idList.includes(aId) || idList.includes(aUnderscoreId)) {
          return false;
        }
        if (email && aEmail === email) {
          if (!course || aCourse === course) {
            return false;
          }
        }
        return true;
      });

      await prisma.cmsData.upsert({
        where: { key: "scholarships.json" },
        update: { data: filtered as any },
        create: { key: "scholarships.json", data: filtered as any },
      });
    } catch (cmsErr) {
      console.warn("[DELETE /api/scholarships] cmsData notice:", cmsErr);
    }

    // 3. Forward delete to Central API store
    try {
      const apiBase = getApiBase();
      await Promise.allSettled([
        fetch(`${apiBase}/cms/scholarships`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: filtered }),
        }),
        fetch(`${apiBase}/scholarships/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: idList, email, course }),
        }),
      ]);
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Scholarship application deleted successfully",
        applications: filtered,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete scholarship application" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/scholarships (Delete application)
export async function DELETE(request: Request) {
  return executeDelete(request);
}

// POST /api/scholarships fallback for environments not allowing DELETE
export async function POST(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("action") === "delete" || url.pathname.endsWith("/delete")) {
    return executeDelete(request);
  }
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
}
