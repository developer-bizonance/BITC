"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Import Routes
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const courses_routes_js_1 = __importDefault(require("./routes/courses.routes.js"));
const contact_routes_js_1 = __importDefault(require("./routes/contact.routes.js"));
const inquiries_routes_js_1 = __importDefault(require("./routes/inquiries.routes.js"));
const admin_routes_js_1 = __importDefault(require("./routes/admin.routes.js"));
const partners_routes_js_1 = __importDefault(require("./routes/partners.routes.js"));
const certifications_routes_js_1 = __importDefault(require("./routes/certifications.routes.js"));
const mentors_routes_js_1 = __importDefault(require("./routes/mentors.routes.js"));
const careers_routes_js_1 = __importDefault(require("./routes/careers.routes.js"));
const alumni_routes_js_1 = __importDefault(require("./routes/alumni.routes.js"));
const testimonials_routes_js_1 = __importDefault(require("./routes/testimonials.routes.js"));
const industry_partners_routes_js_1 = __importDefault(require("./routes/industry-partners.routes.js"));
const employee_testimonials_routes_js_1 = __importDefault(require("./routes/employee-testimonials.routes.js"));
const alumni_companies_routes_js_1 = __importDefault(require("./routes/alumni-companies.routes.js"));
const video_testimonials_routes_js_1 = __importDefault(require("./routes/video-testimonials.routes.js"));
const events_routes_js_1 = __importDefault(require("./routes/events.routes.js"));
const blogs_routes_js_1 = __importDefault(require("./routes/blogs.routes.js"));
const gallery_routes_js_1 = __importDefault(require("./routes/gallery.routes.js"));
const downloads_routes_js_1 = __importDefault(require("./routes/downloads.routes.js"));
const faq_routes_js_1 = __importDefault(require("./routes/faq.routes.js"));
const join_team_routes_js_1 = __importDefault(require("./routes/join-team.routes.js"));
const students_routes_js_1 = __importDefault(require("./routes/students.routes.js"));
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
            return callback(null, true);
        }
        return callback(null, true); // Permissive in development
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
}));
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check
app.get("/api/health", (_req, res) => {
    return res.json({
        status: "ok",
        service: "BITC Backend API Server",
        timestamp: new Date().toISOString(),
    });
});
// Register API Routes
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api/courses", courses_routes_js_1.default);
app.use("/api/contact", contact_routes_js_1.default);
app.use("/api/inquiries", inquiries_routes_js_1.default);
app.use("/api/admin", admin_routes_js_1.default);
app.use("/api/partners", partners_routes_js_1.default);
app.use("/api/certifications", certifications_routes_js_1.default);
app.use("/api/mentors", mentors_routes_js_1.default);
app.use("/api/careers", careers_routes_js_1.default);
app.use("/api/alumni", alumni_routes_js_1.default);
app.use("/api/testimonials", testimonials_routes_js_1.default);
app.use("/api/industry-partners", industry_partners_routes_js_1.default);
app.use("/api/employee-testimonials", employee_testimonials_routes_js_1.default);
app.use("/api/alumni-companies", alumni_companies_routes_js_1.default);
app.use("/api/video-testimonials", video_testimonials_routes_js_1.default);
app.use("/api/events", events_routes_js_1.default);
app.use("/api/blogs", blogs_routes_js_1.default);
app.use("/api/gallery", gallery_routes_js_1.default);
app.use("/api/downloads", downloads_routes_js_1.default);
app.use("/api/faq", faq_routes_js_1.default);
app.use("/api/join-team", join_team_routes_js_1.default);
app.use("/api/students", students_routes_js_1.default);
// Global Error Handler
app.use((err, _req, res, _next) => {
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
