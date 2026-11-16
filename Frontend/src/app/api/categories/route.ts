import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApiBase } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let categories: any[] = [];

    // 1. Primary: fetch from Neon PostgreSQL CmsData table
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "categories.json" },
      });

      if (Array.isArray(record?.data) && record.data.length > 0) {
        categories = record.data as any[];
      }
    } catch (dbErr: any) {
      console.warn("[GET /api/categories] Direct DB query notice:", dbErr?.message || dbErr);
    }

    // 2. Fallback: try raw query on relational table with order
    if (categories.length === 0) {
      try {
        const rows: any[] = await prisma.$queryRaw`SELECT * FROM "Category" ORDER BY "order" ASC, "createdAt" ASC`;
        if (Array.isArray(rows) && rows.length > 0) {
          categories = rows;
        }
      } catch (rawErr) {
        console.warn("[GET /api/categories] raw query fallback notice:", rawErr);
      }
    }

    // 3. Fallback: sync from central backend API
    if (categories.length === 0) {
      try {
        const backendUrl = getApiBase();
        const res = await fetch(`${backendUrl}/categories`, { cache: "no-store" });
        if (res.ok) {
          const apiData = await res.json();
          if (Array.isArray(apiData.categories) && apiData.categories.length > 0) {
            categories = apiData.categories;
          }
        }
      } catch (apiErr) {
        console.warn("[GET /api/categories] Backend API fallback notice:", apiErr);
      }
    }

    // 4. Fallback: canonical 4 categories
    if (categories.length === 0) {
      categories = [
        { id: "cat-1", name: "Information Technology", order: 0 },
        { id: "cat-2", name: "Digital Media Technology", order: 1 },
        { id: "cat-3", name: "Management Programs", order: 2 },
        { id: "cat-4", name: "Design Programs", order: 3 },
      ];
    }

    // Ensure strictly sorted by order asc
    categories.sort((a, b) => {
      const ordA = typeof a.order === "number" ? a.order : 0;
      const ordB = typeof b.order === "number" ? b.order : 0;
      return ordA - ordB;
    });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    console.error("[GET /api/categories] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
