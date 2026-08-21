import React, { useState, useEffect } from "react";
import {
  Quote,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Star,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./uic/SortableItem";

function EmployeeTestimonials() {
  const [employeeTestimonials, setEmployeeTestimonials] = useState([]);
  const [employeeTestimonialsLoading, setEmployeeTestimonialsLoading] = useState(true);
  const [employeeTestiImgError, setEmployeeTestiImgError] = useState({});
  const [isAddEmployeeTestiOpen, setIsAddEmployeeTestiOpen] = useState(false);
  const [isEditEmployeeTestiOpen, setIsEditEmployeeTestiOpen] = useState(false);
  const [currentTesti, setCurrentTesti] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: "",
    image: "",
    rating: 5,
  });

  const fetchEmployeeTestimonials = async () => {
    try {
      setEmployeeTestimonialsLoading(true);
      const res = await fetch("http://localhost:5000/api/employee-testimonials");
      const data = await res.json();
      if (data.success) {
        setEmployeeTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error("Failed to fetch employee testimonials", error);
    } finally {
      setEmployeeTestimonialsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeTestimonials();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/employee-testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setEmployeeTestimonials(data.testimonials);
        setIsAddEmployeeTestiOpen(false);
        setFormData({ name: "", role: "", quote: "", image: "", rating: 5 });
      } else {
        alert(data.error || "Failed to add testimonial");
      }
    } catch (error) {
      console.error("Error adding testimonial", error);
      alert("Error adding testimonial");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/employee-testimonials/${currentTesti.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setEmployeeTestimonials(data.testimonials);
        setIsEditEmployeeTestiOpen(false);
        setCurrentTesti(null);
      } else {
        alert(data.error || "Failed to update testimonial");
      }
    } catch (error) {
      console.error("Error updating testimonial", error);
      alert("Error updating testimonial");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}'s testimonial?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/employee-testimonials/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setEmployeeTestimonials(data.testimonials);
      } else {
        alert(data.error || "Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial", error);
      alert("Error deleting testimonial");
    }
  };

  const openEdit = (t) => {
    setCurrentTesti(t);
    setFormData({
      name: t.name,
      role: t.role,
      quote: t.quote,
      image: t.image || "",
      rating: t.rating || 5,
    });
    setIsEditEmployeeTestiOpen(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setEmployeeTestimonials((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Call backend API to save new order
        fetch("http://localhost:5000/api/employee-testimonials/reorder", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderedIds: newOrder.map((item) => item.id),
          }),
        }).catch((err) => {
          console.error("Failed to reorder employee testimonials:", err);
          alert("Failed to reorder testimonials");
        });

        return newOrder;
      });
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto min-h-[calc(100vh-5rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Employee <span className="text-amber-500">Success Stories</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage employee testimonials shown on the Careers page.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchEmployeeTestimonials}
            disabled={employeeTestimonialsLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs border border-slate-200 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${employeeTestimonialsLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              setFormData({ name: "", role: "", quote: "", image: "", rating: 5 });
              setIsAddEmployeeTestiOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-xs shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Story
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
        {employeeTestimonialsLoading ? (
          <div className="py-12 text-center text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500" />
            <p className="text-sm">Loading employee stories...</p>
          </div>
        ) : employeeTestimonials.length === 0 ? (
          <div className="py-16 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <Quote className="w-10 h-10 mx-auto mb-3 opacity-40 text-amber-500" />
            <p className="text-base font-semibold text-gray-700">No Employee Success Stories</p>
            <p className="text-sm text-gray-500 mt-1">Click "Add Story" to showcase your team's testimonials.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={employeeTestimonials.map((t) => t.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {employeeTestimonials.map((t) => (
                  <SortableItem
                    key={t.id}
                    id={t.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
                  >
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                  <button
                    onClick={() => openEdit(t)}
                    className="w-8 h-8 rounded-full bg-white hover:bg-blue-50 text-gray-500 hover:text-blue-600 border border-gray-200 flex items-center justify-center transition-all shadow-sm"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="w-8 h-8 rounded-full bg-white hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 flex items-center justify-center transition-all shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 shadow-sm bg-gray-100">
                      <img
                        src={employeeTestiImgError[t.id] ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" : t.image}
                        alt={t.name}
                        onError={() => setEmployeeTestiImgError(prev => ({ ...prev, [t.id]: true }))}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                      <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {t.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-4 mb-4">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center text-amber-400 pt-3 border-t border-gray-100">
                  {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {(isAddEmployeeTestiOpen || isEditEmployeeTestiOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => {
                setIsAddEmployeeTestiOpen(false);
                setIsEditEmployeeTestiOpen(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {isAddEmployeeTestiOpen ? <Plus className="w-5 h-5 text-amber-500" /> : <Pencil className="w-5 h-5 text-amber-500" />}
                  {isAddEmployeeTestiOpen ? "Add Employee Story" : "Edit Employee Story"}
                </h3>
                <button
                  onClick={() => {
                    setIsAddEmployeeTestiOpen(false);
                    setIsEditEmployeeTestiOpen(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={isAddEmployeeTestiOpen ? handleAddSubmit : handleEditSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Employee Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Role / Designation</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Testimonial Quote</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                    placeholder="Write the testimonial here..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddEmployeeTestiOpen(false);
                      setIsEditEmployeeTestiOpen(false);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
                  >
                    <Save className="w-4 h-4" />
                    {isAddEmployeeTestiOpen ? "Add Story" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EmployeeTestimonials;
