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
  ChevronRight,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "../utils";

const getStatusStyle = (status) => {
  const s = (status || "").toLowerCase().trim();
  if (s.includes("approv") || s.includes("hire") || s.includes("convert") || s.includes("resolv") || s.includes("shortlist")) {
    return {
      bg: "bg-[#E0F8E9] text-[#2E8B57] border-[#A7E8BD] hover:bg-[#c9f2d6]",
      chevron: "text-[#2E8B57]",
      dot: "bg-[#2E8B57]",
    };
  }
  if (s.includes("reject") || s.includes("archiv") || s.includes("close")) {
    return {
      bg: "bg-[#FEECEB] text-[#D32F2F] border-[#F8B4B4] hover:bg-[#fcdad8]",
      chevron: "text-[#D32F2F]",
      dot: "bg-[#D32F2F]",
    };
  }
  if (s.includes("contact")) {
    return {
      bg: "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD] hover:bg-[#bae6fd]",
      chevron: "text-[#0369A1]",
      dot: "bg-[#0369A1]",
    };
  }
  if (s.includes("review")) {
    return {
      bg: "bg-[#EAF3FE] text-[#294B7A] border-[#BFDBFE] hover:bg-[#dbeafe]",
      chevron: "text-[#294B7A]",
      dot: "bg-[#294B7A]",
    };
  }
  // Default: Pending / Under review / New
  return {
    bg: "bg-[#FFF4D2] text-[#B8860B] border-[#FDE68A] hover:bg-[#fef08a]",
    chevron: "text-[#B8860B]",
    dot: "bg-[#B8860B]",
  };
};

