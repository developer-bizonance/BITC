import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { usersDb } from "../lib/userStore.js";
import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/students - List all student users
router.get("/", async (_req: Request, res: Response) => {
  try {
    let dbStudents: any[] = [];
    try {
      dbStudents = await prisma.user.findMany({
        where: { role: "STUDENT" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      // Prisma optional fallback
    }

    const inMemoryStudents = usersDb
      .filter((u) => u.role === "student")
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "",
        role: "student",
        createdAt: u.createdAt,
      }));

    // Merge without duplicates
    const dbEmails = new Set(dbStudents.map((s) => s.email.toLowerCase()));
    const merged = [
      ...dbStudents,
      ...inMemoryStudents.filter((s) => !dbEmails.has(s.email.toLowerCase())),
    ];

    return res.json({
      success: true,
      students: merged,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: "Failed to fetch students" });
  }
});

// POST /api/students - Add new student account
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Name and Email are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = usersDb.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, error: "Student with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password || "Student@123", 10);
    const newStudent = {
      id: `usr_stu_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : "",
      passwordHash,
      role: "student" as const,
      createdAt: new Date().toISOString(),
    };

    try {
      await prisma.user.create({
        data: {
          name: newStudent.name,
          email: newStudent.email,
          phone: newStudent.phone,
          passwordHash: newStudent.passwordHash,
          role: "STUDENT",
        },
      });
    } catch (e) {
      // Memory fallback
    }

    usersDb.unshift(newStudent);

    return res.status(201).json({
      success: true,
      student: {
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        role: newStudent.role,
        createdAt: newStudent.createdAt,
      },
      message: "Student account created successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to create student" });
  }
});

// PUT /api/students/:id - Update student account
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const idx = usersDb.findIndex((u) => u.id === id);
    if (idx !== -1) {
      usersDb[idx] = {
        ...usersDb[idx],
        name: name ? name.trim() : usersDb[idx].name,
        email: email ? email.trim().toLowerCase() : usersDb[idx].email,
        phone: phone !== undefined ? phone.trim() : usersDb[idx].phone,
      };
    }

    try {
      await prisma.user.update({
        where: { id },
        data: {
          ...(name && { name: name.trim() }),
          ...(email && { email: email.trim().toLowerCase() }),
          ...(phone !== undefined && { phone: phone.trim() }),
        },
      });
    } catch (e) {}

    return res.json({
      success: true,
      message: "Student account updated successfully",
      student: idx !== -1 ? usersDb[idx] : { id, name, email, phone },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to update student" });
  }
});

// DELETE /api/students/:id - Delete student account
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const idx = usersDb.findIndex((u) => u.id === id);
    if (idx !== -1) {
      usersDb.splice(idx, 1);
    }

    try {
      await prisma.user.delete({ where: { id } });
    } catch (e) {}

    return res.json({
      success: true,
      message: "Student account deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to delete student" });
  }
});

export default router;
