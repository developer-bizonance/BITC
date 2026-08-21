"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Heart,
  TrendingUp,
  BookOpen,
  Coffee,
  Users,
  ArrowRight,
  CheckCircle2,
  Upload,
  MapPin,
  Clock,
  Star,
  X,
  Send,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  Award,
  Building,
  Check,
  AlertCircle,
  FileText,
  Calendar,
  Paperclip,
  Trash2,
} from "lucide-react";

interface JobOpeningItem {
  id?: string;
  title: string;
  type: string;
  location: string;
  experience: string;
  department?: string;
  description?: string;
  specialities?: string;
}

interface EmployeeTestimonialItem {
  id?: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  rating?: number;
}

const defaultOpenings: JobOpeningItem[] = [
  { title: "Faculty – Full Stack Development", type: "Full-Time", location: "On-Site", experience: "3+ Years", department: "Academic & Training", specialities: "MERN, Java, Python" },
  { title: "Technical Trainer – Data Science", type: "Full-Time", location: "On-Site", experience: "2+ Years", department: "Academic & Training", specialities: "Python, Machine Learning, SQL" },
  { title: "Industry Expert", type: "Part-Time", location: "Hybrid", experience: "5+ Years", department: "Academic & Training", specialities: "Industry Insights, Mentorship, Tech Leadership" },
  { title: "T and P Office", type: "Full-Time", location: "On-Site", experience: "3+ Years", department: "Placement Cell", specialities: "Corporate Relations, Placement Coordination, HR Networking" },
];

const defaultTestimonials: EmployeeTestimonialItem[] = [
  { name: "Ananya Mehta", role: "Faculty – Data Science", quote: "Working at BITC has been the most rewarding experience. I get to shape careers and learn alongside brilliant students every day.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&h=150&q=80", rating: 5 },
  { name: "Rohan Singh", role: "Software Developer", quote: "The culture here is incredible. Innovation is encouraged, and every team member's contribution is valued.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80", rating: 5 },
  { name: "Kavitha Rao", role: "Placement Officer", quote: "Seeing our students land their dream jobs is the best part of my role. BITC truly cares about outcomes.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80", rating: 5 },
];

// All courses & certifications available across BITC website categorized
const courseCertificationOptions = [
  {
    category: "💻 IT & Full Stack Software Development",
    courses: [
      "MERN Stack Development (MongoDB, Express, React, Node)",
      "MEAN Stack Development (MongoDB, Express, Angular, Node)",
      "Full Stack Java Development (Spring Boot, Microservices, React)",
      "Full Stack Python Development (Django, FastAPI, PostgreSQL)",
      "React.js & Next.js Frontend Architecture",
      "Node.js Backend & API Development",
      "Mobile App Development (Flutter & React Native)",
      "Software Testing & QA Automation (Selenium, Cypress)",
    ],
  },
  {
    category: "🤖 AI, Data Science & Analytics",
    courses: [
      "Data Science & Machine Learning (Python, Pandas, Scikit-Learn)",
      "Artificial Intelligence & Deep Learning (TensorFlow, PyTorch)",
      "Business Intelligence & Data Analytics (PowerBI, Tableau, SQL)",
      "Big Data Engineering (Spark, Hadoop, Kafka)",
      "Generative AI & LLM Applications",
    ],
  },
  {
    category: "☁️ Cloud Computing & Cyber Security",
    courses: [
      "Cloud Computing & Architecture (AWS / Microsoft Azure / GCP)",
      "DevOps & SRE (Docker, Kubernetes, Jenkins, CI/CD, Terraform)",
      "Cyber Security & Ethical Hacking",
      "Network Engineering & Systems Security",
    ],
  },
  {
    category: "📊 Management, Business & Marketing",
    courses: [
      "Digital Marketing & Growth Hacking (SEO, SEM, Meta Ads, SMM)",
      "Product Management & Agile Scrum Methodology",
      "Business Analytics & Financial Analysis",
      "Human Resource Management & Talent Acquisition",
    ],
  },
  {
    category: "🎨 UI/UX Design & Multimedia",
    courses: [
      "UI/UX Design & Design Systems (Figma, Adobe XD)",
      "Graphic Design & Visual Communication (Photoshop, Illustrator)",
      "3D Modeling, Motion Graphics & Animation",
      "Video Editing & Production (Premiere Pro, After Effects)",
    ],
  },
  {
    category: "🏛️ Placement Cell & Institutional Roles",
    courses: [
      "Training & Placement Officer (TPO) / Corporate Relations",
      "Soft Skills, Communication & Personality Development Trainer",
      "Quantitative Aptitude & Logical Reasoning Trainer",
      "Technical Mock Interview & Resume Building Mentor",
    ],
  },
];