const CourseApplications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  // --- API CONFIGURATION ---
  const API_ENDPOINT = `${getApiUrl()}/admin/applications`;

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
        date: app.appliedAt ? (() => {
          const d = new Date(app.appliedAt);
          return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
        })() : "Recent",
        time: app.appliedAt ? new Date(app.appliedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "",
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

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await fetch(`${API_ENDPOINT}/${id}`, {
          method: "DELETE",
        });
        setApplicants((prev) => prev.filter((app) => app.fullId !== id));
        if (selectedApplicant && selectedApplicant.fullId === id) {
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error("Failed to delete application", err);
      }
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
      "Course",
      "City",
      "Qualification",
      "Specialization",
      "Message",
      "Status",
      "Date Applied",
    ];

    const rows = applicants.map((app) => [
      `"${(app.id || app.fullId || "").replace(/"/g, '""')}"`,
      `"${(app.name || "").replace(/"/g, '""')}"`,
      `"${(app.email || "").replace(/"/g, '""')}"`,
      `"${(app.phone || "").replace(/"/g, '""')}"`,
      `"${(app.courseTitle || "").replace(/"/g, '""')}"`,
      `"${(app.city || "").replace(/"/g, '""')}"`,
      `"${(app.qualification || "").replace(/"/g, '""')}"`,
      `"${(app.specialization || "").replace(/"/g, '""')}"`,
      `"${(app.message || "").replace(/"/g, '""')}"`,
      `"${(app.status || "").replace(/"/g, '""')}"`,
      `"${(app.date || "").replace(/"/g, '""')}"`,
    ]);

    const csvString = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bitc_course_applications_${new Date().toISOString().slice(0, 10)}.csv`;
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
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      
      {/* ── Page Header ── */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent p-2">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FFF2E5] flex items-center justify-center text-[#F97316]">
              <GraduationCap size={24} fill="currentColor" stroke="none" />
            </div>
            <div>
              <h1 className="text-xl md:text-[22px] font-bold text-[#1E293B] tracking-tight">Course Applications</h1>
              <p className="text-[#64748B] text-sm mt-0.5 font-medium">
                Review submitted student applications for enrollment
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#D6E4F8] text-[#294B7A] hover:bg-[#c6d7f0] text-sm font-semibold rounded-xl transition-colors active:scale-95 cursor-pointer"
          >
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-[#A0AEC0]" />
          </div>
          <input
            id="globalSearchInput"
            type="text"
            placeholder="Search by candidate name, email, course, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200/60 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all text-sm text-[#1E293B] placeholder:text-[#94A3B8] shadow-sm font-medium"
          />
        </div>
        <div className="relative w-full sm:w-52">
          <select
            id="globalStatusSelect"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200/60 rounded-xl py-2.5 pl-4 pr-10 outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 text-sm text-[#1E293B] cursor-pointer font-bold shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
            <ChevronDown size={15} className="text-[#A0AEC0]" />
          </div>
        </div>
      </div>

      {/* ── Applications Table ── */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="bg-[#EDF2FA] text-[#6C7E9C] font-semibold text-xs tracking-wider capitalize">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Date</th>
                <th className="px-6 py-5 whitespace-nowrap">Name</th>
                <th className="px-6 py-5 whitespace-nowrap">Phone</th>
                <th className="px-6 py-5 whitespace-nowrap">Course</th>
                <th className="px-6 py-5 whitespace-nowrap">Location</th>
                <th className="px-6 py-5 text-center whitespace-nowrap">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    Fetching applications from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No applications matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.fullId} onClick={() => { setSelectedApplicant(app); setIsModalOpen(true); }} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
                    <td className="px-6 py-5 align-middle whitespace-nowrap">
                      <p className="font-medium text-[#64748B] text-[12px] flex items-center gap-1.5">
                        {app.date}
                      </p>
                      {app.time && (
                        <p className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1 mt-0.5">
                          {app.time}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-5 align-middle max-w-[200px] whitespace-nowrap">
                      <p className="font-medium text-[#334155] text-[13px] truncate whitespace-nowrap" title={app.name || "Unknown Candidate"}>{app.name || "Unknown Candidate"}</p>
                      <p className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1 mt-0.5 truncate whitespace-nowrap" title={app.email}>
                        <span className="truncate whitespace-nowrap">{app.email}</span>
                      </p>
                    </td>

                    <td className="px-6 py-5 align-middle whitespace-nowrap">
                      <p className="text-[12px] text-[#475569] font-medium flex items-center gap-1.5">
                        {app.phone}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-middle max-w-[200px] whitespace-nowrap">
                      <p className="font-medium text-[#334155] text-[13px] truncate whitespace-nowrap" title={app.courseTitle}>
                        {app.courseTitle}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-middle max-w-[150px] whitespace-nowrap">
                      <p className="text-[13px] text-[#475569] font-medium flex items-center gap-1.5 truncate whitespace-nowrap" title={app.city || "Not Specified"}>
                        <Building className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" /> <span className="truncate">{app.city || "Not Specified"}</span>
                      </p>
                    </td>

                    <td className="px-6 py-5 text-center align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${
                          app.status.toLowerCase() === "reviewed"
                            ? "bg-[#EAF3FE] text-[#294B7A] border-blue-200"
                            : app.status.toLowerCase() === "approved"
                            ? "bg-[#E0F8E9] text-[#2E8B57] border-green-200"
                            : app.status.toLowerCase() === "rejected"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-[#FFF4D2] text-[#B8860B] border-yellow-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            app.status.toLowerCase() === "reviewed"
                              ? "bg-[#294B7A]"
                              : app.status.toLowerCase() === "approved"
                              ? "bg-[#2E8B57]"
                              : app.status.toLowerCase() === "rejected"
                              ? "bg-red-600"
                              : "bg-[#B8860B]"
                          }`}
                        />
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right align-middle">
                      <button
                        onClick={(e) => handleDelete(e, app.fullId)}
                        className="w-7 h-7 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 border border-slate-200 shadow-sm hover:shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95 inline-flex"
                        title="Delete Application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start px-6 py-5 border-b border-slate-100 bg-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shadow-inner font-bold text-xl">
                    {(selectedApplicant.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-0.5">
                      {selectedApplicant.name || "Unknown Applicant"}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      COURSE APPLICATION
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto bg-slate-50 flex-1 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                
                {/* Candidate Information Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <GraduationCap size={12} className="text-slate-400" /> Course Interest
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-sm break-words leading-snug">{selectedApplicant.courseTitle}</p>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Mail size={12} className="text-slate-400" /> Email Address
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-sm break-all">{selectedApplicant.email}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Phone size={12} className="text-slate-400" /> Phone Number
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Building size={12} className="text-slate-400" /> City
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.city || "Not Specified"}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <GraduationCap size={12} className="text-slate-400" /> Higher Qualification
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.qualification || "Not Specified"}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Briefcase size={12} className="text-slate-400" /> Specialization
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.specialization || "Not Specified"}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Calendar size={12} className="text-slate-400" /> Date
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">
                      {selectedApplicant.date}
                    </p>
                  </div>
                </div>

                {/* Cover Note */}
                {selectedApplicant.message && (
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1 capitalize text-[10px] font-bold tracking-widest">
                      Applicant Message
                    </div>
                    <p className="text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed font-medium whitespace-pre-wrap break-words">
                      &quot;{selectedApplicant.message}&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer / Quick Reply Actions */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-normal">
                  Click to reply directly to {selectedApplicant.name}
                </span>

                <div className="flex items-center gap-2">
                  {/* Update Status Button */}
                  {(() => {
                    const st = getStatusStyle(selectedApplicant.status);
                    return (
                      <div className="relative inline-flex items-center">
                        <select
                          value={selectedApplicant.status.toLowerCase()}
                          onChange={(e) => handleStatusChange(selectedApplicant.fullId, e.target.value)}
                          className={`appearance-none flex items-center pl-3.5 pr-8 py-2 text-xs font-bold rounded-3xl border shadow-xs transition-all active:scale-95 cursor-pointer outline-none ${st.bg}`}
                        >
                          <option value="under review" className="bg-white text-slate-800">Under Review</option>
                          <option value="approved" className="bg-white text-slate-800">Approved</option>
                          <option value="rejected" className="bg-white text-slate-800">Rejected</option>
                        </select>
                        <ChevronDown size={14} className={`absolute right-2.5 pointer-events-none transition-colors ${st.chevron}`} />
                      </div>
                    );
                  })()}
                  <a
                    href={`tel:${selectedApplicant.phone}`}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium rounded-3xl shadow-xs transition-all active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    Call
                  </a>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedApplicant.email}&su=BITC%20Course%20Enrollment:%20${encodeURIComponent(
                      selectedApplicant.courseTitle || "Course"
                    )}&body=Dear%20${encodeURIComponent(selectedApplicant.name)}%2C%0A%0AThank%20you%20for%20applying%20for%20the%20${encodeURIComponent(
                      selectedApplicant.courseTitle || "course"
                    )}%20at%20BIZONANCE%20Industrial%20Training%20Centre%20(BITC).%0A%0AOur%20academic%20counselor%20will%20contact%20you%20shortly%20to%20complete%20the%20orientation%20and%20batch%20scheduling.%0A%0ABest%20regards%2C%0ABITC%20Team`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium rounded-3xl shadow-xs transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-500" />
                    Email
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
