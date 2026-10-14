import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCheck,
  GraduationCap,
  Mail,
  Handshake,
  Trash2,
  Calendar,
  X,
  ExternalLink,
  Sparkles,
  Inbox,
  Award,
  MessageSquare
} from "lucide-react";
import { getApiUrl } from "../utils";

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'unread'
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bitc_read_notifications") || "[]");
    } catch {
      return [];
    }
  });
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bitc_dismissed_notifications") || "[]");
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const apiUrl = getApiUrl();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Fetch notifications from live endpoints
  const fetchNotifications = async () => {
    setLoading(true);
    const items = [];

    try {
      // 1. Course Applications
      const appsRes = await fetch(`${apiUrl}/admin/applications`).catch(() => null);
      if (appsRes && appsRes.ok) {
        const appsData = await appsRes.json();
        const apps = appsData.applications || [];
        apps.forEach((app) => {
          items.push({
            id: `course-app-${app.id || app.fullId || Math.random()}`,
            type: "course",
            title: "Course Application",
            name: app.name || app.userName || "New Candidate",
            subtitle: app.courseTitle ? `Applied for ${app.courseTitle}` : "New Course Application submitted",
            time: app.appliedAt || app.date || "Recently",
            tab: "Course Applications",
            subTopic: null,
            badgeColor: "bg-blue-100 text-blue-700",
            icon: GraduationCap,
          });
        });
      }

      // 2. Contact Inquiries
      const inqRes = await fetch(`${apiUrl}/contact`).catch(() => null);
      if (inqRes && inqRes.ok) {
        const inqData = await inqRes.json();
        const inqs = inqData.inquiries || [];
        inqs.forEach((inq) => {
          items.push({
            id: `contact-inq-${inq.id || Math.random()}`,
            type: "contact",
            title: "Contact Inquiry",
            name: inq.name || "Visitor",
            subtitle: inq.message ? `"${inq.message.slice(0, 55)}${inq.message.length > 55 ? "..." : ""}"` : `Inquiry from ${inq.city || "Website"}`,
            time: inq.createdAt || "Recently",
            tab: "Contact Inquiries",
            subTopic: "inquiries-list",
            badgeColor: "bg-amber-100 text-amber-700",
            icon: Mail,
          });
        });
      }

      // 3. Partnership Applications
      const partRes = await fetch(`${apiUrl}/partnership-applications`).catch(() => null);
      if (partRes && partRes.ok) {
        const partData = await partRes.json();
        const parts = partData.applications || [];
        parts.forEach((p) => {
          items.push({
            id: `partner-app-${p.id || Math.random()}`,
            type: "partnership",
            title: "Partnership Application",
            name: p.organizationName || p.contactPerson || "Organization",
            subtitle: `${p.type || "MoU Collaboration"} request (${p.city || p.partnershipType || "Partner"})`,
            time: p.appliedAt || p.createdAt || "Recently",
            tab: "Partnerships",
            subTopic: p.type === "corporate" ? "corporate-partnership" : "educational-partnership",
            badgeColor: "bg-purple-100 text-purple-700",
            icon: Handshake,
          });
        });
      }

      // 4. Scholarship Applications
      const schRes = await fetch(`${apiUrl}/scholarships`).catch(() => null);
      if (schRes && schRes.ok) {
        const schData = await schRes.json();
        const schs = schData.applications || [];
        schs.forEach((s) => {
          items.push({
            id: `sch-app-${s.id || s._id || Math.random()}`,
            type: "scholarship",
            title: "Scholarship Application",
            name: s.fullName || s.name || "Student Applicant",
            subtitle: s.course ? `Applied for ${s.course} (${s.category || "Scholarship"})` : `Scholarship request from ${s.city || "Student"}`,
            time: s.createdAt || s.appliedAt || "Recently",
            tab: "Scholarship Applications",
            subTopic: null,
            badgeColor: "bg-emerald-100 text-emerald-700",
            icon: Award,
          });
        });
      }

      // 5. Student Consulting & Direct Inquiries
      const directInqRes = await fetch(`${apiUrl}/inquiries`).catch(() => null);
      if (directInqRes && directInqRes.ok) {
        const directData = await directInqRes.json();
        const dInqs = directData.inquiries || [];
        dInqs.forEach((di) => {
          const isConsulting = di.enquiryType === "Student Consulting";
          items.push({
            id: `direct-inq-${di.id || Math.random()}`,
            type: isConsulting ? "consulting" : "contact",
            title: isConsulting ? "Consultation Request" : "Direct Inquiry",
            name: di.name || "Student / Visitor",
            subtitle: di.message ? `"${di.message.slice(0, 55)}${di.message.length > 55 ? "..." : ""}"` : (di.enquiryType || "Inquiry"),
            time: di.createdAt || "Recently",
            tab: isConsulting ? "Student Consulting" : "Contact Inquiries",
            subTopic: isConsulting ? null : "inquiries-list",
            badgeColor: isConsulting ? "bg-teal-100 text-teal-700" : "bg-amber-100 text-amber-700",
            icon: MessageSquare,
          });
        });
      }

      // 6. Event Registrations
      const eventRes = await fetch(`${apiUrl}/event-registrations`).catch(() => null);
      if (eventRes && eventRes.ok) {
        const eventData = await eventRes.json();
        const evs = eventData.registrations || [];
        evs.forEach((ev) => {
          items.push({
            id: `event-reg-${ev.id || Math.random()}`,
            type: "event",
            title: "Event Registration",
            name: ev.name || "Attendee",
            subtitle: ev.college ? `Registered from ${ev.college}` : "New event participant",
            time: ev.createdAt || "Recently",
            tab: "Events",
            subTopic: "view-registrations",
            badgeColor: "bg-indigo-100 text-indigo-700",
            icon: Calendar,
          });
        });
      }

      // Format time relative if valid date
      items.sort((a, b) => {
        const timeA = new Date(a.time).getTime() || 0;
        const timeB = new Date(b.time).getTime() || 0;
        return timeB - timeA;
      });

      setNotifications(items);
    } catch (err) {
      console.warn("Failed to aggregate notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 10 seconds for real-time form submission updates
    const timer = setInterval(fetchNotifications, 10000);

    const onFocus = () => fetchNotifications();
    window.addEventListener("focus", onFocus);
    window.addEventListener("bitc:refresh-notifications", onFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("bitc:refresh-notifications", onFocus);
    };
  }, []);

  // Filter out dismissed items
  const activeNotifications = notifications.filter(
    (n) => !dismissedIds.includes(n.id)
  );

  const unreadCount = activeNotifications.filter(
    (n) => !readIds.includes(n.id)
  ).length;

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        localStorage.setItem("bitc_read_notifications", JSON.stringify(updated));
      } catch {}
    }
  };

  const markAllAsRead = () => {
    const allIds = activeNotifications.map((n) => n.id);
    const merged = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(merged);
    try {
      localStorage.setItem("bitc_read_notifications", JSON.stringify(merged));
    } catch {}
  };

  const dismissNotification = (e, id) => {
    e.stopPropagation();
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem("bitc_dismissed_notifications", JSON.stringify(updated));
    } catch {}
  };

  const clearAllNotifications = () => {
    const allIds = notifications.map((n) => n.id);
    setDismissedIds(allIds);
    try {
      localStorage.setItem("bitc_dismissed_notifications", JSON.stringify(allIds));
    } catch {}
  };

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    setIsOpen(false);

    // Dispatch global navigation event to Sidebar
    window.dispatchEvent(
      new CustomEvent("bitc:navigate", {
        detail: {
          tab: item.tab,
          subTopic: item.subTopic,
        },
      })
    );
  };

  const displayedList = activeNotifications.filter((n) => {
    if (activeFilter === "unread") return !readIds.includes(n.id);
    return true;
  });

  const formatDisplayTime = (timeString) => {
    if (!timeString || timeString === "Recently") return "Just now";
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return timeString;
      const now = new Date();
      const diffMin = Math.floor((now - date) / (1000 * 60));
      if (diffMin < 1) return "Just now";
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Bell Icon Button ── */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        title="Notifications"
        aria-label="Open notifications"
        className={`relative p-2.5 rounded-full border border-slate-200 transition-all cursor-pointer ${
          isOpen
            ? "bg-blue-50 text-blue-600 border-blue-300 shadow-xs"
            : "bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 shadow-2xs"
        }`}
      >
        <Bell className="w-5 h-5 transition-transform group-hover:scale-105" />

        {/* Pulse Unread Dot & Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Notification Dropdown Menu ── */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Recent incoming inquiries & applications</p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                All ({activeNotifications.length})
              </button>
              <button
                onClick={() => setActiveFilter("unread")}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  activeFilter === "unread"
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {activeNotifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-[10px] font-semibold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* List of Notification Items */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {loading && notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">Loading notifications...</p>
              </div>
            ) : displayedList.length === 0 ? (
              <div className="py-12 px-4 text-center text-slate-400">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mx-auto mb-2">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">No notifications found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {activeFilter === "unread"
                    ? "You've read all your notifications!"
                    : "You're all caught up. No new activities."}
                </p>
              </div>
            ) : (
              displayedList.map((item) => {
                const isRead = readIds.includes(item.id);
                const ItemIcon = item.icon || Bell;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`group p-3.5 flex items-start gap-3 transition-all cursor-pointer ${
                      isRead ? "bg-white hover:bg-slate-50/80 opacity-80" : "bg-blue-50/40 hover:bg-blue-50/70"
                    }`}
                  >
                    {/* Category Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${item.badgeColor}`}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {formatDisplayTime(item.time)}
                        </span>
                      </div>

                      <p
                        className={`text-xs leading-snug truncate ${
                          isRead ? "font-semibold text-slate-700" : "font-extrabold text-slate-900"
                        }`}
                      >
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold text-blue-600 group-hover:underline flex items-center gap-0.5">
                          Open in {item.tab} &rarr;
                        </span>
                      </div>
                    </div>

                    {/* Right Action Icons: Unread dot & Dismiss button */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0 self-center">
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-100" />
                      )}
                      <button
                        onClick={(e) => dismissNotification(e, item.id)}
                        title="Dismiss"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live synchronization with BITC API
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
