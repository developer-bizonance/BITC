import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/jwt";
import { usersDb } from "@/lib/userStore";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user: any = null;

    // Try finding in Neon DB
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (dbUser) {
        user = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          passwordHash: dbUser.passwordHash,
          phone: dbUser.phone || "",
          role: dbUser.role.toLowerCase(),
        };
      }
    } catch (e) {
      console.warn("Neon DB login query notice:", e);
    }

    // Fallback to in-memory store
    if (!user) {
      user = usersDb.find((u) => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare the submitted password against the stored bcrypt hash.
    // Never compare plaintext passwords directly against the DB value.
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signJWT({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const response = NextResponse.json({
      message: "Login successful",
      user: userProfile,
      token,
    });

    response.cookies.set("bitc_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error during login" },
      { status: 500 }
    );
  }
}