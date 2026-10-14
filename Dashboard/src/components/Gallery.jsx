import { resolveImageUrl, getApiUrl } from "../utils";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, Image as ImageIcon, Video } from "lucide-react";
import ImageUpload from "./ImageUpload";

const getYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const clean = url.trim();
  const shortsMatch = clean.match(/(?:youtube\.com|youtu\.be)\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];
  const liveMatch = clean.match(/(?:youtube\.com|youtu\.be)\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch && liveMatch[1]) return liveMatch[1];
  const standardMatch = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (standardMatch && standardMatch[1]) return standardMatch[1];
  const genericMatch = clean.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  if (genericMatch && genericMatch[2] && genericMatch[2].length === 11) return genericMatch[2];
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  return null;
};

const getVimeoId = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.trim().match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+))/);
  return match ? match[1] : null;
};

const isVideoItem = (img) => {
  if (!img) return false;
  if (img.type === "video") return true;
  const url = img.imgUrl || "";
  return Boolean(
    getYouTubeId(url) ||
    getVimeoId(url) ||
    url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ||
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com")
  );
};

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("photo");
  const [editType, setEditType] = useState("photo");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isVideoAddOpen, setIsVideoAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, title }

  const [form, setForm] = useState({ title: "", imgUrl: "" });
  const [editForm, setEditForm] = useState({ title: "", imgUrl: "" });

  const apiUrl = getApiUrl();

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
    if (!form.title.trim() || !form.imgUrl) {
      showNotification("Please fill in the title and upload an image or provide video link", "error");
      return;
    }
    setSubmitting(true);
    try {
      const isVideo = isVideoAddOpen || activeTab === "video";
      const payload = {
        title: form.title.trim(),
        imgUrl: form.imgUrl.trim(),
        type: isVideo ? "video" : "photo",
      };
      const res = await fetch(`${apiUrl}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setGallery(data.items || [data.item, ...gallery]);
        setIsAddOpen(false);
        setIsVideoAddOpen(false);
        setForm({ title: "", imgUrl: "" });
        showNotification("Media added successfully!");
      } else {
        showNotification(data.error || "Failed to add media", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    setConfirmDelete({ id, title });
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    const { id, title } = confirmDelete;
    setConfirmDelete(null);
    try {
      const res = await fetch(`${apiUrl}/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setGallery(data.items || gallery.filter((g) => g.id !== id));
        showNotification("Media removed.");
      } else {
        showNotification(data.error || "Failed to delete media", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    }
  };

  const openEdit = (img) => {
    setEditingId(img.id);
    setEditForm({ title: img.title, imgUrl: img.imgUrl });
    const isVideo = isVideoItem(img);
    setEditType(isVideo ? 'video' : 'photo');
    setIsEditOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.imgUrl) {
      showNotification("Please fill in both fields", "error");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: editForm.title.trim(),
        imgUrl: editForm.imgUrl.trim(),
        type: editType === "video" ? "video" : "photo",
      };
      const res = await fetch(`${apiUrl}/gallery/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setGallery(data.items || gallery.map(g => g.id === editingId ? data.item : g));
        setIsEditOpen(false);
        showNotification("Media updated successfully!");
      } else {
        showNotification(data.error || "Failed to update media", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const videosList = gallery.filter(isVideoItem);
  const imagesList = gallery.filter((img) => !isVideoItem(img));

  const renderCard = (img) => {
    const youtubeId = getYouTubeId(img.imgUrl);
    const vimeoId = getVimeoId(img.imgUrl);
    const isDirectVideo = img.imgUrl && img.imgUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);

    return (
      <div key={img.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all group flex flex-col justify-between">
        <div className="relative h-52 bg-slate-100 overflow-hidden flex items-center justify-center">
          {youtubeId ? (
            <img 
              src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
              alt={img.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
              }}
            />
          ) : isDirectVideo ? (
            <video src={resolveImageUrl(img.imgUrl)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" muted loop playsInline onMouseEnter={(e) => e.target.play()} onMouseLeave={(e) => e.target.pause()} />
          ) : vimeoId ? (
            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white">
              <Video className="w-10 h-10 text-primary mb-2" />
              <span className="text-xs font-semibold">Vimeo Video</span>
            </div>
          ) : (
            <img 
              src={resolveImageUrl(img.imgUrl)} 
              alt={img.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop";
              }}
            />
          )}
          {/* Subtle hover dark tint */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Top-right circular action buttons with circle border */}
          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-2 z-10">
            <button
              onClick={() => openEdit(img)}
              className="w-8 h-8 flex items-center justify-center bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-full border border-slate-200 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(img.id, img.title)}
              className="w-8 h-8 flex items-center justify-center bg-white text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-full border border-slate-200 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="p-3 border-t border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-700 truncate" title={img.title}>{img.title}</h3>
          {isVideoItem(img) && (
            <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full shrink-0 ml-1">
              Video
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 pb-24 max-w-7xl mx-auto">
      {/* Custom Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">Remove Media</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-700">"{confirmDelete.title}"</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndDelete}
                className="px-5 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
            className="flex items-center gap-2 px-5 py-2.5 hover: text-xs hover: cursor-pointer bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
          >
            <ImageIcon className="w-4 h-4" /> Add Image
          </button>
          <button
            onClick={() => setIsVideoAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 hover: text-xs hover: cursor-pointer bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
          >
            <Video className="w-4 h-4" /> Add Video
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${notification.type === "error" ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-700 font-semibold"}`}>
          <p>{notification.msg}</p>
        </div>
      )}

      {/* Sections */}
      {loading && gallery.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : gallery.length === 0 ? (
        <div className="bg-transparent p-8 text-center">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-600 mb-1">No media found</h3>
          <p className="text-xs text-slate-500">Get started by adding your first gallery media.</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8 mt-6">
            <button
              onClick={() => setActiveTab("photo")}
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "photo" 
                  ? "bg-blue-400/30 text-slate-900 shadow-md transition-all" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "video" 
                  ? "bg-blue-400/30 text-slate-900 shadow-md transition-all" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Videos
            </button>
          </div>

          {activeTab === "photo" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {imagesList.length > 0 ? imagesList.map(renderCard) : <p className="text-center text-slate-500 col-span-full py-10">No photos available.</p>}
            </div>
          )}

          {activeTab === "video" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {videosList.length > 0 ? videosList.map(renderCard) : <p className="text-center text-slate-500 col-span-full py-10">No videos available.</p>}
            </div>
          )}
        </>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-medium text-gray-600">Add New Image</h3>
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
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Upload Image</label>
                  <ImageUpload category="gallery"
                    value={form.imgUrl}
                    onChange={(url) => setForm({ ...form, imgUrl: url })}
                  />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 text-sm hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95">Cancel</button>
              <button type="submit" form="add-gal-form" disabled={submitting} className="px-5 py-2.5 text-sm hover: disabled:opacity-70 flex items-center gap-2 hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {isVideoAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-medium text-gray-600">Add New Video</h3>
              <button onClick={() => setIsVideoAddOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-video-form" onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Title</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="e.g. Testimonial Video" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Video Link (YouTube, Vimeo, etc.)</label>
                  <input type="text" required value={form.imgUrl} onChange={(e) => setForm({ ...form, imgUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="Paste link here..." />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsVideoAddOpen(false)} className="px-5 py-2.5 text-sm hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95">Cancel</button>
              <button type="submit" form="add-video-form" disabled={submitting} className="px-5 py-2.5 text-sm hover: disabled:opacity-70 flex items-center gap-2 hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Video
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
              <h3 className="text-lg font-medium text-gray-600">Edit Media</h3>
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
                {editType === 'photo' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Upload Image</label>
                    <ImageUpload category="gallery"
                      value={editForm.imgUrl}
                      onChange={(url) => setEditForm({ ...editForm, imgUrl: url })}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Video Link (YouTube, Vimeo, etc.)</label>
                    <input type="text" required value={editForm.imgUrl} onChange={(e) => setEditForm({ ...editForm, imgUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="Paste link here..." />
                  </div>
                )}
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95">Cancel</button>
              <button type="submit" form="edit-gal-form" disabled={submitting} className="px-5 py-2.5 text-sm hover: disabled:opacity-70 flex items-center gap-2 hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95">
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
