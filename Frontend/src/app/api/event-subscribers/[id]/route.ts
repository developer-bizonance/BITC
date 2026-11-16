import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// DELETE /api/event-subscribers/:id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      if ((prisma as any).eventSubscriber?.delete) {
        await (prisma as any).eventSubscriber.delete({
          where: { id },
        });
      } else {
        await (prisma as any).$executeRawUnsafe(
          `DELETE FROM "EventSubscriber" WHERE "id" = $1`,
          id
        );
      }
    } catch (delErr) {
      await (prisma as any).$executeRawUnsafe(
        `DELETE FROM "EventSubscriber" WHERE "id" = $1`,
        id
      );
    }

    // Also delete from EventRegistration
    try {
      await (prisma as any).eventRegistration.deleteMany({
        where: { OR: [{ id }, { id: String(id) }] },
      });
    } catch {}

    // Also remove from cmsData if present
    try {
      const record = await prisma.cmsData.findUnique({
        where: { key: "event-subscribers.json" },
      });
      if (record && Array.isArray(record.data)) {
        const filtered = (record.data as any[]).filter((s) => s.id !== id);
        await prisma.cmsData.upsert({
          where: { key: "event-subscribers.json" },
          update: { data: filtered as any },
          create: { key: "event-subscribers.json", data: filtered as any },
        });
      }
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Subscriber removed successfully.",
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[NEXT API /event-subscribers DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber." },
      { status: 500, headers: corsHeaders }
    );
  }
}
