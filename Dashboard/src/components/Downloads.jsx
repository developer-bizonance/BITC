import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, Download } from "lucide-react";
import { getApiUrl } from "../utils";
import DeleteConfirmModal from "./uic/DeleteConfirmModal.jsx";

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, title }
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({ title: "", description: "", fileUrl: "" });
  const [editForm, setEditForm] = useState({ title: "", description: "", fileUrl: "" });

  const apiUrl = getApiUrl();

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

  const handleDelete = (id, title) => {
    setConfirmDelete({ id, title });
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    const { id, title } = confirmDelete;
    setDeleting(true);
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
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
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
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-normal">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Downloads Management</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-amber-50 text-amber-700 border border-amber-100">
                  {downloads.length} Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage downloadable PDF resources, syllabi, and forms
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Download
        </button>
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
        <div className="bg-transparent p-8 text-center">
          <Download className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-600 mb-1">No downloads found</h3>
          <p className="text-xs text-slate-500">Get started by adding your first downloadable resource.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {downloads.map((dl) => (
            <div key={dl.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all group flex flex-col justify-between">
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h3 className="text-xs font-medium text-gray-600 leading-snug line-clamp-2">{dl.title}</h3>
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
                    className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                    title="Delete Download"
                  >
                    <Trash2 size={15} />
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
              <h3 className="text-lg font-medium text-gray-600">Add New Download</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-dl-form" onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Description (Optional)</label>
                  <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-sm text-gray-500"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">File URL</label>
                  <input type="text" required value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-sm text-gray-500" />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsAddOpen(false)} className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50">Cancel</button>
              <button type="submit" form="add-dl-form" disabled={submitting} className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin shrink-0" /> : <Plus className="w-4 h-4 shrink-0" />} <span>Save Changes</span>
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
              <h3 className="text-lg font-medium text-gray-600">Edit Download</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-dl-form" onSubmit={handleEdit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
                  <input type="text" required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Description (Optional)</label>
                  <textarea rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-sm text-gray-500"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">File URL</label>
                  <input type="text" required value={editForm.fileUrl} onChange={(e) => setEditForm({ ...editForm, fileUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-sm text-gray-500" />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50">Cancel</button>
              <button type="submit" form="edit-dl-form" disabled={submitting} className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin shrink-0" /> : <Pencil className="w-4 h-4 shrink-0" />} <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centered Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!confirmDelete}
        title="Remove Download"
        itemName={confirmDelete?.title}
        from="Downloads"
        loading={deleting}
        onConfirm={confirmAndDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Downloads;
