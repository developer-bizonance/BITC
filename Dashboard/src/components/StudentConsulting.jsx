"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  X,
  RefreshCw,
  Mail,
  Phone,
  User,
  Calendar,
  MessageSquare,
  Building,
  CheckCircle,
  Clock,
  Send,
  Download,
  Trash2,
  Eye,
  Tag,
  MapPin,
  ChevronDown,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl, getSiteUrl, useRecordHighlight } from "../utils";
import DeleteConfirmModal from "./uic/DeleteConfirmModal.jsx";
import { WhatsAppButton } from "./uic/WhatsAppButton";

const getStatusStyle = (status) => {
  const s = (status || "").toLowerCase().trim();
  if (s.includes("approv") || s.includes("hire") || s.includes("convert") || s.includes("schedul") || s.includes("resolv") || s.includes("shortlist")) {
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

const StudentConsulting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  const { highlightTarget, isHighlighted } = useRecordHighlight("Student Counseling");

  useEffect(() => {
    if (highlightTarget) {
      setStatusFilter("all");
      setSearchTerm("");
    }
  }, [highlightTarget]);

  // --- API CONFIGURATION ---
  // --- API CONFIGURATION ---
  const API_ENDPOINT = `${getApiUrl()}/inquiries`;
  const CMS_ENDPOINT = `${getApiUrl()}/cms/inquiries`;
  const SITE_ENDPOINT = `${getSiteUrl()}/api/inquiries`;

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const map = new Map();
      const addList = (items) => {
        if (!Array.isArray(items)) return;
        for (const item of items) {
          if (!item) continue;
          const key = (item.id || item._id || item.fullId || `${item.email}-${item.createdAt}`).toString().trim();
          if (key) {
            const existing = map.get(key) || {};
            const collegeVal = (item.college || item.school || item.collegeName || item.schoolCollege ||
                               existing.college || existing.school || existing.collegeName || existing.schoolCollege || "").trim();
            const cityVal = (item.city || existing.city || "").trim();
            map.set(key, {
              ...existing,
              ...item,
              college: collegeVal,
              school: collegeVal,
              collegeName: collegeVal,
              city: cityVal,
            });
          }
        }
      };

      // 1. Fetch from primary backend
      try {
        const response = await fetch(API_ENDPOINT);
        if (response.ok) {
          const data = await response.json();
          addList(data.inquiries || (Array.isArray(data) ? data : []));
        }
      } catch (err) {
        console.warn("Primary inquiries fetch notice:", err);
      }

      // 2. Fetch from CMS store
      try {
        const cmsRes = await fetch(CMS_ENDPOINT);
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          addList(Array.isArray(cmsData) ? cmsData : (cmsData.data || cmsData.inquiries || []));
        }
      } catch (cmsErr) {
        console.warn("CMS inquiries fetch notice:", cmsErr);
      }

      // 3. Fetch from website endpoint
      try {
        const siteRes = await fetch(SITE_ENDPOINT);
        if (siteRes.ok) {
          const siteData = await siteRes.json();
          addList(siteData.inquiries || (Array.isArray(siteData) ? siteData : []));
        }
      } catch (siteErr) {
        console.warn("Site inquiries fetch notice:", siteErr);
      }

      const rawList = Array.from(map.values()).sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      const formatted = rawList
        .filter(item => {
          const t = (item.enquiryType || "").toLowerCase().trim();
          return t === "student consulting" || t === "student counseling" || item.college || item.school || item.collegeName;
        })
        .map((item) => {
          const collegeVal = (item.college || item.school || item.collegeName || item.schoolCollege || "").trim();
          const cityVal = (item.city || "").trim();
          return {
            ...item,
            id: item.id || `INQ-${Math.floor(Math.random() * 1000)}`,
            fullId: item.id,
            college: collegeVal || "—",
            city: cityVal || "—",
            date: item.createdAt ? (() => {
              const d = new Date(item.createdAt);
              return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
            })() : "Recent",
            time: item.createdAt
              ? new Date(item.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
              : "",
            status: (item.status && item.status.toUpperCase() !== "PENDING" && item.status.toUpperCase() !== "NEW") ? item.status.toUpperCase() : "REVIEWED",
          };
        });

      setInquiries(formatted);
    } catch (err) {
      console.error("Student Consulting Fetch Error:", err);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, [API_ENDPOINT, CMS_ENDPOINT, SITE_ENDPOINT]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setInquiries((prev) =>
        prev.map((inq) => (inq.fullId === id ? { ...inq, status: newStatus } : inq))
      );
      if (selectedInquiry && selectedInquiry.fullId === id) {
        setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
      }

      await fetch(`${API_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      fetchInquiries();
    }
  };

  const handleDelete = (id, name) => {
    const inq = inquiries.find((i) => i.fullId === id || i.id === id);
    const inqName = name || (inq ? inq.name : "") || "this inquiry";
    setConfirmDelete({ id, name: inqName });
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    const { id } = confirmDelete;
    setDeleting(true);
    try {
      setInquiries((prev) => prev.filter((inq) => inq.fullId !== id && inq.id !== id));
      if (selectedInquiry && (selectedInquiry.fullId === id || selectedInquiry.id === id)) {
        setIsModalOpen(false);
        setSelectedInquiry(null);
      }

      // Sync direct delete to CMS store in Neon PostgreSQL
      const syncCms = (async () => {
        try {
          const cmsRes = await fetch(CMS_ENDPOINT);
          if (cmsRes.ok) {
            const list = await cmsRes.json();
            if (Array.isArray(list)) {
              const cleanId = String(id).trim().toLowerCase();
              const filtered = list.filter((a) => {
                const aId = String(a.id || "").trim().toLowerCase();
                const aUnderscoreId = String(a._id || "").trim().toLowerCase();
                const aFullId = String(a.fullId || "").trim().toLowerCase();
                return aId !== cleanId && aUnderscoreId !== cleanId && aFullId !== cleanId;
              });
              if (filtered.length !== list.length) {
                await fetch(CMS_ENDPOINT, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ data: filtered }),
                });
              }
            }
          }
        } catch (cmsErr) {
          console.warn("[StudentConsulting] CMS delete sync notice:", cmsErr);
        }
      })();

      await Promise.allSettled([
        syncCms,
        fetch(`${API_ENDPOINT}/${encodeURIComponent(id)}`, { method: "DELETE" }),
        fetch(`${API_ENDPOINT}?id=${encodeURIComponent(id)}`, { method: "DELETE" }),
        fetch(`${SITE_ENDPOINT}?id=${encodeURIComponent(id)}`, { method: "DELETE" }),
      ]);
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
      fetchInquiries();
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ["ID", "Name", "Email Id", "Contact Number", "School / College", "City", "Status", "Date"];
    const rows = inquiries.map((inq) => [
      `"${inq.fullId || inq.id}"`,
      `"${inq.name}"`,
      `"${inq.email}"`,
      `"${inq.phone}"`,
      `"${inq.college && inq.college !== "—" ? inq.college : ""}"`,
      `"${inq.city && inq.city !== "—" ? inq.city : ""}"`,
      `"${inq.status}"`,
      `"${inq.date}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BITC_Student_Counseling_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Logic
  const filteredInquiries = inquiries.filter((inq) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (inq.name && inq.name.toLowerCase().includes(term)) ||
      (inq.email && inq.email.toLowerCase().includes(term)) ||
      (inq.phone && inq.phone.toLowerCase().includes(term)) ||
      (inq.college && inq.college.toLowerCase().includes(term)) ||
      (inq.city && inq.city.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === "all" ||
      inq.status.toLowerCase() === statusFilter.toLowerCase() ||
      (statusFilter.toLowerCase() === "scheduled" && inq.status.toLowerCase() === "converted");

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "CONVERTED" || s === "SCHEDULED") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s === "CONTACTED") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200 min-h-screen">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-normal">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Student Counseling</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-purple-50 text-purple-700 border border-purple-100">
                  {inquiries.length} Inquiries
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage counseling requests from students
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={exportToCSV}
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
            placeholder="Search by name, email ID, contact number, or message..."
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
            <option value="scheduled">Scheduled</option>
            <option value="pending">Pending</option>
          </select>
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
            <ChevronDown size={15} className="text-[#A0AEC0]" />
          </div>
        </div>
      </div>

      {/* ── Inquiries Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EDF2FA] text-[#294B7A] text-[11px] uppercase tracking-[0.1em] font-bold border-b border-slate-200/60">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email Id</th>
                <th className="px-6 py-4">Contact Number</th>
                <th className="px-6 py-4">School / College</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Fetching contact inquiries...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold mb-1">No inquiries found</p>
                    <p className="text-xs">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr
                    key={inq.fullId}
                    onClick={() => {
                      const effectiveStatus = (!inq.status || inq.status.toUpperCase() === 'PENDING' || inq.status.toUpperCase() === 'NEW') ? 'REVIEWED' : inq.status;
                      setSelectedInquiry({ ...inq, status: effectiveStatus });
                      setIsModalOpen(true);
                    }}
                    className={`transition-all duration-700 cursor-pointer ${isHighlighted(inq)
                        ? "bg-slate-100/80 hover:bg-slate-100"
                        : "hover:bg-slate-50/80"
                      }`}
                    data-highlighted={isHighlighted(inq) ? "true" : undefined}
                  >
                    <td className="px-6 py-5 align-middle whitespace-nowrap">
                      <p className="font-medium text-[#64748B] text-[12px] flex items-center gap-1.5">
                        {inq.date}
                      </p>
                      {inq.time && (
                        <p className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1 mt-0.5">
                          {inq.time}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-5 align-middle max-w-[150px] whitespace-nowrap">
                      <p className="font-medium text-[#334155] text-[13px] truncate whitespace-nowrap" title={inq.name}>
                        {inq.name}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-middle max-w-[180px] whitespace-nowrap">
                      <p className="text-[12px] text-[#475569] font-medium flex items-center gap-1.5 truncate whitespace-nowrap" title={inq.email}>
                        <span className="truncate whitespace-nowrap">{inq.email}</span>
                      </p>
                    </td>

                    <td className="px-6 py-5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[12px] text-[#475569] font-medium flex items-center gap-1.5">
                          {inq.phone}
                        </p>
                        {inq.phone && (
                          <WhatsAppButton
                            phone={inq.phone}
                            name={inq.name}
                            message={`Hello ${inq.name}, this is regarding your student counseling inquiry at BITC (BIZONANCE Industrial Training Centre).`}
                            size="sm"
                          />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5 align-middle max-w-[170px] whitespace-nowrap">
                      <p className="font-medium text-[#334155] text-[12px] truncate whitespace-nowrap" title={inq.college}>
                        {inq.college && inq.college !== "—" ? inq.college : <span className="text-slate-300">—</span>}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-middle max-w-[130px] whitespace-nowrap">
                      <p className="font-medium text-[#334155] text-[12px] truncate whitespace-nowrap" title={inq.city}>
                        {inq.city && inq.city !== "—" ? inq.city : <span className="text-slate-300">—</span>}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-center align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${inq.status.toLowerCase() === 'pending' ? 'bg-[#FFF4D2] text-[#B8860B] border-yellow-200' :
                            inq.status.toLowerCase() === 'contacted' ? 'bg-[#EAF3FE] text-[#294B7A] border-blue-200' :
                              (inq.status.toLowerCase() === 'converted' || inq.status.toLowerCase() === 'scheduled') ? 'bg-[#E0F8E9] text-[#2E8B57] border-green-200' :
                                'bg-[#EAF3FE] text-[#294B7A] border-[#BFDBFE]'
                          }`}
                      >
                        {inq.status.toLowerCase() === 'pending' && <Clock className="w-3 h-3" />}
                        {inq.status.toLowerCase() === 'contacted' && <Eye className="w-3 h-3" />}
                        {(inq.status.toLowerCase() === 'converted' || inq.status.toLowerCase() === 'scheduled') && <Calendar className="w-3 h-3" />}
                        {inq.status.toLowerCase() === 'converted' ? 'Scheduled' : inq.status.charAt(0).toUpperCase() + inq.status.slice(1).toLowerCase()}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right align-middle">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(inq.fullId, inq.name); }}
                        className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                        title="Delete Inquiry"
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

      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {isModalOpen && selectedInquiry && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
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
                    {(selectedInquiry.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* 1. Name */}
                    <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-tight truncate mb-1">
                      {selectedInquiry.name || "Unknown Applicant"}
                    </h3>

                    {/* 2. Tag (Between Name and Date + Time) */}
                    <div className="mb-1.5 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200/80 shrink-0">
                        Student Counseling
                      </span>
                    </div>

                    {/* 3. Date + Time */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {selectedInquiry.date}
                      </span>
                      {selectedInquiry.time && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            {selectedInquiry.time}
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
                    const currentSt = (!selectedInquiry.status || selectedInquiry.status.toUpperCase() === 'PENDING' || selectedInquiry.status.toUpperCase() === 'NEW')
                      ? 'REVIEWED'
                      : selectedInquiry.status;
                    const st = getStatusStyle(currentSt);
                    return (
                      <div className="relative inline-flex items-center">
                        <select
                          value={currentSt}
                          onChange={(e) => handleStatusChange(selectedInquiry.fullId, e.target.value)}
                          className={`appearance-none flex items-center pl-3.5 pr-8 py-1.5 text-xs font-bold rounded-full border shadow-xs transition-all active:scale-95 cursor-pointer outline-none ${st.bg}`}
                        >
                          <option value="REVIEWED" className="bg-white text-slate-800">Reviewed</option>
                          <option value="CONTACTED" className="bg-white text-slate-800">Contacted</option>
                          <option value="SCHEDULED" className="bg-white text-slate-800">Scheduled</option>
                          <option value="PENDING" className="bg-white text-slate-800">Pending</option>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <GraduationCap size={12} className="text-slate-400" /> School / College
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">
                      {selectedInquiry.college && selectedInquiry.college !== "—" ? selectedInquiry.college : "—"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <MapPin size={12} className="text-slate-400" /> City
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">
                      {selectedInquiry.city && selectedInquiry.city !== "—" ? selectedInquiry.city : "—"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Mail size={12} className="text-slate-400" /> Email Id
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-all">{selectedInquiry.email || "—"}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Phone size={12} className="text-slate-400" /> Contact Number
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-slate-800 font-medium text-sm break-words">{selectedInquiry.phone || "—"}</p>
                      {selectedInquiry.phone &&
                        selectedInquiry.phone !== "—" &&
                        selectedInquiry.phone.replace(/\D/g, "").length >= 10 && (
                          <WhatsAppButton
                            phone={selectedInquiry.phone}
                            name={selectedInquiry.name}
                            message={`Hello ${selectedInquiry.name}, this is regarding your student counseling inquiry at BITC (BIZONANCE Industrial Training Centre).`}
                            showLabel={false}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full border border-emerald-200/80 bg-emerald-50/50 transition-all shadow-2xs"
                          />
                        )}
                    </div>
                  </div>

                  {selectedInquiry.message && (
                    <div className="col-span-1 sm:col-span-2">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                        <MessageSquare size={12} className="text-slate-400" /> Inquirer Message
                      </div>
                      <p className="text-sm text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed font-normal whitespace-pre-wrap break-words">
                        &quot;{selectedInquiry.message}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer: Delete Button Down */}
              <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex justify-end items-center rounded-b-2xl">
                <button
                  type="button"
                  onClick={(e) => handleDeleteClick(e, selectedInquiry.fullId, selectedInquiry.name)}
                  className="w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                  title="Delete Inquiry"
                  aria-label="Delete Inquiry"
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
        title="Remove Counseling Inquiry"
        itemName={confirmDelete?.name}
        from="Student Counseling"
        loading={deleting}
        onConfirm={confirmAndDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default StudentConsulting;
