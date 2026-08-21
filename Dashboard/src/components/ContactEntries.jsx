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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ContactEntries = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- API CONFIGURATION ---
  const API_ENDPOINT = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/inquiries`;

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch inquiries");
      const data = await response.json();

      const list = data.inquiries || (Array.isArray(data) ? data : []);
      const formatted = list.map((item) => ({
        ...item,
        id: item.id || `INQ-${Math.floor(Math.random() * 1000)}`,
        fullId: item.id,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN") : "Recent",
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
    const headers = ["ID", "Name", "Email", "Phone", "City", "Course/Type", "Status", "Date", "Message"];
    const rows = inquiries.map((inq) => [
      `"${inq.fullId || inq.id}"`,
      `"${inq.name}"`,
      `"${inq.email}"`,
      `"${inq.phone}"`,
      `"${inq.city || ''}"`,
      `"${inq.courseName}"`,
      `"${inq.status}"`,
      `"${inq.date}"`,
      `"${(inq.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BITC_Contact_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
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
      (inq.city && inq.city.toLowerCase().includes(term)) ||
      (inq.courseName && inq.courseName.toLowerCase().includes(term)) ||
      (inq.message && inq.message.toLowerCase().includes(term));

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
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Contact Inquiries</h1>
            <p className="text-slate-500 text-xs mt-0.5">Manage messages & leads received from the contact form</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
            <span>Total:</span>
            <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-blue-600">
              {inquiries.length}
            </span>
          </div>
          <button
            onClick={fetchInquiries}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer"
            title="Refresh Inquiries"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-blue-600" : ""} />
          </button>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Inquiry Statuses</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {/* ── INQUIRIES TABLE ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Inquirer</th>
                <th className="px-6 py-4">Course / Subject</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
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
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No inquiries found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.fullId} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Inquirer details */}
                    <td className="px-6 py-4 align-middle">
                      <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {inq.name}
                      </p>
                      <p className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Mail size={12} className="text-slate-400 shrink-0" /> {inq.email}
                      </p>
                      <p className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Phone size={12} className="text-slate-400 shrink-0" /> {inq.phone}
                      </p>
                      {inq.city && (
                        <p className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                          <MapPin size={10} className="shrink-0" /> {inq.city}
                        </p>
                      )}
                    </td>

                    {/* Course Name */}
                    <td className="px-6 py-4 align-middle min-w-[180px]">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-100">
                        <Tag size={12} /> {inq.courseName}
                      </span>
                    </td>

                    {/* Message Preview */}
                    <td className="px-6 py-4 align-middle max-w-[280px]">
                      <p className="text-slate-700 line-clamp-2 leading-relaxed">
                        {inq.message || "—"}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <p className="font-semibold text-slate-700">{inq.date}</p>
                      {inq.time && <p className="text-[10px] text-slate-400">{inq.time}</p>}
                    </td>

                    {/* Status Select */}
                    <td className="px-6 py-4 align-middle">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.fullId, e.target.value)}
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${getStatusBadge(
                          inq.status
                        )}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CONVERTED">CONVERTED</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Full Message"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(inq.fullId)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Inquiry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-slate-100"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{selectedInquiry.name}</h3>
                    <p className="text-xs text-slate-500">Contact Form Inquiry</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Mail size={12} className="text-blue-500" /> Email Address
                    </p>
                    <p className="text-slate-900 font-semibold">{selectedInquiry.email}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Phone size={12} className="text-blue-500" /> Phone Number
                    </p>
                    <p className="text-slate-900 font-semibold">{selectedInquiry.phone}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Tag size={12} className="text-blue-500" /> Topic / Course
                  </p>
                  <p className="text-slate-900 font-bold">{selectedInquiry.courseName}</p>
                </div>

                {selectedInquiry.city && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin size={12} className="text-blue-500" /> Location / City
                    </p>
                    <p className="text-slate-900 font-semibold">{selectedInquiry.city}</p>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MessageSquare size={12} className="text-blue-500" /> Inquirer Message
                  </p>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-medium">
                    &quot;{selectedInquiry.message || "No message provided."}&quot;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Update Status</p>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => handleStatusChange(selectedInquiry.fullId, e.target.value)}
                      className="bg-white border border-slate-300 text-blue-600 text-xs font-bold py-1.5 px-3 rounded-xl outline-none cursor-pointer"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="CONVERTED">CONVERTED</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">Date: {selectedInquiry.date}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call
                </a>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Response from BITC Amravati&body=Dear ${encodeURIComponent(
                    selectedInquiry.name
                  )},\n\nThank you for reaching out to BITC regarding ${encodeURIComponent(
                    selectedInquiry.courseName
                  )}.\n\nBest regards,\nBITC Admissions Team`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Reply via Email
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactEntries;
