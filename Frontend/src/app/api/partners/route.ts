import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const getBackendBase = () => {
  return getApiBase().replace(/\/api\/?$/, "");
};

// GET /api/partners (Fetch academic partners directly from database with API fallback)
export async function GET() {
  try {
    let partners: any[] = [];

    // 1. Primary: fetch from dedicated AcademicPartner relational table
    try {
      const rows = await prisma.academicPartner.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      });
      if (Array.isArray(rows) && rows.length > 0) {
        partners = rows.map((r: any) => ({
          ...r,
          id: String(r.id),
          isActive: r.isActive !== false,
        }));
      }
    } catch (dbErr: any) {
      console.warn("[GET /api/partners] Direct AcademicPartner query notice:", dbErr?.message || dbErr);
    }

    // 2. Secondary: fallback to CmsData table if relational table is empty
    if (partners.length === 0) {
      try {
        const record = await prisma.cmsData.findUnique({
          where: { key: "partners.json" },
        });

        if (Array.isArray(record?.data) && record.data.length > 0) {
          partners = (record.data as any[]).map((r: any) => ({
            ...r,
            id: String(r.id),
            isActive: r.isActive !== false && r.isActive !== "false",
          }));
        }
      } catch (cmsErr: any) {
        console.warn("[GET /api/partners] Direct CmsData query notice:", cmsErr?.message || cmsErr);
      }
    }

    // 3. Fallback: if DB is empty, sync from central backend API
    if (partners.length === 0) {
      try {
        const backendUrl = getBackendBase();
        const res = await fetch(`${backendUrl}/api/partners`, { cache: "no-store" });
        if (res.ok) {
          const apiData = await res.json();
          const list = Array.isArray(apiData.partners)
            ? apiData.partners
            : Array.isArray(apiData)
            ? apiData
            : [];
          if (list.length > 0) {
            partners = list.map((r: any) => ({
              ...r,
              id: String(r.id),
              isActive: r.isActive !== false && r.isActive !== "false",
            }));

            // Background populate into database
            prisma.cmsData
              .upsert({
                where: { key: "partners.json" },
                update: { data: partners as any },
                create: { key: "partners.json", data: partners as any },
              })
              .catch(() => null);
          }
        }
      } catch (apiErr) {
        console.warn("[GET /api/partners] Central backend API notice:", apiErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        partners,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[GET /api/partners] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch partners" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/partners (Add academic partner)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, logo, website, city, isActive } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Partner name is required (minimum 2 characters)." },
        { status: 400, headers: corsHeaders }
      );
    }

    const newPartner = {
      id: `partner-${Date.now()}`,
      name: name.trim(),
      logo: logo?.trim() || "/univercity.png",
      website: website?.trim() || "",
      city: city?.trim() || "Amravati",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date().toISOString(),
    };

    // Upsert directly into AcademicPartner table
    try {
      await prisma.academicPartner.upsert({
        where: { id: newPartner.id },
        update: {
          name: newPartner.name,
          logo: newPartner.logo,
          city: newPartner.city,
          isActive: newPartner.isActive,
        },
        create: {
          id: newPartner.id,
          name: newPartner.name,
          logo: newPartner.logo,
          city: newPartner.city,
          isActive: newPartner.isActive,
        },
      });
    } catch (tblErr) {
      console.warn("[POST /api/partners] AcademicPartner table write notice:", tblErr);
    }

    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "partners.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch {}

    list.unshift(newPartner);

    try {
      await prisma.cmsData.upsert({
        where: { key: "partners.json" },
        update: { data: list as any },
        create: { key: "partners.json", data: list as any },
      });
    } catch (saveErr) {
      console.warn("[POST /api/partners] Could not write to DB:", saveErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Academic Partner added successfully",
        partner: newPartner,
        partners: list,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to add partner" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT /api/partners (Update or reorder partners)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "partners.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch {}

    // If list is empty in DB, hydrate from central backend API first
    if (list.length === 0) {
      try {
        const backendUrl = getBackendBase();
        const res = await fetch(`${backendUrl}/api/partners`, { cache: "no-store" });
        if (res.ok) {
          const apiData = await res.json();
          list = Array.isArray(apiData.partners) ? apiData.partners : [];
        }
      } catch {}
    }

    if (Array.isArray(body.orderedIds)) {
      const orderedIds: string[] = body.orderedIds;
      const reordered: any[] = [];
      for (const id of orderedIds) {
        const item = list.find((p) => String(p.id) === String(id));
        if (item) reordered.push(item);
      }
      for (const item of list) {
        if (!orderedIds.includes(String(item.id))) reordered.push(item);
      }
      list = reordered;

      // Update order in relational table
      for (let idx = 0; idx < orderedIds.length; idx++) {
        const oid = orderedIds[idx];
        prisma.academicPartner
          .updateMany({
            where: { id: oid },
            data: { order: idx },
          })
          .catch(() => null);
      }
    } else if (body.id) {
      const { id, name, logo, website, city, isActive } = body;
      const idx = list.findIndex((p) => String(p.id) === String(id));
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...(name !== undefined && { name: name.trim() }),
          ...(logo !== undefined && { logo: logo.trim() }),
          ...(website !== undefined && { website: website.trim() }),
          ...(city !== undefined && { city: city.trim() }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        };
      }

      // Sync to relational table
      try {
        await prisma.academicPartner.updateMany({
          where: { id: String(id) },
          data: {
            ...(name !== undefined && { name: name.trim() }),
            ...(logo !== undefined && { logo: logo.trim() }),
            ...(city !== undefined && { city: city.trim() }),
            ...(isActive !== undefined && { isActive: Boolean(isActive) }),
          },
        });
      } catch (tblErr) {
        console.warn("[PUT /api/partners] AcademicPartner table sync notice:", tblErr);
      }
    } else if (Array.isArray(body.data)) {
      list = body.data;
    }

    try {
      await prisma.cmsData.upsert({
        where: { key: "partners.json" },
        update: { data: list as any },
        create: { key: "partners.json", data: list as any },
      });
    } catch (saveErr) {
      console.warn("[PUT /api/partners] Could not write to DB:", saveErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Academic Partners updated successfully",
        partners: list,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update partners" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH /api/partners (Toggle show/hide)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isActive } = body;
    if (!id) {
      return NextResponse.json({ error: "Partner id is required" }, { status: 400, headers: corsHeaders });
    }

    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "partners.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch {}

    const idx = list.findIndex((p) => String(p.id) === String(id));
    let newIsActive: boolean;

    if (idx !== -1) {
      const current = list[idx];
      newIsActive = isActive !== undefined ? Boolean(isActive) : current.isActive === false;
      list[idx] = { ...current, isActive: newIsActive };
    } else {
      newIsActive = isActive !== undefined ? Boolean(isActive) : true;
    }

    // Direct update to AcademicPartner relational table
    try {
      await prisma.academicPartner.updateMany({
        where: { id: String(id) },
        data: { isActive: newIsActive },
      });
    } catch (relErr) {
      console.warn("[PATCH /api/partners] AcademicPartner update notice:", relErr);
    }

    try {
      await prisma.cmsData.upsert({
        where: { key: "partners.json" },
        update: { data: list as any },
        create: { key: "partners.json", data: list as any },
      });
    } catch (saveErr) {
      console.warn("[PATCH /api/partners] DB write notice:", saveErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Partner is now ${newIsActive ? "visible" : "hidden"}`,
        partner: idx !== -1 ? list[idx] : { id, isActive: newIsActive },
        partners: list,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to toggle partner" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/partners (Delete partner)
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
      return NextResponse.json({ error: "Partner ID is required" }, { status: 400, headers: corsHeaders });
    }

    const cleanId = String(id).trim();

    // Delete from relational table
    try {
      await prisma.academicPartner.deleteMany({
        where: { id: cleanId },
      });
    } catch (relErr) {
      console.warn("[DELETE /api/partners] Relational table delete notice:", relErr);
    }

    const record = await prisma.cmsData.findUnique({
      where: { key: "partners.json" },
    });

    const list: any[] = Array.isArray(record?.data) ? (record.data as any[]) : [];
    const filtered = list.filter((p) => String(p.id || "").trim() !== cleanId);

    await prisma.cmsData.upsert({
      where: { key: "partners.json" },
      update: { data: filtered as any },
      create: { key: "partners.json", data: filtered as any },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Academic Partner deleted successfully",
        partners: filtered,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete partner" },
      { status: 500, headers: corsHeaders }
    );
  }
}
