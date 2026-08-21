import { Router, Request, Response } from "express";
import { readJsonDb, writeJsonDb } from "../dataStore.js";

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  exp: string;
  area: string;
  skills: string[];
  img: string;
  bio?: string;
  linkedin?: string;
  thought?: string;
  createdAt: string;
}

// Initial In-Memory Store

const router = Router();

// GET /api/mentors
router.get("/", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    mentors: readJsonDb("mentors.json"),
  });
});

// POST /api/mentors (Add new mentor)
router.post("/", (req: Request, res: Response) => {
  try {
    const { name, role, company, exp, area, skills, img, bio, linkedin, thought } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Mentor name is required." });
    }

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Industry Professional"];

    const newMentor: Mentor = {
      id: `mentor-${Date.now()}`,
      name: name.trim(),
      role: role?.trim() || "Industry Expert & Trainer",
      company: company?.trim() || "BiZONANCE Partner",
      exp: exp?.trim() || "5+ Years",
      area: area?.trim() || "Technology",
      skills: parsedSkills.length > 0 ? parsedSkills : ["Software Architecture"],
      img: img?.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
      bio: bio?.trim() || "",
      linkedin: linkedin?.trim() || "",
      thought: thought?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    const db = readJsonDb("mentors.json"); db.unshift(newMentor); writeJsonDb("mentors.json", db);

    return res.status(201).json({
      success: true,
      message: "Mentor added successfully",
      mentor: newMentor,
      mentors: readJsonDb("mentors.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add mentor" });
  }
});

// PUT /api/mentors/reorder (Reorder mentors)
router.put("/reorder", (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const reorderedDb: Mentor[] = [];
    for (const id of orderedIds) {
      const item = readJsonDb("mentors.json").find((m) => m.id === id);
      if (item) reorderedDb.push(item);
    }
    for (const item of readJsonDb("mentors.json")) {
      if (!orderedIds.includes(item.id)) reorderedDb.push(item);
    }

    writeJsonDb("mentors.json", reorderedDb);

    return res.json({
      success: true,
      message: "Mentors reordered successfully",
      mentors: readJsonDb("mentors.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder mentors" });
  }
});

// PUT /api/mentors/:id (Update mentor)
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, company, exp, area, skills, img, bio, linkedin, thought } = req.body;

    const index = readJsonDb("mentors.json").findIndex((m) => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const current = readJsonDb("mentors.json")[index];
    const parsedSkills = skills !== undefined
      ? Array.isArray(skills)
        ? skills
        : typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : current.skills
      : current.skills;

    const updated: Mentor = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      role: role !== undefined ? role.trim() : current.role,
      company: company !== undefined ? company.trim() : current.company,
      exp: exp !== undefined ? exp.trim() : current.exp,
      area: area !== undefined ? area.trim() : current.area,
      skills: parsedSkills,
      img: img !== undefined ? img.trim() : current.img,
      bio: bio !== undefined ? bio.trim() : current.bio,
      linkedin: linkedin !== undefined ? linkedin.trim() : current.linkedin,
      thought: thought !== undefined ? thought.trim() : current.thought,
    };

    const db = readJsonDb("mentors.json"); db[index] = updated; writeJsonDb("mentors.json", db);

    return res.json({
      success: true,
      message: "Mentor updated successfully",
      mentor: updated,
      mentors: readJsonDb("mentors.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update mentor" });
  }
});

// DELETE /api/mentors/:id (Remove mentor)
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const initialLen = readJsonDb("mentors.json").length;
    const db = readJsonDb("mentors.json").filter((m) => m.id !== id); writeJsonDb("mentors.json", db);

    if (readJsonDb("mentors.json").length === initialLen) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    return res.json({
      success: true,
      message: "Mentor removed successfully",
      mentors: readJsonDb("mentors.json"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete mentor" });
  }
});

export default router;
