import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, Download } from "lucide-react";

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({ title: "", description: "", fileUrl: "" });
  const [editForm, setEditForm] = useState({ title: "", description: "", fileUrl: "" });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/downloads`);
      if (res.ok) {
        const data = await res.json();
        if (data.items) setDownloads(data.items);
      }
    } catch (err) {
      console.warn("Failed to fetch downloads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.fileUrl.trim()) {
      showNotification("Please fill in both title and file URL", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/downloads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setDownloads(data.items || [data.item, ...downloads]);
        setIsAddOpen(false);
        setForm({ title: "", description: "", fileUrl: "" });
        showNotification("Download added successfully!");
      } else {
        showNotification(data.error || "Failed to add download", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}"?`)) return;
    try {
      const res = await fetch(`${apiUrl}/downloads/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setDownloads(data.items || downloads.filter((d) => d.id !== id));
        showNotification("Download removed.");
      } else {
        showNotification(data.error || "Failed to delete download", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    }
  };

  const openEdit = (dl) => {
    setEditingId(dl.id);
    setEditForm({ title: dl.title, description: dl.description, fileUrl: dl.fileUrl });
    setIsEditOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.fileUrl.trim()) {
      showNotification("Please fill in both title and file URL", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/downloads/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setDownloads(data.items || downloads.map(d => d.id === editingId ? data.item : d));
        setIsEditOpen(false);
        showNotification("Download updated successfully!");
      } else {
        showNotification(data.error || "Failed to update download", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 md:p-6 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" /> Downloads Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage downloadable PDF resources, syllabi, and forms</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDownloads}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Download
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${notification.type === "error" ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-700 font-semibold"}`}>
          <p>{notification.msg}</p>
        </div>
      )}

      {/* Compact Grid */}
      {loading && downloads.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : downloads.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-2xs border border-slate-200 p-8 text-center">
          <Download className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No downloads found</h3>
          <p className="text-xs text-slate-500">Get started by adding your first downloadable resource.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {downloads.map((dl) => (
            <div key={dl.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all group flex flex-col justify-between">
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">{dl.title}</h3>
                  <a
                    href={dl.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-lg transition-colors shrink-0"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-1">{dl.description}</p>
              </div>
              <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{dl.fileUrl}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(dl)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Download"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(dl.id, dl.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Download"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Add New Download</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-dl-form" onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Title</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="e.g. Admission Brochure 2025" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Description (Optional)</label>
                  <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="Brief description..."></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">File URL</label>
                  <input type="text" required value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="e.g. /downloads/file.pdf or https://..." />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="add-dl-form" disabled={submitting} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 flex items-center gap-2">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Edit Download</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-dl-form" onSubmit={handleEdit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Title</label>
                  <input type="text" required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Description (Optional)</label>
                  <textarea rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">File URL</label>
                  <input type="text" required value={editForm.fileUrl} onChange={(e) => setEditForm({ ...editForm, fileUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="edit-dl-form" disabled={submitting} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 flex items-center gap-2">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />} Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Downloads;
