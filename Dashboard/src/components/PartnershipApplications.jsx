"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  RefreshCw,
  Mail,
  Phone,
  Link as LinkIcon,
  ChevronDown,
  Copy,
  Calendar,
  Briefcase,
  Building,
  CheckCircle,
  User,
  GraduationCap,
  FileText,
  Download,
  Send,
  Handshake,
  Trash2,
  Clock,
  Eye,
  Check,
  ExternalLink,
  Globe,
  Tag,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl, getSiteUrl, useRecordHighlight, resolveImageUrl } from "../utils";
import { WhatsAppButton } from "./uic/WhatsAppButton";
import DeleteConfirmModal from "./uic/DeleteConfirmModal.jsx";

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

const PartnershipApplications = ({ activeSubTopic }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  const { highlightTarget, isHighlighted } = useRecordHighlight("Partnerships");

  useEffect(() => {
    if (highlightTarget) {
      setStatusFilter("all");
      setSearchTerm("");
    }
  }, [highlightTarget]);

  // Type filter based on activeSubTopic
  const expectedType = activeSubTopic === "educational-partnership" ? "educational" : "corporate";

  // --- API CONFIGURATION ---
  const API_ENDPOINT = `${getApiUrl()}/partnership-applications`;
  const CMS_ENDPOINT = `${getApiUrl()}/cms/partnership-applications`;
  const FALLBACK_ENDPOINT = `${getSiteUrl()}/api/partnership-applications`;

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const map = new Map();

      // 1. Fetch from Primary Backend endpoint
      try {
        const response = await fetch(API_ENDPOINT);
        if (response.ok) {
          const data = await response.json();
          const list = data.applications || (Array.isArray(data) ? data : []);
          for (const app of list) {
            const key = app.id || app._id || app.fullId;
            if (key) map.set(key, app);
          }
        }
      } catch (err) {
        console.warn("Primary partnership endpoint notice:", err);
      }

      // 2. Fetch from CMS store (direct Neon PostgreSQL CmsData)
      try {
        const cmsRes = await fetch(CMS_ENDPOINT);
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          const list = Array.isArray(cmsData) ? cmsData : (cmsData.data || cmsData.applications || []);
          for (const app of list) {
            const key = app.id || app._id || app.fullId;
            if (key) {
              if (map.has(key)) {
                map.set(key, { ...app, ...map.get(key) });
              } else {
                map.set(key, app);
              }
            }
          }
        }
      } catch (cmsErr) {
        console.warn("CMS partnership endpoint notice:", cmsErr);
      }

      // 3. Fetch from fallback Next.js website endpoint
      try {
        const fbRes = await fetch(FALLBACK_ENDPOINT);
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          const list = fbData.applications || (Array.isArray(fbData) ? fbData : []);
          for (const app of list) {
            const key = app.id || app._id || app.fullId;
            if (key && !map.has(key)) map.set(key, app);
          }
        }
      } catch (fbErr) {
        console.warn("Fallback partnership endpoint notice:", fbErr);
      }

      const apps = Array.from(map.values()).sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      const formatted = apps.map((app) => ({
        ...app,
        id: app.id || `APP-${Math.floor(Math.random() * 1000)}`,
        fullId: app.id || app._id,
        date: app.createdAt
          ? (() => {
            const d = new Date(app.createdAt);
            return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${d.getFullYear()}`;
          })()
          : "Recent",
        time: app.createdAt
          ? new Date(app.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
          : "",
        status: app.status && app.status.toLowerCase() !== "pending" && app.status.toLowerCase() !== "new"
          ? app.status.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
          : "Reviewed",
        name: app.contactPerson || app.name || "Unknown",
        email: app.email || "",
        phone: app.phone || "",
        organizationName: app.organizationName || "",
        website: app.website || "",
        designation: app.designation || "",
        partnershipType: app.partnershipType || "",
        mouFile: app.mouFile || app.mou || "",
        mouFileName: app.mouFileName || "",
        mouFileSize: app.mouFileSize || "",
        type: app.type || "corporate",
      }));

      setApplicants(formatted);
    } catch (err) {
      console.error("Fetch Error:", err);
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
      setApplicants((prev) =>
        prev.map((a) => (a.fullId === id || a.id === id ? { ...a, status: newStatus } : a))
      );
      if (selectedApplicant && (selectedApplicant.fullId === id || selectedApplicant.id === id)) {
        setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
      }

      // Sync status change directly to Neon PostgreSQL database via CMS store
      const syncCmsPromise = (async () => {
        try {
          const cmsRes = await fetch(CMS_ENDPOINT);
          if (cmsRes.ok) {
            const list = await cmsRes.json();
            if (Array.isArray(list)) {
              let modified = false;
              const cleanId = String(id).trim().toLowerCase();
              const updated = list.map((a) => {
                const aId = String(a.id || "").trim().toLowerCase();
                const aUnderscoreId = String(a._id || "").trim().toLowerCase();
                const aFullId = String(a.fullId || "").trim().toLowerCase();
                if (aId === cleanId || aUnderscoreId === cleanId || aFullId === cleanId) {
                  modified = true;
                  return { ...a, status: newStatus };
                }
                return a;
              });
              if (modified) {
                await fetch(CMS_ENDPOINT, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ data: updated }),
                });
              }
            }
          }
        } catch (cmsErr) {
          console.warn("[PartnershipApplications] CMS status sync notice:", cmsErr);
        }
      })();

      await Promise.allSettled([
        syncCmsPromise,
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
      ]);
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const handleDeleteClick = (e, app) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setConfirmDelete({
      id: app.fullId || app.id,
      name: app.organizationName || app.name || "this partnership request",
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
    const targetEmail = targetApp?.email ? String(targetApp.email).trim().toLowerCase() : "";
    const targetOrg = targetApp?.organizationName ? String(targetApp.organizationName).trim().toLowerCase() : "";

    setDeleting(true);
    try {
      // 1. Optimistically remove from state immediately
      setApplicants((prev) => prev.filter((app) => {
        const matchId = allIds.includes(app.fullId) || allIds.includes(app.id) || allIds.includes(app._id);
        const matchEmail = targetEmail && String(app.email || "").trim().toLowerCase() === targetEmail;
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

      // 2. Direct persistence delete from Neon PostgreSQL database via CMS endpoint
      const syncCmsPromise = (async () => {
        try {
          const cmsRes = await fetch(CMS_ENDPOINT);
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
                if (cleanIds.includes(aId) || cleanIds.includes(aUnderscoreId) || cleanIds.includes(aFullId)) {
                  return false;
                }
                if (targetEmail && aEmail === targetEmail) {
                  return false;
                }
                return true;
              });
              if (filtered.length !== arr.length) {
                await fetch(CMS_ENDPOINT, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ data: filtered }),
                });
              }
            }
          }
        } catch (cmsErr) {
          console.warn("[PartnershipApplications] CMS delete sync notice:", cmsErr);
        }
      })();

      // 3. Parallel calls to standard REST endpoints & POST fallback
      const deleteCalls = [
        syncCmsPromise,
        fetch(`${API_ENDPOINT}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: allIds, email: targetEmail, organizationName: targetOrg }),
        }),
        fetch(`${FALLBACK_ENDPOINT}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: allIds, email: targetEmail }),
        }),
      ];

      for (const singleId of allIds) {
        deleteCalls.push(
          fetch(`${API_ENDPOINT}/${encodeURIComponent(singleId)}`, { method: "DELETE" }),
          fetch(`${API_ENDPOINT}?id=${encodeURIComponent(singleId)}`, { method: "DELETE" }),
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

  const handleExportCSV = () => {
    if (applicants.length === 0) return;

    const headers = [
      "ID",
      "Organization",
      "Contact Person",
      "Email Id",
      "Contact Number",
      "Website",
      "Designation",
      "Type",
      "Partnership Type",
      "Message",
      "Status",
      "Date Applied",
    ];

    const rows = filtered.map((app) => [
      `"${(app.id || "").replace(/"/g, '""')}"`,
      `"${(app.organizationName || "").replace(/"/g, '""')}"`,
      `"${(app.name || "").replace(/"/g, '""')}"`,
      `"${(app.email || "").replace(/"/g, '""')}"`,
      `"${(app.phone || "").replace(/"/g, '""')}"`,
      `"${(app.website || "").replace(/"/g, '""')}"`,
      `"${(app.designation || "").replace(/"/g, '""')}"`,
      `"${(app.type || "").replace(/"/g, '""')}"`,
      `"${(app.partnershipType || "").replace(/"/g, '""')}"`,
      `"${(app.message || "").replace(/"/g, '""')}"`,
      `"${(app.status || "").replace(/"/g, '""')}"`,
      `"${(app.date || "").replace(/"/g, '""')}"`,
    ]);

    const csvString = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bitc_partnership_applications_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filtered = applicants.filter((app) => {
    if (app.type !== expectedType) return false;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      app.organizationName?.toLowerCase().includes(term) ||
      app.name?.toLowerCase().includes(term) ||
      app.email?.toLowerCase().includes(term) ||
      app.phone?.toLowerCase().includes(term) ||
      app.partnershipType?.toLowerCase().includes(term) ||
      app.id?.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "all" ||
      (app.status && app.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200 min-h-screen">
      {/* Centered Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!confirmDelete}
        title="Remove Partnership Request"
        itemName={confirmDelete?.name}
        from="Partnership Requests"
        loading={deleting}
        onConfirm={confirmAndDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-normal">
              {expectedType === "educational" ? (
                <GraduationCap className="w-4 h-4" />
              ) : (
                <Briefcase className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 capitalize">
                  {expectedType} Partnership Requests
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-blue-50 text-blue-700 border border-blue-100">
                  {filtered.length} Requests
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Review submitted partnership requests
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {expectedType === "corporate" && (
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("bitc:navigate", {
                    detail: { tab: "Partnerships", subTopic: "industrial-partners" },
                  })
                );
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Building className="w-3.5 h-3.5 text-blue-700" /> Manage
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" /> Export Data
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
            placeholder="Search by organization, contact person, email ID, contact number, or ID..."
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
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
            <ChevronDown size={15} className="text-[#A0AEC0]" />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="bg-[#EDF2FA] text-[#294B7A] text-[11px] uppercase tracking-[0.1em] font-bold border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Organization</th>
                <th className="px-6 py-4 whitespace-nowrap">Contact Person</th>
                <th className="px-6 py-4 whitespace-nowrap">Contact Number</th>
                <th className="px-6 py-4 whitespace-nowrap">Uploaded MoU</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Fetching requests...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No requests found.
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
                    {/* Date */}
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

                    {/* Organization */}
                    <td className="px-6 py-5 align-middle max-w-[200px] whitespace-nowrap">
                      <p
                        className="font-medium text-[#334155] text-[13px] truncate whitespace-nowrap"
                        title={app.organizationName || "Unknown Organization"}
                      >
                        {app.organizationName || "Unknown Organization"}
                      </p>
                    </td>

                    {/* Contact Person */}
                    <td className="px-6 py-5 align-middle max-w-[180px] whitespace-nowrap">
                      <p className="font-medium text-[#334155] text-[13px] truncate whitespace-nowrap" title={app.name}>
                        {app.name}
                      </p>
                      {app.email && (
                        <p className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1.5 mt-0.5 truncate whitespace-nowrap" title={app.email}>
                          <Mail size={10} className="shrink-0" />
                          <span className="truncate whitespace-nowrap">{app.email}</span>
                        </p>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[12px] text-[#475569] font-medium">
                          {app.phone || "—"}
                        </p>
                        {app.phone && app.phone !== "—" && (
                          <WhatsAppButton
                            phone={app.phone}
                            name={app.name}
                            message={`Hello ${app.name}, this is regarding your partnership proposal with BITC (BIZONANCE Industrial Training Centre).`}
                            size="sm"
                          />
                        )}
                      </div>
                    </td>

                    {/* Uploaded MoU Document */}
                    <td className="px-6 py-5 align-middle max-w-[220px] whitespace-nowrap">
                      {app.mouFile ? (
                        <a
                          href={app.mouFile.startsWith('data:') ? app.mouFile : resolveImageUrl(app.mouFile)}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={app.mouFileName || "MoU-Document"}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-full font-medium text-xs transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                          onClick={(e) => e.stopPropagation()}
                          title="View / Download Uploaded MoU"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-600" />
                          <span>View MoU</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 font-medium text-xs">—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-5 text-center align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${app.status.toLowerCase() === "reviewed"
                          ? "bg-[#EAF3FE] text-[#294B7A] border-blue-200"
                          : app.status.toLowerCase() === "approved"
                            ? "bg-[#E0F8E9] text-[#2E8B57] border-green-200"
                            : app.status.toLowerCase() === "contacted"
                              ? "bg-[#EAF3FE] text-[#294B7A] border-blue-200"
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
                              : app.status.toLowerCase() === "contacted"
                                ? "bg-[#294B7A]"
                                : app.status.toLowerCase() === "rejected"
                                  ? "bg-red-600"
                                  : "bg-[#B8860B]"
                            }`}
                        />
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-right align-middle">
                      <button
                        onClick={(e) => handleDeleteClick(e, app)}
                        className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                        title="Delete Request"
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

      {/* ── MODAL ── */}
      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {isModalOpen && selectedApplicant && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100"
            >
              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-white rounded-t-2xl">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-xs font-black text-lg shrink-0">
                    {(selectedApplicant.organizationName || selectedApplicant.institutionName || selectedApplicant.name || "P")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* 1. Name */}
                    <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-tight truncate mb-1">
                      {selectedApplicant.organizationName || selectedApplicant.institutionName || selectedApplicant.name || "Unknown Organization"}
                    </h3>

                    {/* 2. Tag (Between Name and Date + Time) */}
                    <div className="mb-1.5 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200/80 shrink-0">
                        {selectedApplicant.type === "educational"
                          ? "Educational Partnership"
                          : selectedApplicant.partnershipType || "Industrial Partnership"}
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
                  {/* Status Dropdown - Pending moved to last */}
                  {(() => {
                    const currentSt = (!selectedApplicant.status || selectedApplicant.status.toLowerCase() === 'pending' || selectedApplicant.status.toLowerCase() === 'new')
                      ? 'Reviewed'
                      : selectedApplicant.status;
                    const st = getStatusStyle(currentSt);
                    return (
                      <div className="relative inline-flex items-center">
                        <select
                          value={currentSt}
                          onChange={(e) =>
                            handleStatusChange(selectedApplicant.fullId, e.target.value)
                          }
                          className={`appearance-none flex items-center pl-3.5 pr-8 py-1.5 text-xs font-bold rounded-full border shadow-xs transition-all active:scale-95 cursor-pointer outline-none ${st.bg}`}
                        >
                          <option value="Reviewed" className="bg-white text-slate-800">Reviewed</option>
                          <option value="Contacted" className="bg-white text-slate-800">Contacted</option>
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

              {/* Modal Body / Form Section */}
              <div className="p-6 overflow-y-auto bg-slate-50 flex-1 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Contact Person Name */}
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <User size={12} className="text-slate-400" /> Contact Person Name
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">
                      {selectedApplicant.name || "—"}
                    </p>
                  </div>

                  {/* Designation */}
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Briefcase size={12} className="text-slate-400" /> Designation
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">
                      {selectedApplicant.designation || "—"}
                    </p>
                  </div>

                  {/* Email Id */}
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Mail size={12} className="text-slate-400" /> Email Id
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-all">
                      {selectedApplicant.email || "—"}
                    </p>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Phone size={12} className="text-slate-400" /> Contact Number
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-slate-800 font-medium text-sm break-words">
                        {selectedApplicant.phone || "—"}
                      </p>
                      {selectedApplicant.phone &&
                        selectedApplicant.phone !== "—" &&
                        selectedApplicant.phone.replace(/\D/g, "").length >= 10 && (
                          <WhatsAppButton
                            phone={selectedApplicant.phone}
                            name={selectedApplicant.name}
                            message={`Hello ${selectedApplicant.name}, this is regarding your partnership proposal with BITC (BIZONANCE Industrial Training Centre).`}
                            showLabel={false}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full border border-emerald-200/80 bg-emerald-50/50 transition-all shadow-2xs"
                          />
                        )}
                    </div>
                  </div>

                  {/* Website URL */}
                  <div className="col-span-1 sm:col-span-2">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Globe size={12} className="text-slate-400" /> Website URL
                    </div>
                    {selectedApplicant.website ? (
                      <a
                        href={
                          selectedApplicant.website.startsWith("http")
                            ? selectedApplicant.website
                            : `https://${selectedApplicant.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline font-medium text-sm break-all inline-flex items-center gap-1.5"
                      >
                        <span>{selectedApplicant.website}</span>
                        <ExternalLink size={12} className="shrink-0" />
                      </a>
                    ) : (
                      <p className="text-slate-500 text-sm italic">Not provided</p>
                    )}
                  </div>

                  {/* Uploaded MoU Document */}
                  <div className="col-span-1 sm:col-span-2">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <FileText size={12} className="text-slate-400" /> Uploaded MoU Document
                    </div>
                    {selectedApplicant.mouFile ? (
                      <div className="flex items-center gap-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {selectedApplicant.mouFileName || "MoU Collaboration Document"}
                          </p>
                          <p className="text-[10px] text-slate-500">Document attached by applicant</p>
                        </div>
                        <a
                          href={selectedApplicant.mouFile.startsWith('data:') ? selectedApplicant.mouFile : resolveImageUrl(selectedApplicant.mouFile)}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={selectedApplicant.mouFileName || "MoU-Document"}
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-semibold shadow-xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View / Download</span>
                        </a>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs italic">No document attached.</p>
                    )}
                  </div>

                  {/* Inquirer Message */}
                  {selectedApplicant.message && (
                    <div className="col-span-1 sm:col-span-2">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <MessageSquare size={12} className="text-slate-400" /> Inquirer Message
                      </div>
                      <p className="text-sm text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed font-normal whitespace-pre-wrap break-words">
                        &quot;{selectedApplicant.message}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer: Delete Button Down */}
              <div className="px-6 py-3 border-t border-slate-100 bg-white flex justify-end items-center rounded-b-2xl">
                <button
                  type="button"
                  onClick={(e) => handleDeleteClick(e, selectedApplicant)}
                  className="w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                  title="Delete Request"
                  aria-label="Delete Request"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PartnershipApplications;
