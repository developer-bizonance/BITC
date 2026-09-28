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
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ScholarshipApplications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  // --- API CONFIGURATION ---
  const API_ENDPOINT = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/scholarships`;

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error("Connection failed");
      const data = await response.json();

      const apps = data.applications || [];
      const formatted = apps.map((app) => ({
        ...app,
        id: app.id || app._id,
        fullId: app._id || app.id,
        date: app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-IN") : "Recent",
        status: app.status || "Pending",
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
      window.open(resumeData.startsWith("http") ? resumeData : `https://${resumeData}`, "_blank");
    }
  };

  // 🌟 Download Resume
  const downloadResume = (resumeData, fileName = "Applicant_CV.pdf") => {
    if (!resumeData) return;
    const link = document.createElement("a");
    link.href = resumeData;
    link.download = fileName || "Applicant_CV.pdf";
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
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900 antialiased">
      
      {/* ── Page Header ── */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center border border-orange-200">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Scholarship Applications</h1>
              <p className="text-xs font-semibold text-slate-500">
                Review submitted student applications for scholarships
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-xs shadow-sm shadow-orange-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <span>Total Received:</span>
            <span className="text-orange-600 font-black text-sm bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
              {applicants.length}
            </span>
          </div>
          <button
            onClick={fetchApplicants}
            title="Refresh Applications"
            className="p-2.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all shadow-xs hover:shadow text-slate-600 cursor-pointer"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-orange-500" : ""} />
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
            placeholder="Search by student name, email, course, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm placeholder:text-slate-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Filter className="w-4 h-4 text-slate-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm appearance-none cursor-pointer hover:bg-slate-50"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ── Applications Data Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-black">
                <th className="px-5 py-4 whitespace-nowrap">ID / Date</th>
                <th className="px-5 py-4">Applicant Profile</th>
                <th className="px-5 py-4">Course & Location</th>
                <th className="px-5 py-4 text-center">CV</th>
                <th className="px-5 py-4 text-center whitespace-nowrap">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-orange-400" />
                    <p className="font-semibold">Loading applications...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-semibold text-base mb-1">No applications found</p>
                    <p className="text-slate-400 text-xs">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((app, index) => (
                  <tr key={index} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-5 py-4 whitespace-nowrap align-top">
                      <div className="font-black text-slate-800 text-xs mb-1 bg-slate-100 px-2 py-0.5 rounded inline-block">
                        {app.id}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {app.date}
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="font-bold text-slate-900 mb-1">{app.fullName || app.name || "Unknown Applicant"}</div>
                      <div className="text-xs text-slate-500 font-medium space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${app.email}`} className="hover:text-blue-600 truncate max-w-[200px]">
                            {app.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3" />
                          <a href={`tel:${app.phone}`} className="hover:text-blue-600">
                            {app.phone}
                          </a>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-sm text-slate-800 max-w-[220px] truncate" title={app.course}>
                          {app.course}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <Building className="w-3 h-3" /> {app.city}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top text-center">
                      {app.cvBase64 ? (
                        <button
                          onClick={() => openResume(app.cvBase64, app.cvFileName)}
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors tooltip cursor-pointer"
                          title="View Uploaded CV"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded">
                          No CV
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 align-top text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border ${
                          app.status.toLowerCase() === "reviewed"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : app.status.toLowerCase() === "approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : app.status.toLowerCase() === "rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {app.status.toLowerCase() === "reviewed" && <Eye className="w-3 h-3" />}
                        {app.status.toLowerCase() === "approved" && <CheckCircle className="w-3 h-3" />}
                        {app.status.toLowerCase() === "rejected" && <X className="w-3 h-3" />}
                        {app.status.toLowerCase() === "pending" && <Clock className="w-3 h-3" />}
                        {app.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 align-top text-right">
                      <button
                        onClick={() => {
                          setSelectedApplicant(app);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50 font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review
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
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-inner font-bold text-lg">
                    {(selectedApplicant.fullName || selectedApplicant.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {selectedApplicant.fullName || selectedApplicant.name || "Unknown Applicant"}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-slate-500">{selectedApplicant.id}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-xs font-semibold text-slate-500">{selectedApplicant.date}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-white hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors border border-slate-200 cursor-pointer shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact Info Card */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm md:col-span-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      <div className="group relative">
                        <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email Address
                        </p>
                        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                          <a href={`mailto:${selectedApplicant.email}`} className="text-sm font-bold text-slate-800 hover:text-blue-600 truncate pr-2">
                            {selectedApplicant.email}
                          </a>
                          <button onClick={() => copyToClipboard(selectedApplicant.email, "email")} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                            {copiedField === "email" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="group relative">
                        <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Mobile Number
                        </p>
                        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                          <a href={`tel:${selectedApplicant.phone}`} className="text-sm font-bold text-slate-800 hover:text-blue-600">
                            {selectedApplicant.phone}
                          </a>
                          <button onClick={() => copyToClipboard(selectedApplicant.phone, "phone")} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                            {copiedField === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="group relative">
                        <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                          <Building className="w-3 h-3" /> City
                        </p>
                        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                          <span className="text-sm font-bold text-slate-800">
                            {selectedApplicant.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Application Details Card */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm md:col-span-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Application Details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Course Category</p>
                        <div className="bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-100 font-bold text-sm text-slate-800">
                          {selectedApplicant.category || "Not Specified"}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Selected Course</p>
                        <div className="bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-100 font-bold text-sm text-slate-800">
                          {selectedApplicant.course || "Not Specified"}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Why they deserve this scholarship
                        </p>
                        <div className="bg-slate-50 px-3 py-3 rounded-lg border border-slate-100 font-semibold text-sm text-slate-700 whitespace-pre-wrap min-h-[80px]">
                          {selectedApplicant.message || <span className="text-slate-400 italic font-medium">No message provided.</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CV / Document Section */}
                  {selectedApplicant.cvBase64 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{selectedApplicant.cvFileName || "Applicant_CV.pdf"}</p>
                          <p className="text-xs font-semibold text-slate-500">Uploaded Document</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => openResume(selectedApplicant.cvBase64, selectedApplicant.cvFileName)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => downloadResume(selectedApplicant.cvBase64, selectedApplicant.cvFileName)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:text-emerald-600 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer (Status Actions) */}
              <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                  <span className="text-slate-400">Current Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs uppercase tracking-wide ${
                      selectedApplicant.status.toLowerCase() === "reviewed"
                        ? "bg-blue-100 text-blue-800"
                        : selectedApplicant.status.toLowerCase() === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedApplicant.status.toLowerCase() === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedApplicant.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedApplicant.fullId, "Reviewed")}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Mark Reviewed
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedApplicant.fullId, "Approved")}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedApplicant.fullId, "Rejected")}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScholarshipApplications;
