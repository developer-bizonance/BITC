import { resolveImageUrl, getApiUrl, isUpcomingEventDate, parseEventStartTimestamp, parseEventEndTimestamp } from "../utils";
import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, Calendar, Clock, Image as ImageIcon, Star, Upload, Camera, Video, Film } from "lucide-react";
import ImageUpload from "./ImageUpload";
import DeleteConfirmModal from "./uic/DeleteConfirmModal.jsx";
import EventSectionsBuilder, { EventSectionsList, parseDescriptionToSections, formatSectionsToDescription } from "./EventSectionsBuilder";
import { INDIAN_STATES, fetchStates, fetchCities } from "../data/indianStatesCities";

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
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, title }
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    type: "",
    imageUrl: "",
    state: "",
    city: "",
    customCity: "",
    venue: "",
    speaker: "",
    heading: "",
    shortDescription: "",
    description: "",
    isFeatured: false,
    customType: "",
    photos: [],
    videos: [],
  });

  const [editForm, setEditForm] = useState({
    title: "",
    date: "",
    time: "",
    type: "",
    imageUrl: "",
    state: "",
    city: "",
    customCity: "",
    venue: "",
    speaker: "",
    heading: "",
    shortDescription: "",
    description: "",
    isFeatured: false,
    customType: "",
    photos: [],
    videos: [],
  });

  const [availableStates, setAvailableStates] = useState(INDIAN_STATES);
  const [addCities, setAddCities] = useState([]);
  const [editCities, setEditCities] = useState([]);

  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");

  const [addSections, setAddSections] = useState([]);
  const [editSections, setEditSections] = useState([]);

  const handleAddSectionsChange = (secs) => {
    setAddSections(secs);
    setForm((prev) => ({
      ...prev,
      description: formatSectionsToDescription(secs),
    }));
  };

  const handleEditSectionsChange = (secs) => {
    setEditSections(secs);
    setEditForm((prev) => ({
      ...prev,
      description: formatSectionsToDescription(secs),
    }));
  };

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
    fetchStates(apiUrl).then((states) => {
      if (states && states.length > 0) setAvailableStates(states);
    });
  }, [apiUrl]);

  const handleAddStateChange = async (newState) => {
    setForm((prev) => ({ ...prev, state: newState, city: "", customCity: "" }));
    if (newState) {
      const cities = await fetchCities(newState, apiUrl);
      setAddCities(cities);
    } else {
      setAddCities([]);
    }
  };

  const handleEditStateChange = async (newState) => {
    setEditForm((prev) => ({ ...prev, state: newState, city: "", customCity: "" }));
    if (newState) {
      const cities = await fetchCities(newState, apiUrl);
      setEditCities(cities);
    } else {
      setEditCities([]);
    }
  };

  // Filter events into Upcoming and Conducted based on event date & time finishing
  const { upcomingEvents, conductedEvents } = useMemo(() => {
    const upcoming = [];
    const conducted = [];

    events.forEach((evt) => {
      if (isUpcomingEventDate(evt.date, evt.time)) {
        upcoming.push(evt);
      } else {
        conducted.push(evt);
      }
    });

    // Sort upcoming ascending (nearest first) and conducted descending (most recent first)
    upcoming.sort((a, b) => parseEventStartTimestamp(a.date, a.time) - parseEventStartTimestamp(b.date, b.time));
    conducted.sort((a, b) => parseEventEndTimestamp(b.date, b.time) - parseEventEndTimestamp(a.date, a.time));

    return { upcomingEvents: upcoming, conductedEvents: conducted };
  }, [events]);

  // If no upcoming events exist but conducted events do, default tab to conducted so it's not empty
  useEffect(() => {
    if (events.length > 0 && upcomingEvents.length === 0 && conductedEvents.length > 0 && activeTab === "upcoming") {
      setActiveTab("conducted");
    }
  }, [events.length, upcomingEvents.length, conductedEvents.length, activeTab]);

  const displayedEvents = activeTab === "upcoming" ? upcomingEvents : conductedEvents;

  const isEditEventConducted = useMemo(() => {
    if (!editForm.date) return false;
    return !isUpcomingEventDate(editForm.date, editForm.time);
  }, [editForm.date, editForm.time]);


  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageFile = async (file, isEdit = false) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showNotification("Please select an image file", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image size must be less than 5MB", "error");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    setUploadingImage(true);
    try {
      const res = await fetch(`${apiUrl}/upload?category=events`, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isEdit) {
          setEditForm((prev) => ({ ...prev, imageUrl: data.url }));
        } else {
          setForm((prev) => ({ ...prev, imageUrl: data.url }));
        }
      } else {
        showNotification(data.error || "Failed to upload image", "error");
      }
    } catch (err) {
      showNotification("Upload failed", "error");
    } finally {
      setUploadingImage(false);
    }
  };


  const handleMultiplePhotos = async (files, isEdit = true) => {
    if (!files || files.length === 0) return;
    setUploadingPhotos(true);
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) {
        showNotification("File " + file.name + " is too large (> 5MB)", "error");
        continue;
      }
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch(apiUrl + "/upload?category=events", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (err) {
        console.warn("Upload failed for file:", file.name, err);
      }
    }

    if (uploadedUrls.length > 0) {
      if (isEdit) {
        setEditForm((prev) => ({
          ...prev,
          photos: [...(prev.photos || []), ...uploadedUrls],
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          photos: [...(prev.photos || []), ...uploadedUrls],
        }));
      }
      showNotification(uploadedUrls.length + " photo(s) added successfully!");
    }
    setUploadingPhotos(false);
  };

  const handleRemovePhoto = (indexToRemove, isEdit = true) => {
    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        photos: (prev.photos || []).filter((_, idx) => idx !== indexToRemove),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        photos: (prev.photos || []).filter((_, idx) => idx !== indexToRemove),
      }));
    }
  };

  const handleAddVideo = (isEdit = true) => {
    if (!newVideoUrl.trim()) return;
    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        videos: [...(prev.videos || []), newVideoUrl.trim()],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        videos: [...(prev.videos || []), newVideoUrl.trim()],
      }));
    }
    setNewVideoUrl("");
  };

  const handleRemoveVideo = (indexToRemove, isEdit = true) => {
    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        videos: (prev.videos || []).filter((_, idx) => idx !== indexToRemove),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        videos: (prev.videos || []).filter((_, idx) => idx !== indexToRemove),
      }));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.imageUrl?.trim()) {
      showNotification("Please upload event image", "error");
      return;
    }
    if (!form.date) {
      showNotification("Please select event date", "error");
      return;
    }
    if (!form.time?.trim()) {
      showNotification("Please enter event time", "error");
      return;
    }
    if (!form.type || (form.type === "CUSTOM" && !form.customType?.trim())) {
      showNotification("Please select event type", "error");
      return;
    }
    if (!form.state?.trim()) {
      showNotification("Please select event state", "error");
      return;
    }
    const resolvedCity = form.city === "CUSTOM" ? form.customCity?.trim() : form.city?.trim();
    if (!resolvedCity) {
      showNotification("Please select or enter event city", "error");
      return;
    }
    if (!form.venue?.trim()) {
      showNotification("Please enter address / venue", "error");
      return;
    }
    if (!form.speaker?.trim()) {
      showNotification("Please enter speaker / industry expert", "error");
      return;
    }
    if (!form.title?.trim()) {
      showNotification("Please enter event title", "error");
      return;
    }
    if (!form.shortDescription?.trim()) {
      showNotification("Please enter event short description", "error");
      return;
    }
    setSubmitting(true);
    try {
      const resolvedCity = form.city === "CUSTOM" ? form.customCity?.trim() : form.city?.trim();
      const submitData = {
        ...form,
        state: form.state.trim(),
        city: resolvedCity,
        type: form.type === "CUSTOM" ? (form.customType || "CUSTOM") : form.type,
      };
      delete submitData.customType;
      delete submitData.customCity;
      const res = await fetch(`${apiUrl}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (res.ok) {
        const isUpcoming = isUpcomingEventDate(submitData.date, submitData.time);
        setActiveTab(isUpcoming ? "upcoming" : "conducted");
        setEvents(data.events || [data.event, ...events]);
        setIsAddOpen(false);
        setForm({ title: "", date: "", time: "", type: "", imageUrl: "", state: "", city: "", customCity: "", venue: "", speaker: "", heading: "", shortDescription: "", description: "", isFeatured: false, customType: "", photos: [], videos: [] });
        setAddCities([]);
        setAddSections([]);
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

  const handleDelete = (id, title) => {
    setConfirmDelete({ id, title });
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    const { id, title } = confirmDelete;
    setDeleting(true);
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
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const toggleFeatured = async (evt) => {
    try {
      const nextVal = !evt.isFeatured;
      const res = await fetch(`${apiUrl}/events/${evt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: nextVal }),
      });
      const data = await res.json();
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => ({
            ...e,
            isFeatured: e.id === evt.id ? nextVal : (nextVal ? false : e.isFeatured),
          }))
        );
        showNotification(nextVal ? `"${evt.title}" is now highlighted on the website!` : `"${evt.title}" removed from highlight.`);
      } else {
        showNotification(data.error || "Failed to update highlight status", "error");
      }
    } catch {
      showNotification("Network error", "error");
    }
  };

  const openEdit = async (evt) => {
    setEditingEventId(evt.id);
    const isStandardType = EVENT_TYPES.some((t) => t.value === evt.type);

    let initialEventState = evt.state || "";
    let initialEventCity = evt.city || "";
    if (!initialEventState && evt.venue) {
      const matched = availableStates.find((st) =>
        evt.venue.toLowerCase().includes(st.toLowerCase())
      );
      if (matched) initialEventState = matched;
    }

    let cities = [];
    if (initialEventState) {
      cities = await fetchCities(initialEventState, apiUrl);
      setEditCities(cities);
    } else {
      setEditCities([]);
    }

    const isCustomCity = Boolean(initialEventCity && cities.length > 0 && !cities.includes(initialEventCity));

    setEditForm({
      title: evt.title || "",
      date: evt.date ? new Date(evt.date).toISOString().split('T')[0] : "",
      time: evt.time || "",
      type: isStandardType ? (evt.type || "") : (evt.type ? "CUSTOM" : ""),
      imageUrl: evt.imageUrl || "",
      state: initialEventState,
      city: isCustomCity ? "CUSTOM" : initialEventCity,
      customCity: isCustomCity ? initialEventCity : "",
      venue: evt.venue || "",
      speaker: evt.speaker || "",
      heading: evt.heading || "",
      shortDescription: evt.shortDescription || "",
      description: evt.description || "",
      isFeatured: evt.isFeatured || false,
      customType: !isStandardType && evt.type ? evt.type : "",
      photos: Array.isArray(evt.photos) ? evt.photos : [],
      videos: Array.isArray(evt.videos) ? evt.videos : [],
    });
    const initialSections = Array.isArray(evt.sections) && evt.sections.length > 0
      ? evt.sections
      : parseDescriptionToSections(evt.description);
    setEditSections(initialSections);
    setNewVideoUrl("");
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.imageUrl?.trim()) {
      showNotification("Please upload event image", "error");
      return;
    }
    if (!editForm.date) {
      showNotification("Please select event date", "error");
      return;
    }
    if (!editForm.time?.trim()) {
      showNotification("Please enter event time", "error");
      return;
    }
    if (!editForm.type || (editForm.type === "CUSTOM" && !editForm.customType?.trim())) {
      showNotification("Please select event type", "error");
      return;
    }
    if (!editForm.state?.trim()) {
      showNotification("Please select event state", "error");
      return;
    }
    const resolvedCity = editForm.city === "CUSTOM" ? editForm.customCity?.trim() : editForm.city?.trim();
    if (!resolvedCity) {
      showNotification("Please select or enter event city", "error");
      return;
    }
    if (!editForm.venue?.trim()) {
      showNotification("Please enter address / venue", "error");
      return;
    }
    if (!editForm.speaker?.trim()) {
      showNotification("Please enter speaker / industry expert", "error");
      return;
    }
    if (!editForm.title?.trim()) {
      showNotification("Please enter event title", "error");
      return;
    }
    if (!editForm.shortDescription?.trim()) {
      showNotification("Please enter event short description", "error");
      return;
    }
    setSubmitting(true);
    try {
      const resolvedCity = editForm.city === "CUSTOM" ? editForm.customCity?.trim() : editForm.city?.trim();
      const submitData = {
        ...editForm,
        state: editForm.state.trim(),
        city: resolvedCity,
        type: editForm.type === "CUSTOM" ? (editForm.customType || "CUSTOM") : editForm.type,
      };
      delete submitData.customType;
      delete submitData.customCity;
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
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 text-white font-medium ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {notification.msg}
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-normal">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Manage Events</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-blue-50 text-blue-700 border border-blue-100">
                  {events.length} Events
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Add, edit, or remove workshops, visits, and convocations
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setForm({ title: "", date: "", time: "", type: "", imageUrl: "", venue: "", speaker: "", heading: "", shortDescription: "", description: "", isFeatured: false, customType: "", photos: [], videos: [] });
            setAddSections([]);
            setIsAddOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Event
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-end my-6">
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
          {activeTab === "upcoming" && conductedEvents.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("conducted")}
              className="mt-4 px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold cursor-pointer transition-colors"
            >
              View {conductedEvents.length} Conducted Event{conductedEvents.length === 1 ? "" : "s"} &rarr;
            </button>
          )}
          {activeTab === "conducted" && upcomingEvents.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className="mt-4 px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold cursor-pointer transition-colors"
            >
              View {upcomingEvents.length} Upcoming Event{upcomingEvents.length === 1 ? "" : "s"} &rarr;
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedEvents.map((evt) => (
            <div key={evt.id} className="bg-white rounded-xl p-0 border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">

              {/* Image Section */}
              <div className="w-full h-52 bg-gray-100 relative group overflow-hidden">
                {evt.isFeatured && (
                  <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900 shadow-md flex items-center gap-1">
                    <Star size={11} className="fill-slate-900" /> Highlighted
                  </span>
                )}
                {evt.imageUrl ? (
                  <img
                    src={resolveImageUrl(evt.imageUrl)}
                    alt={evt.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = "none";
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
                    onClick={(e) => { e.stopPropagation(); toggleFeatured(evt); }}
                    title={evt.isFeatured ? "Remove Highlight" : "Set as Highlighted Event"}
                    className={`w-9 h-9 flex items-center justify-center rounded-full shadow-lg transition-colors cursor-pointer ${
                      evt.isFeatured
                        ? "bg-amber-400 text-slate-900 hover:bg-amber-500"
                        : "bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                    }`}
                  >
                    <Star size={15} className={evt.isFeatured ? "fill-slate-900" : ""} />
                  </button>
                  <button
                    onClick={() => openEdit(evt)}
                    title="Edit"
                    className="w-9 h-9 flex items-center justify-center bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-full shadow-lg transition-colors cursor-pointer"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id, evt.title)}
                    title="Delete Event"
                    className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
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
                  {evt.time && (
                    <span className="text-gray-400 flex items-center gap-0.5 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {evt.time}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-medium text-gray-600 leading-snug line-clamp-2">{evt.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl lg:max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Add New Event</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Fill in the event details to display on the website</p>
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
              <form id="add-event-form" onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Image, Date & Time, Event Type, Venue, Speaker */}
                  <div className="md:col-span-5 space-y-4">
                    {/* Event Image */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Event Image <span className="text-red-500">*</span>
                      </label>
                      <ImageUpload
                        category="events"
                        value={form.imageUrl}
                        onChange={(url) => setForm({ ...form, imageUrl: url })}
                        heightClassName="h-[190px]"
                      />
                    </div>

                    {/* Date & Time Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.time || ""}
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Event Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Event Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={EVENT_TYPES.some((t) => t.value === form.type) ? form.type : (form.type ? "CUSTOM" : "")}
                        onChange={(e) => setForm({ ...form, type: e.target.value, ...(e.target.value !== "CUSTOM" ? { customType: "" } : {}) })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer"
                        required
                      >
                        <option value="">Select</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      {form.type === "CUSTOM" && (
                        <input
                          type="text"
                          value={form.customType || ""}
                          onChange={(e) => setForm({ ...form, customType: e.target.value })}
                          className="w-full mt-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      )}
                    </div>

                    {/* State & City */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.state}
                          onChange={(e) => handleAddStateChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer"
                          required
                        >
                          <option value="">Select State</option>
                          {availableStates.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.city}
                          disabled={!form.state}
                          onChange={(e) => setForm({ ...form, city: e.target.value, ...(e.target.value !== "CUSTOM" ? { customCity: "" } : {}) })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          required
                        >
                          <option value="">{form.state ? "Select City" : "Select State First"}</option>
                          {addCities.map((ct) => (
                            <option key={ct} value={ct}>{ct}</option>
                          ))}
                          {form.state && <option value="CUSTOM">+ Enter Custom City</option>}
                        </select>
                      </div>
                    </div>
                    {form.city === "CUSTOM" && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Enter City Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.customCity || ""}
                          onChange={(e) => setForm({ ...form, customCity: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                    )}

                    {/* Venue & Speaker */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Address / Venue <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.venue}
                          onChange={(e) => setForm({ ...form, venue: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Speaker / Industry Expert <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.speaker}
                          onChange={(e) => setForm({ ...form, speaker: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Title, Short Description, Sections Builder */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Event Title */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Event Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        required
                      />
                    </div>

                    {/* Event Short Description */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Event Short Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={form.shortDescription}
                        onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                        required
                      />
                    </div>

                    {/* Event Sections Builder (Heading & Description) */}
                    <EventSectionsBuilder
                      sections={addSections}
                      onChange={handleAddSectionsChange}
                      hideList={true}
                    />
                  </div>
                </div>

                {/* Added Event Sections List (2 columns: Section 1 on left, Section 2 on right) */}
                <EventSectionsList
                  sections={addSections}
                  onChange={handleAddSectionsChange}
                  entityName="Event"
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
                form="add-event-form"
                disabled={submitting}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Event'}
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
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Edit Event</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Update details, descriptions, or status of this event</p>
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
              <form id="edit-event-form" onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Image, Date & Time, Event Type, Venue, Speaker */}
                  <div className="md:col-span-5 space-y-4">
                    {/* Event Image */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Event Image <span className="text-red-500">*</span>
                      </label>
                      <ImageUpload
                        category="events"
                        value={editForm.imageUrl}
                        onChange={(url) => setEditForm({ ...editForm, imageUrl: url })}
                        heightClassName="h-[190px]"
                      />
                    </div>

                    {/* Date & Time Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editForm.time || ""}
                          onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Event Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Event Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={EVENT_TYPES.some((t) => t.value === editForm.type) ? editForm.type : (editForm.type ? "CUSTOM" : "")}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value, ...(e.target.value !== "CUSTOM" ? { customType: "" } : {}) })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer"
                        required
                      >
                        <option value="">Select</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      {editForm.type === "CUSTOM" && (
                        <input
                          type="text"
                          value={editForm.customType || ""}
                          onChange={(e) => setEditForm({ ...editForm, customType: e.target.value })}
                          className="w-full mt-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      )}
                    </div>

                    {/* State & City */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={editForm.state}
                          onChange={(e) => handleEditStateChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer"
                          required
                        >
                          <option value="">Select State</option>
                          {availableStates.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={editForm.city}
                          disabled={!editForm.state}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value, ...(e.target.value !== "CUSTOM" ? { customCity: "" } : {}) })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          required
                        >
                          <option value="">{editForm.state ? "Select City" : "Select State First"}</option>
                          {editCities.map((ct) => (
                            <option key={ct} value={ct}>{ct}</option>
                          ))}
                          {editForm.state && <option value="CUSTOM">+ Enter Custom City</option>}
                        </select>
                      </div>
                    </div>
                    {editForm.city === "CUSTOM" && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Enter City Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editForm.customCity || ""}
                          onChange={(e) => setEditForm({ ...editForm, customCity: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                    )}

                    {/* Venue & Speaker */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Address / Venue <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editForm.venue}
                          onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Speaker / Industry Expert <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editForm.speaker}
                          onChange={(e) => setEditForm({ ...editForm, speaker: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Title, Short Description, Sections Builder */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Event Title */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Event Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        required
                      />
                    </div>

                    {/* Event Short Description */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Event Short Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.shortDescription}
                        onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                        required
                      />
                    </div>

                    {/* Event Sections Builder (Heading & Description) */}
                    <EventSectionsBuilder
                      sections={editSections}
                      onChange={handleEditSectionsChange}
                      hideList={true}
                    />
                  </div>
                </div>

                {/* Added Event Sections List (2 columns: Section 1 on left, Section 2 on right) */}
                <EventSectionsList
                  sections={editSections}
                  onChange={handleEditSectionsChange}
                  entityName="Event"
                />

                {/* Event Media (Photos & Videos for Conducted Events Only) */}
                {isEditEventConducted && (
                  <div className="pt-5 mt-5 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                        Event Media (Photos &amp; Videos)
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Photos and video highlights shown on the event details page
                      </p>
                    </div>
                  </div>

                  {/* Photos Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                        Photos ({editForm.photos?.length || 0})
                      </label>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingPhotos ? "Uploading..." : "Upload Photos"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={uploadingPhotos}
                          onChange={(e) => handleMultiplePhotos(e.target.files, true)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {editForm.photos && editForm.photos.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-44 overflow-y-auto">
                        {editForm.photos.map((photo, pIdx) => (
                          <div key={pIdx} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200 bg-white shadow-xs">
                            <img
                              src={resolveImageUrl(photo)}
                              alt={"Photo " + (pIdx + 1)}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(pIdx, true)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                              title="Remove"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                        No photos added yet
                      </div>
                    )}
                  </div>

                  {/* Videos Section */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-slate-500" />
                      Videos / YouTube Links ({editForm.videos?.length || 0})
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddVideo(true);
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-black focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddVideo(true)}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium cursor-pointer transition-colors"
                      >
                        Add Video
                      </button>
                    </div>

                    {editForm.videos && editForm.videos.length > 0 && (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {editForm.videos.map((vid, vIdx) => (
                          <div
                            key={vIdx}
                            className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700"
                          >
                            <span className="truncate flex-1 font-mono text-[11px]">{vid}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveVideo(vIdx, true)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Remove video"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                )}
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
                form="edit-event-form"
                disabled={submitting}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centered Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!confirmDelete}
        title="Remove Event"
        itemName={confirmDelete?.title}
        from="Events"
        loading={deleting}
        onConfirm={confirmAndDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Events;
