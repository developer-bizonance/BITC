import React, { useState, useEffect } from "react";
import {
  Bell,
  Search,
  RefreshCw,
  Trash2,
  Download,
} from "lucide-react";
import { getApiUrl, getSiteUrl, useRecordHighlight } from "../utils";
import { WhatsAppButton } from "./uic/WhatsAppButton";
import DeleteConfirmModal from "./uic/DeleteConfirmModal.jsx";

const EventSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }
  const [deletingId, setDeletingId] = useState(null);

  const { highlightTarget, isHighlighted } = useRecordHighlight("Events");

  useEffect(() => {
    if (highlightTarget) {
      setSearchQuery("");
    }
  }, [highlightTarget]);

  const apiUrl = getApiUrl();
  const fallbackUrl = `${getSiteUrl()}/api/event-subscribers`;

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const map = new Map();
      const addList = (items) => {
        if (!Array.isArray(items)) return;
        for (const item of items) {
          if (!item) continue;
          const key = (item.id || item._id || item.email || "").toString().trim().toLowerCase();
          if (key) {
            if (map.has(key)) {
              map.set(key, { ...item, ...map.get(key) });
            } else {
              map.set(key, item);
            }
          }
        }
      };

      // 1. Primary backend
      try {
        const res = await fetch(`${apiUrl}/event-subscribers`);
        if (res.ok) {
          const data = await res.json();
          addList(data.subscribers || (Array.isArray(data) ? data : []));
        }
      } catch (err) {
        console.warn("Primary event-subscribers notice:", err);
      }

      // 2. CMS backend
      try {
        const cmsRes = await fetch(`${apiUrl}/cms/event-subscribers`);
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          addList(Array.isArray(cmsData) ? cmsData : (cmsData.data || cmsData.subscribers || []));
        }
      } catch (cmsErr) {
        console.warn("CMS event-subscribers notice:", cmsErr);
      }

      // 3. Fallback website
      try {
        const fbRes = await fetch(fallbackUrl);
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          addList(fbData.subscribers || (Array.isArray(fbData) ? fbData : []));
        }
      } catch (fbErr) {
        console.warn("Fallback event-subscribers notice:", fbErr);
      }

      const merged = Array.from(map.values()).sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      setSubscribers(merged);
    } catch (err) {
      console.warn("Failed to fetch event subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = (id, name) => {
    setConfirmDelete({ id, name });
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    const { id } = confirmDelete;
    setDeletingId(id);
    try {
      setSubscribers((prev) => prev.filter((s) => s.id !== id && s._id !== id));

      // Direct CMS sync
      const syncCms = (async () => {
        try {
          const cmsRes = await fetch(`${apiUrl}/cms/event-subscribers`);
          if (cmsRes.ok) {
            const list = await cmsRes.json();
            if (Array.isArray(list)) {
              const filtered = list.filter((s) => s.id !== id && s._id !== id);
              if (filtered.length !== list.length) {
                await fetch(`${apiUrl}/cms/event-subscribers`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ data: filtered }),
                });
              }
            }
          }
        } catch (cmsErr) {
          console.warn("[EventSubscribers] CMS delete sync notice:", cmsErr);
        }
      })();

      await Promise.allSettled([
        syncCms,
        fetch(`${apiUrl}/event-subscribers/${encodeURIComponent(id)}`, { method: "DELETE" }),
        fetch(`${fallbackUrl}/${encodeURIComponent(id)}`, { method: "DELETE" }),
      ]);

      setConfirmDelete(null);
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const exportToCSV = () => {
    if (subscribers.length === 0) {
      alert("No subscriber records to export.");
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone", "City", "Profession", "Subscribed Date"];
    const rows = filteredSubscribers.map((s) => [
      `"${s.id || ""}"`,
      `"${(s.name || "").replace(/"/g, '""')}"`,
      `"${(s.email || "").replace(/"/g, '""')}"`,
      `"${s.phone || ""}"`,
      `"${(s.city || "").replace(/"/g, '""')}"`,
      `"${(s.profession || s.college || "").replace(/"/g, '""')}"`,
      `"${s.createdAt ? new Date(s.createdAt).toISOString() : ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `event-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const q = searchQuery.toLowerCase();
    return (
      (sub.name && sub.name.toLowerCase().includes(q)) ||
      (sub.email && sub.email.toLowerCase().includes(q)) ||
      (sub.phone && sub.phone.toLowerCase().includes(q)) ||
      (sub.city && sub.city.toLowerCase().includes(q)) ||
      (sub.profession && sub.profession.toLowerCase().includes(q)) ||
      (sub.college && sub.college.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-normal">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Event Subscribers</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-sky-50 text-sky-700 border border-sky-100">
                  {subscribers.length} Subscribers
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                View and manage records of visitors who subscribed for event updates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email ID, contact number, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm text-gray-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={exportToCSV}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            Export CSV
          </button>
          <button
            onClick={fetchSubscribers}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="bg-transparent p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No Subscribers Found</h3>
          <p className="text-gray-500">
            {searchQuery
              ? "There are no event subscribers matching your search."
              : "Subscribers who sign up for event updates on the website will appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#EDF2FA] text-[#294B7A] text-[11px] uppercase tracking-[0.1em] font-bold border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact Number</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4">Profession</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredSubscribers.map((sub) => {
                  const createdDate = sub.createdAt ? new Date(sub.createdAt) : new Date();
                  const day = createdDate.getDate().toString().padStart(2, "0");
                  const month = (createdDate.getMonth() + 1).toString().padStart(2, "0");
                  const year = createdDate.getFullYear();
                  const formattedDate = `${day}-${month}-${year}`;
                  const formattedTime = createdDate.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={sub.id}
                      className={`transition-all duration-700 cursor-pointer ${isHighlighted(sub)
                          ? "bg-slate-100/80 hover:bg-slate-100"
                          : "hover:bg-slate-50/80"
                        }`}
                      data-highlighted={isHighlighted(sub) ? "true" : undefined}
                    >
                      {/* Date */}
                      <td className="px-6 py-5 align-middle whitespace-nowrap">
                        <p className="font-medium text-[#64748B] text-[12px]">{formattedDate}</p>
                        <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">{formattedTime}</p>
                      </td>

                      {/* Name & Email */}
                      <td className="px-6 py-5 align-middle max-w-[200px]">
                        <p className="font-medium text-[#334155] text-[13px] truncate whitespace-normal">
                          {sub.name || <span className="text-gray-400 italic">Subscriber</span>}
                        </p>
                        <p className="text-[11px] text-[#94A3B8] font-medium truncate whitespace-normal mt-0.5">
                          {sub.email}
                        </p>
                      </td>

                      {/* Contact Number & WhatsApp */}
                      <td className="px-6 py-5 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12px] text-[#475569] font-medium">
                            {sub.phone || "—"}
                          </p>
                          {sub.phone && (
                            <WhatsAppButton
                              phone={sub.phone}
                              name={sub.name || "Subscriber"}
                              message={`Hello ${sub.name || ""}, thank you for subscribing to BITC (BIZONANCE Industrial Training Centre) event updates.`}
                              size="sm"
                            />
                          )}
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-6 py-5 align-middle whitespace-nowrap">
                        <p className="text-[12px] text-[#475569] font-medium">{sub.city || "—"}</p>
                      </td>

                      {/* Profession */}
                      <td className="px-6 py-5 align-middle max-w-[250px]">
                        <p className="text-[12px] text-[#475569] font-medium truncate whitespace-normal">
                          {sub.profession || sub.college || "—"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 align-middle text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(sub.id, sub.name || sub.email);
                          }}
                          disabled={deletingId === sub.id}
                          className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                          title="Delete Subscriber"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!confirmDelete}
        title="Remove Subscriber"
        itemName={confirmDelete?.name}
        from="Event Subscribers"
        loading={deletingId === confirmDelete?.id}
        onConfirm={confirmAndDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default EventSubscribers;
