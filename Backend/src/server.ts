import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import Routes
import authRoutes from "./routes/auth.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import inquiriesRoutes from "./routes/inquiries.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import partnersRoutes from "./routes/partners.routes.js";
import certificationsRoutes from "./routes/certifications.routes.js";
import mentorsRoutes from "./routes/mentors.routes.js";
import careersRoutes from "./routes/careers.routes.js";
import alumniRoutes from "./routes/alumni.routes.js";
import testimonialsRoutes from "./routes/testimonials.routes.js";
import industryPartnersRoutes from "./routes/industry-partners.routes.js";
import employeeTestimonialsRoutes from "./routes/employee-testimonials.routes.js";
import alumniCompaniesRoutes from "./routes/alumni-companies.routes.js";
import videoTestimonialsRoutes from "./routes/video-testimonials.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import blogsRoutes from "./routes/blogs.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import downloadsRoutes from "./routes/downloads.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import joinTeamRoutes from "./routes/join-team.routes.js";
import studentsRoutes from "./routes/students.routes.js";


const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration to support Frontend (3000) and Dashboard (5173)
const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];

const envAllowed = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envAllowed]));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  return res.json({
    status: "ok",
    service: "BITC Backend API Server",
    timestamp: new Date().toISOString(),
  });
});

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/inquiries", inquiriesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/certifications", certificationsRoutes);
app.use("/api/mentors", mentorsRoutes);
app.use("/api/careers", careersRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/industry-partners", industryPartnersRoutes);
app.use("/api/employee-testimonials", employeeTestimonialsRoutes);
app.use("/api/alumni-companies", alumniCompaniesRoutes);
app.use("/api/video-testimonials", videoTestimonialsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/downloads", downloadsRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/join-team", joinTeamRoutes);
app.use("/api/students", studentsRoutes);


// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Server Error:", err);
  return res.status(500).json({
    error: "Internal Server Error",
    message: err?.message || "An unexpected error occurred",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 BITC Backend API running on http://localhost:${PORT}`);
  console.log(`📡 Ready to accept requests from Frontend (:3000) & Dashboard (:5173)`);
});
