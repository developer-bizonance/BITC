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
  if (s.includes("interview")) {
    return {
      bg: "bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF] hover:bg-[#e9d5ff]",
      chevron: "text-[#7E22CE]",
      dot: "bg-[#7E22CE]",
    };
  }
  // Default: Pending / Under review / New
  return {
    bg: "bg-[#FFF4D2] text-[#B8860B] border-[#FDE68A] hover:bg-[#fef08a]",
    chevron: "text-[#B8860B]",
    dot: "bg-[#B8860B]",
  };
};

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  // --- API CONFIGURATION ---
  const API_ENDPOINT = `${getApiUrl()}/join-team`;

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error("Connection failed");
      const data = await response.json();

      // Map API data to UI friendly format
      const formatted = data.map((app) => ({
        ...app,
        id: app._id ? app._id.substring(app._id.length - 6).toUpperCase() : `APP-${Math.floor(Math.random() * 1000)}`,
        fullId: app._id || app.id,
        date: app.createdAt ? (() => {
          const d = new Date(app.createdAt);
          return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
        })() : "Recent",
        time: app.createdAt ? new Date(app.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "",
        status: app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "New",
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
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    
    try {
      setApplicants((prev) => prev.filter((a) => a.fullId !== id));
      if (selectedApplicant && selectedApplicant.fullId === id) {
        setIsModalOpen(false);
      }
      
      await fetch(`${API_ENDPOINT}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Delete failed:", error);
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

  const filtered = applicants.filter((a) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (a.name && a.name.toLowerCase().includes(search)) ||
      (a.role && a.role.toLowerCase().includes(search)) ||
      (a.department && a.department.toLowerCase().includes(search)) ||
      (a.email && a.email.toLowerCase().includes(search)) ||
      (a.id && a.id.toLowerCase().includes(search));

    const matchesStatus = statusFilter === "all" || (a.status && a.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      
      {/* ── Page Header ── */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent p-2">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FFF2E5] flex items-center justify-center text-[#F97316]">
              <Briefcase size={24} fill="currentColor" stroke="none" />
            </div>
            <div>
              <h1 className="text-xl md:text-[22px] font-bold text-[#1E293B] tracking-tight">Faculty Applications</h1>
              <p className="text-[#64748B] text-sm mt-0.5 font-medium">
                Review submitted educator profiles, subject specializations, and candidate resumes
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
            placeholder="Search by candidate name, email, or specialization..."
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
            <option value="interviewed">Interviewed</option>
            <option value="hired">Hired</option>
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
                <th className="px-6 py-5 whitespace-nowrap">Domain</th>
                <th className="px-6 py-5 whitespace-nowrap">Education & Exp</th>
                <th className="px-6 py-5 text-center whitespace-nowrap">Available Date</th>
                <th className="px-6 py-5 text-center whitespace-nowrap">Resume</th>
                <th className="px-6 py-5 text-center whitespace-nowrap">Status</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    Fetching applications from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-slate-400">
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

                    {/* Candidate Info */}
                    <td className="px-6 py-5 align-middle max-w-[200px]">
                      <p className="font-medium text-[#334155] text-[13px] truncate whitespace-normal">
                        {app.name}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1 mt-0.5">
                        <span className="truncate whitespace-normal">{app.email}</span>
                      </p>
                      <p className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1 mt-0.5">
                        {app.phone}
                      </p>
                    </td>

                    {/* Applied Role & Course */}
                    <td className="px-6 py-5 align-middle min-w-[220px]">
                      <p className="text-[13px] text-[#475569] leading-snug mt-0.5 capitalize">
                        {app.department?.toLowerCase()}
                      </p>
                    </td>

                    {/* Education & Experience */}
                    <td className="px-6 py-5 align-middle min-w-[180px]">
                      <p className="font-medium text-[#334155] text-[13px] leading-snug">
                        {app.qualification || "Graduate"}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1 mt-0.5">
                        <Briefcase size={10} className="shrink-0" /> {app.experience || "1-3 Years"}
                      </p>
                    </td>

                    {/* Date to Join */}
                    <td className="px-6 py-5 text-center align-middle">
                      <p className="font-medium text-[#334155] text-[13px]">
                        {app.dateToJoin || "Immediate"}
                      </p>
                    </td>

                    {/* 🌟 SLEEK RESUME ACTION 🌟 */}
                    <td className="px-6 py-5 text-center align-middle">
                      {app.resume ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); openResume(app.resume, app.resumeFileName || `${app.name}_Resume.pdf`); }}
                            title="View / Inspect Resume (Opens in New Tab)"
                            className="p-1.5 text-slate-400 hover:text-[#F97316] transition-colors cursor-pointer"
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadResume(app.resume, app.resumeFileName || `${app.name}_Resume.pdf`); }}
                            title="Download Resume File"
                            className="p-1.5 text-slate-400 hover:text-[#F97316] transition-colors cursor-pointer"
                          >
                            <Download size={15} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 font-normal">—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-5 text-center align-middle whitespace-nowrap">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.fullId, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer appearance-none text-center ${
                          app.status.toLowerCase() === 'pending' ? 'bg-[#FFF4D2] text-[#B8860B]' :
                          app.status.toLowerCase() === 'reviewed' ? 'bg-[#EAF3FE] text-[#294B7A]' :
                          ['shortlisted', 'interviewed', 'hired'].includes(app.status.toLowerCase()) ? 'bg-[#E0F8E9] text-[#2E8B57]' :
                          app.status.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-600' :
                          'bg-slate-100 text-slate-600'
                        }`}
                        style={{ textAlignLast: "center" }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewed">Interviewed</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Details Action */}
                    <td className="px-6 py-5 text-right align-middle">
                      <button
                        onClick={(e) => handleDelete(e, app.fullId)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer inline-flex"
                        title="Delete Application"
                      >
                        <Trash2 size={18} />
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
              <div className="p-6 flex justify-between items-start bg-white border-b border-slate-100">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-slate-200">
                    {selectedApplicant.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">{selectedApplicant.name}</h2>
                    <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-0.5">
                      {selectedApplicant.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-slate-50/40 text-sm flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                
                {/* Candidate Information Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <GraduationCap size={12} className="text-slate-400" /> Domain
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.department}</p>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Mail size={12} className="text-slate-400" /> Email Address
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-sm break-all">{selectedApplicant.email}</p>
                      <button
                        onClick={() => copyToClipboard(selectedApplicant.email, "email")}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Copy email"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                    {copiedField === "email" && <span className="text-[10px] text-green-600 font-medium">Copied!</span>}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Phone size={12} className="text-slate-400" /> Phone Number
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.phone}</p>
                      <button
                        onClick={() => copyToClipboard(selectedApplicant.phone, "phone")}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Copy phone"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                    {copiedField === "phone" && <span className="text-[10px] text-green-600 font-medium">Copied!</span>}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Briefcase size={12} className="text-slate-400" /> Total Experience
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.experience || "1-3 Years"}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <GraduationCap size={12} className="text-slate-400" /> Degree / Qualification
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.qualification || "Graduate"}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Calendar size={12} className="text-slate-400" /> Date to Join / Availability
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">
                      {selectedApplicant.dateToJoin || "Immediate"}
                    </p>
                  </div>
                </div>

                {/* LinkedIn Profile */}
                {selectedApplicant.linkedin && (
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1 capitalize text-[10px] font-bold tracking-widest">
                      <LinkIcon size={12} /> LinkedIn Profile
                    </div>
                    <a
                      href={selectedApplicant.linkedin.startsWith("http") ? selectedApplicant.linkedin : `https://${selectedApplicant.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-600 text-xs font-bold hover:underline inline-flex items-center gap-1"
                    >
                      {selectedApplicant.linkedin} <ExternalLink size={11} />
                    </a>
                  </div>
                )}

                {/* Cover Note */}
                {selectedApplicant.message && (
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1 capitalize text-[10px] font-bold tracking-widest">
                      Candidate Note / Philosophy
                    </div>
                    <p className="text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed font-medium">
                      &quot;{selectedApplicant.message}&quot;
                    </p>
                  </div>
                )}

                {/* 🌟 RESUME SECTION IN MODAL 🌟 */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 capitalize tracking-wider">
                      <FileText size={14} className="text-slate-500" /> Attached Resume / CV
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">PDF / DOCX File</span>
                  </div>

                  {selectedApplicant.resume ? (
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold shadow-2xs">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[240px]">
                            {selectedApplicant.resumeFileName || "Candidate_Resume.pdf"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-semibold">Available for review</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            openResume(
                              selectedApplicant.resume,
                              selectedApplicant.resumeFileName || `${selectedApplicant.name}_Resume.pdf`
                            )
                          }
                          title="View Resume in New Window"
                          className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() =>
                            downloadResume(
                              selectedApplicant.resume,
                              selectedApplicant.resumeFileName || `${selectedApplicant.name}_Resume.pdf`
                            )
                          }
                          title="Download file"
                          className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">No resume was attached with this application.</p>
                  )}
                </div>
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
                          value={selectedApplicant.status}
                          onChange={(e) => handleStatusChange(selectedApplicant.fullId, e.target.value)}
                          className={`appearance-none flex items-center pl-3.5 pr-8 py-2 text-xs font-bold rounded-3xl border shadow-xs transition-all active:scale-95 cursor-pointer outline-none ${st.bg}`}
                        >
                          <option value="Pending" className="bg-white text-slate-800">Pending</option>
                          <option value="Reviewed" className="bg-white text-slate-800">Reviewed</option>
                          <option value="Shortlisted" className="bg-white text-slate-800">Shortlisted</option>
                          <option value="Interviewed" className="bg-white text-slate-800">Interviewed</option>
                          <option value="Hired" className="bg-white text-slate-800">Hired</option>
                          <option value="Rejected" className="bg-white text-slate-800">Rejected</option>
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
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedApplicant.email}&su=BITC%20Application%20Response:%20${encodeURIComponent(
                      selectedApplicant.role || "Faculty / Trainer Role"
                    )}&body=Dear%20${encodeURIComponent(selectedApplicant.name)}%2C%0A%0AThank%20you%20for%20applying%20to%20teach%20${encodeURIComponent(
                      selectedApplicant.department
                    )}%20at%20BIZONANCE%20Industrial%20Training%20Centre%20(BITC).%0A%0AWe%20reviewed%20your%20profile%20and%20would%20like%20to%20invite%20you%20for%20a%20discussion%20%26%20demo%20lecture.%0A%0ABest%20regards%2C%0ABITC%20Academic%20%26%20HR%20Team`}
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

export default Applications;
