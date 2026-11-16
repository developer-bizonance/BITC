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

// GET /api/inquiries
export async function GET() {
  try {
    let inquiries: any[] = [];
    if (process.env.DATABASE_URL) {
      try {
        const dbInqs = await prisma.inquiry.findMany({
          orderBy: { createdAt: "desc" },
        });
        inquiries = dbInqs || [];
      } catch (dbErr) {
        console.warn("[GET /api/inquiries] DB error:", dbErr);
      }
    }

    if (inquiries.length === 0) {
      try {
        const record = await prisma.cmsData.findUnique({
          where: { key: "inquiries.json" },
        });
        if (record && Array.isArray(record.data)) {
          inquiries = record.data as any[];
        }
      } catch (cmsErr) {
        console.warn("[GET /api/inquiries] CMS error:", cmsErr);
      }
    }

    const normalized = inquiries.map((inq: any) => {
      const collegeVal = inq.college || inq.school || inq.collegeName || inq.schoolCollege || "";
      const cityVal = inq.city || "";
      return {
        ...inq,
        college: collegeVal,
        school: collegeVal,
        collegeName: collegeVal,
        city: cityVal,
      };
    });

    return NextResponse.json({ success: true, inquiries: normalized }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch inquiries" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/inquiries
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, courseId, courseSlug, enquiryType, college, school, collegeName, city } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and mobile number are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const schoolOrCollege = (college || school || collegeName || body.schoolCollege || "").trim();
    const cityVal = (city || "").trim();

    // Forward to central backend API
    try {
      const apiBase = getApiBase();
      await fetch(`${apiBase}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.warn("[INQUIRIES API] Central API sync notice:", e);
    }

    let savedInquiry: any = null;

    if (process.env.DATABASE_URL) {
      try {
        let targetCourseId = courseId;
        if (!targetCourseId && courseSlug) {
          const course = await prisma.course.findUnique({
            where: { slug: courseSlug },
          });
          if (course) targetCourseId = course.id;
        }

        savedInquiry = await prisma.inquiry.create({
          data: {
            name,
            email,
            phone,
            college: schoolOrCollege || null,
            school: schoolOrCollege || null,
            collegeName: schoolOrCollege || null,
            city: cityVal || null,
            enquiryType: enquiryType || "General Inquiry",
            message: message || "Interested in BITC Certification Courses",
            status: "PENDING",
            courseId: targetCourseId || null,
          },
        });

        // Update inquiries.json in cmsData
        try {
          const record = await prisma.cmsData.findUnique({ where: { key: "inquiries.json" } });
          const list = Array.isArray(record?.data) ? (record!.data as any[]) : [];
          const item = {
            id: savedInquiry.id,
            name,
            email,
            phone,
            message: message || "",
            enquiryType: enquiryType || "General Inquiry",
            college: schoolOrCollege,
            school: schoolOrCollege,
            collegeName: schoolOrCollege,
            city: cityVal,
            status: "PENDING",
            createdAt: new Date().toISOString(),
          };
          list.unshift(item);
          await prisma.cmsData.upsert({
            where: { key: "inquiries.json" },
            update: { data: list as any },
            create: { key: "inquiries.json", data: list as any },
          });

          // Sync to central API CMS
          const apiBase = getApiBase();
          await fetch(`${apiBase}/cms/inquiries`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: list }),
          }).catch(() => {});
        } catch {}
      } catch (dbError) {
        console.warn("[INQUIRIES API] Neon DB save notice:", dbError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting BITC! Our team will reach out to you within 24 hours.",
        inquiry: savedInquiry || {
          name,
          email,
          phone,
          college: schoolOrCollege,
          school: schoolOrCollege,
          city: cityVal,
          message,
          status: "PENDING",
        },
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to record inquiry" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/inquiries
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400, headers: corsHeaders });
    }

    const cleanId = String(id).trim().toLowerCase();

    if (process.env.DATABASE_URL) {
      try {
        await prisma.inquiry.deleteMany({
          where: {
            OR: [
              { id: String(id) },
              { id: { equals: cleanId, mode: "insensitive" } },
            ],
          },
        });
      } catch (e) {}
    }

    // Filter from cmsData
    try {
      const record = await prisma.cmsData.findUnique({ where: { key: "inquiries.json" } });
      const list = Array.isArray(record?.data) ? (record!.data as any[]) : [];
      const filtered = list.filter((a) => {
        const aId = String(a.id || "").trim().toLowerCase();
        return aId !== cleanId;
      });
      await prisma.cmsData.upsert({
        where: { key: "inquiries.json" },
        update: { data: filtered as any },
        create: { key: "inquiries.json", data: filtered as any },
      });
    } catch (e) {}

    // Forward to central API
    try {
      const apiBase = getApiBase();
      await fetch(`${apiBase}/inquiries/${id}`, { method: "DELETE" }).catch(() => {});
    } catch (e) {}

    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete inquiry" }, { status: 500, headers: corsHeaders });
  }
}
