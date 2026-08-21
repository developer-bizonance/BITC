import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { usersDb } from "@/lib/userStore";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // 1. Check Authorization header
    const authHeader = request.headers.get("authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    // 2. Fallback to cookie
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("bitc_token")?.value || null;
    }

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ user: null, error: "Invalid or expired JWT token" }, { status: 401 });
    }

    // Try fetching from Neon DB first
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (dbUser) {
        return NextResponse.json({
          user: {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            phone: dbUser.phone || "",
            role: dbUser.role.toLowerCase(),
          },
        });
      }
    } catch (e) {
      console.warn("Neon DB me endpoint query notice:", e);
    }

    const user = usersDb.find((u) => u.id === payload.userId);
    if (!user) {
      return NextResponse.json({
        user: {
          id: payload.userId,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        },
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null, error: "Authentication check failed" }, { status: 500 });
  }
}
