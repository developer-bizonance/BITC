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
  ChevronDown
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

const StudentConsulting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- API CONFIGURATION ---
  const API_ENDPOINT = `${getApiUrl()}/inquiries`;

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch inquiries");
      const data = await response.json();

      const list = data.inquiries || (Array.isArray(data) ? data : []);
      const formatted = list
        .filter(item => item.enquiryType === "Student Consulting")
        .map((item) => ({
          ...item,
          id: item.id || `INQ-${Math.floor(Math.random() * 1000)}`,
          fullId: item.id,
          date: item.createdAt ? (() => {
            const d = new Date(item.createdAt);
            return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
          })() : "Recent",
          time: item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
            : "",
          status: item.status ? item.status.toUpperCase() : "PENDING",
          courseName: item.course?.title || item.courseName || item.enquiryType || "General Inquiry",
        }));

      setInquiries(formatted);
    } catch (err) {
      console.error("Inquiries Fetch Error:", err);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, [API_ENDPOINT]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      setInquiries((prev) => prev.filter((inq) => inq.fullId !== id));
      if (selectedInquiry && selectedInquiry.fullId === id) {
        setIsModalOpen(false);
        setSelectedInquiry(null);
      }

      await fetch(`${API_ENDPOINT}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
      fetchInquiries();
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Status", "Date"];
    const rows = inquiries.map((inq) => [
      `"${inq.fullId || inq.id}"`,
      `"${inq.name}"`,
      `"${inq.email}"`,
      `"${inq.phone}"`,
      `"${inq.status}"`,
      `"${inq.date}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BITC_Student_Consulting_${new Date().toISOString().slice(0, 10)}.csv`);
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
      (inq.phone && inq.phone.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === "all" || inq.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "CONVERTED") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s === "CONTACTED") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      
      {/* ── Page Header ── */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent p-2">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#9333EA]">
              <MessageSquare size={24} fill="currentColor" stroke="none" />
            </div>
            <div>
              <h1 className="text-xl md:text-[22px] font-bold text-[#1E293B] tracking-tight">Student Consulting</h1>
              <p className="text-[#64748B] text-sm mt-0.5 font-medium">
                Manage consultation requests from students
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={exportToCSV}
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
            placeholder="Search by name, email, phone, or message..."
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
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
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
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Fetching contact inquiries...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold mb-1">No inquiries found</p>
                    <p className="text-xs">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.fullId} onClick={() => { setSelectedInquiry(inq); setIsModalOpen(true); }} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
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
                      <p className="text-[12px] text-[#475569] font-medium flex items-center gap-1.5">
                        {inq.phone}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-center align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${
                          inq.status.toLowerCase() === 'pending' ? 'bg-[#FFF4D2] text-[#B8860B] border-yellow-200' :
                          inq.status.toLowerCase() === 'contacted' ? 'bg-[#EAF3FE] text-[#294B7A] border-blue-200' :
                          inq.status.toLowerCase() === 'converted' ? 'bg-[#E0F8E9] text-[#2E8B57] border-green-200' :
                          'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {inq.status.toLowerCase() === 'pending' && <Clock className="w-3 h-3" />}
                        {inq.status.toLowerCase() === 'contacted' && <Eye className="w-3 h-3" />}
                        {inq.status.toLowerCase() === 'converted' && <CheckCircle className="w-3 h-3" />}
                        {inq.status.charAt(0).toUpperCase() + inq.status.slice(1).toLowerCase()}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right align-middle">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(inq.fullId); }}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer inline-flex"
                        title="Delete Inquiry"
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
              <div className="flex justify-between items-start px-6 py-5 border-b border-slate-100 bg-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shadow-inner font-bold text-xl">
                    {(selectedInquiry.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-0.5">
                      {selectedInquiry.name || "Unknown Applicant"}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      STUDENT CONSULTING
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
                      <Mail size={12} className="text-slate-400" /> Email Address
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-sm break-all">{selectedInquiry.email}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Phone size={12} className="text-slate-400" /> Phone Number
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-sm break-words">{selectedInquiry.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 capitalize text-[10px] font-semibold tracking-wider">
                      <Calendar size={12} className="text-slate-400" /> Date
                    </div>
                    <p className="text-slate-800 font-medium text-sm break-words">
                      {selectedInquiry.date}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer / Quick Reply Actions */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-normal">
                  Click to reply directly to {selectedInquiry.name}
                </span>

                <div className="flex items-center gap-2">
                  {/* Update Status Button */}
                  {(() => {
                    const st = getStatusStyle(selectedInquiry.status);
                    return (
                      <div className="relative inline-flex items-center">
                        <select
                          value={selectedInquiry.status}
                          onChange={(e) => handleStatusChange(selectedInquiry.fullId, e.target.value)}
                          className={`appearance-none flex items-center pl-3.5 pr-8 py-2 text-xs font-bold rounded-3xl border shadow-xs transition-all active:scale-95 cursor-pointer outline-none ${st.bg}`}
                        >
                          <option value="PENDING" className="bg-white text-slate-800">Pending</option>
                          <option value="CONTACTED" className="bg-white text-slate-800">Contacted</option>
                          <option value="CONVERTED" className="bg-white text-slate-800">Converted</option>
                        </select>
                        <ChevronDown size={14} className={`absolute right-2.5 pointer-events-none transition-colors ${st.chevron}`} />
                      </div>
                    );
                  })()}
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium rounded-3xl shadow-xs transition-all active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    Call
                  </a>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedInquiry.email}&su=Response%20from%20BITC%20Amravati&body=Dear%20${encodeURIComponent(selectedInquiry.name)}%2C%0A%0AThank%20you%20for%20reaching%20out%20to%20BITC%20regarding%20${encodeURIComponent('Student Consulting')}.%0A%0ABest%20regards%2C%0ABITC%20Admissions%20Team`}
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

export default StudentConsulting;
