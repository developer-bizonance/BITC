import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, FileText, User } from "lucide-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    author: "Admin",
    publishedAt: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    slug: "",
    content: "",
    author: "",
    publishedAt: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/blogs`);
      if (res.ok) {
        const data = await res.json();
        if (data.blogs) setBlogs(data.blogs);
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
        setBlogs(data.blogs || [data.blog, ...blogs]);
        setIsAddOpen(false);
        setForm({ title: "", slug: "", content: "", author: "Admin", publishedAt: "" });
        showNotification("Blog added successfully!");
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
    if (!window.confirm(`Are you sure you want to remove blog "${title}"?`)) return;
    try {
      const res = await fetch(`${apiUrl}/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setBlogs(data.blogs || blogs.filter((b) => b.id !== id));
        showNotification(`Blog "${title}" removed.`);
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
      publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().split('T')[0] : "",
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
        setBlogs(data.blogs || blogs.map((b) => (b.id === editingBlogId ? data.blog : b)));
        setIsEditOpen(false);
        showNotification("Blog updated successfully!");
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
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 text-white font-medium ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {notification.msg}
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} /> Add Blog Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-blue-500" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-1.5 py-0.5 rounded">
                    {blog.category || "Article"}
                  </span>
                  {blog.publishedAt && (
                    <span className="text-[10px] text-slate-400">{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">{blog.title}</h3>
                
                <p className="text-slate-500 text-[11px] mt-1.5 line-clamp-2 leading-relaxed font-normal">{blog.content}</p>
                
                <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 font-medium">
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{blog.author || "Admin"}</span>
                </div>
              </div>
              
              <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="text-[10px] text-blue-500 font-mono truncate max-w-[120px]">/blog/{blog.slug}</span>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => openEdit(blog)}
                    className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                    title="Edit Blog"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id, blog.title)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="Delete Blog"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Add New Blog Post</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-blog-form" onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (optional)</label>
                    <input type="text" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} placeholder="e.g. my-first-post" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                    <input type="text" value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Publish Date</label>
                    <input type="date" value={form.publishedAt} onChange={(e) => setForm({...form, publishedAt: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Content (Markdown / HTML support can be added later)</label>
                  <textarea value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} rows="8" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button onClick={() => setIsAddOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200">Cancel</button>
              <button type="submit" form="add-blog-form" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl">
                {submitting ? 'Saving...' : 'Save Blog'}
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
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-blog-form" onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Slug</label>
                    <input type="text" value={editForm.slug} onChange={(e) => setEditForm({...editForm, slug: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                    <input type="text" value={editForm.author} onChange={(e) => setEditForm({...editForm, author: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Publish Date</label>
                    <input type="date" value={editForm.publishedAt} onChange={(e) => setEditForm({...editForm, publishedAt: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                  <textarea value={editForm.content} onChange={(e) => setEditForm({...editForm, content: e.target.value})} rows="8" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button onClick={() => setIsEditOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200">Cancel</button>
              <button type="submit" form="edit-blog-form" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl">
                {submitting ? 'Updating...' : 'Update Blog'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
