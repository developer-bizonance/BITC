import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getBackendBase = () => {
  return getApiBase().replace(/\/api\/?$/, "");
};

// GET /api/hiring-partners (Fetch hiring partners directly from Neon PostgreSQL CmsData with backend fallback)
export async function GET() {
  try {
    let partners: any[] = [];

    // 1. Primary: fetch from dedicated TopRecruiter relational table
    try {
      const rows = await prisma.topRecruiter.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      });
      if (Array.isArray(rows) && rows.length > 0) {
        partners = rows.map((r: any) => ({
          ...r,
          id: String(r.id),
          isActive: r.isActive !== false,
        }));
      }
    } catch (tblErr: any) {
      console.warn("[GET /api/hiring-partners] TopRecruiter table query notice:", tblErr?.message || tblErr);
    }

    // 2. Secondary: fetch from Neon PostgreSQL CmsData table
    if (partners.length === 0) {
      try {
        const record = await prisma.cmsData.findUnique({
          where: { key: "hiring-partners.json" },
        });

        if (Array.isArray(record?.data) && record.data.length > 0) {
          partners = record.data as any[];
        }
      } catch (dbErr: any) {
        console.warn("[GET /api/hiring-partners] Direct DB query notice:", dbErr?.message || dbErr);
      }
    }

    // 3. Fallback: if DB is empty, sync from central backend API
    if (partners.length === 0) {
      try {
        const backendUrl = getBackendBase();
        const res = await fetch(`${backendUrl}/api/hiring-partners`, { cache: "no-store" });
        if (res.ok) {
          const apiData = await res.json();
          const list = Array.isArray(apiData.partners)
            ? apiData.partners
            : Array.isArray(apiData)
            ? apiData
            : [];
          if (list.length > 0) {
            partners = list;

            // Background populate into database
            prisma.cmsData
              .upsert({
                where: { key: "hiring-partners.json" },
                update: { data: partners as any },
                create: { key: "hiring-partners.json", data: partners as any },
              })
              .catch(() => null);
          }
        }
      } catch (apiErr) {
        console.warn("[GET /api/hiring-partners] Central backend API notice:", apiErr);
      }
    }

    // Deduplicate partners by id and name
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const uniquePartners: any[] = [];
    for (const p of partners || []) {
      if (!p) continue;
      const id = p.id ? String(p.id).trim() : "";
      const norm = p.name ? String(p.name).trim().toLowerCase() : "";
      if (id && seenIds.has(id)) continue;
      if (norm && seenNames.has(norm)) continue;
      if (id) seenIds.add(id);
      if (norm) seenNames.add(norm);
      uniquePartners.push(p);
    }

    return NextResponse.json({
      success: true,
      partners: uniquePartners,
    });
  } catch (error: any) {
    console.error("[GET /api/hiring-partners] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch hiring partners" },
      { status: 500 }
    );
  }
}

// POST /api/hiring-partners (Create new hiring partner)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, logo, website, category, isActive } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Company name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    let list: any[] = [];

    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "hiring-partners.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch (dbErr) {
      console.warn("[POST /api/hiring-partners] DB query warning:", dbErr);
    }

    const existing = list.find(
      (p) => p.name?.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) {
      return NextResponse.json(
        { error: `A partner named "${trimmedName}" already exists.` },
        { status: 409 }
      );
    }

    const newPartner = {
      id: `hp-${Date.now()}`,
      name: trimmedName,
      logo: logo?.trim() || "",
      website: website?.trim() || "",
      category: category?.trim() || "Hiring Partner",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date().toISOString(),
    };

    list.push(newPartner);

    try {
      await prisma.cmsData.upsert({
        where: { key: "hiring-partners.json" },
        update: { data: list as any },
        create: { key: "hiring-partners.json", data: list as any },
      });
    } catch (saveErr) {
      console.warn("[POST] DB write notice:", saveErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Hiring partner added successfully",
        partner: newPartner,
        partners: list,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to add partner" },
      { status: 500 }
    );
  }
}

// PUT /api/hiring-partners (Update or reorder hiring partners)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "hiring-partners.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch {
      // Ignore DB fetch failure
    }

    if (Array.isArray(body.orderedIds)) {
      const orderedIds: string[] = body.orderedIds;
      const reordered: any[] = [];
      for (const id of orderedIds) {
        const item = list.find((p) => p.id === id);
        if (item) reordered.push(item);
      }
      for (const item of list) {
        if (!orderedIds.includes(item.id)) reordered.push(item);
      }
      list = reordered;
    } else if (body.id) {
      const { id, name, logo, website, category, isActive } = body;
      const idx = list.findIndex((p) => p.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Partner not found in local cache" }, { status: 404 });
      }
      list[idx] = {
        ...list[idx],
        ...(name !== undefined && { name: name.trim() }),
        ...(logo !== undefined && { logo: logo.trim() }),
        ...(website !== undefined && { website: website.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      };
    } else if (Array.isArray(body.data)) {
      list = body.data;
    } else {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    try {
      await prisma.cmsData.upsert({
        where: { key: "hiring-partners.json" },
        update: { data: list as any },
        create: { key: "hiring-partners.json", data: list as any },
      });
    } catch (saveErr) {
      console.warn("[PUT] DB write notice:", saveErr);
    }

    return NextResponse.json({
      success: true,
      message: "Hiring Partners updated successfully",
      partners: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update hiring partners" },
      { status: 500 }
    );
  }
}

// DELETE /api/hiring-partners?id=xxx (Delete hiring partner)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Partner ID is required" }, { status: 400 });
    }

    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "hiring-partners.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch (e) {
      console.warn("[DELETE /api/hiring-partners] DB read warning:", e);
    }

    const initialLen = list.length;
    const updatedList = list.filter((p) => p.id !== id);

    if (updatedList.length === initialLen) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    try {
      await prisma.cmsData.upsert({
        where: { key: "hiring-partners.json" },
        update: { data: updatedList as any },
        create: { key: "hiring-partners.json", data: updatedList as any },
      });
    } catch (saveErr) {
      console.warn("[DELETE] DB write notice:", saveErr);
    }

    return NextResponse.json({
      success: true,
      message: "Hiring partner removed successfully",
      partners: updatedList,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete partner" },
      { status: 500 }
    );
  }
}

