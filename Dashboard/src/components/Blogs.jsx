import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, FileText, User, Upload, Newspaper } from "lucide-react";
import { getApiUrl, resolveImageUrl } from "../utils";
import ImageUpload from "./ImageUpload";
import EventSectionsBuilder, { EventSectionsList, parseDescriptionToSections, formatSectionsToDescription } from "./EventSectionsBuilder";

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
    author: "",
    category: "",
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

  const [addSections, setAddSections] = useState([]);
  const [editSections, setEditSections] = useState([]);

  const handleAddSectionsChange = (secs) => {
    setAddSections(secs);
    setForm((prev) => ({
      ...prev,
      content: formatSectionsToDescription(secs),
    }));
  };

  const handleEditSectionsChange = (secs) => {
    setEditSections(secs);
    setEditForm((prev) => ({
      ...prev,
      content: formatSectionsToDescription(secs),
    }));
  };

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
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image size must be less than 5MB", "error");
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

  const openAdd = () => {
    setForm({
      title: "",
      slug: "",
      content: "",
      author: "",
      category: "",
      image: "",
      publishedAt: "",
    });
    setAddSections([]);
    setIsAddOpen(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showNotification("Please enter blog title", "error");
      return;
    }
    setSubmitting(true);
    try {
      const generatedSlug = (form.slug || form.title)
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-");
      const res = await fetch(`${apiUrl}/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug: generatedSlug, sections: addSections }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAddOpen(false);
        setForm({ title: "", slug: "", content: "", author: "", category: "", image: "", publishedAt: "" });
        setAddSections([]);
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
    const blogContent = blog.content || blog.description || "";
    setEditForm({
      title: blog.title || "",
      slug: blog.slug || "",
      content: blogContent,
      author: blog.author || "",
      category: blog.category || "",
      image: blog.image || blog.imageUrl || blog.coverImage || "",
      publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().split("T")[0] : "",
    });
    const initialSections = Array.isArray(blog.sections) && blog.sections.length > 0
      ? blog.sections
      : parseDescriptionToSections(blogContent);
    setEditSections(initialSections);
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
        body: JSON.stringify({ ...editForm, sections: editSections }),
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
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 text-white font-medium ${notification.type === "error" ? "bg-red-500" : "bg-green-500"
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-normal">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Manage Blogs</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-blue-50 text-blue-700 border border-blue-100">
                  {blogs.length} Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Create, edit, or remove blog posts and tech articles
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Blog
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-slate-200">
          <Newspaper className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold text-gray-700">No Blog Posts</p>
          <p className="text-xs text-gray-500 mt-0.5">Click "Add New Blog" to create your first post.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {blogs.map((blog) => {
            const blogImg = blog.image || blog.imageUrl || blog.coverImage;
            return (
              <div
                key={blog.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all duration-200 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left: Thumbnail Image */}
                <div className="relative w-full sm:w-52 md:w-60 h-40 sm:h-32 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
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
                      <Upload className="w-6 h-6 mb-1 text-slate-400 group-hover/upload:text-blue-600 transition-colors" />
                      <span className="text-[11px] font-medium text-slate-500 group-hover/upload:text-blue-600">
                        Upload Image
                      </span>
                      <input
                        type="file"
                        className="hidden text-gray-500"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleQuickImageUpload(blog.id, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Middle: Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    {blog.publishedAt && (
                      <span className="text-[11px] font-medium text-slate-400">
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-normal">
                    {blog.content ? blog.content.replace(/<[^>]*>/g, "") : ""}
                  </p>

                  <div className="flex items-center gap-1.5 pt-0.5 text-xs text-slate-500 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{blog.author || "Admin"}</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <label
                    className="w-8 h-8 flex items-center justify-center bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-full border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
                    title="Upload / Change Image"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      className="hidden text-gray-500"
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
                    className="w-8 h-8 flex items-center justify-center bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-full border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id, blog.title)}
                    className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl lg:max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-normal">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Add New Blog Post</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Fill in article details and content sections</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-left">
              <form id="add-blog-form" onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Cover Image, Category, Author, Publish Date */}
                  <div className="md:col-span-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cover Image</label>
                      <ImageUpload
                        category="blogs"
                        value={form.image}
                        onChange={(url) => setForm({ ...form, image: url })}
                        heightClassName="h-[190px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                        <input
                          type="text"
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Author</label>
                        <input
                          type="text"
                          value={form.author}
                          onChange={(e) => setForm({ ...form, author: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Publish Date</label>
                      <input
                        type="date"
                        value={form.publishedAt}
                        onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Right Column: Title, Content / Description Sections */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <EventSectionsBuilder
                        sections={addSections}
                        onChange={handleAddSectionsChange}
                        entityName="Blog"
                        hideList={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Added Blog Sections List (2 columns: Section 1 on left, Section 2 on right) */}
                <EventSectionsList
                  sections={addSections}
                  onChange={handleAddSectionsChange}
                  entityName="Blog"
                />
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-blog-form"
                disabled={submitting}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Blog"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl lg:max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-normal">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Edit Blog Post</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Update article details and content sections</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-left">
              <form id="edit-blog-form" onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Cover Image, Category, Author, Publish Date */}
                  <div className="md:col-span-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cover Image</label>
                      <ImageUpload
                        category="blogs"
                        value={editForm.image}
                        onChange={(url) => setEditForm({ ...editForm, image: url })}
                        heightClassName="h-[190px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                        <input
                          type="text"
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Author</label>
                        <input
                          type="text"
                          value={editForm.author}
                          onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Publish Date</label>
                      <input
                        type="date"
                        value={editForm.publishedAt}
                        onChange={(e) => setEditForm({ ...editForm, publishedAt: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Right Column: Title, Content / Description Sections */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <EventSectionsBuilder
                        sections={editSections}
                        onChange={handleEditSectionsChange}
                        entityName="Blog"
                        hideList={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Added Blog Sections List (2 columns: Section 1 on left, Section 2 on right) */}
                <EventSectionsList
                  sections={editSections}
                  onChange={handleEditSectionsChange}
                  entityName="Blog"
                />
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-blog-form"
                disabled={submitting}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
