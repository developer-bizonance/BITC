"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  RefreshCw,
  Mail,
  Phone,
  User,
  Link as LinkIcon,
  ChevronDown,
  Copy,
  Calendar,
  GraduationCap,
  FileText,
  Download,
  Briefcase,
  ExternalLink,
  Building,
  Eye,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  Filter,
  Check,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CourseApplications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  // --- API CONFIGURATION ---
  const API_ENDPOINT = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/applications`;

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error("Connection failed");
      const data = await response.json();

      // Map API data to UI friendly format
      const apps = data.applications || [];
      const formatted = apps.map((app) => ({
        ...app,
        id: app.id || `APP-${Math.floor(Math.random() * 1000)}`,
        fullId: app.id,
        date: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-IN") : "Recent",
        status: app.status ? app.status.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : "Under Review",
        // Normalize nested vs flat data
        name: app.name || app.userName || app.user?.name || "Unknown",
        email: app.email || app.userEmail || app.user?.email || "",
        phone: app.phone || app.userPhone || app.user?.phone || "",
        courseTitle: app.course?.title || app.courseTitle || "",
      }));

      setApplicants(formatted);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setApplicants((prev) => prev.map((a) => (a.fullId === id ? { ...a, status: newStatus } : a)));
      if (selectedApplicant && selectedApplicant.fullId === id) {
        setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
      }

      await fetch(API_ENDPOINT, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus.toLowerCase() }),
      });
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // 🌟 Open Resume in New Tab (handles Base64 DataURLs, Blobs, or HTTP Links)
  const openResume = (resumeData, fileName = "Resume.pdf") => {
    if (!resumeData) return;

    if (resumeData.startsWith("data:")) {
      try {
        const arr = resumeData.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "application/pdf";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } catch (e) {
        window.open(resumeData, "_blank");
      }
    } else {
      window.open(resumeData.startsWith("http") ? resumeData : `https://${resumeData}`, "_blank");
    }
  };

  // 🌟 Download Resume to Local Computer
  const downloadResume = (resumeData, fileName = "Candidate_Resume.pdf") => {
    if (!resumeData) return;
    const link = document.createElement("a");
    link.href = resumeData;
    link.download = fileName || "Candidate_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (applicants.length === 0) return;

    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Role",
      "Specialization / Course",
      "Qualification",
      "Experience",
      "Available Date",
      "Company / College",
      "Status",
      "Date Applied",
    ];

    const rows = applicants.map((app) => [
      `"${(app.id || app.fullId || "").replace(/"/g, '""')}"`,
      `"${(app.name || "").replace(/"/g, '""')}"`,
      `"${(app.email || "").replace(/"/g, '""')}"`,
      `"${(app.phone || "").replace(/"/g, '""')}"`,
      `"${(app.role || "").replace(/"/g, '""')}"`,
      `"${(app.department || "").replace(/"/g, '""')}"`,
      `"${(app.qualification || "").replace(/"/g, '""')}"`,
      `"${(app.experience || "").replace(/"/g, '""')}"`,
      `"${(app.dateToJoin || "").replace(/"/g, '""')}"`,
      `"${(app.company || "").replace(/"/g, '""')}"`,
      `"${(app.status || "").replace(/"/g, '""')}"`,
      `"${(app.date || "").replace(/"/g, '""')}"`,
    ]);

    const csvString = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bitc_faculty_applications_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filtered = applicants.filter((app) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (app.name?.toLowerCase().includes(term) ||
        app.email?.toLowerCase().includes(term) ||
        app.id?.toLowerCase().includes(term) ||
        app.courseTitle?.toLowerCase().includes(term));

    const matchesStatus = statusFilter === "all" || (app.status && app.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900 antialiased">
      
      {/* ── Page Header ── */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center border border-orange-200">
              <GraduationCap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Course Applications</h1>
              <p className="text-xs font-semibold text-slate-500">
                Review submitted student applications for enrollment
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-xs shadow-sm shadow-orange-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <span>Total Received:</span>
            <span className="text-orange-600 font-black text-sm bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
              {applicants.length}
            </span>
          </div>
          <button
            onClick={fetchApplicants}
            title="Refresh Applications"
            className="p-2.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all shadow-xs hover:shadow text-slate-600 cursor-pointer"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-orange-500" : ""} />
          </button>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by student name, email, course, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all text-sm text-slate-800 placeholder:text-slate-400 shadow-xs font-medium"
          />
        </div>

        <div className="relative w-full sm:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-2xl py-2.5 pl-4 pr-10 outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 text-sm text-slate-700 cursor-pointer font-bold shadow-xs"
          >
            <option value="all">All Application Statuses</option>
            <option value="under review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
            <ChevronDown size={15} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* ── Applications Table ── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course Details</th>
                <th className="px-6 py-4 text-center">Applied Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-500 font-normal">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    Fetching applications from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-500 font-normal">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No applications matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.fullId} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Student Info */}
                    <td className="px-6 py-4 align-middle">
                      <p className="font-semibold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">
                        {app.name}
                      </p>
                      <p className="text-xs text-slate-500 font-normal flex items-center gap-1.5 mt-0.5">
                        <Mail size={12} className="text-slate-400 shrink-0" /> {app.email}
                      </p>
                      <p className="text-xs text-slate-500 font-normal flex items-center gap-1.5 mt-0.5">
                        <Phone size={12} className="text-slate-400 shrink-0" /> {app.phone}
                      </p>
                    </td>

                    {/* Course Details */}
                    <td className="px-6 py-4 align-middle min-w-[220px]">
                      <p className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider">
                        ENROLLMENT
                      </p>
                      <p className="text-xs font-medium text-slate-700 leading-snug mt-0.5">
                        {app.courseTitle}
                      </p>
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4 text-center align-middle">
                      <p className="text-xs font-medium text-slate-700">
                        {app.date}
                      </p>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4 text-center align-middle">
                      <select
                        value={app.status.toLowerCase()}
                        onChange={(e) => handleStatusChange(app.fullId, e.target.value)}
                        className="bg-transparent text-xs font-medium text-slate-700 hover:text-slate-900 border-b border-slate-300 hover:border-orange-500 py-0.5 px-1 outline-none cursor-pointer transition-colors"
                      >
                        <option value="under review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right align-middle">
                      <button
                        onClick={() => {
                          setSelectedApplicant(app);
                          setIsModalOpen(true);
                        }}
                        className="text-orange-600 hover:text-orange-700 font-semibold text-xs hover:underline cursor-pointer"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── APPLICANT FULL PROFILE MODAL ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && selectedApplicant && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-100"
            >
              {/* Modal Header */}
              <div className="p-6 flex justify-between items-start bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center font-black text-xl border border-orange-500/30 shadow-inner">
                    {selectedApplicant.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">{selectedApplicant.name}</h2>
                    <p className="text-xs text-orange-400 font-bold tracking-wider uppercase mt-0.5">
                      STUDENT
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-slate-50/40 text-sm flex-1">
                
                {/* Course Box */}
                <div className="p-4 bg-orange-500/10 border-2 border-orange-500/30 rounded-2xl">
                  <p className="text-[10px] font-bold text-orange-800 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <GraduationCap size={15} className="text-orange-600" /> Course Interest
                  </p>
                  <p className="text-base font-black text-slate-900">{selectedApplicant.courseTitle}</p>
                </div>

                {/* Candidate Information Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 uppercase text-[10px] font-semibold tracking-wider">
                      <Mail size={12} className="text-slate-400" /> Email Address
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-xs truncate">{selectedApplicant.email}</p>
                      <button
                        onClick={() => copyToClipboard(selectedApplicant.email, "email")}
                        className="p-1 text-slate-400 hover:text-orange-600 cursor-pointer"
                        title="Copy email"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                    {copiedField === "email" && <span className="text-[10px] text-green-600 font-medium">Copied!</span>}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 uppercase text-[10px] font-semibold tracking-wider">
                      <Phone size={12} className="text-slate-400" /> Phone Number
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-xs">{selectedApplicant.phone}</p>
                      <button
                        onClick={() => copyToClipboard(selectedApplicant.phone, "phone")}
                        className="p-1 text-slate-400 hover:text-orange-600 cursor-pointer"
                        title="Copy phone"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                    {copiedField === "phone" && <span className="text-[10px] text-green-600 font-medium">Copied!</span>}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 uppercase text-[10px] font-semibold tracking-wider">
                      <Briefcase size={12} className="text-slate-400" /> Total Experience
                    </div>
                    <p className="text-slate-800 font-medium">{selectedApplicant.experience || "1-3 Years"}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 uppercase text-[10px] font-semibold tracking-wider">
                      <GraduationCap size={12} className="text-slate-400" /> Degree / Qualification
                    </div>
                    <p className="text-slate-800 font-medium">{selectedApplicant.qualification || "Graduate"}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 uppercase text-[10px] font-semibold tracking-wider">
                      <Calendar size={12} className="text-slate-400" /> Date to Join / Availability
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedApplicant.dateToJoin || "Immediate"}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 uppercase text-[10px] font-semibold tracking-wider">
                      <Building size={12} className="text-slate-400" /> Current Organization
                    </div>
                    <p className="text-slate-800 font-medium">{selectedApplicant.company || "Not Specified"}</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar size={12} className="text-orange-500" /> Application Date
                    </p>
                    <p className="text-slate-800 font-semibold">{selectedApplicant.date}</p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <CheckCircle size={12} className="text-emerald-500" /> Application Status
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <p className="text-slate-800 font-semibold capitalize">{selectedApplicant.status}</p>
                    </div>
                  </div>
                </div>

                {/* Status Updater */}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Update Status</p>
                    <select
                      value={selectedApplicant.status.toLowerCase()}
                      onChange={(e) => handleStatusChange(selectedApplicant.fullId, e.target.value)}
                      className="bg-white border border-slate-300 text-orange-600 text-xs font-bold py-2 px-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer shadow-xs"
                    >
                      <option value="under review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400 font-medium">Applied Date: {selectedApplicant.date}</p>
                    <p className="text-[10px] text-slate-300">ID: {selectedApplicant.id}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer / Quick Reply Actions */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-normal">
                  Click to reply directly to {selectedApplicant.name}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedApplicant.phone}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs transition-all shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Call Candidate
                  </a>

                  <a
                    href={`mailto:${selectedApplicant.email}?subject=BITC Application Response: ${encodeURIComponent(
                      selectedApplicant.role || "Faculty / Trainer Role"
                    )}&body=Dear ${encodeURIComponent(selectedApplicant.name)},\n\nThank you for applying to teach ${encodeURIComponent(
                      selectedApplicant.department
                    )} at BIZONANCE Industrial Training Centre (BITC).\n\nWe reviewed your profile and would like to invite you for a discussion & demo lecture.\n\nBest regards,\nBITC Academic & HR Team`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-xs shadow-sm shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Reply via Email
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseApplications;
