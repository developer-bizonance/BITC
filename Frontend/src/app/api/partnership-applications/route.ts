import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

const getBackendBase = () => {
  const base = getApiBase();
  return base.replace(/\/api\/?$/, "");
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET /api/partnership-applications
export async function GET() {
  try {
    let applications: any[] = [];

    // 1. Try fetching directly from PostgreSQL CmsData table
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "partnership-applications.json" },
      });
      if (Array.isArray(record?.data) && record.data.length > 0) {
        applications = record.data;
      }
    } catch (dbErr: any) {
      console.warn("[GET /api/partnership-applications] DB notice:", dbErr?.message || dbErr);
    }

    // 2. Fallback to central backend API if database is empty or inaccessible
    if (applications.length === 0) {
      try {
        const backendBase = getBackendBase();
        const res = await fetch(`${backendBase}/api/partnership-applications`, {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.applications)) {
            applications = data.applications;
          } else if (Array.isArray(data)) {
            applications = data;
          }
        }
      } catch (apiErr: any) {
        console.warn("[GET /api/partnership-applications] Backend fallback notice:", apiErr?.message || apiErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        applications,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.warn("[GET /api/partnership-applications] Safe fallback notice:", error?.message || error);
    return NextResponse.json(
      {
        success: true,
        applications: [],
      },
      { headers: corsHeaders }
    );
  }
}

// POST /api/partnership-applications (Submit new request)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      organizationName,
      website,
      contactPerson,
      designation,
      email,
      phone,
      partnershipType,
      mouFile,
      mouFileName,
      mouFileSize,
      message,
    } = body;

    if (!organizationName || !email || !phone) {
      return NextResponse.json(
        { error: "Organization Name, Email, and Phone are required." },
        { status: 400, headers: corsHeaders }
      );
    }

    const newApp = {
      id: `partnerapp-${Date.now()}`,
      type: type || "corporate",
      organizationName: organizationName.trim(),
      website: website?.trim() || "",
      contactPerson: contactPerson?.trim() || "",
      designation: designation?.trim() || "",
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      partnershipType: partnershipType?.trim() || "MoU Collaboration",
      mouFile: mouFile?.trim() || "",
      mouFileName: mouFileName?.trim() || "",
      mouFileSize: mouFileSize?.trim() || "",
      message: message?.trim() || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "partnership-applications.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch {}

    list.unshift(newApp);

    try {
      await prisma.cmsData.upsert({
        where: { key: "partnership-applications.json" },
        update: { data: list as any },
        create: { key: "partnership-applications.json", data: list as any },
      });
    } catch (upsertErr: any) {
      console.warn("[POST /api/partnership-applications] DB upsert notice:", upsertErr?.message || upsertErr);
    }

    // Sync to central API store
    try {
      const backendBase = getBackendBase();
      await fetch(`${backendBase}/api/cms/partnership-applications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: list }),
      });
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Partnership application submitted successfully!",
        application: newApp,
        applications: list,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to submit partnership application" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH /api/partnership-applications (Update status)
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

    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "partnership-applications.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch {}

    const cleanId = String(id).trim().toLowerCase();
    const index = list.findIndex(
      (a) =>
        String(a.id || "").toLowerCase() === cleanId ||
        String(a._id || "").toLowerCase() === cleanId ||
        String(a.fullId || "").toLowerCase() === cleanId
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Partnership application not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    list[index].status = status;

    try {
      await prisma.cmsData.upsert({
        where: { key: "partnership-applications.json" },
        update: { data: list as any },
        create: { key: "partnership-applications.json", data: list as any },
      });
    } catch (upsertErr: any) {
      console.warn("[PATCH /api/partnership-applications] DB upsert notice:", upsertErr?.message || upsertErr);
    }

    // Sync to central API store
    try {
      const backendBase = getBackendBase();
      await fetch(`${backendBase}/api/cms/partnership-applications`, {
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
      { error: error?.message || "Failed to update partnership application" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/partnership-applications (Delete application)
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

    let list: any[] = [];
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "partnership-applications.json" },
      });
      list = Array.isArray(record?.data) ? (record.data as any[]) : [];
    } catch {}

    const cleanId = String(id).trim().toLowerCase();
    const filtered = list.filter(
      (a) =>
        String(a.id || "").toLowerCase() !== cleanId &&
        String(a._id || "").toLowerCase() !== cleanId &&
        String(a.fullId || "").toLowerCase() !== cleanId
    );

    if (filtered.length === list.length) {
      return NextResponse.json(
        { error: "Partnership application not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    try {
      await prisma.cmsData.upsert({
        where: { key: "partnership-applications.json" },
        update: { data: filtered as any },
        create: { key: "partnership-applications.json", data: filtered as any },
      });
    } catch (upsertErr: any) {
      console.warn("[DELETE /api/partnership-applications] DB upsert notice:", upsertErr?.message || upsertErr);
    }

    // Sync to central API store
    try {
      const backendBase = getBackendBase();
      await fetch(`${backendBase}/api/cms/partnership-applications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: filtered }),
      });
    } catch {}

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
      { error: error?.message || "Failed to delete partnership application" },
      { status: 500, headers: corsHeaders }
    );
  }
}
