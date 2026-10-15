import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCheck,
  GraduationCap,
  Mail,
  Handshake,
  Calendar,
  X,
  Inbox,
  Award,
  MessageSquare,
  Briefcase,
  Layers,
} from "lucide-react";
import { getApiUrl } from "../utils";

// Filter Category Options
const CATEGORIES = [
  { key: "all", label: "All", icon: Layers },
  { key: "unread", label: "Unread", icon: Bell },
  { key: "contact", label: "Contact Inquiries", icon: Mail, tab: "Contact Inquiries" },
  { key: "consulting", label: "Student Consulting", icon: MessageSquare, tab: "Student Consulting" },
  { key: "course", label: "Course Applications", icon: GraduationCap, tab: "Course Applications" },
  { key: "scholarship", label: "Scholarship Applications", icon: Award, tab: "Scholarship Applications" },
  { key: "faculty", label: "Faculty Applications", icon: Briefcase, tab: "Faculty Applications" },
  { key: "partnership", label: "Partnerships", icon: Handshake, tab: "Partnerships" },
  { key: "event", label: "Events", icon: Calendar, tab: "Events" },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
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

  // Fetch notifications across all inquiry & application streams
  const fetchNotifications = async () => {
    setLoading(true);
    const items = [];

    try {
      // 1. Course Applications (/api/admin/applications)
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
            badgeColor: "bg-blue-50 text-blue-700",
            icon: GraduationCap,
          });
        });
      }

      // 2. Contact Inquiries (/api/contact)
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
            badgeColor: "bg-amber-50 text-amber-700",
            icon: Mail,
          });
        });
      }

      // 3. Partnership Applications (/api/partnership-applications)
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
            badgeColor: "bg-purple-50 text-purple-700",
            icon: Handshake,
          });
        });
      }

      // 4. Scholarship Applications (/api/scholarships)
      let schRes = await fetch(`${apiUrl}/scholarships`).catch(() => null);
      if (!schRes || !schRes.ok) {
        schRes = await fetch("https://bitc.bizonance.com/api/scholarships").catch(() => null);
      }
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
            badgeColor: "bg-emerald-50 text-emerald-700",
            icon: Award,
          });
        });
      }

      // 5. Student Consulting & Direct Inquiries (/api/inquiries)
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
            badgeColor: isConsulting ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700",
            icon: MessageSquare,
          });
        });
      }

      // 6. Faculty Applications (/api/join-team)
      const facultyRes = await fetch(`${apiUrl}/join-team`).catch(() => null);
      if (facultyRes && facultyRes.ok) {
        const facultyData = await facultyRes.json();
        const facultyList = Array.isArray(facultyData) ? facultyData : (facultyData.applications || []);
        facultyList.forEach((fac) => {
          items.push({
            id: `faculty-app-${fac._id || fac.id || Math.random()}`,
            type: "faculty",
            title: "Faculty Application",
            name: fac.name || "Faculty Applicant",
            subtitle: fac.role ? `Applied for ${fac.role}${fac.department ? ` (${fac.department})` : ""}` : "New Faculty Application received",
            time: fac.createdAt || "Recently",
            tab: "Faculty Applications",
            subTopic: null,
            badgeColor: "bg-rose-50 text-rose-700",
            icon: Briefcase,
          });
        });
      }

      // 7. Event Registrations (/api/event-registrations)
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
            badgeColor: "bg-indigo-50 text-indigo-700",
            icon: Calendar,
          });
        });
      }

      // Sort by newest first
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
    const targetIds = displayedList.map((n) => n.id);
    const merged = Array.from(new Set([...readIds, ...targetIds]));
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
    if (activeFilter === "all") {
      const allIds = notifications.map((n) => n.id);
      setDismissedIds(allIds);
      try {
        localStorage.setItem("bitc_dismissed_notifications", JSON.stringify(allIds));
      } catch {}
    } else {
      const filterIds = displayedList.map((n) => n.id);
      const updated = Array.from(new Set([...dismissedIds, ...filterIds]));
      setDismissedIds(updated);
      try {
        localStorage.setItem("bitc_dismissed_notifications", JSON.stringify(updated));
      } catch {}
    }
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

  // Get count for a category key
  const getCategoryCount = (key) => {
    if (key === "all") return activeNotifications.length;
    if (key === "unread") return unreadCount;
    return activeNotifications.filter((n) => n.type === key).length;
  };

  // Filter items based on active selection
  const displayedList = activeNotifications.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !readIds.includes(n.id);
    return n.type === activeFilter;
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

  const getEmptyMessage = () => {
    switch (activeFilter) {
      case "unread":
        return {
          title: "No unread notifications",
          desc: "You have caught up with all incoming updates.",
        };
      case "contact":
        return {
          title: "No contact inquiries",
          desc: "No inquiries submitted from website contact forms.",
        };
      case "consulting":
        return {
          title: "No consulting requests",
          desc: "No pending student consulting requests.",
        };
      case "course":
        return {
          title: "No course applications",
          desc: "No new course applications received yet.",
        };
      case "scholarship":
        return {
          title: "No scholarship applications",
          desc: "No new scholarship applications at this moment.",
        };
      case "faculty":
        return {
          title: "No faculty applications",
          desc: "No new faculty applications submitted.",
        };
      case "partnership":
        return {
          title: "No partnership requests",
          desc: "No pending corporate or educational partnership applications.",
        };
      case "event":
        return {
          title: "No event registrations",
          desc: "No new event participant registrations.",
        };
      default:
        return {
          title: "No notifications found",
          desc: "You're all caught up. No new activities.",
        };
    }
  };

  const emptyState = getEmptyMessage();

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
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white shadow-xs animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Notification Dropdown Menu ── */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[340px] sm:w-[440px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-normal text-slate-800 text-sm tracking-tight flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-normal bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-500 font-normal">Recent incoming inquiries & applications</p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="text-[11px] font-normal text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* Filter Pills Navigation Bar (Scrollable with category options) */}
          <div className="px-3 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-2">
            <div 
              className="flex items-center gap-1.5 overflow-x-auto py-0.5 scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {CATEGORIES.map((cat) => {
                const count = getCategoryCount(cat.key);
                const isActive = activeFilter === cat.key;
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveFilter(cat.key)}
                    className={`px-2.5 py-1 rounded-full text-xs font-normal flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-800 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
                    }`}
                  >
                    <CatIcon className="w-3 h-3 opacity-70" />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-slate-700 text-slate-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeNotifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                title="Clear notifications"
                className="text-[11px] font-normal text-slate-400 hover:text-red-600 shrink-0 px-1.5 py-0.5 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* List of Notification Items */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {loading && notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-normal text-slate-500">Loading notifications...</p>
              </div>
            ) : displayedList.length === 0 ? (
              <div className="py-12 px-4 text-center text-slate-400">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mx-auto mb-2">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-xs font-normal text-slate-700">{emptyState.title}</p>
                <p className="text-[11px] font-normal text-slate-400 mt-0.5">
                  {emptyState.desc}
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
                      isRead ? "bg-white hover:bg-slate-50/80 opacity-80" : "bg-blue-50/30 hover:bg-blue-50/60"
                    }`}
                  >
                    {/* Category Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 mt-0.5 ${item.badgeColor}`}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-normal text-slate-400">
                          {formatDisplayTime(item.time)}
                        </span>
                      </div>

                      <p
                        className={`text-xs leading-snug truncate ${
                          isRead ? "font-normal text-slate-600" : "font-medium text-slate-800"
                        }`}
                      >
                        {item.name}
                      </p>
                      <p className="text-[11px] font-normal text-slate-500 line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-normal text-blue-600 group-hover:underline flex items-center gap-0.5">
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
            <span className="text-[10px] font-normal text-slate-400 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live synchronization with BITC API
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
