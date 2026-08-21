import React, { useState, useEffect } from "react";
import {
  Video,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  X,
  Play,
  Save
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

// Helper to extract YouTube ID
const getYouTubeID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function VideoTestimonials() {
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentTesti, setCurrentTesti] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    youtubeUrl: "",
  });

  const fetchVideoTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/video-testimonials");
      const data = await res.json();
      if (data.success) {
        setVideoTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error("Failed to fetch video testimonials", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoTestimonials();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/video-testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setVideoTestimonials(data.testimonials);
        setIsAddOpen(false);
        setFormData({ title: "", name: "", youtubeUrl: "" });
      } else {
        alert(data.error || "Failed to add video testimonial");
      }
    } catch (error) {
      console.error("Error adding video testimonial", error);
      alert("Error adding video testimonial");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/video-testimonials/${currentTesti.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setVideoTestimonials(data.testimonials);
        setIsEditOpen(false);
        setCurrentTesti(null);
      } else {
        alert(data.error || "Failed to update video testimonial");
      }
    } catch (error) {
      console.error("Error updating video testimonial", error);
      alert("Error updating video testimonial");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/video-testimonials/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setVideoTestimonials(data.testimonials);
      } else {
        alert(data.error || "Failed to delete video testimonial");
      }
    } catch (error) {
      console.error("Error deleting video testimonial", error);
      alert("Error deleting video testimonial");
    }
  };

  const openEdit = (t) => {
    setCurrentTesti(t);
    setFormData({
      title: t.title,
      name: t.name,
      youtubeUrl: t.youtubeUrl,
    });
    setIsEditOpen(true);
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
      setVideoTestimonials((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        fetch("http://localhost:5000/api/video-testimonials/reorder", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderedIds: newOrder.map((item) => item.id),
          }),
        }).catch((err) => {
          console.error("Failed to reorder video testimonials:", err);
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
            Video <span className="text-blue-600">Testimonials</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage YouTube video testimonials shown on the Placements page.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchVideoTestimonials}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs border border-slate-200 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              setFormData({ title: "", name: "", youtubeUrl: "" });
              setIsAddOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Video
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
        {loading ? (
          <div className="py-12 text-center text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
            <p className="text-sm">Loading videos...</p>
          </div>
        ) : videoTestimonials.length === 0 ? (
          <div className="py-16 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <Video className="w-10 h-10 mx-auto mb-3 opacity-40 text-blue-500" />
            <p className="text-base font-semibold text-gray-700">No Video Testimonials</p>
            <p className="text-sm text-gray-500 mt-1">Click "Add Video" to showcase student success stories via YouTube.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={videoTestimonials.map((t) => t.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {videoTestimonials.map((t) => {
                  const ytId = getYouTubeID(t.youtubeUrl);
                  const thumbnailUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "https://via.placeholder.com/480x360?text=Invalid+URL";
                  
                  return (
                    <SortableItem
                      key={t.id}
                      id={t.id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md overflow-hidden"
                    >
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                        <button
                          onClick={() => openEdit(t)}
                          className="w-8 h-8 rounded-full bg-white hover:bg-blue-50 text-gray-500 hover:text-blue-600 border border-gray-200 flex items-center justify-center transition-all shadow-sm"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.title)}
                          className="w-8 h-8 rounded-full bg-white hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 flex items-center justify-center transition-all shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="aspect-video bg-gray-100 relative">
                        <img
                          src={thumbnailUrl}
                          alt={t.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-10 h-10 text-white opacity-80" />
                        </div>
                      </div>

                      <div className="p-4">
                        <h4 className="text-base font-bold text-slate-900 leading-tight mb-1">{t.title}</h4>
                        <p className="text-sm font-medium text-gray-500">{t.name}</p>
                      </div>
                    </SortableItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {(isAddOpen || isEditOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => {
                setIsAddOpen(false);
                setIsEditOpen(false);
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
                  {isAddOpen ? <Plus className="w-5 h-5 text-blue-600" /> : <Pencil className="w-5 h-5 text-blue-600" />}
                  {isAddOpen ? "Add Video Testimonial" : "Edit Video Testimonial"}
                </h3>
                <button
                  onClick={() => {
                    setIsAddOpen(false);
                    setIsEditOpen(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Video Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. From Non-IT to Full Stack Developer"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Alumni Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ravi Kumar"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none"
                    />
                    {formData.youtubeUrl && (
                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                        <span>Preview:</span>
                        {getYouTubeID(formData.youtubeUrl) ? (
                          <span className="text-green-600 font-semibold flex items-center gap-1">Valid YouTube URL</span>
                        ) : (
                          <span className="text-red-500 font-semibold flex items-center gap-1">Invalid YouTube URL</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddOpen(false);
                      setIsEditOpen(false);
                    }}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isAddOpen ? "Add Video" : "Save Changes"}
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
