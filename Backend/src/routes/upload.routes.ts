import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Create uploads directory if it doesn't exist
export const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper: delete a locally-uploaded file given its stored URL or filename
// Handles both relative paths like "/uploads/abc.png" and full URLs like "http://localhost:5000/uploads/abc.png"
export function deleteUploadedFile(imageUrl: string | null | undefined): void {
  if (!imageUrl) return;
  try {
    const parts = imageUrl.split("/uploads/");
    if (parts.length < 2) return;
    const fileRelativePath = parts[1];
    if (!fileRelativePath) return;
    
    // Prevent directory traversal
    const safePath = path.normalize(fileRelativePath).replace(/^(\.\.[\/\\])+/, "");
    const filePath = path.join(uploadDir, safePath);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[Upload] Deleted old file: ${safePath}`);
    }
  } catch (err) {
    console.warn(`[Upload] Could not delete old file:`, err);
  }
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const category = (req.query.category as string) || "misc";
    const safeCategory = category.replace(/[^a-zA-Z0-9_-]/g, "");
    const destDir = path.join(uploadDir, safeCategory);
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    cb(null, destDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/") ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype.includes("document") ||
      file.originalname.match(/\.(pdf|doc|docx|png|jpg|jpeg|webp)$/i)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image, video, or document (PDF, Word) files are allowed"));
    }
  },
});

// POST /api/upload  — Upload a new file or image, optionally replacing an old one
// Body: multipart/form-data with field "file", "image", or "mou"
// Optional query params: ?oldUrl=<previously-stored-url> & category=<folder-name>
router.post(
  "/",
  (req, res, next) => {
    upload.any()(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message || "Upload failed" });
      }
      next();
    });
  },
  (req, res) => {
    try {
      const file = req.file || (req.files && Array.isArray(req.files) ? req.files[0] : undefined);
      if (!file) {
        return res.status(400).json({ success: false, error: "No file provided" });
      }

      // Delete the old file if the caller told us what it was
      const oldUrl = req.query.oldUrl as string | undefined;
      if (oldUrl) {
        deleteUploadedFile(oldUrl);
      }

      const category = (req.query.category as string) || "misc";
      const safeCategory = category.replace(/[^a-zA-Z0-9_-]/g, "");
      
      // Store as a relative path — the frontend constructs the full URL using the API base
      const fileUrl = `/uploads/${safeCategory}/${file.filename}`;
      return res.json({ success: true, url: fileUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// DELETE /api/upload  — Explicitly delete a stored file/image
// Body: { url: "/uploads/filename.png" }
router.delete("/", (req, res) => {
  const { url } = req.body as { url?: string };
  if (!url) {
    return res.status(400).json({ success: false, error: "No url provided" });
  }
  deleteUploadedFile(url);
  return res.json({ success: true, message: "File deleted" });
});

export default router;
