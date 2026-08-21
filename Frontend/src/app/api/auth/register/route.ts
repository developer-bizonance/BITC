import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/jwt";
import { usersDb } from "@/lib/userStore";
import prisma from "@/lib/prisma";

const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check existing in Neon DB or fallback
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (dbUser) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in." },
          { status: 409 }
        );
      }
    } catch (e) {
      const existingInMemory = usersDb.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existingInMemory) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in." },
          { status: 409 }
        );
      }
    }

    // Hash the password before it ever touches the database or memory store.
    // The plaintext password is never persisted anywhere from this point on.
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let createdUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    let userRole = "STUDENT";

    // 2. Persist in Neon DB
    try {
      const dbNewUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          passwordHash: hashedPassword,
          phone: phone || "",
          role: "STUDENT",
        },
      });
      createdUserId = dbNewUser.id;
    } catch (dbError) {
      console.warn("Neon DB user registration save notice (in-memory fallback active):", dbError);
    }

    // Keep in-memory store in sync
    const newUserRecord = {
      id: createdUserId,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashedPassword,
      phone: phone || "",
      role: "student" as const,
      createdAt: new Date().toISOString(),
    };
    usersDb.push(newUserRecord);

    // 3. Sign JWT token
    const token = signJWT({
      userId: createdUserId,
      name: name.trim(),
      email: normalizedEmail,
      role: "student",
    });

    const userProfile = {
      id: createdUserId,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || "",
      role: "student",
    };

    const response = NextResponse.json({
      message: "Registration successful",
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
      { error: "Internal Server Error during registration" },
      { status: 500 }
    );
  }
}