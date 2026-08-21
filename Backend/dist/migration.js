"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const alumni_companies_routes_js_1 = require("./routes/alumni-companies.routes.js");
const alumni_routes_js_1 = require("./routes/alumni.routes.js");
const blogs_routes_js_1 = require("./routes/blogs.routes.js");
const certifications_routes_js_1 = require("./routes/certifications.routes.js");
const contact_routes_js_1 = require("./routes/contact.routes.js");
const downloads_routes_js_1 = require("./routes/downloads.routes.js");
const employee_testimonials_routes_js_1 = require("./routes/employee-testimonials.routes.js");
const events_routes_js_1 = require("./routes/events.routes.js");
const faq_routes_js_1 = require("./routes/faq.routes.js");
const gallery_routes_js_1 = require("./routes/gallery.routes.js");
const industry_partners_routes_js_1 = require("./routes/industry-partners.routes.js");
const mentors_routes_js_1 = require("./routes/mentors.routes.js");
const partners_routes_js_1 = require("./routes/partners.routes.js");
const testimonials_routes_js_1 = require("./routes/testimonials.routes.js");
const video_testimonials_routes_js_1 = require("./routes/video-testimonials.routes.js");
const url_1 = require("url");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
const dumps = {
    'alumni-companies': alumni_companies_routes_js_1.alumniCompaniesDb,
    'alumni': alumni_routes_js_1.alumniDb,
    'blogs': blogs_routes_js_1.blogsDb,
    'certifications': certifications_routes_js_1.certificationsDb,
    'contact': contact_routes_js_1.contactInquiriesDb,
    'downloads': downloads_routes_js_1.downloadsDb,
    'employee-testimonials': employee_testimonials_routes_js_1.employeeTestimonialsDb,
    'events': events_routes_js_1.eventsDb,
    'faq': faq_routes_js_1.faqDb,
    'gallery': gallery_routes_js_1.galleryDb,
    'industry-partners': industry_partners_routes_js_1.industryPartnersDb,
    'mentors': mentors_routes_js_1.mentorsDb,
    'partners': partners_routes_js_1.academicPartnersDb,
    'testimonials': testimonials_routes_js_1.testimonialsDb,
    'video-testimonials': video_testimonials_routes_js_1.videoTestimonialsDb
};
for (const [key, value] of Object.entries(dumps)) {
    fs_1.default.writeFileSync(path_1.default.join(__dirname, 'data', `${key}.json`), JSON.stringify(value, null, 2), 'utf-8');
    console.log(`Saved ${key}.json`);
}
