import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, FileText, User, Upload } from "lucide-react";
import { getApiUrl, resolveImageUrl } from "../utils";
import ImageUpload from "./ImageUpload";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, title }

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    author: "Admin",
    category: "Technology",
    image: "",
    publishedAt: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    slug: "",
    content: "",
    author: "",
    category: "",
    image: "",
    publishedAt: "",
  });

  const apiUrl = getApiUrl();

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const deduplicateBlogs = (blogList) => {
    if (!Array.isArray(blogList)) return [];
    const seenIds = new Set();
    const seenSlugs = new Set();
    const seenTitles = new Set();
    const unique = [];

    const normSlug = (str) =>
      str ? String(str).trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "") : "";
    const normTitle = (str) =>
      str ? String(str).trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ") : "";

    for (const b of blogList) {
      if (!b) continue;
      const idKey = b.id ? String(b.id).trim().toLowerCase() : "";
      const slugKey = normSlug(b.slug);
      const titleKey = normTitle(b.title);

      if (idKey && seenIds.has(idKey)) continue;
      if (slugKey && seenSlugs.has(slugKey)) continue;
      if (titleKey && seenTitles.has(titleKey)) continue;

      if (idKey) seenIds.add(idKey);
      if (slugKey) seenSlugs.add(slugKey);
      if (titleKey) seenTitles.add(titleKey);

      unique.push(b);
    }
    return unique;
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/blogs`);
      if (res.ok) {
        const data = await res.json();
        if (data.blogs) setBlogs(deduplicateBlogs(data.blogs));
      }
    } catch (err) {
      console.warn("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleQuickImageUpload = async (blogId, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showNotification("Please select an image file", "error");
      return;
    }
    const currentBlog = blogs.find((b) => b.id === blogId);
    const formData = new FormData();
    formData.append("image", file);
    try {
      showNotification("Uploading image...", "info");
      const oldUrl = currentBlog?.image || "";
      const uploadUrl = `${apiUrl}/upload?category=blogs${oldUrl ? `&oldUrl=${encodeURIComponent(oldUrl)}` : ""}`;
      const upRes = await fetch(uploadUrl, { method: "POST", body: formData });
      const upData = await upRes.json();
      if (upRes.ok && upData.success) {
        const updateRes = await fetch(`${apiUrl}/blogs/${blogId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: upData.url }),
        });
        const updateData = await updateRes.json();
        if (updateRes.ok) {
          if (updateData.blogs) {
            setBlogs(deduplicateBlogs(updateData.blogs));
          } else {
            setBlogs((prev) => prev.map((b) => (b.id === blogId ? { ...b, image: upData.url } : b)));
          }
          showNotification("Image uploaded and updated successfully!");
        } else {
          showNotification(updateData.error || "Failed to update blog image", "error");
        }
      } else {
        showNotification(upData.error || "Failed to upload image", "error");
      }
    } catch (err) {
      showNotification("Network error during upload", "error");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showNotification("Please enter blog title", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAddOpen(false);
        setForm({ title: "", slug: "", content: "", author: "Admin", category: "Technology", image: "", publishedAt: "" });
        showNotification("Blog added successfully!");
        if (data.blogs && Array.isArray(data.blogs)) {
          setBlogs(deduplicateBlogs(data.blogs));
        } else {
          fetchBlogs();
        }
      } else {
        showNotification(data.error || "Failed to add blog", "error");
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
      const res = await fetch(`${apiUrl}/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Blog "${title}" removed.`);
        if (data.blogs && Array.isArray(data.blogs)) {
          setBlogs(deduplicateBlogs(data.blogs));
        } else {
          setBlogs((prev) => prev.filter((b) => b.id !== id));
          fetchBlogs();
        }
      } else {
        showNotification(data.error || "Failed to delete blog", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    }
  };

  const openEdit = (blog) => {
    setEditingBlogId(blog.id);
    setEditForm({
      title: blog.title || "",
      slug: blog.slug || "",
      content: blog.content || "",
      author: blog.author || "Admin",
      category: blog.category || "",
      image: blog.image || blog.imageUrl || blog.coverImage || "",
      publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().split("T")[0] : "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      showNotification("Please enter blog title", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/blogs/${editingBlogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditOpen(false);
        showNotification("Blog updated successfully!");
        if (data.blogs && Array.isArray(data.blogs)) {
          setBlogs(deduplicateBlogs(data.blogs));
        } else {
          setBlogs((prev) => prev.map((b) => (b.id === editingBlogId ? data.blog : b)));
          fetchBlogs();
        }
      } else {
        showNotification(data.error || "Failed to update blog", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 text-white font-medium ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {notification.msg}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">Remove Blog</h3>
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
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Manage Blogs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Create, edit, or remove blog posts and tech articles</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="hover: px-3.5 py-2 text-xs flex items-center gap-1.5 cursor-pointer bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
        >
          <Plus size={16} /> Add Blog Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {blogs.map((blog) => {
            const blogImg = blog.image || blog.imageUrl || blog.coverImage;
            return (
              <div
                key={blog.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                {/* Image / Cover Area */}
                <div className="relative h-44 bg-slate-100 overflow-hidden flex items-center justify-center">
                  {blogImg ? (
                    <img
                      src={resolveImageUrl(blogImg)}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <label
                      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 hover:bg-slate-200/70 transition-colors cursor-pointer group/upload"
                      title="Click to upload image"
                    >
                      <Upload className="w-7 h-7 mb-1 text-slate-400 group-hover/upload:text-blue-600 transition-colors" />
                      <span className="text-[11px] font-medium text-slate-500 group-hover/upload:text-blue-600">
                        Upload Image
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleQuickImageUpload(blog.id, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                  {/* Subtle hover dark tint */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Top-right action buttons */}
                  <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-2 z-10">
                    <label
                      className="w-8 h-8 flex items-center justify-center bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-full border border-slate-200 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                      title="Upload / Change Image"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleQuickImageUpload(blog.id, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      onClick={() => openEdit(blog)}
                      className="w-8 h-8 flex items-center justify-center bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-full border border-slate-200 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id, blog.title)}
                      className="w-8 h-8 flex items-center justify-center bg-white text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-full border border-slate-200 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Content (Category tag removed as requested) */}
                <div className="p-3 border-t border-slate-100">
                  <div className="flex items-center justify-end gap-1 mb-1">
                    {blog.publishedAt && (
                      <span className="text-[10px] text-slate-400">
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-medium text-gray-800 leading-snug line-clamp-2 mt-1">
                    {blog.title}
                  </h3>

                  <p className="text-slate-500 text-[11px] mt-1.5 line-clamp-2 leading-relaxed font-normal">
                    {blog.content ? blog.content.replace(/<[^>]*>/g, "") : ""}
                  </p>

                  <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 font-medium">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{blog.author || "Admin"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Add New Blog Post</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-blog-form" onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (optional)</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="e.g. my-first-post"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g. Technology"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Publish Date</label>
                    <input
                      type="date"
                      value={form.publishedAt}
                      onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image</label>
                  <ImageUpload
                    category="blogs"
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                  />
                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                    <span>Or Image URL:</span>
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://... or /uploads/..."
                      className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Content / Description</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows="6"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                    placeholder="Write the full blog post description or content here..."
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button
                onClick={() => setIsAddOpen(false)}
                className="px-6 py-2.5 hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-blog-form"
                disabled={submitting}
                className="hover: px-8 py-2.5 hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
              >
                {submitting ? "Saving..." : "Save Blog"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Edit Blog Post</h2>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-blog-form" onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={editForm.slug}
                      onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      placeholder="e.g. Technology"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      value={editForm.author}
                      onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Publish Date</label>
                    <input
                      type="date"
                      value={editForm.publishedAt}
                      onChange={(e) => setEditForm({ ...editForm, publishedAt: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image</label>
                  <ImageUpload
                    category="blogs"
                    value={editForm.image}
                    onChange={(url) => setEditForm({ ...editForm, image: url })}
                  />
                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                    <span>Or Image URL:</span>
                    <input
                      type="text"
                      value={editForm.image}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      placeholder="https://... or /uploads/..."
                      className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Content / Description</label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    rows="6"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm"
                    placeholder="Write the full blog post description or content here..."
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-6 py-2.5 hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-blog-form"
                disabled={submitting}
                className="hover: px-8 py-2.5 hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
              >
                {submitting ? "Updating..." : "Update Blog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
