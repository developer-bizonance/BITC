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
  Award,
  FileText,
  Download,
  Briefcase,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  Filter,
  Check,
  Building,
  MessageSquare,
  GraduationCap,
  Trash2,
  Send
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

const ScholarshipApplications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  const { highlightTarget, isHighlighted } = useRecordHighlight("Scholarship Applications");

  useEffect(() => {
    if (highlightTarget) {
      setStatusFilter("all");
      setSearchTerm("");
    }
  }, [highlightTarget]);

  // --- API CONFIGURATION ---
  const API_ENDPOINT = `${getApiUrl()}/scholarships`;
  const CMS_ENDPOINT = `${getApiUrl()}/cms/scholarships`;
  const FALLBACK_ENDPOINT = `${getSiteUrl()}/api/scholarships`;

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const allFetched = [];

      // 1. Fetch from primary backend endpoint
      try {
        const response = await fetch(API_ENDPOINT);
        if (response.ok) {
          const data = await response.json();
          const list = data.applications || (Array.isArray(data) ? data : []);
          allFetched.push(...list);
        }
      } catch (err) {
        console.warn("Primary scholarships endpoint notice:", err);
      }

      // 2. Fetch from CMS store (Neon PostgreSQL CmsData)
      try {
        const cmsRes = await fetch(CMS_ENDPOINT);
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          const list = Array.isArray(cmsData) ? cmsData : (cmsData.data || cmsData.applications || []);
          allFetched.push(...list);
        }
      } catch (cmsErr) {
        console.warn("CMS scholarships endpoint notice:", cmsErr);
      }

      // 3. Fetch from fallback Next.js website endpoint
      try {
        const fbRes = await fetch(FALLBACK_ENDPOINT);
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          const list = fbData.applications || (Array.isArray(fbData) ? fbData : []);
          allFetched.push(...list);
        }
      } catch (fbErr) {
        console.warn("Fallback scholarships endpoint notice:", fbErr);
      }

      // Intelligent deduplication
      const deduped = [];
      for (const app of allFetched) {
        if (!app) continue;

        const email = String(app.email || "").trim().toLowerCase();
        const phone = String(app.phone || "").replace(/\D/g, "");
        const course = String(app.course || "").trim().toLowerCase();
        const id = String(app.id || app._id || "").trim();

        const matchIndex = deduped.findIndex((existing) => {
          const exId = String(existing.id || existing._id || "").trim();
          const exEmail = String(existing.email || "").trim().toLowerCase();
          const exPhone = String(existing.phone || "").replace(/\D/g, "");
          const exCourse = String(existing.course || "").trim().toLowerCase();

          // 1. Same ID
          if (id && exId && (id === exId || (app._id && String(app._id).trim() === exId) || (existing._id && id === String(existing._id).trim()))) {
            return true;
          }

          // 2. Same applicant: email + course
          if (email && exEmail && email === exEmail && course && exCourse && course === exCourse) {
            // Same phone or within 24 hours
            if (phone && exPhone && phone === exPhone) return true;
            const diff = Math.abs(new Date(existing.createdAt || 0).getTime() - new Date(app.createdAt || 0).getTime());
            if (diff < 24 * 60 * 60 * 1000) return true;
          }

          return false;
        });

        if (matchIndex !== -1) {
          const existing = deduped[matchIndex];
          // Merge, keeping richer data
          deduped[matchIndex] = {
            ...existing,
            ...app,
            fullName: existing.fullName || app.fullName || existing.name || app.name || "",
            name: existing.name || app.name || existing.fullName || app.fullName || "",
            cvUrl: existing.cvUrl || app.cvUrl || "",
            cvFileName: existing.cvFileName || app.cvFileName || "",
            cvBase64: existing.cvBase64 || app.cvBase64 || "",
            status: (existing.status && existing.status.toLowerCase() !== "pending" && existing.status.toLowerCase() !== "new") ? existing.status : ((app.status && app.status.toLowerCase() !== "pending" && app.status.toLowerCase() !== "new") ? app.status : "Reviewed"),
            createdAt: (existing.createdAt && app.createdAt)
              ? (new Date(existing.createdAt) < new Date(app.createdAt) ? existing.createdAt : app.createdAt)
              : (existing.createdAt || app.createdAt),
            id: existing.cvUrl ? existing.id : (app.cvUrl ? app.id : (existing.id || app.id)),
            fullId: existing.cvUrl ? (existing.fullId || existing.id) : (app.cvUrl ? (app.fullId || app.id) : (existing.fullId || app.fullId || existing.id)),
          };
        } else {
          deduped.push({
            ...app,
            id: app.id || app._id,
            fullId: app._id || app.id,
          });
        }
      }

      const apps = deduped.sort((a, b) => {
        const timeA = new Date(a.createdAt || a.appliedAt || 0).getTime();
        const timeB = new Date(b.createdAt || b.appliedAt || 0).getTime();
        return timeB - timeA;
      });

      const formatted = apps.map((app) => ({
        ...app,
        id: app.id || app._id,
        fullId: app._id || app.id,
        date: app.createdAt ? (() => {
          const d = new Date(app.createdAt);
          return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
        })() : "Recent",
        time: app.createdAt ? new Date(app.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "",
        status: (app.status && app.status.toLowerCase() !== "pending" && app.status.toLowerCase() !== "new") ? app.status : "Reviewed",
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

      await Promise.allSettled([
        fetch(`${API_ENDPOINT}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }),
        fetch(`${FALLBACK_ENDPOINT}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: newStatus }),
        }),
        // Sync to CMS store as well
        (async () => {
          try {
            const cmsRes = await fetch(CMS_ENDPOINT);
            if (cmsRes.ok) {
              const list = await cmsRes.json();
              if (Array.isArray(list)) {
                let changed = false;
                const updated = list.map((a) => {
                  if (a.id === id || a._id === id || a.fullId === id) {
                    changed = true;
                    return { ...a, status: newStatus };
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

  const copyToClipboard = (text, fieldName) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // 🌟 Open Resume in New Tab
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
      const siteUrl = getSiteUrl().replace(/\/+$/, "");
      const fullUrl = resumeData.startsWith("http://") || resumeData.startsWith("https://")
        ? resumeData
        : `${siteUrl}${resumeData.startsWith("/") ? "" : "/"}${resumeData}`;
      window.open(fullUrl, "_blank");
    }
  };

  // 🌟 Download Resume
  const downloadResume = (resumeData, fileName = "Applicant_CV.pdf") => {
    if (!resumeData) return;
    const siteUrl = getSiteUrl().replace(/\/+$/, "");
    const fullUrl = resumeData.startsWith("data:") || resumeData.startsWith("http://") || resumeData.startsWith("https://")
      ? resumeData
      : `${siteUrl}${resumeData.startsWith("/") ? "" : "/"}${resumeData}`;
    const link = document.createElement("a");
    link.href = fullUrl;
    link.download = fileName || "Applicant_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete Scholarship Application
  const handleDelete = (e, id, name) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const app = applicants.find((a) => a.fullId === id || a.id === id || a._id === id);
    const applicantName = name || (app ? app.fullName || app.name : "") || "this application";
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
    const targetCourse = targetApp?.course ? String(targetApp.course).trim().toLowerCase() : "";

    setDeleting(true);
    try {
      // 1. Optimistic removal from state immediately
      setApplicants((prev) => prev.filter((app) => {
        const matchId = allIds.includes(app.fullId) || allIds.includes(app.id) || allIds.includes(app._id);
        const matchEmail = targetEmail && targetCourse &&
          String(app.email || "").trim().toLowerCase() === targetEmail &&
          String(app.course || "").trim().toLowerCase() === targetCourse;
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
                const aCourse = String(a.course || "").trim().toLowerCase();

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
        fetch(`${FALLBACK_ENDPOINT}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: allIds, email: targetEmail, course: targetCourse }),
        }),
      ];

      for (const singleId of allIds) {
        deleteCalls.push(
          fetch(`${API_ENDPOINT}/${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${API_ENDPOINT}?id=${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${FALLBACK_ENDPOINT}?id=${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${FALLBACK_ENDPOINT}/delete?id=${encodeURIComponent(singleId)}`, { method: "DELETE" })
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

  // Export CSV
  const handleExportCSV = () => {
    if (applicants.length === 0) return;

    const headers = [
      "ID",
      "Name",
      "Email Id",
      "Contact Number",
      "City",
      "Category",
      "Course",
      "Message",
      "Status",
      "Date Applied",
    ];

    const rows = applicants.map((app) => [
      `"${(app.id || app.fullId || "").replace(/"/g, '""')}"`,
      `"${(app.fullName || "").replace(/"/g, '""')}"`,
      `"${(app.email || "").replace(/"/g, '""')}"`,
      `"${(app.phone || "").replace(/"/g, '""')}"`,
      `"${(app.city || "").replace(/"/g, '""')}"`,
      `"${(app.category || "").replace(/"/g, '""')}"`,
      `"${(app.course || "").replace(/"/g, '""')}"`,
      `"${(app.message || "").replace(/"/g, '""')}"`,
      `"${(app.status || "").replace(/"/g, '""')}"`,
      `"${(app.date || "").replace(/"/g, '""')}"`,
    ]);

    const csvString = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bitc_scholarship_applications_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filtered = applicants.filter((app) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (app.fullName?.toLowerCase().includes(term) ||
        app.email?.toLowerCase().includes(term) ||
        app.id?.toLowerCase().includes(term) ||
        app.course?.toLowerCase().includes(term));

    const matchesStatus = statusFilter === "all" || (app.status && app.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200 min-h-screen">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-normal">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Scholarship Applications</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-amber-50 text-amber-700 border border-amber-100">
                  {filtered.length} Applications
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Review submitted student applications for scholarships
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
            placeholder="Search by applicant name, email ID, contact number, course, or ID..."
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
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
            <ChevronDown size={15} className="text-[#A0AEC0]" />
          </div>
        </div>
      </div>

      {/* ── Applications Data Table ── */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="bg-[#EDF2FA] text-[#6C7E9C] font-semibold text-xs tracking-wider capitalize">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Date</th>
                <th className="px-6 py-5 whitespace-nowrap">Name</th>
                <th className="px-6 py-5 whitespace-nowrap">Contact Number</th>
                <th className="px-6 py-5 whitespace-nowrap">Certification</th>
                <th className="px-6 py-5 whitespace-nowrap">Location</th>
                <th className="px-6 py-5 text-center whitespace-nowrap">CV</th>
                <th className="px-6 py-5 text-center whitespace-nowrap">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-400" />
                    <p className="font-semibold">Loading applications...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold mb-1">No applications found</p>
                    <p className="text-xs">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((app, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      const effectiveStatus = (!app.status || app.status.toLowerCase() === 'pending' || app.status.toLowerCase() === 'new') ? 'Reviewed' : app.status;
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
                      <p className="font-medium text-[#334155] text-[13px] truncate whitespace-nowrap" title={app.fullName || app.name || "Unknown Applicant"}>{app.fullName || app.name || "Unknown Applicant"}</p>
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
                            name={app.fullName || app.name}
                            message={`Hello ${app.fullName || app.name}, this is regarding your scholarship application for ${app.course || "our program"} at BITC (BIZONANCE Industrial Training Centre).`}
                            size="sm"
                          />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5 align-middle max-w-[200px] whitespace-nowrap">
                      <p className="font-medium text-[#334155] text-[13px] truncate whitespace-nowrap" title={app.course}>
                        {app.course}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-middle max-w-[150px] whitespace-nowrap">
                      <p className="text-[13px] text-[#475569] font-medium flex items-center gap-1.5 truncate whitespace-nowrap" title={app.city}>
                        <Building className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" /> <span className="truncate">{app.city}</span>
                      </p>
                    </td>

                    <td className="px-6 py-5 text-center align-middle">
                      {app.cvUrl || app.cvBase64 ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); openResume(app.cvUrl || app.cvBase64, app.cvFileName || `${app.fullName || app.name || 'Applicant'}_CV.pdf`); }}
                            title="View Uploaded CV"
                            className="p-1.5 text-slate-400 hover:text-[#F97316] transition-colors cursor-pointer"
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadResume(app.cvUrl || app.cvBase64, app.cvFileName || `${app.fullName || app.name || 'Applicant'}_CV.pdf`); }}
                            title="Download CV"
                            className="p-1.5 text-slate-400 hover:text-[#F97316] transition-colors cursor-pointer"
                          >
                            <Download size={15} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 font-normal">—</span>
                      )}
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
                        {app.status.toLowerCase() === "reviewed" && <Eye className="w-3 h-3" />}
                        {app.status.toLowerCase() === "approved" && <CheckCircle className="w-3 h-3" />}
                        {app.status.toLowerCase() === "rejected" && <X className="w-3 h-3" />}
                        {app.status.toLowerCase() === "pending" && <Clock className="w-3 h-3" />}
                        {app.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right align-middle">
                      <button
                        onClick={(e) => handleDelete(e, app.fullId, app.fullName || app.name)}
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

      {/* ── Applicant Details Modal ── */}
      <AnimatePresence>
        {isModalOpen && selectedApplicant && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden pointer-events-auto"
              >
                {/* Modal Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-white rounded-t-2xl">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-xs font-black text-lg shrink-0">
                      {(selectedApplicant.fullName || selectedApplicant.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* 1. Name */}
                      <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-tight truncate mb-1">
                        {selectedApplicant.fullName || selectedApplicant.name || "Unknown Applicant"}
                      </h3>

                      {/* 2. Tag (Between Name and Date + Time) */}
                      <div className="mb-1.5 flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200/80 shrink-0">
                          {selectedApplicant.category ? `Scholarship / ${selectedApplicant.category}` : "Scholarship Application"}
                        </span>
                      </div>

                      {/* 3. Date + Time */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          {selectedApplicant.date}
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
                      const currentSt = (!selectedApplicant.status || selectedApplicant.status.toLowerCase() === 'pending' || selectedApplicant.status.toLowerCase() === 'new')
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
                <div className="p-6 overflow-y-auto bg-slate-50 flex-1 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                  {/* Candidate Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <GraduationCap size={12} className="text-slate-400" /> Course Category
                      </div>
                      <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.category || "Not Specified"}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <Award size={12} className="text-slate-400" /> Selected Course
                      </div>
                      <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.course || "Not Specified"}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <Mail size={12} className="text-slate-400" /> Email Id
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-800 font-medium text-sm break-all">{selectedApplicant.email || "—"}</p>
                        {selectedApplicant.email && (
                          <button
                            onClick={() => copyToClipboard(selectedApplicant.email, "email")}
                            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy email"
                          >
                            <Copy size={12} />
                          </button>
                        )}
                      </div>
                      {copiedField === "email" && <span className="text-[10px] text-green-600 font-medium">Copied!</span>}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <Phone size={12} className="text-slate-400" /> Contact Number
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.phone || "—"}</p>
                        {selectedApplicant.phone && (
                          <button
                            onClick={() => copyToClipboard(selectedApplicant.phone, "phone")}
                            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy phone"
                          >
                            <Copy size={12} />
                          </button>
                        )}
                        {selectedApplicant.phone &&
                          selectedApplicant.phone !== "—" &&
                          selectedApplicant.phone.replace(/\D/g, "").length >= 10 && (
                            <WhatsAppButton
                              phone={selectedApplicant.phone}
                              name={selectedApplicant.fullName || selectedApplicant.name}
                              message={`Hello ${selectedApplicant.fullName || selectedApplicant.name}, this is regarding your scholarship application for ${selectedApplicant.course || "our program"} at BITC (BIZONANCE Industrial Training Centre).`}
                              showLabel={false}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full border border-emerald-200/80 bg-emerald-50/50 transition-all shadow-2xs"
                            />
                          )}
                      </div>
                      {copiedField === "phone" && <span className="text-[10px] text-green-600 font-medium">Copied!</span>}
                    </div>

                    <div className="col-span-1 sm:col-span-2">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <Building size={12} className="text-slate-400" /> City
                      </div>
                      <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.city || "—"}</p>
                    </div>

                    {/* Resume / CV */}
                    <div className="col-span-1 sm:col-span-2">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <FileText size={12} className="text-slate-400" /> Attached Resume / CV
                      </div>
                      {selectedApplicant.cvUrl || selectedApplicant.cvBase64 ? (
                        <div className="flex items-center justify-between p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-2xs">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 truncate max-w-[240px]">
                                {selectedApplicant.cvFileName || "Candidate_CV.pdf"}
                              </p>
                              <p className="text-[10px] text-slate-500 font-semibold">Available for review</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                openResume(
                                  selectedApplicant.cvUrl || selectedApplicant.cvBase64,
                                  selectedApplicant.cvFileName || `${selectedApplicant.name || selectedApplicant.fullName}_CV.pdf`
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
                                  selectedApplicant.cvUrl || selectedApplicant.cvBase64,
                                  selectedApplicant.cvFileName || `${selectedApplicant.name || selectedApplicant.fullName}_CV.pdf`
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
                        <p className="text-xs text-slate-400 italic bg-white p-3 rounded-xl border border-slate-200">No CV was attached with this application.</p>
                      )}
                    </div>

                    {/* Cover Note */}
                    {selectedApplicant.message && (
                      <div className="col-span-1 sm:col-span-2">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                          <MessageSquare size={12} className="text-slate-400" /> Candidate Note / Reason
                        </div>
                        <p className="text-sm text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed font-normal whitespace-pre-wrap break-words">
                          &quot;{selectedApplicant.message}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer: Delete Button Down */}
                <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex justify-end items-center rounded-b-2xl">
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, selectedApplicant.fullId, selectedApplicant.fullName || selectedApplicant.name)}
                    className="w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                    title="Delete Application"
                    aria-label="Delete Application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Centered Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!confirmDelete}
        title="Remove Scholarship Application"
        itemName={confirmDelete?.name}
        from="Scholarship Applications"
        loading={deleting}
        onConfirm={confirmAndDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default ScholarshipApplications;
