import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, BookOpen, Clock, Tag } from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCourseSlug, setEditingCourseSlug] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "",
    image: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    duration: "",
    fees: "",
    price: 0,
    description: "",
    image: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/courses`);
      if (res.ok) {
        const data = await res.json();
        if (data.courses) setCourses(data.courses);
      }
    } catch (err) {
      console.warn("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showNotification("Please enter course title", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || [...courses, data.course]);
        setIsAddOpen(false);
        setForm({
          title: "",
          category: "Information Technology",
          duration: "6 Months",
          fees: "₹36,000",
          price: 36000,
          description: "",
          image: "",
        });
        showNotification("Course added successfully!");
      } else {
        showNotification(data.error || "Failed to add course", "error");
      }
    } catch (err) {
      showNotification("Network error while adding course", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slug, title) => {
    if (!window.confirm(`Are you sure you want to remove course "${title}"?`)) return;
    try {
      const res = await fetch(`${apiUrl}/courses/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || courses.filter((c) => c.slug !== slug));
        showNotification(`Course "${title}" removed.`);
      } else {
        showNotification(data.error || "Failed to delete course", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    }
  };

  const openEdit = (course) => {
    setEditingCourseSlug(course.slug);
    setEditForm({
      title: course.title || "",
      category: course.category || "Information Technology",
      duration: course.duration || "",
      fees: course.fees || "",
      price: course.price || 0,
      description: course.description || "",
      image: course.image || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      showNotification("Please enter course title", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/courses/${editingCourseSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || courses.map((c) => (c.slug === editingCourseSlug ? data.course : c)));
        setIsEditOpen(false);
        showNotification("Course updated successfully!");
      } else {
        showNotification(data.error || "Failed to update course", "error");
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

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" /> Manage Courses
          </h1>
          <p className="text-gray-500 mt-2">Add, edit, or remove academic courses.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={20} /> Add Course
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.slug} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
              <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
              <p className="text-sm font-semibold text-blue-600 mt-1">{course.category}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration}</span>
                <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> {course.fees}</span>
              </div>
              <p className="text-gray-500 text-sm mt-4 line-clamp-3 flex-1">{course.description}</p>
              
              <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                <button
                  onClick={() => openEdit(course)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(course.slug, course.title)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Add New Course</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-course-form" onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="Information Technology">Information Technology</option>
                      <option value="Management">Management</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                    <input type="text" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Fees String</label>
                    <input type="text" value={form.fees} onChange={(e) => setForm({...form, fees: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Numeric Price</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                    <input type="text" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows="4" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button onClick={() => setIsAddOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200">Cancel</button>
              <button type="submit" form="add-course-form" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl">
                {submitting ? 'Saving...' : 'Save Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Edit Course</h2>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-course-form" onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="Information Technology">Information Technology</option>
                      <option value="Management">Management</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                    <input type="text" value={editForm.duration} onChange={(e) => setEditForm({...editForm, duration: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Fees String</label>
                    <input type="text" value={editForm.fees} onChange={(e) => setEditForm({...editForm, fees: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Numeric Price</label>
                    <input type="number" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                    <input type="text" value={editForm.image} onChange={(e) => setEditForm({...editForm, image: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} rows="4" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button onClick={() => setIsEditOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200">Cancel</button>
              <button type="submit" form="edit-course-form" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl">
                {submitting ? 'Updating...' : 'Update Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;

