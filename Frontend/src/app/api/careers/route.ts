import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

const getBackendBase = () => {
  return getApiBase().replace(/\/api\/?$/, "");
};

function formatExperience(exp?: string): string {
  if (!exp) return "1+ Years";
  const trimmed = exp.trim();
  if (!trimmed) return "1+ Years";
  if (/fresher/i.test(trimmed)) return trimmed;
  if (/years?/i.test(trimmed)) return trimmed;
  if (trimmed.endsWith("+")) return `${trimmed} Years`;
  if (/^\d+\s*(-|to)\s*\d+$/i.test(trimmed)) return `${trimmed} Years`;
  if (/^\d+$/.test(trimmed)) return `${trimmed}+ Years`;
  return `${trimmed}+ Years`;
}

// GET /api/careers (List active job openings from DB with fallback)
export async function GET() {
  try {
    let openings: any[] = [];

    // 1. Primary: fetch from Neon PostgreSQL CmsData table
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "careers.json" },
      });

      if (Array.isArray(record?.data) && record.data.length > 0) {
        openings = record.data as any[];
      }
    } catch (dbErr: any) {
      console.warn("[GET /api/careers] Direct DB query notice:", dbErr?.message || dbErr);
    }

    // 2. Fallback: If DB had an issue (e.g. quota limit on serverless) or was empty, sync from central API
    if (openings.length === 0) {
      try {
        const backendUrl = getBackendBase();
        const res = await fetch(`${backendUrl}/api/careers`, { cache: "no-store" });
        if (res.ok) {
          const apiData = await res.json();
          const list = Array.isArray(apiData.openings)
            ? apiData.openings
            : Array.isArray(apiData)
            ? apiData
            : [];
          if (list.length > 0) {
            openings = list;

            // Background populate into database
            prisma.cmsData
              .upsert({
                where: { key: "careers.json" },
                update: { data: openings as any },
                create: { key: "careers.json", data: openings as any },
              })
              .catch(() => null);
          }
        }
      } catch (apiErr) {
        console.warn("[GET /api/careers] Central backend API notice:", apiErr);
      }
    }

    return NextResponse.json({
      success: true,
      openings,
    });
  } catch (error: any) {
    console.error("[GET /api/careers] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch job openings" },
      { status: 500 }
    );
  }
}

// POST /api/careers (Create job opening)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, type, location, experience, department, description, specialities, specialization } = body;

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return NextResponse.json({ error: "Job title is required." }, { status: 400 });
    }

    const newJob = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      type: type?.trim() || "Full-Time",
      location: location?.trim() || "On-Site",
      experience: formatExperience(experience),
      department: department?.trim() || "Academic & Training",
      description: description?.trim() || "",
      specialities: (specialities || specialization || "")?.trim(),
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "careers.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch {
      // If DB read fails, continue with new list
    }

    // Prevent duplicate postings within 30 seconds
    const isDuplicate = list.some((j) => {
      const sameTitle = (j.title || "").toLowerCase().trim() === title.trim().toLowerCase();
      const sameDept = (j.department || "").toLowerCase().trim() === (department || "").trim().toLowerCase();
      const diffSecs = Math.abs(Date.now() - new Date(j.createdAt || 0).getTime()) / 1000;
      return sameTitle && sameDept && diffSecs < 30;
    });

    if (isDuplicate) {
      return NextResponse.json({
        success: true,
        message: "Job opening already exists",
        openings: list,
      });
    }

    list.unshift(newJob);

    // Save to Neon PostgreSQL CmsData table
    try {
      await prisma.cmsData.upsert({
        where: { key: "careers.json" },
        update: { data: list as any },
        create: { key: "careers.json", data: list as any },
      });
    } catch (saveErr) {
      console.warn("[POST /api/careers] Could not write to DB:", saveErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Job opening posted successfully",
        opening: newJob,
        openings: list,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to post job opening" },
      { status: 500 }
    );
  }
}

// PUT /api/careers (Update job opening or reorder)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "careers.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch {
      // Ignore DB fetch failure
    }

    // Check if reordering
    if (Array.isArray(body.orderedIds)) {
      const orderedIds: string[] = body.orderedIds;
      const reordered: any[] = [];
      for (const id of orderedIds) {
        const item = list.find((j) => j.id === id);
        if (item) reordered.push(item);
      }
      for (const item of list) {
        if (!orderedIds.includes(item.id)) reordered.push(item);
      }
      list = reordered;
    } else if (body.id) {
      const { id, title, type, location, experience, department, description, specialities, specialization, status } = body;
      const idx = list.findIndex((j) => j.id === id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...(title !== undefined && { title: title.trim() }),
          ...(type !== undefined && { type: type.trim() }),
          ...(location !== undefined && { location: location.trim() }),
          ...(experience !== undefined && { experience: formatExperience(experience) }),
          ...(department !== undefined && { department: department.trim() }),
          ...(description !== undefined && { description: description.trim() }),
          ...(specialities !== undefined && { specialities: specialities.trim() }),
          ...(specialization !== undefined && { specialities: specialization.trim() }),
          ...(status !== undefined && { status }),
        };
      }
    } else if (Array.isArray(body.data)) {
      list = body.data;
    }

    try {
      await prisma.cmsData.upsert({
        where: { key: "careers.json" },
        update: { data: list as any },
        create: { key: "careers.json", data: list as any },
      });
    } catch (saveErr) {
      console.warn("[PUT /api/careers] Could not write to DB:", saveErr);
    }

    return NextResponse.json({
      success: true,
      message: "Job opening updated successfully",
      openings: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update job opening" },
      { status: 500 }
    );
  }
}

// DELETE /api/careers (Delete job opening)
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    let id = url.searchParams.get("id");
    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const cleanId = String(id).trim().toLowerCase();
    const record = await prisma.cmsData.findUnique({
      where: { key: "careers.json" },
    });

    const list: any[] = Array.isArray(record?.data) ? (record.data as any[]) : [];
    const filtered = list.filter((j) => String(j.id || "").trim().toLowerCase() !== cleanId);

    await prisma.cmsData.upsert({
      where: { key: "careers.json" },
      update: { data: filtered as any },
      create: { key: "careers.json", data: filtered as any },
    });

    return NextResponse.json({
      success: true,
      message: "Job opening removed successfully",
      openings: filtered,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete job opening" },
      { status: 500 }
    );
  }
}
