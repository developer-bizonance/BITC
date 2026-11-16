import { Router, Request, Response } from "express";
import { readJsonDbAsync, writeJsonDbAsync } from "../dataStore.js";
import { deleteUploadedFile } from "./upload.routes.js";

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  companyLogo?: string;
  exp: string;
  area: string;
  category?: string;
  skills: string[];
  img: string;
  bio?: string;
  linkedin?: string;
  thought?: string;
  createdAt: string;
}

const router = Router();

// GET /api/mentors
router.get("/", async (_req: Request, res: Response) => {
  const mentors = await readJsonDbAsync<Mentor>("mentors.json");
  const normalized = mentors.map((m: any) => ({
    ...m,
    companyLogo: m.companyLogo || "",
    category: m.category || m.area || "Industry Expert",
    area: m.category || m.area || "Industry Expert",
  }));
  return res.json({
    success: true,
    mentors: normalized,
  });
});

// POST /api/mentors (Add new mentor)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, role, company, companyLogo, exp, area, category, skills, img, bio, linkedin, thought } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Mentor name is required." });
    }

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Industry Professional"];

    const chosenCategory = category?.trim() || area?.trim() || "Industry Expert";

    const newMentor: Mentor = {
      id: `mentor-${Date.now()}`,
      name: name.trim(),
      role: role?.trim() || "Industry Expert & Trainer",
      company: company?.trim() || "BIZONANCE Partner",
      companyLogo: companyLogo?.trim() || "",
      exp: exp?.trim() || "5+ Years",
      area: chosenCategory,
      category: chosenCategory,
      skills: parsedSkills.length > 0 ? parsedSkills : ["Software Architecture"],
      img: img?.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
      bio: bio?.trim() || "",
      linkedin: linkedin?.trim() || "",
      thought: thought?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    const db = await readJsonDbAsync<Mentor>("mentors.json");
    db.unshift(newMentor);
    await writeJsonDbAsync("mentors.json", db);

    return res.status(201).json({
      success: true,
      message: "Mentor added successfully",
      mentor: newMentor,
      mentors: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to add mentor" });
  }
});

// PUT /api/mentors/reorder (Reorder mentors)
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "orderedIds must be an array" });
    }

    const currentDb = await readJsonDbAsync<Mentor>("mentors.json");
    const reorderedDb: Mentor[] = [];
    for (const id of orderedIds) {
      const item = currentDb.find((m) => m.id === id);
      if (item) reorderedDb.push(item);
    }
    for (const item of currentDb) {
      if (!orderedIds.includes(item.id)) reorderedDb.push(item);
    }

    await writeJsonDbAsync("mentors.json", reorderedDb);

    return res.json({
      success: true,
      message: "Mentors reordered successfully",
      mentors: reorderedDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to reorder mentors" });
  }
});

// PUT /api/mentors/:id (Update mentor)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, company, companyLogo, exp, area, category, skills, img, bio, linkedin, thought } = req.body;

    const db = await readJsonDbAsync<Mentor>("mentors.json");
    const index = db.findIndex((m) => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const current = db[index];
    const parsedSkills = skills !== undefined
      ? Array.isArray(skills)
        ? skills
        : typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : current.skills
      : current.skills;

    const chosenCategory = category !== undefined ? category.trim() : (area !== undefined ? area.trim() : current.category || current.area || "Industry Expert");

    const updated: Mentor = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      role: role !== undefined ? role.trim() : current.role,
      company: company !== undefined ? company.trim() : current.company,
      companyLogo: companyLogo !== undefined ? companyLogo.trim() : (current as any).companyLogo || "",
      exp: exp !== undefined ? exp.trim() : current.exp,
      area: chosenCategory,
      category: chosenCategory,
      skills: parsedSkills,
      img: img !== undefined ? img.trim() : current.img,
      bio: bio !== undefined ? bio.trim() : current.bio,
      linkedin: linkedin !== undefined ? linkedin.trim() : current.linkedin,
      thought: thought !== undefined ? thought.trim() : current.thought,
    };

    if (img !== undefined && current.img && current.img !== updated.img) {
      deleteUploadedFile(current.img);
    }

    db[index] = updated;
    await writeJsonDbAsync("mentors.json", db);

    return res.json({
      success: true,
      message: "Mentor updated successfully",
      mentor: updated,
      mentors: db,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to update mentor" });
  }
});

// DELETE /api/mentors/:id (Remove mentor)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const initialDb = await readJsonDbAsync<Mentor>("mentors.json");
    const mentorToDelete = initialDb.find((m: Mentor) => m.id === id);
    if (!mentorToDelete) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    if (mentorToDelete.img) {
      deleteUploadedFile(mentorToDelete.img);
    }

    const filteredDb = initialDb.filter((m: Mentor) => m.id !== id);
    await writeJsonDbAsync("mentors.json", filteredDb);

    return res.json({
      success: true,
      message: "Mentor removed successfully",
      mentors: filteredDb,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to delete mentor" });
  }
});

export default router;
