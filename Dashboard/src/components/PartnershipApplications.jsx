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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PartnershipApplications = ({ activeSubTopic }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  // Type filter based on activeSubTopic
  const expectedType = activeSubTopic === "educational-partnership" ? "educational" : "corporate";

  // --- API CONFIGURATION ---
  const API_ENDPOINT = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/partnership-applications`;

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error("Connection failed");
      const data = await response.json();

      const apps = data.applications || [];
      const formatted = apps.map((app) => ({
        ...app,
        id: app.id || `APP-${Math.floor(Math.random() * 1000)}`,
        fullId: app.id,
        date: app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-IN") : "Recent",
        status: app.status || "Pending",
        name: app.contactPerson || "Unknown",
        email: app.email || "",
        phone: app.phone || "",
        organizationName: app.organizationName || "",
        website: app.website || "",
        designation: app.designation || "",
        partnershipType: app.partnershipType || "",
        type: app.type || "corporate"
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
      setApplicants((prev) => prev.map((a) => (a.fullId === id ? { ...a, status: newStatus } : a)));
      if (selectedApplicant && selectedApplicant.fullId === id) {
        setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
      }

      await fetch(`${API_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
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

  const handleExportCSV = () => {
    if (applicants.length === 0) return;

    const headers = [
      "ID",
      "Organization",
      "Contact Person",
      "Email",
      "Phone",
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
      (app.organizationName?.toLowerCase().includes(term) ||
        app.name?.toLowerCase().includes(term) ||
        app.email?.toLowerCase().includes(term) ||
        app.id?.toLowerCase().includes(term));

    const matchesStatus = statusFilter === "all" || (app.status && app.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900 antialiased">
      
      {/* ── Page Header ── */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
              {expectedType === "educational" ? <GraduationCap className="w-6 h-6 text-blue-600" /> : <Briefcase className="w-6 h-6 text-blue-600" />}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight capitalize">{expectedType} Partnership Requests</h1>
              <p className="text-xs font-semibold text-slate-500">
                Review submitted partnership requests
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <span>Total Requests:</span>
            <span className="text-blue-600 font-black text-sm bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
              {filtered.length}
            </span>
          </div>
          <button
            onClick={fetchApplicants}
            title="Refresh"
            className="p-2.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all shadow-xs hover:shadow text-slate-600 cursor-pointer"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-blue-500" : ""} />
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
            placeholder="Search by organization, contact person, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all text-sm text-slate-800 placeholder:text-slate-400 shadow-xs font-medium"
          />
        </div>

        <div className="relative w-full sm:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-2xl py-2.5 pl-4 pr-10 outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 text-sm text-slate-700 cursor-pointer font-bold shadow-xs"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="contacted">Contacted</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
            <ChevronDown size={15} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Partnership Type</th>
                <th className="px-6 py-4 text-center">Applied Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-500 font-normal">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Fetching requests...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-500 font-normal">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.fullId} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4 align-middle">
                      <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                        {app.organizationName}
                      </p>
                      {app.website && (
                        <p className="text-xs text-blue-500 font-normal flex items-center gap-1 mt-0.5">
                          <LinkIcon size={10} />
                          <a href={app.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Website</a>
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <p className="font-semibold text-slate-700">{app.name}</p>
                      <p className="text-[11px] text-slate-500">{app.designation}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <Mail size={12} /> {app.email}
                      </p>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold">
                        {app.partnershipType}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center align-middle text-xs font-medium text-slate-700">
                      {app.date}
                    </td>

                    <td className="px-6 py-4 text-center align-middle">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.fullId, e.target.value)}
                        className="bg-transparent text-xs font-medium text-slate-700 hover:text-slate-900 border-b border-slate-300 hover:border-blue-500 py-0.5 px-1 outline-none cursor-pointer transition-colors"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-right align-middle">
                      <button
                        onClick={() => {
                          setSelectedApplicant(app);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-xs hover:underline cursor-pointer"
                      >
                        View Details
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
      <AnimatePresence>
        {isModalOpen && selectedApplicant && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-100"
            >
              <div className="p-6 flex justify-between items-start bg-gradient-to-r from-blue-900 via-slate-800 to-slate-900 text-white">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center font-black text-xl border border-blue-500/30">
                    {selectedApplicant.organizationName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">{selectedApplicant.organizationName}</h2>
                    <p className="text-xs text-blue-400 font-bold uppercase mt-0.5">
                      {selectedApplicant.type} Partnership
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

              <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-slate-50/40 text-sm flex-1">
                
                <div className="p-4 bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl">
                  <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Handshake size={15} className="text-blue-600" /> Partnership Type
                  </p>
                  <p className="text-base font-black text-slate-900">{selectedApplicant.partnershipType}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                     <div className="flex items-center gap-1.5 text-slate-500 mb-1 uppercase text-[10px] font-semibold">
                      <User size={12} /> Contact Person
                    </div>
                    <p className="text-slate-800 font-medium">{selectedApplicant.name} - {selectedApplicant.designation}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 uppercase text-[10px] font-semibold">
                      <Mail size={12} /> Email
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-xs truncate">{selectedApplicant.email}</p>
                      <button onClick={() => copyToClipboard(selectedApplicant.email, "email")} className="text-slate-400 hover:text-blue-600"><Copy size={12} /></button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 uppercase text-[10px] font-semibold">
                      <Phone size={12} /> Phone
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800 font-medium text-xs truncate">{selectedApplicant.phone}</p>
                      <button onClick={() => copyToClipboard(selectedApplicant.phone, "phone")} className="text-slate-400 hover:text-blue-600"><Copy size={12} /></button>
                    </div>
                  </div>

                  {selectedApplicant.website && (
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 uppercase text-[10px] font-semibold">
                        <LinkIcon size={12} /> Website
                      </div>
                      <a href={selectedApplicant.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{selectedApplicant.website}</a>
                    </div>
                  )}

                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 uppercase text-[10px] font-semibold">
                      <FileText size={12} /> Message
                    </div>
                    <p className="text-slate-800 font-medium bg-white p-3 rounded-xl border border-slate-200">{selectedApplicant.message || "No message provided."}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-1"><Calendar size={12} className="text-blue-500" /> Applied On</p>
                    <p className="text-slate-800 font-semibold">{selectedApplicant.date}</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> Status</p>
                    <p className="text-slate-800 font-semibold capitalize">{selectedApplicant.status}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Update Status</p>
                    <select
                      value={selectedApplicant.status}
                      onChange={(e) => handleStatusChange(selectedApplicant.fullId, e.target.value)}
                      className="bg-white border border-slate-300 text-blue-600 text-xs font-bold py-2 px-3 rounded-xl outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex justify-end gap-2">
                  <a
                    href={`tel:${selectedApplicant.phone}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call
                  </a>
                  <a
                    href={`mailto:${selectedApplicant.email}?subject=BITC Partnership Query`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Email
                  </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PartnershipApplications;
