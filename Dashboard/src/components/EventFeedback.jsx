import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Star,
  Users,
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Check,
  X,
  Search,
  Sparkles,
  Share2,
  AlertCircle,
  Frown,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { getApiUrl, getSiteUrl, resolveImageUrl, isUpcomingEventDate, parseEventEndTimestamp, parseEventStartTimestamp } from "../utils";
import DeleteConfirmModal from "./uic/DeleteConfirmModal.jsx";

const isGhostForm = (f) => {
  if (!f) return true;
  const title = String(f.eventTitle || "").trim();
  if (!title) return true;

  const t = title.toLowerCase();
  if (t === "test" || t === "sdfdf" || t === "dummy") return true;
  if (/^efb[-_\s0-9]{10,}$/i.test(t)) return true;
  if (/^form[-_\s0-9]{10,}$/i.test(t)) return true;
  if (/^form\s+[a-z0-9]{12,}$/i.test(title)) return true;

  return false;
};

export default function EventFeedback() {
  const [forms, setForms] = useState(() => {
    try {
      const cached = localStorage.getItem("bitc_event_feedback_forms");
      const parsed = cached ? JSON.parse(cached) : [];
      const clean = Array.isArray(parsed) ? parsed.filter((f) => !isGhostForm(f)) : [];
      if (clean.length !== (parsed ? parsed.length : 0)) {
        localStorage.setItem("bitc_event_feedback_forms", JSON.stringify(clean));
      }
      return clean;
    } catch {
      return [];
    }
  });
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [createForm, setCreateForm] = useState({
    eventTitle: "",
    speakerName: "",
    eventDate: new Date().toISOString().split("T")[0],
    posterUrl: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);

  // Submissions Popup Modal
  const [selectedFormForSubmissions, setSelectedFormForSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Copy Link State
  const [copiedId, setCopiedId] = useState(null);

  // Delete Confirm Modal
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, title }
  const [deleting, setDeleting] = useState(false);

  const apiUrl = getApiUrl();
  const siteUrl = getSiteUrl();

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Helper to fetch from primary backend API with fallback to site API
  const fetchWithFallback = async (endpointPath, options = {}) => {
    const primaryApi = (apiUrl || getApiUrl()).replace(/\/+$/, "");
    const siteBase = (siteUrl || getSiteUrl()).replace(/\/+$/, "");

    // 1. Primary: Central backend API
    try {
      const res = await fetch(`${primaryApi}${endpointPath}`, options);
      if (res && (res.ok || res.status < 500)) {
        // For mutations (POST, DELETE, PUT), sync to siteBase in background
        if (options.method && options.method !== "GET") {
          try {
            fetch(`${siteBase}/api${endpointPath}`, options).catch(() => {});
          } catch {}
        }
        return res;
      }
    } catch (e) {
      console.warn(`[EventFeedback] Primary API error for ${endpointPath}:`, e);
    }

    // 2. Fallback to site API
    try {
      const res = await fetch(`${siteBase}/api${endpointPath}`, options);
      return res;
    } catch (e) {
      console.warn(`[EventFeedback] Site API error for ${endpointPath}:`, e);
      throw e;
    }
  };

  // Fetch all feedback forms
  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await fetchWithFallback("/event-feedback/forms");
      if (res && res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.forms)) {
          const cleanForms = data.forms.filter((f) => !isGhostForm(f));
          setForms(cleanForms);
          try {
            localStorage.setItem("bitc_event_feedback_forms", JSON.stringify(cleanForms));
          } catch { }
        }
      } else {
        console.warn(`[EventFeedback] fetchForms could not load forms (status: ${res?.status})`);
      }
    } catch (err) {
      console.warn("Feedback forms fetch notice:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing events to quickly prefill create form
  const fetchExistingEvents = async () => {
    try {
      // 1. Primary: Central backend API where events are created and stored
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/events`);
      if (res && res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.events)) {
          setEventsList(data.events);
          try {
            localStorage.removeItem("bitc_events_cache");
          } catch { }
          return;
        }
      }
    } catch (e) {
      console.warn("[EventFeedback] Failed to fetch events from primary API:", e);
    }

    try {
      // 2. Fallback: Site API
      const res = await fetchWithFallback("/events");
      if (res && res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.events)) {
          setEventsList(data.events);
          try {
            localStorage.removeItem("bitc_events_cache");
          } catch { }
        }
      }
    } catch (e) {
      // non-blocking
    }
  };

  useEffect(() => {
    fetchForms();
    fetchExistingEvents();
  }, []);

  // Re-fetch events when opening the create modal to guarantee up-to-date dropdown
  useEffect(() => {
    if (isCreateOpen) {
      fetchExistingEvents();
    }
  }, [isCreateOpen]);

  const normalizeStr = (s) => String(s || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");

  // Check if an event already has a feedback form created (prevent duplicate creation)
  const isEventAlreadyCreated = (ev) => {
    if (!ev) return false;
    const evIdStr = String(ev.id || "").toLowerCase().trim();
    const evTitleNorm = normalizeStr(ev.title);

    return forms.some((f) => {
      if (!f) return false;
      const fEventId = String(f.eventId || "").toLowerCase().trim();
      const fId = String(f.id || "").toLowerCase().trim();
      const fTitleNorm = normalizeStr(f.eventTitle);

      // 1. Direct eventId or form-id match
      if (evIdStr && (fEventId === evIdStr || fId === `form-${evIdStr}` || fId === evIdStr)) {
        return true;
      }
      // 2. Exact normalized title match
      if (evTitleNorm && fTitleNorm && evTitleNorm === fTitleNorm) {
        return true;
      }
      return false;
    });
  };

  // Filter strictly conducted events that do NOT already have a feedback form
  const availableEventsList = useMemo(() => {
    return eventsList
      .filter((ev) => ev && ev.title && ev.date && !isUpcomingEventDate(ev.date, ev.time) && !isEventAlreadyCreated(ev))
      .sort((a, b) => (parseEventEndTimestamp(b.date, b.time) || 0) - (parseEventEndTimestamp(a.date, a.time) || 0));
  }, [eventsList, forms]);

  // When selecting an existing event in the create modal
  const handleSelectEvent = (eId) => {
    setSelectedEventId(eId);
    if (!eId) {
      setCreateForm({
        eventTitle: "",
        speakerName: "",
        eventDate: new Date().toISOString().split("T")[0],
        posterUrl: "",
        description: "",
      });
      return;
    }

    const ev =
      availableEventsList.find((item) => String(item.id) === String(eId)) ||
      eventsList.find((item) => String(item.id) === String(eId));

    if (ev) {
      setCreateForm({
        eventTitle: ev.title || "",
        speakerName: ev.speaker || "",
        eventDate: ev.date ? new Date(ev.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        posterUrl: ev.imageUrl || "",
        description: ev.shortDescription || "",
      });
    }
  };

  // Create a new feedback form
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      showNotification("Please select an event", "error");
      return;
    }
    if (!createForm.eventTitle.trim() || !createForm.speakerName.trim()) {
      showNotification("Please provide Event Title and Speaker Name", "error");
      return;
    }

    // Explicit safeguard against duplicate creation
    const alreadyExists = forms.some(
      (f) =>
        (selectedEventId && f.eventId && String(f.eventId) === String(selectedEventId)) ||
        (f.eventTitle && normalizeStr(f.eventTitle) === normalizeStr(createForm.eventTitle))
    );
    if (alreadyExists) {
      showNotification("A feedback form for this event has already been created.", "error");
      return;
    }

    setCreating(true);
    try {
      const res = await fetchWithFallback("/event-feedback/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          eventId: selectedEventId || null,
        }),
      });

      if (!res || !res.ok) {
        let errMessage = `Failed to create feedback form (Server returned ${res?.status || "error"})`;
        try {
          const errData = await res.json();
          if (errData?.error) errMessage = errData.error;
        } catch { }
        showNotification(errMessage, "error");
        return;
      }

      const data = await res.json();
      if (data.success) {
        const updated = [data.form, ...forms];
        setForms(updated);
        try {
          localStorage.setItem("bitc_event_feedback_forms", JSON.stringify(updated));
        } catch { }
        setIsCreateOpen(false);
        setCreateForm({
          eventTitle: "",
          speakerName: "",
          eventDate: new Date().toISOString().split("T")[0],
          posterUrl: "",
          description: "",
        });
        setSelectedEventId("");
        showNotification("Feedback form created successfully!");
      } else {
        showNotification(data.error || "Failed to create feedback form", "error");
      }
    } catch (err) {
      showNotification("Network or server error. Please ensure API backend is running.", "error");
    } finally {
      setCreating(false);
    }
  };

  // Delete a feedback form with custom dashboard modal
  const handleDeleteClick = (e, item) => {
    e.stopPropagation();
    setConfirmDelete({ id: item.id, title: item.eventTitle });
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await fetchWithFallback(`/event-feedback/forms/${confirmDelete.id}`, {
        method: "DELETE",
      });
      if (res && res.ok) {
        const data = await res.json().catch(() => ({ success: true }));
        if (data.success !== false) {
          setForms((prev) => {
            const updated = prev.filter((f) => f.id !== confirmDelete.id);
            try {
              localStorage.setItem("bitc_event_feedback_forms", JSON.stringify(updated));
            } catch { }
            return updated;
          });
          showNotification(`Feedback form for "${confirmDelete.title}" deleted`);
          setConfirmDelete(null);
          return;
        }
      }
      let errMsg = "Failed to delete form";
      try {
        const errData = await res.json();
        if (errData?.error) errMsg = errData.error;
      } catch { }
      showNotification(errMsg, "error");
    } catch (err) {
      showNotification("Failed to delete form", "error");
    } finally {
      setDeleting(false);
    }
  };

  const slugify = (title) => {
    return (title || "")
      .toLowerCase()
      .trim()
      .replace(/ & /g, "-")
      .replace(/[\/\s_]+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const getFormSlug = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    return item.slug || slugify(item.eventTitle) || item.id;
  };

  // Copy shareable public link with event name slug strictly generated from .env
  const getPublicUrl = (formItem) => {
    const slug = getFormSlug(formItem);
    const siteBase = (siteUrl || getSiteUrl()).replace(/\/+$/, "");
    return `${siteBase}/events/feedback/${slug}`;
  };

  const handleCopyLink = (formItem) => {
    const url = getPublicUrl(formItem);
    const id = typeof formItem === "object" && formItem !== null ? formItem.id : formItem;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      showNotification("Feedback form link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Open Submissions Popup Modal
  const openSubmissionsModal = async (formItem) => {
    setSelectedFormForSubmissions(formItem);
    setLoadingSubmissions(true);

    try {
      const res = await fetchWithFallback(`/event-feedback/forms/${formItem.id}/submissions`);
      if (res && res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubmissions(data.submissions || []);
          // update form stats in local state
          if (data.form) {
            setSelectedFormForSubmissions(data.form);
            setForms((prev) => prev.map((f) => (f.id === formItem.id ? data.form : f)));
          }
        }
      }
    } catch (err) {
      console.warn("Failed to load submissions:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Filter strictly attended feedback records ("do not show not attending recourd")
  const attendedSubmissions = useMemo(() => {
    return submissions.filter(
      (sub) =>
        sub.attended !== false &&
        sub.name &&
        sub.name !== "Non-Attending Visitor" &&
        sub.rating
    );
  }, [submissions]);

  // Count of people who selected "Not attending event"
  const notAttendedCount = useMemo(() => {
    const countFromSubs = submissions.filter(
      (sub) => sub.attended === false || sub.name === "Non-Attending Visitor"
    ).length;
    return countFromSubs || selectedFormForSubmissions?.notAttendedCount || 0;
  }, [submissions, selectedFormForSubmissions]);

  // Get strictly attended feedback response count (excluding not-attending records)
  const getFeedbackResponseCount = (item) => {
    if (!item) return 0;
    if (typeof item.attendedCount === "number") {
      return item.attendedCount;
    }
    if (typeof item.ratingsCount === "number" && item.ratingsCount > 0) {
      return item.ratingsCount;
    }
    const total = item.totalSubmissions || 0;
    const notAttended = item.notAttendedCount || 0;
    if (total > 0 && notAttended > 0) {
      return Math.max(0, total - notAttended);
    }
    return total;
  };

  // Calculate Overall Statistics across all forms
  const totalSubmissionsCount = forms.reduce((acc, f) => acc + (f.totalSubmissions || 0), 0);
  const totalAttendedCount = forms.reduce((acc, f) => acc + getFeedbackResponseCount(f), 0);
  const formsWithRatings = forms.filter((f) => (f.ratingsCount || 0) > 0);
  const overallAvgRating =
    formsWithRatings.length > 0
      ? (
        formsWithRatings.reduce((acc, f) => acc + (f.averageRating || 0), 0) /
        formsWithRatings.length
      ).toFixed(1)
      : "0.0";

  return (
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 text-left animate-in fade-in duration-200">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-2xl shadow-xl z-50 text-white font-medium text-xs flex items-center gap-2 animate-in slide-in-from-top-3 ${notification.type === "error" ? "bg-red-500" : "bg-emerald-600"
            }`}
        >
          <Check className="w-4 h-4" />
          {notification.msg}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-normal">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Event Feedback Forms
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Create feedback forms, share links with attendees, and monitor dynamic ratings & responses.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Feedback Form
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Feedback Forms</span>
          <p className="text-2xl font-bold text-slate-900">{forms.length}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Total Responses</span>
          <p className="text-2xl font-bold text-slate-900">{totalAttendedCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Overall Rating</span>
          <div className="flex items-center gap-1.5">
            <p className="text-2xl font-bold text-slate-900">{overallAvgRating}</p>
            <div className="flex text-amber-400">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Attendance Rate</span>
          <p className="text-2xl font-bold text-slate-900">
            {totalSubmissionsCount > 0
              ? `${Math.round((totalAttendedCount / totalSubmissionsCount) * 100)}%`
              : "0%"}
          </p>
        </div>
      </div>

      {/* Forms Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">
            All Event Feedback Forms
          </h3>
          <span className="text-xs text-slate-400">
            Click any row to view full attendee feedback popup
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Loading feedback forms...
          </div>
        ) : forms.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">No Feedback Forms Created Yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first feedback form for an upcoming or conducted event and share the link with attendees.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create First Form
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EDF2FA] text-[#294B7A] text-xs font-semibold border-b border-slate-200/60">
                <tr>
                  <th className="py-3.5 px-6">Event Name</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Speaker</th>
                  <th className="py-3.5 px-4">Average Rating</th>
                  <th className="py-3.5 px-4">Responses</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {forms.map((item) => {
                  const avg = item.averageRating || 0;
                  const count = getFeedbackResponseCount(item);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => openSubmissionsModal(item)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Event Name & Poster */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {item.posterUrl ? (
                            <img
                              src={resolveImageUrl(item.posterUrl)}
                              alt={item.eventTitle}
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (!target.src.includes("bitcapi.bizonance.com")) {
                                  const clean = item.posterUrl.startsWith('/') ? item.posterUrl : `/${item.posterUrl}`;
                                  target.src = `https://bitcapi.bizonance.com${clean}`;
                                } else {
                                  target.style.display = "none";
                                  const fallbackEl = target.parentElement?.querySelector(".feedback-poster-fallback");
                                  if (fallbackEl) fallbackEl.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className="feedback-poster-fallback w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 font-bold"
                            style={{ display: item.posterUrl ? "none" : "flex" }}
                          >
                            {item.eventTitle ? item.eventTitle.charAt(0) : "E"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.eventTitle}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                        {item.eventDate ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {new Date(item.eventDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Speaker */}
                      <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.speakerName}</span>
                        </div>
                      </td>

                      {/* Dynamic Average Rating */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {avg > 0 ? (
                          <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{avg} / 5</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs font-normal">
                            No ratings yet
                          </span>
                        )}
                      </td>

                      {/* Responses Count */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {count} {count === 1 ? "response" : "responses"}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {/* Copy Link */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(item)}
                            title="Copy Public Link"
                            className={`h-8 px-3 rounded-full border shadow-xs text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 ${copiedId === item.id
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
                              : "bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-slate-200 hover:border-blue-200"
                              }`}
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check size={14} className="text-emerald-600" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} className="text-slate-500" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          {/* Delete Form */}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(e, item)}
                            title="Delete Feedback Form"
                            className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* POPUP MODAL: View All User Info / Submissions for that Event */}
      {selectedFormForSubmissions && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  Event Submissions
                </span>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {selectedFormForSubmissions.eventTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {selectedFormForSubmissions.speakerName}
                  </span>
                  {selectedFormForSubmissions.eventDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(selectedFormForSubmissions.eventDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFormForSubmissions(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Stats Summary Strip inside Modal */}
            <div className="grid grid-cols-3 gap-3 px-6 py-3.5 bg-slate-100/60 border-b border-slate-200/60 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Average Rating</span>
                <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{selectedFormForSubmissions.averageRating || 0} / 5</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Total Feedback Responses</span>
                <span className="font-bold text-slate-900 text-sm">
                  {attendedSubmissions.length}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Not Attending Event</span>
                <span className="font-bold text-rose-600 text-sm">
                  {notAttendedCount}
                </span>
              </div>
            </div>

            {/* Submissions Table Body */}
            <div className="overflow-y-auto flex-1">
              {loadingSubmissions ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  Loading attendee responses...
                </div>
              ) : attendedSubmissions.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">No Responses Found</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Share the feedback form link with event attendees to start gathering reviews!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#EDF2FA] text-[#294B7A] text-[11px] font-bold border-b border-slate-200/60 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Contact Number</th>
                        <th className="px-6 py-4">Rating</th>
                        <th className="px-6 py-4">Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {attendedSubmissions.map((sub, sIdx) => {
                        const createdDate = sub.createdAt ? new Date(sub.createdAt) : new Date();
                        const day = createdDate.getDate().toString().padStart(2, "0");
                        const month = (createdDate.getMonth() + 1).toString().padStart(2, "0");
                        const year = createdDate.getFullYear();
                        const formattedDate = `${day}-${month}-${year}`;
                        const formattedTime = createdDate.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });

                        return (
                          <tr
                            key={sub.id || sIdx}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            {/* Date */}
                            <td className="px-6 py-4 align-middle whitespace-nowrap">
                              <p className="font-medium text-[#64748B] text-[12px]">{formattedDate}</p>
                              <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">{formattedTime}</p>
                            </td>

                            {/* Name */}
                            <td className="px-6 py-4 align-middle max-w-[180px]">
                              <p className="font-normal text-[#64748B] text-[13px] truncate">
                                {sub.name || "Anonymous Attendee"}
                              </p>
                            </td>

                            {/* Contact Number */}
                            <td className="px-6 py-4 align-middle whitespace-nowrap">
                              <p className="text-[12px] text-[#475569] font-medium font-mono">
                                {sub.phone || "—"}
                              </p>
                            </td>

                            {/* Rating */}
                            <td className="px-6 py-4 align-middle whitespace-nowrap">
                              {sub.rating ? (
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-3.5 h-3.5 ${star <= sub.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-200"
                                        }`}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[#94A3B8] text-[12px]">—</span>
                              )}
                            </td>

                            {/* Feedback (single line with clean hover popover) */}
                            <td className="px-6 py-4 align-middle max-w-[340px]">
                              {sub.feedback ? (
                                <div className="relative group inline-block max-w-full">
                                  <p
                                    className="text-[#475569] text-[13px] truncate cursor-pointer group-hover:text-slate-900 group-hover:bg-slate-100/90 px-2 py-0.5 -mx-2 rounded-lg transition-colors"
                                    title={sub.feedback}
                                  >
                                    {sub.feedback}
                                  </p>

                                  {/* Simple Styled Popover on Mouse Hover */}
                                  <div
                                    className={`absolute left-0 ${sIdx === 0 ? "top-full mt-2" : "bottom-full mb-2"
                                      } hidden group-hover:block z-50 min-w-[200px] max-w-sm px-3.5 py-2.5 bg-white text-slate-800 text-[12px] rounded-2xl shadow-xl border border-slate-200/90 pointer-events-none animate-in fade-in zoom-in-95 duration-150`}
                                  >
                                    <p className="leading-relaxed whitespace-pre-wrap break-words text-slate-700 font-normal">
                                      {sub.feedback}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[#94A3B8] text-[12px] italic">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {attendedSubmissions.length} response{attendedSubmissions.length === 1 ? "" : "s"}</span>
              <button
                type="button"
                onClick={() => setSelectedFormForSubmissions(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE FEEDBACK FORM MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Create Event Feedback Form</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generate a shareable public feedback link for an event
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-4 text-left">
              {/* Select Event (Mandatory) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Event <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={selectedEventId}
                  onChange={(e) => handleSelectEvent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">
                    {eventsList.length === 0
                      ? "No events found (Create an event in Manage Events first)"
                      : availableEventsList.length === 0
                      ? "All conducted events already have feedback forms created"
                      : "Select Event"}
                  </option>
                  {availableEventsList.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} {ev.speaker ? `(${ev.speaker})` : ""} {ev.date ? `• ${new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createForm.eventTitle}
                  onChange={(e) => setCreateForm({ ...createForm, eventTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              {/* Speaker & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Speaker / Expert Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.speakerName}
                    onChange={(e) => setCreateForm({ ...createForm, speakerName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={createForm.eventDate}
                    onChange={(e) => setCreateForm({ ...createForm, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Poster Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Event Poster / Image URL
                </label>
                <input
                  type="text"
                  value={createForm.posterUrl}
                  onChange={(e) => setCreateForm({ ...createForm, posterUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description / Note for Attendees (Optional)
                </label>
                <textarea
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-y"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {creating ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Centered Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!confirmDelete}
        title="Remove Feedback Form"
        itemName={confirmDelete?.title}
        from="Event Feedback"
        loading={deleting}
        onConfirm={confirmAndDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

