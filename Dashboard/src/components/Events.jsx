import { resolveImageUrl, getApiUrl } from "../utils";
import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, Calendar, Image as ImageIcon, Star } from "lucide-react";
import ImageUpload from "./ImageUpload";

const EVENT_TYPES = [
  { value: "WORKSHOP", label: "Workshop" },
  { value: "VISIT", label: "Industrial Visit" },
  { value: "CONVOCATION", label: "Convocation" },
  { value: "SEMINAR", label: "Seminar" },
  { value: "HACKATHON", label: "Hackathon" },
  { value: "WEBINAR", label: "Webinar" },
  { value: "ORIENTATION", label: "Orientation" },
  { value: "GUEST_LECTURE", label: "Guest Lecture" },
  { value: "CULTURAL_FEST", label: "Cultural Fest" },
  { value: "SPORTS_DAY", label: "Sports Day" },
  { value: "EXAM", label: "Exam / Assessment" },
  { value: "PLACEMENT_DRIVE", label: "Placement Drive" },
  { value: "ALUMNI_MEET", label: "Alumni Meet" },
  { value: "CUSTOM", label: " Custom (type your own)" },
];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' | 'conducted'

  const [form, setForm] = useState({
    title: "",
    date: "",
    type: "WORKSHOP",
    imageUrl: "",
    venue: "",
    speaker: "",
    description: "",
    isFeatured: false,
  });

  const [editForm, setEditForm] = useState({
    title: "",
    date: "",
    type: "WORKSHOP",
    imageUrl: "",
    venue: "",
    speaker: "",
    description: "",
    isFeatured: false,
  });

  const apiUrl = getApiUrl();

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/events`);
      if (res.ok) {
        const data = await res.json();
        if (data.events) setEvents(data.events);
      }
    } catch (err) {
      console.warn("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events into Upcoming and Conducted based on today's date
  const { upcomingEvents, conductedEvents } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [];
    const conducted = [];

    events.forEach((evt) => {
      const eventDate = new Date(evt.date);
      if (eventDate >= today) {
        upcoming.push(evt);
      } else {
        conducted.push(evt);
      }
    });

    // Sort upcoming ascending (nearest first) and conducted descending (most recent first)
    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    conducted.sort((a, b) => new Date(b.date) - new Date(a.date));

    return { upcomingEvents: upcoming, conductedEvents: conducted };
  }, [events]);

  const displayedEvents = activeTab === "upcoming" ? upcomingEvents : conductedEvents;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) {
      showNotification("Please enter event title and date", "error");
      return;
    }
    setSubmitting(true);
    try {
      const submitData = { ...form, type: form.type === "CUSTOM" ? (form.customType || "CUSTOM") : form.type };
      delete submitData.customType;
      const res = await fetch(`${apiUrl}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || [data.event, ...events]);
        setIsAddOpen(false);
        setForm({ title: "", date: "", type: "WORKSHOP", imageUrl: "", venue: "", speaker: "", description: "", isFeatured: false, customType: "" });
        fetchEvents();
        showNotification("Event added successfully!");
      } else {
        showNotification(data.error || "Failed to add event", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove event "${title}"?`)) return;
    try {
      const res = await fetch(`${apiUrl}/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || events.filter((evt) => evt.id !== id));
        showNotification(`Event "${title}" removed.`);
      } else {
        showNotification(data.error || "Failed to delete event", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    }
  };

  const openEdit = (evt) => {
    setEditingEventId(evt.id);
    setEditForm({
      title: evt.title || "",
      date: evt.date ? new Date(evt.date).toISOString().split('T')[0] : "",
      type: evt.type || "WORKSHOP",
      imageUrl: evt.imageUrl || "",
      venue: evt.venue || "",
      speaker: evt.speaker || "",
      description: evt.description || "",
      isFeatured: evt.isFeatured || false,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.date) {
      showNotification("Please enter event title and date", "error");
      return;
    }
    setSubmitting(true);
    try {
      const submitData = { ...editForm, type: editForm.type === "CUSTOM" ? (editForm.customType || "CUSTOM") : editForm.type };
      delete submitData.customType;
      const res = await fetch(`${apiUrl}/events/${editingEventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || events.map((evt) => (evt.id === editingEventId ? data.event : evt)));
        setIsEditOpen(false);
        showNotification("Event updated successfully!");
      } else {
        showNotification(data.error || "Failed to update event", "error");
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

      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" /> Manage Events
          </h1>
          <p className="text-gray-500 mt-1">Add, edit, or remove workshops, visits, and convocations.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="hover: px-5 py-2.5 flex items-center gap-2 bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
        >
          <Plus size={20} /> Add Event
        </button>
      </div>

      {/* Tab Switcher (Matches your Screenshot Design) */}
      <div className="flex justify-center my-6">
        <div className="inline-flex bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === "upcoming"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
          >
            Upcoming Events ({upcomingEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("conducted")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === "conducted"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
          >
            Conducted Events ({conductedEvents.length})
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : displayedEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">
            No {activeTab === "upcoming" ? "upcoming" : "conducted"} events found
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {activeTab === "upcoming"
              ? "Add a new upcoming event to showcase on the website."
              : "Events with past dates will automatically appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedEvents.map((evt) => (
            <div key={evt.id} className="bg-white rounded-xl p-0 border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">

              {/* Image Section */}
              <div className="w-full h-52 bg-gray-100 relative group overflow-hidden">
                {evt.imageUrl ? (
                  <img
                    src={resolveImageUrl(evt.imageUrl)}
                    alt={evt.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                    <ImageIcon size={24} opacity={0.5} />
                  </div>
                )}


                {/* Hover overlay - top-right circular icon buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-2">
                  <button
                    onClick={() => openEdit(evt)}
                    title="Edit"
                    className="w-9 h-9 flex items-center justify-center bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-full shadow-lg transition-colors cursor-pointer"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id, evt.title)}
                    title="Delete"
                    className="w-9 h-9 flex items-center justify-center bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-full shadow-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-3 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider ${evt.type === 'WORKSHOP' ? 'bg-purple-100 text-purple-700' : evt.type === 'VISIT' ? 'bg-orange-100 text-orange-700' : evt.type === 'CONVOCATION' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {evt.type}
                  </span>
                  <span className="text-gray-400 flex items-center gap-0.5 text-[11px]">
                    <Calendar className="w-3 h-3" />
                    {new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <h3 className="text-sm font-medium text-gray-600 leading-snug line-clamp-2">{evt.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Add New Event</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-event-form" onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                    <select value={EVENT_TYPES.some(t => t.value === form.type) ? form.type : "CUSTOM"} onChange={(e) => setForm({ ...form, type: e.target.value, ...(e.target.value !== "CUSTOM" ? { customType: "" } : {}) })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      {EVENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    {(form.type === "CUSTOM" || !EVENT_TYPES.some(t => t.value === form.type)) && (
                      <input type="text" value={form.customType || ""} onChange={(e) => setForm({ ...form, customType: e.target.value })} placeholder="Enter your custom event type" className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl" required />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address/Venue</label>
                    <input type="text" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="e.g. BITC Campus" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Speaker</label>
                    <input type="text" value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} placeholder="e.g. Guest Speaker" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description / Event Theory</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter event details, key takeaways, who should attend..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[120px]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Event Image</label>
                  <ImageUpload category="events"
                    onChange={(url) => setForm({ ...form, imageUrl: url })}
                    label="Image"
                  />
                  {form.imageUrl && (
                    <div className="mt-3 relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 h-32 flex items-center justify-center">
                      <img src={resolveImageUrl(form.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, imageUrl: "" })}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 shadow-sm hover:bg-red-50 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button onClick={() => setIsAddOpen(false)} className="px-6 py-2.5 hover: cursor-pointer bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95">Cancel</button>
              <button type="submit" form="add-event-form" disabled={submitting} className="hover: px-8 py-2.5 cursor-pointer hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95">
                {submitting ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-event-form" onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                    <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                    <select value={EVENT_TYPES.some(t => t.value === editForm.type) ? editForm.type : "CUSTOM"} onChange={(e) => setEditForm({ ...editForm, type: e.target.value, ...(e.target.value !== "CUSTOM" ? { customType: "" } : {}) })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      {EVENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    {(editForm.type === "CUSTOM" || !EVENT_TYPES.some(t => t.value === editForm.type)) && (
                      <input type="text" value={editForm.customType || ""} onChange={(e) => setEditForm({ ...editForm, customType: e.target.value })} placeholder="Enter your custom event type" className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl" required />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address/Venue</label>
                    <input type="text" value={editForm.venue} onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })} placeholder="e.g. BITC Campus" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Speaker</label>
                    <input type="text" value={editForm.speaker} onChange={(e) => setEditForm({ ...editForm, speaker: e.target.value })} placeholder="e.g. Guest Speaker" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description / Event Theory</label>
                  <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Enter event details, key takeaways, who should attend..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[120px]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Event Image</label>
                  <ImageUpload category="events"
                    onChange={(url) => setEditForm({ ...editForm, imageUrl: url })}
                    label="Image"
                  />
                  {editForm.imageUrl && (
                    <div className="mt-3 relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 h-32 flex items-center justify-center">
                      <img src={resolveImageUrl(editForm.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, imageUrl: "" })}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 shadow-sm hover:bg-red-50 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button onClick={() => setIsEditOpen(false)} className="px-6 py-2.5 hover: cursor-pointer bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95">Cancel</button>
              <button type="submit" form="edit-event-form" disabled={submitting} className="hover: px-8 py-2.5 cursor-pointer hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95">
                {submitting ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;