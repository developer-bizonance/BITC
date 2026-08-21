import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, Image as ImageIcon } from "lucide-react";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({ title: "", imgUrl: "" });
  const [editForm, setEditForm] = useState({ title: "", imgUrl: "" });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/gallery`);
      if (res.ok) {
        const data = await res.json();
        if (data.items) setGallery(data.items);
      }
    } catch (err) {
      console.warn("Failed to fetch gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.imgUrl.trim()) {
      showNotification("Please fill in both title and image URL", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setGallery(data.items || [data.item, ...gallery]);
        setIsAddOpen(false);
        setForm({ title: "", imgUrl: "" });
        showNotification("Image added successfully!");
      } else {
        showNotification(data.error || "Failed to add image", "error");
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
      const res = await fetch(`${apiUrl}/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setGallery(data.items || gallery.filter((g) => g.id !== id));
        showNotification("Image removed.");
      } else {
        showNotification(data.error || "Failed to delete image", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    }
  };

  const openEdit = (img) => {
    setEditingId(img.id);
    setEditForm({ title: img.title, imgUrl: img.imgUrl });
    setIsEditOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.imgUrl.trim()) {
      showNotification("Please fill in both fields", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/gallery/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setGallery(data.items || gallery.map(g => g.id === editingId ? data.item : g));
        setIsEditOpen(false);
        showNotification("Image updated successfully!");
      } else {
        showNotification(data.error || "Failed to update image", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" /> Gallery Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage campus photos, labs, workshops, and placement drives</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchGallery}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${notification.type === "error" ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-700 font-semibold"}`}>
          <p>{notification.msg}</p>
        </div>
      )}

      {/* Compact Grid */}
      {loading && gallery.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : gallery.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-2xs border border-slate-200 p-8 text-center">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No images found</h3>
          <p className="text-xs text-slate-500">Get started by adding your first gallery image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {gallery.map((img) => (
            <div key={img.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all group flex flex-col justify-between">
              <div className="relative h-36 bg-slate-100 overflow-hidden">
                <img 
                  src={img.imgUrl} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x600?text=Invalid+Image+URL";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(img)} className="p-1.5 bg-white/90 text-blue-600 rounded-lg hover:bg-white transition-colors cursor-pointer" title="Edit">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(img.id, img.title)} className="p-1.5 bg-white/90 text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-3 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 truncate" title={img.title}>{img.title}</h3>
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
              <h3 className="text-lg font-bold text-gray-900">Add New Image</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-gal-form" onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Title</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="e.g. Campus Orientation" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Image URL</label>
                  <input type="text" required value={form.imgUrl} onChange={(e) => setForm({ ...form, imgUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="https://..." />
                </div>
                {form.imgUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 h-40">
                     <img src={form.imgUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="add-gal-form" disabled={submitting} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 flex items-center gap-2">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Image
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
              <h3 className="text-lg font-bold text-gray-900">Edit Image</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-gal-form" onSubmit={handleEdit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Title</label>
                  <input type="text" required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Image URL</label>
                  <input type="text" required value={editForm.imgUrl} onChange={(e) => setEditForm({ ...editForm, imgUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" />
                </div>
                {editForm.imgUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 h-40">
                     <img src={editForm.imgUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="edit-gal-form" disabled={submitting} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 flex items-center gap-2">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />} Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
