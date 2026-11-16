import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getBackendBase = () => {
  return getApiBase().replace(/\/api\/?$/, "");
};

// GET /api/industry-partners (Fetch industry partners directly from Neon PostgreSQL CmsData with backend fallback)
export async function GET() {
  try {
    let partners: any[] = [];

    // 1. Primary: fetch from Neon PostgreSQL CmsData table
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "industry-partners.json" },
      });

      if (Array.isArray(record?.data) && record.data.length > 0) {
        partners = record.data as any[];
      }
    } catch (dbErr: any) {
      console.warn("[GET /api/industry-partners] Direct DB query notice:", dbErr?.message || dbErr);
    }

    // 2. Fallback: if DB is empty, sync from central backend API
    if (partners.length === 0) {
      try {
        const backendUrl = getBackendBase();
        const res = await fetch(`${backendUrl}/api/industry-partners`, { cache: "no-store" });
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
                where: { key: "industry-partners.json" },
                update: { data: partners as any },
                create: { key: "industry-partners.json", data: partners as any },
              })
              .catch(() => null);
          }
        }
      } catch (apiErr) {
        console.warn("[GET /api/industry-partners] Central backend API notice:", apiErr);
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
    console.error("[GET /api/industry-partners] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch industry partners" },
      { status: 500 }
    );
  }
}

// POST /api/industry-partners (Create new industry partner)
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
        where: { key: "industry-partners.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch {
      // Ignore DB fetch failure
    }

    // Check if partner with the same name already exists
    const existing = list.find(
      (p) => String(p.name || "").trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) {
      return NextResponse.json(
        {
          error: `A partner named "${trimmedName}" already exists.`,
          partner: existing,
          partners: list,
        },
        { status: 400 }
      );
    }

    const newPartner = {
      id: `ip-${Date.now()}`,
      name: trimmedName,
      category: category?.trim() || "Industry Partner",
      logo: logo?.trim() || "",
      website: website?.trim() || "",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date().toISOString(),
    };

    list.push(newPartner);

    try {
      await prisma.cmsData.upsert({
        where: { key: "industry-partners.json" },
        update: { data: list as any },
        create: { key: "industry-partners.json", data: list as any },
      });
    } catch (saveErr) {
      console.warn("[POST /api/industry-partners] Could not write to DB:", saveErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Industry Partner added successfully",
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

// PUT /api/industry-partners (Update or reorder industry partners)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "industry-partners.json" },
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
        where: { key: "industry-partners.json" },
        update: { data: list as any },
        create: { key: "industry-partners.json", data: list as any },
      });
    } catch (saveErr) {
      console.warn("[PUT] DB write notice:", saveErr);
    }

    return NextResponse.json({
      success: true,
      message: "Industry Partners updated successfully",
      partners: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update industry partners" },
      { status: 500 }
    );
  }
}

// PATCH /api/industry-partners (Toggle visibility)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "Partner ID is required" }, { status: 400 });
    }

    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "industry-partners.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch {}

    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Industry Partner not found" }, { status: 404 });
    }

    const current = list[idx];
    const newIsActive = body.isActive !== undefined ? Boolean(body.isActive) : current.isActive === false ? true : false;
    list[idx] = { ...current, isActive: newIsActive };

    try {
      await prisma.cmsData.upsert({
        where: { key: "industry-partners.json" },
        update: { data: list as any },
        create: { key: "industry-partners.json", data: list as any },
      });
    } catch (saveErr) {
      console.warn("[PATCH /api/industry-partners] DB write notice:", saveErr);
    }

    return NextResponse.json({
      success: true,
      message: `Industry Partner is now ${newIsActive ? "visible" : "hidden"}`,
      partner: list[idx],
      partners: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to toggle industry partner" },
      { status: 500 }
    );
  }
}

// DELETE /api/industry-partners (Delete industry partner)
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
      return NextResponse.json({ error: "Partner ID is required" }, { status: 400 });
    }

    const cleanId = String(id).trim().toLowerCase();
    const record = await prisma.cmsData.findUnique({
      where: { key: "industry-partners.json" },
    });

    const list: any[] = Array.isArray(record?.data) ? (record.data as any[]) : [];
    const filtered = list.filter((p) => String(p.id || "").trim().toLowerCase() !== cleanId);

    await prisma.cmsData.upsert({
      where: { key: "industry-partners.json" },
      update: { data: filtered as any },
      create: { key: "industry-partners.json", data: filtered as any },
    });

    // Also forward delete to backend API asynchronously
    try {
      const backendUrl = getBackendBase();
      fetch(`${backendUrl}/api/industry-partners/${id}`, {
        method: "DELETE",
      }).catch(() => null);
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Industry Partner deleted successfully",
      partners: filtered,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete partner" },
      { status: 500 }
    );
  }
}
