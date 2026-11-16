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
import { getApiUrl, getSiteUrl, useRecordHighlight } from "../utils";
import DeleteConfirmModal from "./uic/DeleteConfirmModal.jsx";
import { WhatsAppButton } from "./uic/WhatsAppButton";

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
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  const { highlightTarget, isHighlighted } = useRecordHighlight("Course Applications");

  // If a highlight target was requested, ensure it is not hidden by filters
  useEffect(() => {
    if (highlightTarget) {
      setStatusFilter("all");
      setSearchTerm("");
    }
  }, [highlightTarget]);

  // --- API CONFIGURATION ---
  const API_ENDPOINT = `${getApiUrl()}/admin/applications`;
  const CMS_ENDPOINT = `${getApiUrl()}/cms/course-applications`;
  const FALLBACK_ENDPOINT = `${getSiteUrl()}/api/admin/applications`;

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const allFetched = [];

      // 1. Fetch from Primary Admin Applications endpoint
      try {
        const response = await fetch(API_ENDPOINT);
        if (response.ok) {
          const data = await response.json();
          const list = data.applications || (Array.isArray(data) ? data : []);
          allFetched.push(...list);
        }
      } catch (err) {
        console.warn("Primary admin applications endpoint failed:", err);
      }

      // 2. Fetch from CMS store (which directly reflects Neon PostgreSQL CmsData)
      try {
        const cmsRes = await fetch(CMS_ENDPOINT);
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          const list = Array.isArray(cmsData) ? cmsData : (cmsData.data || []);
          allFetched.push(...list);
        }
      } catch (cmsErr) {
        console.warn("CMS applications endpoint failed:", cmsErr);
      }

      // 3. Fetch from Next.js website fallback endpoint
      try {
        const fallbackRes = await fetch(FALLBACK_ENDPOINT);
        if (fallbackRes.ok) {
          const fbData = await fallbackRes.json();
          const list = fbData.applications || (Array.isArray(fbData) ? fbData : []);
          allFetched.push(...list);
        }
      } catch (fbErr) {
        console.warn("Fallback applications endpoint failed:", fbErr);
      }

      // Deduplicate applications
      const deduped = [];
      for (const app of allFetched) {
        if (!app) continue;

        const email = String(app.email || app.userEmail || app.user?.email || "").trim().toLowerCase();
        const phone = String(app.phone || app.userPhone || app.user?.phone || "").replace(/\D/g, "");
        const course = String(app.courseTitle || app.course?.title || app.courseId || "").trim().toLowerCase();
        const id = String(app.id || app.fullId || "").trim();

        const matchIndex = deduped.findIndex((existing) => {
          const exId = String(existing.id || existing.fullId || "").trim();
          const exEmail = String(existing.email || existing.userEmail || existing.user?.email || "").trim().toLowerCase();
          const exPhone = String(existing.phone || existing.userPhone || existing.user?.phone || "").replace(/\D/g, "");
          const exCourse = String(existing.courseTitle || existing.course?.title || existing.courseId || "").trim().toLowerCase();

          // 1. Same ID
          if (id && exId && (id === exId || id === String(existing.fullId || "").trim() || String(app.fullId || "").trim() === exId)) {
            return true;
          }

          // 2. Same applicant: email + course
          if (email && exEmail && email === exEmail && course && exCourse && (course.includes(exCourse) || exCourse.includes(course))) {
            if (phone && exPhone && phone === exPhone) return true;
            const diff = Math.abs(new Date(existing.appliedAt || existing.createdAt || 0).getTime() - new Date(app.appliedAt || app.createdAt || 0).getTime());
            if (diff < 24 * 60 * 60 * 1000) return true;
          }

          return false;
        });

        if (matchIndex !== -1) {
          const existing = deduped[matchIndex];
          deduped[matchIndex] = {
            ...existing,
            ...app,
            name: existing.name || app.name || existing.userName || app.userName || "Unknown",
            city: existing.city || app.city || existing.location || app.location || "",
            qualification: existing.qualification || app.qualification || "",
            specialization: existing.specialization || app.specialization || "",
            message: existing.message || app.message || "",
            status: (existing.status && !["UNDER_REVIEW", "Under Review", "PENDING", "Pending", "New"].includes(existing.status)) ? existing.status : ((app.status && !["UNDER_REVIEW", "Under Review", "PENDING", "Pending", "New"].includes(app.status)) ? app.status : "Reviewed"),
            id: (existing.id && existing.id.startsWith("APP-")) ? existing.id : (app.id && app.id.startsWith("APP-") ? app.id : existing.id),
            fullId: (existing.fullId && !existing.fullId.startsWith("APP-")) ? existing.fullId : (app.fullId || existing.fullId),
          };
        } else {
          deduped.push({
            ...app,
            id: app.id || app.fullId,
            fullId: app.fullId || app.id,
          });
        }
      }

      const rawApps = deduped.sort((a, b) => {
        const timeA = new Date(a.appliedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.appliedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      // Map API data to UI friendly format
      const formatted = rawApps.map((app) => ({
        ...app,
        id: app.id || `APP-${Math.floor(Math.random() * 1000)}`,
        fullId: app.fullId || app.id,
        date: app.appliedAt ? (() => {
          const d = new Date(app.appliedAt);
          return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
        })() : "Recent",
        time: app.appliedAt ? new Date(app.appliedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "",
        status: (app.status && !["under review", "under_review", "pending", "new"].includes(app.status.toLowerCase()))
          ? app.status.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
          : "Reviewed",
        // Normalize nested vs flat data
        name: app.name || app.userName || app.user?.name || "Unknown",
        email: app.email || app.userEmail || app.user?.email || "",
        phone: app.phone || app.userPhone || app.user?.phone || "",
        courseTitle: app.courseTitle || app.course?.title || "",
        city: app.city || app.location || "Not Specified",
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
      setApplicants((prev) => prev.map((a) => (a.fullId === id || a.id === id ? { ...a, status: newStatus } : a)));
      if (selectedApplicant && (selectedApplicant.fullId === id || selectedApplicant.id === id)) {
        setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
      }

      const payload = JSON.stringify({ id, status: newStatus.toLowerCase() });
      const headers = { "Content-Type": "application/json" };

      await Promise.allSettled([
        fetch(API_ENDPOINT, { method: "PATCH", headers, body: payload }),
        fetch(FALLBACK_ENDPOINT, { method: "PATCH", headers, body: payload }),
        // Sync to CMS store as well
        (async () => {
          try {
            const cmsRes = await fetch(CMS_ENDPOINT);
            if (cmsRes.ok) {
              const list = await cmsRes.json();
              if (Array.isArray(list)) {
                let changed = false;
                const updated = list.map((a) => {
                  if (a.id === id || a.fullId === id) {
                    changed = true;
                    return { ...a, status: newStatus.toUpperCase().replace(/\s+/g, "_") };
                  }
                  return a;
                });
                if (changed) {
                  await fetch(CMS_ENDPOINT, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: updated }),
                  });
                }
              }
            }
          } catch { }
        })(),
      ]);
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const handleDelete = (e, id, name) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const app = applicants.find((a) => a.fullId === id || a.id === id);
    const applicantName = name || (app ? app.name : "") || "this application";
    setConfirmDelete({ id, name: applicantName });
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    const { id } = confirmDelete;
    const targetApp = applicants.find((a) => a.fullId === id || a.id === id || a._id === id);
    const allIds = Array.from(new Set([
      id,
      targetApp?.fullId,
      targetApp?.id,
      targetApp?._id,
      ...(targetApp?.altIds || [])
    ].filter(Boolean)));
    const targetEmail = targetApp?.email ? String(targetApp.email).trim().toLowerCase() : "";
    const targetCourse = targetApp?.course || targetApp?.subjectCourse ? String(targetApp.course || targetApp.subjectCourse).trim().toLowerCase() : "";

    setDeleting(true);
    try {
      // 1. Optimistic removal from state immediately
      setApplicants((prev) => prev.filter((app) => {
        const matchId = allIds.includes(app.fullId) || allIds.includes(app.id) || allIds.includes(app._id);
        const matchEmail = targetEmail && targetCourse &&
          String(app.email || "").trim().toLowerCase() === targetEmail &&
          String(app.course || app.subjectCourse || "").trim().toLowerCase() === targetCourse;
        return !matchId && !matchEmail;
      }));
      if (selectedApplicant && (
        allIds.includes(selectedApplicant.fullId) ||
        allIds.includes(selectedApplicant.id) ||
        allIds.includes(selectedApplicant._id) ||
        (targetEmail && String(selectedApplicant.email || "").toLowerCase() === targetEmail)
      )) {
        setIsModalOpen(false);
      }

      // 2. Direct clean up from CMS store
      const deleteFromCms = async (endpoint) => {
        try {
          const cmsRes = await fetch(endpoint);
          if (cmsRes.ok) {
            const list = await cmsRes.json();
            const arr = Array.isArray(list) ? list : (list.data || list.applications || []);
            if (Array.isArray(arr)) {
              const cleanIds = allIds.map((x) => String(x).trim().toLowerCase());
              const filtered = arr.filter((a) => {
                const aId = String(a.id || "").trim().toLowerCase();
                const aUnderscoreId = String(a._id || "").trim().toLowerCase();
                const aFullId = String(a.fullId || "").trim().toLowerCase();
                const aEmail = String(a.email || "").trim().toLowerCase();
                const aCourse = String(a.course || a.subjectCourse || "").trim().toLowerCase();

                if (cleanIds.includes(aId) || cleanIds.includes(aUnderscoreId) || cleanIds.includes(aFullId)) {
                  return false;
                }
                if (targetEmail && targetCourse && aEmail === targetEmail && aCourse === targetCourse) {
                  return false;
                }
                return true;
              });

              if (filtered.length !== arr.length) {
                await fetch(endpoint, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ data: filtered }),
                });
              }
            }
          }
        } catch (e) {
          console.warn("CMS delete notice:", e);
        }
      };

      // 3. Parallel calls to all endpoints
      const deleteCalls = [
        deleteFromCms(CMS_ENDPOINT),
        fetch(`${API_ENDPOINT}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: allIds, email: targetEmail, course: targetCourse }),
        }),
        fetch(`${FALLBACK_ENDPOINT}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: allIds, email: targetEmail, course: targetCourse }),
        }),
      ];

      for (const singleId of allIds) {
        deleteCalls.push(
          fetch(`${API_ENDPOINT}/${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${API_ENDPOINT}?id=${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${FALLBACK_ENDPOINT}/${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${FALLBACK_ENDPOINT}?id=${encodeURIComponent(singleId)}`, { method: "DELETE" })
        );
      }

      await Promise.allSettled(deleteCalls);
    } catch (err) {
      console.error("Failed to delete application", err);
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
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
      "Email Id",
      "Contact Number",
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
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200 min-h-screen">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-normal">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Course Applications</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-orange-50 text-orange-700 border border-orange-100">
                  {filtered.length} Applications
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Review submitted student applications for enrollment
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          Export Data
        </button>
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
            placeholder="Search by candidate name, email ID, contact number, course, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200/60 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all text-sm text-[#1E293B] placeholder:text-[#94A3B8] shadow-sm font-normal text-gray-500"
          />
        </div>
        <div className="relative w-full sm:w-52">
          <select
            id="globalStatusSelect"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200/60 rounded-xl py-2.5 pl-4 pr-10 outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 text-sm text-[#1E293B] cursor-pointer font-normal shadow-sm text-gray-500"
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
                <th className="px-6 py-5 whitespace-nowrap">Contact Number</th>
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
                  <tr
                    key={app.fullId}
                    onClick={() => {
                      const effectiveStatus = (!app.status || app.status.toLowerCase() === 'pending' || app.status.toLowerCase() === 'new' || app.status.toLowerCase() === 'under review') ? 'Reviewed' : app.status;
                      setSelectedApplicant({ ...app, status: effectiveStatus });
                      setIsModalOpen(true);
                    }}
                    className={`transition-all duration-700 cursor-pointer ${isHighlighted(app)
                        ? "bg-slate-100/80 hover:bg-slate-100"
                        : "hover:bg-slate-50/80"
                      }`}
                    data-highlighted={isHighlighted(app) ? "true" : undefined}
                  >
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
                      <div className="flex items-center gap-1.5">
                        <p className="text-[12px] text-[#475569] font-medium flex items-center gap-1.5">
                          {app.phone}
                        </p>
                        {app.phone && (
                          <WhatsAppButton
                            phone={app.phone}
                            name={app.name}
                            message={`Hello ${app.name}, this is regarding your application for the ${app.courseTitle || "course"} at BITC (BIZONANCE Industrial Training Centre).`}
                            size="sm"
                          />
                        )}
                      </div>
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
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${app.status.toLowerCase() === "reviewed"
                            ? "bg-[#EAF3FE] text-[#294B7A] border-blue-200"
                            : app.status.toLowerCase() === "approved"
                              ? "bg-[#E0F8E9] text-[#2E8B57] border-green-200"
                              : app.status.toLowerCase() === "rejected"
                                ? "bg-red-50 text-red-600 border-red-200"
                                : "bg-[#FFF4D2] text-[#B8860B] border-yellow-200"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${app.status.toLowerCase() === "reviewed"
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
                        onClick={(e) => handleDelete(e, app.fullId, app.name)}
                        className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                        title="Delete Application"
                      >
                        <Trash2 size={15} />
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shadow-inner font-bold text-xl shrink-0">
                    {(selectedApplicant.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-0.5">
                      {selectedApplicant.name || "Unknown Applicant"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200/60">
                        COURSE APPLICATION
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {selectedApplicant.date || "Recent"}
                      </span>
                      {selectedApplicant.time && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            {selectedApplicant.time}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Header Actions: Status Select, Close */}
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  {/* Status Dropdown - Pending at last */}
                  {(() => {
                    const currentSt = (!selectedApplicant.status || selectedApplicant.status.toLowerCase() === 'pending' || selectedApplicant.status.toLowerCase() === 'new' || selectedApplicant.status.toLowerCase() === 'under review')
                      ? 'Reviewed'
                      : selectedApplicant.status;
                    const st = getStatusStyle(currentSt);
                    return (
                      <div className="relative inline-flex items-center">
                        <select
                          value={currentSt}
                          onChange={(e) => handleStatusChange(selectedApplicant.fullId, e.target.value)}
                          className={`appearance-none flex items-center pl-3.5 pr-8 py-1.5 text-xs font-bold rounded-full border shadow-xs transition-all active:scale-95 cursor-pointer outline-none ${st.bg}`}
                        >
                          <option value="Reviewed" className="bg-white text-slate-800">Reviewed</option>
                          <option value="Approved" className="bg-white text-slate-800">Approved</option>
                          <option value="Rejected" className="bg-white text-slate-800">Rejected</option>
                          <option value="Pending" className="bg-white text-slate-800">Pending</option>
                        </select>
                        <ChevronDown size={13} className={`absolute right-2.5 pointer-events-none transition-colors ${st.chevron}`} />
                      </div>
                    );
                  })()}

                  {/* Close Modal (X) */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200/60 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                    title="Close"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
                      <Mail size={12} className="text-slate-400" /> Email Id
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-sm break-all">{selectedApplicant.email}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Phone size={12} className="text-slate-400" /> Contact Number
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.phone}</p>
                      {selectedApplicant.phone && (
                        <WhatsAppButton
                          phone={selectedApplicant.phone}
                          name={selectedApplicant.name}
                          message={`Hello ${selectedApplicant.name}, this is regarding your application for the ${selectedApplicant.courseTitle || "course"} at BITC (BIZONANCE Industrial Training Centre).`}
                          showLabel={false}
                        />
                      )}
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

              {/* Modal Footer / Delete Action */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end">
                <button
                  onClick={(e) => {
                    handleDelete(e, selectedApplicant.fullId, selectedApplicant.name);
                  }}
                  className="w-8 h-8 rounded-full border border-red-200 bg-red-50/50 hover:bg-red-500 hover:text-white text-red-500 transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                  title="Delete Application"
                  aria-label="Delete Application"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Centered Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!confirmDelete}
        title="Remove Course Application"
        itemName={confirmDelete?.name}
        from="Course Applications"
        loading={deleting}
        onConfirm={confirmAndDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default CourseApplications;
