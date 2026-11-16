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
  MessageSquare,
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

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  const { highlightTarget, isHighlighted } = useRecordHighlight("Career Applications");

  useEffect(() => {
    if (highlightTarget) {
      setStatusFilter("all");
      setSearchTerm("");
    }
  }, [highlightTarget]);

  // --- API CONFIGURATION ---
  const JOIN_TEAM_ENDPOINT = `${getApiUrl()}/join-team`;
  const CAREERS_APP_ENDPOINT = `${getApiUrl()}/careers/applications`;
  const CMS_APPLICATIONS = `${getApiUrl()}/cms/applications`;
  const CMS_JOIN_TEAM = `${getApiUrl()}/cms/join-team`;
  const SITE_CAREERS_APP = `${getSiteUrl()}/api/careers/applications`;
  const SITE_JOIN_TEAM = `${getSiteUrl()}/api/join-team`;

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const map = new Map();

      const getAppKey = (app) => {
        if (!app) return "";
        const email = (app.email || "").trim().toLowerCase();
        const phone = (app.phone || "").replace(/\D/g, "");
        const role = (app.subjectCourse || app.department || app.position || app.role || "").trim().toLowerCase();
        if (email && phone) return `${email}-${phone}-${role}`;
        if (email) return `${email}-${role}`;
        if (phone) return `${phone}-${role}`;
        const id = (app.fullId || app.id || app._id || "").toString().trim();
        return id || Math.random().toString();
      };

      const addApp = (rawApp) => {
        if (!rawApp) return;
        const key = getAppKey(rawApp);
        if (!key) return;

        const resume = rawApp.resume || rawApp.resumeUrl || rawApp.resumeBase64 || rawApp.cvBase64 || "";
        const resumeUrl = rawApp.resumeUrl || rawApp.resume || resume;
        const resumeFileName = rawApp.resumeFileName || rawApp.cvFileName || (rawApp.name || rawApp.fullName ? `${rawApp.name || rawApp.fullName}_Resume.pdf` : "Resume.pdf");

        const normalized = {
          ...rawApp,
          resume,
          resumeUrl,
          resumeFileName,
          id: rawApp.id || rawApp._id,
          _id: rawApp._id || rawApp.id,
          fullId: rawApp.fullId || rawApp.id || rawApp._id,
          altIds: [rawApp.id, rawApp._id, rawApp.fullId].filter(Boolean),
        };

        if (map.has(key)) {
          const existing = map.get(key);
          const bestResume = existing.resume || normalized.resume;
          const bestResumeUrl = existing.resumeUrl || normalized.resumeUrl || bestResume;
          const bestResumeFileName = existing.resumeFileName || normalized.resumeFileName;
          const combinedAltIds = Array.from(new Set([...(existing.altIds || []), ...(normalized.altIds || [])]));

          map.set(key, {
            ...normalized,
            ...existing,
            resume: bestResume,
            resumeUrl: bestResumeUrl,
            resumeFileName: bestResumeFileName,
            id: existing.id || normalized.id,
            _id: existing._id || normalized._id,
            fullId: existing.fullId || normalized.fullId,
            altIds: combinedAltIds,
          });
        } else {
          map.set(key, normalized);
        }
      };

      // 1. Fetch from Careers Applications endpoint
      try {
        const res = await fetch(CAREERS_APP_ENDPOINT);
        if (res.ok) {
          const data = await res.json();
          const list = data.applications || (Array.isArray(data) ? data : []);
          for (const app of list) addApp(app);
        }
      } catch (err) {
        console.warn("Primary careers applications endpoint notice:", err);
      }

      // 2. Fetch from Join-Team endpoint
      try {
        const res = await fetch(JOIN_TEAM_ENDPOINT);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.applications || []);
          for (const app of list) addApp(app);
        }
      } catch (err) {
        console.warn("Primary join-team endpoint notice:", err);
      }

      // 3. Fetch from direct Neon PostgreSQL CMS stores
      try {
        const [cmsAppRes, cmsJtRes] = await Promise.allSettled([
          fetch(CMS_APPLICATIONS),
          fetch(CMS_JOIN_TEAM),
        ]);
        if (cmsAppRes.status === "fulfilled" && cmsAppRes.value.ok) {
          const d = await cmsAppRes.value.json();
          const list = Array.isArray(d) ? d : (d.data || d.applications || []);
          for (const app of list) addApp(app);
        }
        if (cmsJtRes.status === "fulfilled" && cmsJtRes.value.ok) {
          const d = await cmsJtRes.value.json();
          const list = Array.isArray(d) ? d : (d.data || d.applications || []);
          for (const app of list) addApp(app);
        }
      } catch (err) {
        console.warn("CMS applications endpoint notice:", err);
      }

      // 4. Fetch from website fallback endpoints
      try {
        const [fbAppRes, fbJtRes] = await Promise.allSettled([
          fetch(SITE_CAREERS_APP),
          fetch(SITE_JOIN_TEAM),
        ]);
        if (fbAppRes.status === "fulfilled" && fbAppRes.value.ok) {
          const d = await fbAppRes.value.json();
          const list = d.applications || (Array.isArray(d) ? d : []);
          for (const app of list) addApp(app);
        }
        if (fbJtRes.status === "fulfilled" && fbJtRes.value.ok) {
          const d = await fbJtRes.value.json();
          const list = d.applications || (Array.isArray(d) ? d : []);
          for (const app of list) addApp(app);
        }
      } catch (err) { }

      const rawApps = Array.from(map.values()).sort((a, b) => {
        const timeA = new Date(a.createdAt || a.appliedAt || 0).getTime();
        const timeB = new Date(b.createdAt || b.appliedAt || 0).getTime();
        return timeB - timeA;
      });

      // Map API data to UI friendly format
      const formatted = rawApps.map((app) => {
        const resume = app.resume || app.resumeUrl || app.cvBase64 || app.resumeBase64 || "";
        return {
          ...app,
          id: app.id || (app._id ? app._id.substring(app._id.length - 6).toUpperCase() : `APP-${Math.floor(Math.random() * 1000)}`),
          fullId: app.fullId || app._id || app.id,
          name: app.fullName || app.name || "Unknown Applicant",
          role: app.position || app.role || "Faculty",
          department: app.subjectCourse || app.department || "",
          experience: app.experience || "",
          qualification: app.qualification || "",
          otherQualification: app.otherQualification || "",
          dateToJoin: app.dateToJoin || "",
          currentOrg: app.currentOrg || "",
          resume: resume,
          resumeUrl: resume,
          resumeFileName: app.resumeFileName || "Resume.pdf",
          linkedinUrl: app.linkedinUrl || "",
          coverNote: app.coverNote || app.message || "",
          message: app.coverNote || app.message || "",
          date: app.createdAt ? (() => {
            const d = new Date(app.createdAt);
            return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
          })() : "Recent",
          time: app.createdAt ? new Date(app.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "",
          status: app.status && app.status.toLowerCase() !== "pending" && app.status.toLowerCase() !== "new"
            ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
            : "Reviewed",
        };
      });

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

      // Sync status directly to CMS stores in Neon PostgreSQL
      const syncCms = async (endpoint) => {
        try {
          const r = await fetch(endpoint);
          if (r.ok) {
            const list = await r.json();
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
                await fetch(endpoint, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ data: updated }),
                });
              }
            }
          }
        } catch { }
      };

      await Promise.allSettled([
        fetch(JOIN_TEAM_ENDPOINT, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: newStatus.toLowerCase() }),
        }),
        fetch(`${CAREERS_APP_ENDPOINT}/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }),
        syncCms(CMS_APPLICATIONS),
        syncCms(CMS_JOIN_TEAM),
      ]);
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const handleDeleteClick = (e, app) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setConfirmDelete({
      id: app.fullId || app.id || app._id,
      name: app.name || app.fullName || "this application",
    });
  };

  const handleDelete = (e, id, name) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const app = applicants.find((a) => a.fullId === id || a.id === id || a._id === id);
    const applicantName = name || (app ? app.name || app.fullName : "") || "this application";
    setConfirmDelete({
      id,
      name: applicantName,
    });
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
    setDeleting(true);
    try {
      // 1. Optimistic removal from state immediately
      setApplicants((prev) => prev.filter((a) => !allIds.includes(a.fullId) && !allIds.includes(a.id) && !allIds.includes(a._id)));
      if (selectedApplicant && allIds.some(i => selectedApplicant.fullId === i || selectedApplicant.id === i || selectedApplicant._id === i)) {
        setIsModalOpen(false);
      }

      // 2. Direct persistence delete from Neon PostgreSQL database
      const deleteFromCms = async (endpoint) => {
        try {
          const r = await fetch(endpoint);
          if (r.ok) {
            const list = await r.json();
            if (Array.isArray(list)) {
              const cleanIds = allIds.map(x => String(x).trim().toLowerCase());
              const filtered = list.filter((a) => {
                const aId = String(a.id || "").toLowerCase();
                const aUnderscoreId = String(a._id || "").toLowerCase();
                const aFullId = String(a.fullId || "").toLowerCase();
                return !cleanIds.includes(aId) && !cleanIds.includes(aUnderscoreId) && !cleanIds.includes(aFullId);
              });
              if (filtered.length !== list.length) {
                await fetch(endpoint, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ data: filtered }),
                });
              }
            }
          }
        } catch (e) {
          console.warn("CMS delete error:", e);
        }
      };

      const deleteCalls = [
        deleteFromCms(CMS_APPLICATIONS),
        deleteFromCms(CMS_JOIN_TEAM),
      ];

      for (const singleId of allIds) {
        deleteCalls.push(
          fetch(`${JOIN_TEAM_ENDPOINT}/${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${JOIN_TEAM_ENDPOINT}?id=${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${CAREERS_APP_ENDPOINT}/${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${CAREERS_APP_ENDPOINT}?id=${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${SITE_CAREERS_APP}?id=${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${SITE_JOIN_TEAM}?id=${encodeURIComponent(singleId)}`, { method: "DELETE" })
        );
      }

      await Promise.allSettled(deleteCalls);
    } catch (error) {
      console.error("Delete failed:", error);
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
    link.download = `bitc_career_applications_${new Date().toISOString().slice(0, 10)}.csv`;
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
      (a.phone && a.phone.toLowerCase().includes(search)) ||
      (a.id && a.id.toLowerCase().includes(search));

    const matchesStatus = statusFilter === "all" || (a.status && a.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200 min-h-screen">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-normal">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Career Applications</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-blue-50 text-blue-700 border border-blue-100">
                  {filtered.length} Applications
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Review submitted career profiles, subject specializations, and candidate resumes
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
            placeholder="Search by candidate name, email ID, contact number, or specialization..."
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
            <option value="contacted">Contacted</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewed">Interviewed</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
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
                <th className="px-6 py-5 whitespace-nowrap">Domain</th>
                <th className="px-6 py-5 text-center whitespace-nowrap">Resume</th>
                <th className="px-6 py-5 text-center whitespace-nowrap">Status</th>
                <th className="px-6 py-5 text-right">Action</th>
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

                    {/* Candidate Info */}
                    <td className="px-6 py-5 align-middle max-w-[200px]">
                      <p className="font-medium text-[#334155] text-[13px] truncate whitespace-normal">
                        {app.name}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1 mt-0.5">
                        <span className="truncate whitespace-normal">{app.email}</span>
                      </p>
                    </td>

                    {/* Phone Number */}
                    <td className="px-6 py-5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] text-[#334155] font-medium">
                          {app.phone || "—"}
                        </p>
                        {app.phone && (
                          <div onClick={(e) => e.stopPropagation()}>
                            <WhatsAppButton
                              phone={app.phone}
                              name={app.name}
                              message={`Hello ${app.name}, this is regarding your application for ${app.role || app.department || "the position"} at BITC (BIZONANCE Industrial Training Centre).`}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Applied Role & Course */}
                    <td className="px-6 py-5 align-middle min-w-[220px]">
                      <p className="text-[13px] text-[#475569] leading-snug mt-0.5 capitalize">
                        {app.department?.toLowerCase()}
                      </p>
                    </td>

                    {/* 🌟 SLEEK RESUME ACTION 🌟 */}
                    <td className="px-6 py-5 text-center align-middle">
                      {(app.resume || app.resumeUrl) ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); openResume(app.resume || app.resumeUrl, app.resumeFileName || `${app.name}_Resume.pdf`); }}
                            title="View / Inspect Resume (Opens in New Tab)"
                            className="p-1.5 text-slate-400 hover:text-[#F97316] transition-colors cursor-pointer"
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadResume(app.resume || app.resumeUrl, app.resumeFileName || `${app.name}_Resume.pdf`); }}
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
                        className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer appearance-none text-center ${app.status.toLowerCase() === 'pending' ? 'bg-[#FFF4D2] text-[#B8860B]' :
                            app.status.toLowerCase() === 'reviewed' ? 'bg-[#EAF3FE] text-[#294B7A]' :
                            app.status.toLowerCase() === 'contacted' ? 'bg-[#E0F2FE] text-[#0369A1]' :
                              ['shortlisted', 'interviewed', 'hired'].includes(app.status.toLowerCase()) ? 'bg-[#E0F8E9] text-[#2E8B57]' :
                                app.status.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-600' :
                                  'bg-slate-100 text-slate-600'
                          }`}
                        style={{ textAlignLast: "center" }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewed">Interviewed</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Details Action */}
                    <td className="px-6 py-5 text-right align-middle text-gray-500">
                      <button
                        onClick={(e) => handleDelete(e, app.fullId, app.name || app.fullName)}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-white rounded-t-2xl">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-xs font-black text-lg shrink-0">
                    {(selectedApplicant.name || "A").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* 1. Name */}
                    <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-tight truncate mb-1">
                      {selectedApplicant.name || "Unknown Applicant"}
                    </h3>

                    {/* 2. Tag (Between Name and Date + Time) */}
                    <div className="mb-1.5 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200/80 shrink-0">
                        {selectedApplicant.role || selectedApplicant.department || "Career Application"}
                      </span>
                    </div>

                    {/* 3. Date + Time */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
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
                          <option value="Contacted" className="bg-white text-slate-800">Contacted</option>
                          <option value="Shortlisted" className="bg-white text-slate-800">Shortlisted</option>
                          <option value="Interviewed" className="bg-white text-slate-800">Interviewed</option>
                          <option value="Hired" className="bg-white text-slate-800">Hired</option>
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
              <div className="p-6 overflow-y-auto space-y-5 bg-slate-50 flex-1 text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* Candidate Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <GraduationCap size={12} className="text-slate-400" /> Domain / Department
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.department || "—"}</p>
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
                            name={selectedApplicant.name}
                            message={`Hello ${selectedApplicant.name}, this is regarding your application for ${selectedApplicant.role || selectedApplicant.department || "the position"} at BITC (BIZONANCE Industrial Training Centre).`}
                            showLabel={false}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full border border-emerald-200/80 bg-emerald-50/50 transition-all shadow-2xs"
                          />
                        )}
                    </div>
                    {copiedField === "phone" && <span className="text-[10px] text-green-600 font-medium">Copied!</span>}
                  </div>

                  {selectedApplicant.experience && selectedApplicant.experience !== "Not specified" && (
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <Briefcase size={12} className="text-slate-400" /> Total Experience
                      </div>
                      <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.experience}</p>
                    </div>
                  )}

                  {selectedApplicant.qualification && selectedApplicant.qualification !== "Not specified" && (
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <GraduationCap size={12} className="text-slate-400" /> Degree / Qualification
                      </div>
                      <p className="text-slate-800 font-medium text-sm break-words">{selectedApplicant.qualification}</p>
                    </div>
                  )}

                  {selectedApplicant.dateToJoin && selectedApplicant.dateToJoin !== "Immediate" && (
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <Calendar size={12} className="text-slate-400" /> Date to Join / Availability
                      </div>
                      <p className="text-slate-800 font-medium text-sm break-words">
                        {selectedApplicant.dateToJoin}
                      </p>
                    </div>
                  )}

                  {/* LinkedIn Profile */}
                  {selectedApplicant.linkedin && (
                    <div className="col-span-1 sm:col-span-2">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <LinkIcon size={12} className="text-slate-400" /> LinkedIn Profile
                      </div>
                      <a
                        href={selectedApplicant.linkedin.startsWith("http") ? selectedApplicant.linkedin : `https://${selectedApplicant.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline font-medium text-sm break-all inline-flex items-center gap-1.5"
                      >
                        <span>{selectedApplicant.linkedin}</span>
                        <ExternalLink size={12} className="shrink-0" />
                      </a>
                    </div>
                  )}

                  {/* Resume / CV */}
                  <div className="col-span-1 sm:col-span-2">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <FileText size={12} className="text-slate-400" /> Attached Resume / CV
                    </div>
                    {selectedApplicant.resume ? (
                      <div className="flex items-center justify-between p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-2xs">
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
                      <p className="text-xs text-slate-400 italic bg-white p-3 rounded-xl border border-slate-200">No resume was attached with this application.</p>
                    )}
                  </div>

                  {/* Candidate Note / Philosophy */}
                  {selectedApplicant.message && (
                    <div className="col-span-1 sm:col-span-2">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <MessageSquare size={12} className="text-slate-400" /> Candidate Note / Philosophy
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
                  onClick={(e) => handleDelete(e, selectedApplicant.fullId, selectedApplicant.name || selectedApplicant.fullName)}
                  className="w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                  title="Delete Application"
                  aria-label="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Centered Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!confirmDelete}
        title="Remove Career Application"
        itemName={confirmDelete?.name}
        from="Career Applications"
        loading={deleting}
        onConfirm={confirmAndDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Applications;
