import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

async function handleDelete(request: Request) {
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

    // 1. Direct Prisma delete
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
      console.warn("[DELETE /api/scholarships/delete] DB delete notice:", dbErr);
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

        if (idList.includes(aId) || idList.includes(aUnderscoreId)) return false;
        if (email && aEmail === email) {
          if (!course || aCourse === course) return false;
        }
        return true;
      });

      await prisma.cmsData.upsert({
        where: { key: "scholarships.json" },
        update: { data: filtered as any },
        create: { key: "scholarships.json", data: filtered as any },
      });
    } catch (cmsErr) {
      console.warn("[DELETE /api/scholarships/delete] cmsData notice:", cmsErr);
    }

    // 3. Forward to central backend
    try {
      const apiBase = getApiBase();
      await fetch(`${apiBase}/cms/scholarships`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: filtered }),
      });
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

export async function POST(request: Request) {
  return handleDelete(request);
}

export async function DELETE(request: Request) {
  return handleDelete(request);
}