export default function CareersPage() {
  const [openingsList, setOpeningsList] = useState<JobOpeningItem[]>(defaultOpenings);
  const [testimonialsList, setTestimonialsList] = useState<EmployeeTestimonialItem[]>(defaultTestimonials);
  const [imgError, setImgError] = useState<Record<string | number, boolean>>({});
  const [, setLoading] = useState(false);

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Faculty – Full Stack Development");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "Faculty – Full Stack Development",
    subjectCourse: "MERN Stack Development (MongoDB, Express, React, Node)",
    experience: "3-5 Years",
    qualification: "B.Tech / BE",
    otherQualification: "",
    dateToJoin: "",
    joinQuickOption: "Immediate",
    currentOrg: "",
    resumeUrl: "",
    linkedinUrl: "",
    coverNote: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resumeFile, setResumeFile] = useState<{ name: string; size: string; data: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadCareers() {
      setLoading(true);
      try {
        const res = await fetch("/api/careers");
        if (res.ok) {
          const data = await res.json();
          if (data.openings && data.openings.length > 0) {
            setOpeningsList(data.openings);
          }
        }
      } catch (err) {
        console.warn("Failed to load dynamic careers, using fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/employee-testimonials");
        if (res.ok) {
          const data = await res.json();
          if (data.testimonials && data.testimonials.length > 0) {
            setTestimonialsList(data.testimonials);
          }
        }
      } catch (err) {
        console.warn("Failed to load employee testimonials, using fallback:", err);
      }
    }

    loadCareers();
    loadTestimonials();
  }, []);

  const openApplyModal = (roleTitle?: string) => {
    const role = roleTitle || "Faculty / Technical Trainer";
    setSelectedRole(role);
    setForm((prev) => ({
      ...prev,
      position: role,
    }));
    setErrors({});
    setTouched({});
    setSubmitSuccess(false);
    setSubmitError(null);
    setIsApplyModalOpen(true);
  };

  // Validation function per field
  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "fullName") {
      if (!value.trim()) {
        error = "Full Name is required.";
      } else if (value.trim().length < 3) {
        error = "Name must be at least 3 characters.";
      }
    } else if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!value.trim()) {
        error = "Email address is required.";
      } else if (!emailRegex.test(value.trim())) {
        error = "Please enter a valid email address (e.g. name@example.com).";
      }
    } else if (name === "phone") {
      const cleanPhone = value.replace(/\D/g, "");
      if (!cleanPhone) {
        error = "Phone number is required.";
      } else if (cleanPhone.length < 10) {
        error = `Please enter full 10-digit number (${cleanPhone.length}/10).`;
      } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        error = "Mobile number must start with 6, 7, 8, or 9.";
      }
    } else if (name === "otherQualification") {
      if (form.qualification === "Other" && !value.trim()) {
        error = "Please specify your degree / qualification.";
      }
    } else if (name === "dateToJoin") {
      if (form.joinQuickOption === "Custom Date" && !value) {
        error = "Please select your expected joining date.";
      }
    } else if (name === "subjectCourse") {
      if (!value) {
        error = "Please select a course / certification specialization.";
      }
    }
    return error;
  };

  // Run validation across all fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const fnErr = validateField("fullName", form.fullName);
    if (fnErr) newErrors.fullName = fnErr;

    const emErr = validateField("email", form.email);
    if (emErr) newErrors.email = emErr;

    const phErr = validateField("phone", form.phone);
    if (phErr) newErrors.phone = phErr;

    const scErr = validateField("subjectCourse", form.subjectCourse);
    if (scErr) newErrors.subjectCourse = scErr;

    if (form.qualification === "Other") {
      const oqErr = validateField("otherQualification", form.otherQualification);
      if (oqErr) newErrors.otherQualification = oqErr;
    }

    if (form.joinQuickOption === "Custom Date") {
      const dtErr = validateField("dateToJoin", form.dateToJoin);
      if (dtErr) newErrors.dateToJoin = dtErr;
    }

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      subjectCourse: true,
      qualification: true,
      otherQualification: true,
      dateToJoin: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, (form as any)[field] || "");
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleChange = (field: string, value: string) => {
    let sanitized = value;
    if (field === "phone") {
      // Strictly allow only numbers and maximum 10 digits
      sanitized = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => ({ ...prev, [field]: sanitized }));
    if (touched[field]) {
      const error = validateField(field, sanitized);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) {
          next[field] = error;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: "File size exceeds 5MB limit. Please upload a smaller file." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      
      setResumeFile({
        name: file.name,
        size: sizeStr,
        data: reader.result as string,
      });

      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr.resume;
        return newErr;
      });
    };
    reader.readAsDataURL(file);
  };

  const removeResumeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitError("Please fill out all required fields with valid information.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const finalDateToJoin = form.joinQuickOption === "Custom Date" ? form.dateToJoin : form.joinQuickOption;

    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        position: form.position,
        subjectCourse: form.subjectCourse,
        experience: form.experience,
        qualification: form.qualification,
        otherQualification: form.otherQualification,
        dateToJoin: finalDateToJoin || "Immediate",
        currentOrg: form.currentOrg.trim(),
        resumeUrl: resumeFile ? resumeFile.data : form.resumeUrl.trim(),
        resumeFileName: resumeFile ? resumeFile.name : "",
        linkedinUrl: form.linkedinUrl.trim(),
        coverNote: form.coverNote.trim(),
      };

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(true);
        setForm({
          fullName: "",
          email: "",
          phone: "",
          position: "Faculty – Full Stack Development",
          subjectCourse: "MERN Stack Development (MongoDB, Express, React, Node)",
          experience: "3-5 Years",
          qualification: "B.Tech / BE",
          otherQualification: "",
          dateToJoin: "",
          joinQuickOption: "Immediate",
          currentOrg: "",
          resumeUrl: "",
          linkedinUrl: "",
          coverNote: "",
        });
        setResumeFile(null);
        setErrors({});
        setTouched({});
      } else {
        setSubmitError(data.error || "Failed to submit application. Please try again.");
      }
    } catch (err) {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[calc(100vh-80px)] bg-white text-slate-900 py-20 lg:py-28 overflow-hidden flex flex-col items-center justify-center border-b border-gray-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1000px] mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold rounded-full px-5 py-2 text-sm uppercase tracking-widest mb-8 border border-primary/20">
            <Briefcase className="w-4 h-4" />
            Careers & Faculty Hiring
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Teach & Inspire at <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">BITC</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-[1.4rem] text-gray-600 max-w-[900px] mx-auto leading-relaxed mb-8">
            Join a premier industrial training centre. Share your industry expertise, mentor passionate students, and shape the next generation of tech leaders.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openApplyModal()}
              className="h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-semibold flex items-center gap-2 justify-center hover:shadow-xl shadow-orange-500/20 hover:-translate-y-0.5 transition-all text-base cursor-pointer"
            >
              <Sparkles className="w-5 h-5" /> Apply as Faculty / Trainer
            </button>
            <Link
              href="#current-openings"
              className="h-14 px-8 rounded-full bg-slate-100 text-slate-900 font-semibold flex items-center justify-center border border-slate-200 hover:bg-slate-200 transition-all text-base"
            >
              View Openings
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY WORK WITH US ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Why Teach & Mentor at BITC</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                At BITC, our mentors and faculty are the cornerstone of student success. We provide an inspiring academic ecosystem with state-of-the-art labs, high student engagement, and competitive compensation.
              </p>
              <div className="space-y-4">
                {[
                  "Deliver practical, project-based training on modern corporate stacks",
                  "Collaborate with 150+ hiring partners and industry veterans",
                  "Flexible engagement: Full-Time, Part-Time, Weekend & Visiting Faculty",
                  "Attractive remuneration packages and performance bonuses",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3]">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1171&auto=format&fit=crop" alt="Our Culture" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── EMPLOYEE BENEFITS ── */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Faculty & Trainer Benefits</h2>
            <p className="text-gray-600 max-w-[600px] mx-auto text-lg">We invest in our faculty and provide full institutional support.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Competitive Pay", icon: TrendingUp, desc: "Above-market honorarium, salary packages, and batch incentives.", color: "bg-green-500/10 text-green-600" },
              { title: "Latest Tech Infrastructure", icon: BookOpen, desc: "High-spec GPU labs, cloud credits, smart classrooms, and teaching aids.", color: "bg-blue-500/10 text-blue-600" },
              { title: "Academic Freedom", icon: TrendingUp, desc: "Freedom to innovate syllabus, conduct workshops, and lead hackathons.", color: "bg-purple-500/10 text-purple-600" },
              { title: "Recognition & Growth", icon: Heart, desc: "Faculty awards, institutional recognition, and leadership opportunities.", color: "bg-red-500/10 text-red-600" },
              { title: "Flexible Working Modes", icon: Coffee, desc: "Offline classroom, hybrid models, or corporate weekend schedules.", color: "bg-amber-500/10 text-amber-600" },
              { title: "Vibrant Community", icon: Users, desc: "Join an elite circle of educators, industry advisors, and researchers.", color: "bg-primary/10 text-primary" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-lg transition-shadow group">
                <div className={`w-14 h-14 rounded-2xl ${item.color.split(" ")[0]} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-7 h-7 ${item.color.split(" ")[1]}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRENT OPENINGS ── */}
      <section id="current-openings" className="py-16 md:py-24 bg-white scroll-mt-20">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Current Openings</h2>
            <p className="text-gray-600 max-w-[600px] mx-auto text-lg">Select a role and apply directly with your course specialization.</p>
          </div>

          <div className="space-y-4 max-w-[950px] mx-auto">
            {openingsList.map((job, i) => (
              <div key={job.id || i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md hover:border-primary/30 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    {job.department && (
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full">
                        {job.department}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <Briefcase className="w-3.5 h-3.5 text-primary" /> {job.type}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {job.experience}
                    </span>
                  </div>
                  {job.specialities && (
                    <div className="mt-3 text-sm text-slate-600">
                      <span className="font-bold text-slate-800">Specialities:</span> {job.specialities}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => openApplyModal(job.title)}
                  className="px-6 py-2.5 rounded-full text-white font-semibold text-sm hover:shadow-lg shadow-orange-500/20 transition-all whitespace-nowrap bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:opacity-90 cursor-pointer"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECRUITMENT PROCESS ── */}
      <section className="py-16 md:py-24 bg-slate-100 text-slate-900 border-y border-slate-200/80">
        <div className="container max-w-[1000px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Recruitment Process</h2>
            <p className="text-slate-600 text-lg font-medium">A structured, professional hiring journey for faculty and educators.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            {[
              { step: "Apply Online", desc: "Submit course specialization" },
              { step: "Demo Lecture", desc: "Technical demo / interview" },
              { step: "Discussion", desc: "Curriculum & syllabus alignment" },
              { step: "Onboarding", desc: "Welcome to BITC family" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-3">
                    <span className="text-primary font-extrabold text-lg">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">{item.step}</h4>
                  <p className="text-slate-500 text-xs font-medium">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block w-16 h-0.5 bg-slate-300 mx-2" />
                )}
                {i < 3 && (
                  <div className="md:hidden h-8 w-0.5 bg-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
        <div className="container max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="mb-16 text-center">
            <p className="text-primary font-bold uppercase tracking-widest text-[14px] mb-3">Faculty Voices</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Hear from Our <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Educators & Mentors</span>
            </h2>
            <p className="text-gray-500 text-[16px] max-w-2xl mx-auto">Discover what makes teaching at BITC an impactful experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsList.map((t, i) => (
              <Card key={t.id || i} className="!p-0 !gap-0 border-0 shadow-xl shadow-gray-200/40 bg-white rounded-2xl relative overflow-hidden h-full flex flex-col">
                <div className="absolute -top-4 right-4 text-[120px] font-serif leading-none text-gray-100 pointer-events-none select-none">
                  &quot;
                </div>

                <CardContent className="p-6 flex flex-col flex-1 relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative">
                      <img
                        src={imgError[t.id || i] ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" : t.image}
                        alt={t.name}
                        onError={() => setImgError((prev) => ({ ...prev, [t.id || i]: true }))}
                        className="w-12 h-12 rounded-full object-cover relative z-10 border-2 border-white shadow-md"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[15px]">{t.name}</h4>
                      <p className="text-[12px] text-gray-500 font-semibold">{t.role}</p>
                    </div>
                  </div>

                  <p className="text-slate-700 text-[14px] italic mb-6 leading-relaxed flex-1 relative z-10 font-medium">
                    &quot;{t.quote}&quot;
                  </p>

                  <div className="flex items-center text-amber-400 mt-auto pt-4 border-t border-gray-100">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    {Array.from({ length: t.rating || 5 }).map((_, starIndex) => (
                      <Star key={starIndex} className="h-4 w-4 fill-current mr-1" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLY CTA ── */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <Upload className="w-14 h-14 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Ready to Teach at BITC?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Submit your teaching application along with your course specialization and let&apos;s build future tech talent together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openApplyModal()}
              className="h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-semibold flex items-center gap-2 justify-center hover:shadow-xl shadow-orange-500/20 hover:-translate-y-0.5 transition-all text-lg cursor-pointer"
            >
              Apply Online Now <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              href="/contact"
              className="h-14 px-8 rounded-full bg-white/80 text-slate-900 font-semibold flex items-center justify-center border border-blue-200/80 hover:bg-white transition-all text-lg shadow-sm backdrop-blur-sm"
            >
              Contact HR
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SPECIAL FACULTY & TRAINER APPLICATION MODAL ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative flex justify-between items-start shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-2 border border-primary/30">
                  <Sparkles className="w-3.5 h-3.5" /> BITC Faculty Application
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  Apply for <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">{selectedRole}</span>
                </h3>
                <p className="text-slate-300 text-xs md:text-sm mt-1">
                  Fill in your details, specialization, resume, and availability date.
                </p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-50/50">
              {submitSuccess ? (
                <div className="text-center py-10 px-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Check className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2">Application Received!</h4>
                  <p className="text-slate-600 max-w-md mx-auto mb-6 text-sm">
                    Thank you for applying to teach at BITC. Our Academic and HR Board will review your application and contact you for a demo lecture & interview.
                  </p>
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-8 py-3 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer shadow-lg"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} noValidate className="space-y-5">
                  {submitError && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Candidate Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        onBlur={() => handleBlur("fullName")}
                        placeholder="e.g. Dr. Rajesh Sharma"
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none transition-all font-medium ${
                          touched.fullName && errors.fullName
                            ? "border-red-500 ring-2 ring-red-100 bg-red-50/20"
                            : "border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                        }`}
                      />
                      {touched.fullName && errors.fullName && (
                        <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        placeholder="e.g. rajesh@example.com"
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none transition-all font-medium ${
                          touched.email && errors.email
                            ? "border-red-500 ring-2 ring-red-100 bg-red-50/20"
                            : "border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                        }`}
                      />
                      {touched.email && errors.email && (
                        <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Position */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Phone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        placeholder="e.g. 9876543210 (10 Digits)"
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none transition-all font-medium ${
                          touched.phone && errors.phone
                            ? "border-red-500 ring-2 ring-red-100 bg-red-50/20"
                            : "border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                        }`}
                      />
                      {touched.phone && errors.phone && (
                        <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Teaching / Industry Experience <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.experience}
                        onChange={(e) => handleChange("experience", e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium cursor-pointer"
                      >
                        <option value="Fresher / <1 Year">Fresher / &lt; 1 Year</option>
                        <option value="1-3 Years">1 - 3 Years</option>
                        <option value="3-5 Years">3 - 5 Years</option>
                        <option value="5-8 Years">5 - 8 Years</option>
                        <option value="8+ Years">8+ Years (Senior Lead / Architect)</option>
                      </select>
                    </div>
                  </div>

                  {/* Course / Certification Dropdown Special Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-primary font-extrabold">
                        <GraduationCap className="w-4 h-4" /> Which Course / Certification will you teach? <span className="text-red-500">*</span>
                      </span>
                      <span className="text-[11px] font-normal text-slate-500">All Website Courses</span>
                    </label>
                    <select
                      value={form.subjectCourse}
                      onChange={(e) => handleChange("subjectCourse", e.target.value)}
                      onBlur={() => handleBlur("subjectCourse")}
                      className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none transition-all cursor-pointer shadow-sm ${
                        touched.subjectCourse && errors.subjectCourse
                          ? "border-red-500 ring-2 ring-red-100"
                          : "border-primary/40 focus:ring-2 focus:ring-primary focus:border-primary"
                      }`}
                    >
                      {courseCertificationOptions.map((group) => (
                        <optgroup key={group.category} label={group.category} className="font-bold text-slate-800">
                          {group.courses.map((course) => (
                            <option key={course} value={course} className="font-medium text-slate-700 py-1">
                              {course}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {touched.subjectCourse && errors.subjectCourse && (
                      <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.subjectCourse}
                      </p>
                    )}
                  </div>

                  {/* Highest Qualification & Current Company (Always 2 Columns) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Highest Qualification <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.qualification}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            qualification: val,
                            ...(val !== "Other" ? { otherQualification: "" } : {}),
                          }));
                          if (val !== "Other") {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.otherQualification;
                              return next;
                            });
                          }
                        }}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium cursor-pointer"
                      >
                        <option value="B.Tech / BE">B.Tech / B.E.</option>
                        <option value="M.Tech / ME">M.Tech / M.E.</option>
                        <option value="MCA / M.Sc IT">MCA / M.Sc. IT / CS</option>
                        <option value="BCA / B.Sc CS">BCA / B.Sc. CS</option>
                        <option value="PhD / Doctorate">PhD / Doctorate</option>
                        <option value="MBA / PGDM">MBA / PGDM</option>
                        <option value="Industry Certified Professional">Industry Certified Professional</option>
                        <option value="Other">Other (Please specify)</option>
                      </select>
                    </div>

                    {/* Current Company / College is ALWAYS visible here */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Current Company / College
                      </label>
                      <input
                        type="text"
                        value={form.currentOrg}
                        onChange={(e) => handleChange("currentOrg", e.target.value)}
                        placeholder="e.g. Infosys, TCS, or Freelance"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Dedicated Extra Row When 'Other' Education is Selected */}
                  {form.qualification === "Other" && (
                    <div className="p-4 bg-orange-50/60 rounded-2xl border-2 border-orange-200 animate-in fade-in zoom-in-95 duration-200">
                      <label className="block text-xs font-bold text-orange-800 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-orange-600" />
                        Specify Your Degree / Qualification <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.otherQualification}
                        onChange={(e) => handleChange("otherQualification", e.target.value)}
                        onBlur={() => handleBlur("otherQualification")}
                        placeholder="e.g. B.Sc Electronics, Diploma in Computer Engineering, M.Phil"
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none transition-all font-medium ${
                          touched.otherQualification && errors.otherQualification
                            ? "border-red-500 ring-2 ring-red-100 bg-red-50/30"
                            : "border-orange-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        }`}
                      />
                      {touched.otherQualification && errors.otherQualification && (
                        <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.otherQualification}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Date to Join / Availability Field */}
                  <div className="bg-slate-100/80 p-4 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" /> Expected Date to Join / Availability <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
                      {["Immediate", "Within 15 Days", "1st of Next Month", "Custom Date"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, joinQuickOption: opt });
                            if (opt !== "Custom Date") {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.dateToJoin;
                                return next;
                              });
                            }
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                            form.joinQuickOption === opt
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {form.joinQuickOption === "Custom Date" && (
                      <div className="mt-2 animate-in fade-in duration-150">
                        <input
                          type="date"
                          value={form.dateToJoin}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => handleChange("dateToJoin", e.target.value)}
                          onBlur={() => handleBlur("dateToJoin")}
                          className={`w-full px-4 py-2.5 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none font-medium ${
                            touched.dateToJoin && errors.dateToJoin
                              ? "border-red-500 ring-2 ring-red-100 bg-red-50/20"
                              : "border-slate-200 focus:ring-2 focus:ring-primary"
                          }`}
                        />
                        {touched.dateToJoin && errors.dateToJoin && (
                          <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.dateToJoin}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Resume Upload Button & Link Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-primary" /> Upload Resume / CV (.PDF, .DOCX)
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">Max size: 5MB</span>
                    </label>

                    {resumeFile ? (
                      <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 truncate max-w-[280px]">{resumeFile.name}</p>
                            <p className="text-[11px] text-emerald-700 font-semibold">{resumeFile.size} • Ready for upload</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeResumeFile}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-primary bg-white hover:bg-primary/5 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary mb-1 transition-colors" />
                        <p className="text-xs font-bold text-slate-700 group-hover:text-primary">
                          Click to upload Resume / CV file
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF, DOC, DOCX up to 5MB</p>
                      </div>
                    )}
                  </div>

                  {/* LinkedIn & Bio */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        value={form.linkedinUrl}
                        onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Teaching Philosophy / Bio
                      </label>
                      <input
                        type="text"
                        value={form.coverNote}
                        onChange={(e) => handleChange("coverNote", e.target.value)}
                        placeholder="Briefly highlight your experience..."
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-bold text-base hover:shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>Submitting Application...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit Faculty Application
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-2">
                      🔒 Your contact information is kept confidential and reviewed solely by BITC HR.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
