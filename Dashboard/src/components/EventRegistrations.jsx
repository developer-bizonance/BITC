import React, { useState, useEffect } from "react";
import { Users, Mail, Phone, Calendar, Search, RefreshCw, GraduationCap, Trash2 } from "lucide-react";
import { getApiUrl, getSiteUrl, useRecordHighlight } from "../utils";
import { WhatsAppButton } from "./uic/WhatsAppButton";
import DeleteConfirmModal from "./uic/DeleteConfirmModal.jsx";

const EventRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  const { highlightTarget, isHighlighted } = useRecordHighlight("Events");

  useEffect(() => {
    if (highlightTarget) {
      setSearchQuery("");
    }
  }, [highlightTarget]);

  const apiUrl = getApiUrl();
  const fallbackUrl = `${getSiteUrl()}/api/event-registrations`;

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const map = new Map();
      const addList = (items) => {
        if (!Array.isArray(items)) return;
        for (const item of items) {
          if (!item) continue;
          const key = (item.id || item._id || `${item.email}-${item.eventId || item.createdAt}`).toString().trim();
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
        const res = await fetch(`${apiUrl}/event-registrations`);
        if (res.ok) {
          const data = await res.json();
          addList(data.registrations || (Array.isArray(data) ? data : []));
        }
      } catch (err) {
        console.warn("Primary event-registrations notice:", err);
      }

      // 2. CMS backend
      try {
        const cmsRes = await fetch(`${apiUrl}/cms/event-registrations`);
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          addList(Array.isArray(cmsData) ? cmsData : (cmsData.data || cmsData.registrations || []));
        }
      } catch (cmsErr) {
        console.warn("CMS event-registrations notice:", cmsErr);
      }

      // 3. Fallback website
      try {
        const fbRes = await fetch(fallbackUrl);
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          addList(fbData.registrations || (Array.isArray(fbData) ? fbData : []));
        }
      } catch (fbErr) {
        console.warn("Fallback event-registrations notice:", fbErr);
      }

      const merged = Array.from(map.values()).sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      setRegistrations(merged);
    } catch (err) {
      console.warn("Failed to fetch event registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = (e, id, name) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const reg = registrations.find((r) => r.id === id || r._id === id);
    const registrantName = name || (reg ? reg.name : "") || "this registration";
    setConfirmDelete({ id, name: registrantName });
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    const { id } = confirmDelete;
    setDeleting(true);
    try {
      setRegistrations((prev) => prev.filter((r) => r.id !== id && r._id !== id));

      await Promise.allSettled([
        fetch(`${apiUrl}/event-registrations/${encodeURIComponent(id)}`, { method: "DELETE" }),
        fetch(`${apiUrl}/event-registrations?id=${encodeURIComponent(id)}`, { method: "DELETE" }),
        fetch(`${fallbackUrl}?id=${encodeURIComponent(id)}`, { method: "DELETE" }),
        (async () => {
          try {
            const cmsRes = await fetch(`${apiUrl}/cms/event-registrations`);
            if (cmsRes.ok) {
              const list = await cmsRes.json();
              if (Array.isArray(list)) {
                const filtered = list.filter((r) => r.id !== id && r._id !== id);
                if (filtered.length !== list.length) {
                  await fetch(`${apiUrl}/cms/event-registrations`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: filtered }),
                  });
                }
              }
            }
          } catch {}
        })(),
      ]);
    } catch (err) {
      console.error("Failed to delete event registration:", err);
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const q = searchQuery.toLowerCase();
    return (
      reg.name?.toLowerCase().includes(q) ||
      reg.email?.toLowerCase().includes(q) ||
      reg.phone?.toLowerCase().includes(q) ||
      reg.college?.toLowerCase().includes(q) ||
      reg.education?.toLowerCase().includes(q) ||
      reg.city?.toLowerCase().includes(q) ||
      reg.event?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-normal">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Event Registrations</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {registrations.length} Registrations
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                View students registered for upcoming events
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email ID, contact number, or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm text-gray-500"
          />
        </div>
        <button
          onClick={fetchRegistrations}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="bg-transparent p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No Registrations Found</h3>
          <p className="text-gray-500">There are no event registrations matching your search.</p>
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
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Education / Profession</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredRegistrations.map((reg) => {
                  const createdDate = new Date(reg.createdAt);
                  const day = createdDate.getDate().toString().padStart(2, '0');
                  const month = (createdDate.getMonth() + 1).toString().padStart(2, '0');
                  const year = createdDate.getFullYear();
                  const formattedDate = `${day}-${month}-${year}`;
                  const formattedTime = createdDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr
                      key={reg.id}
                      className={`transition-all duration-700 cursor-pointer ${isHighlighted(reg)
                          ? "bg-slate-100/80 hover:bg-slate-100"
                          : "hover:bg-slate-50/80"
                        }`}
                      data-highlighted={isHighlighted(reg) ? "true" : undefined}
                    >
                      {/* Date */}
                      <td className="px-6 py-5 align-middle whitespace-nowrap">
                        <p className="font-medium text-[#64748B] text-[12px]">{formattedDate}</p>
                        <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">{formattedTime}</p>
                      </td>

                      {/* Name & Email */}
                      <td className="px-6 py-5 align-middle max-w-[200px]">
                        <p className="font-medium text-[#334155] text-[13px] truncate whitespace-normal">
                          {reg.name}
                        </p>
                        <p className="text-[11px] text-[#94A3B8] font-medium truncate whitespace-normal mt-0.5">
                          {reg.email}
                        </p>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-5 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12px] text-[#475569] font-medium">
                            {reg.phone}
                          </p>
                          {reg.phone && (
                            <WhatsAppButton
                              phone={reg.phone}
                              name={reg.name}
                              message={`Hello ${reg.name}, this is regarding your event registration with BITC (BIZONANCE Industrial Training Centre).`}
                              size="sm"
                            />
                          )}
                        </div>
                      </td>

                      {/* Event */}
                      <td className="px-6 py-5 align-middle">
                        {reg.event ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-[#334155] text-[13px]">{reg.event.title}</span>
                            <span className="text-[11px] text-[#94A3B8] font-medium mt-0.5">
                              {new Date(reg.event.date).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
                            General Update / Newsletter
                          </span>
                        )}
                      </td>

                      {/* Education / Profession */}
                      <td className="px-6 py-5 align-middle max-w-[250px]">
                        {(reg.profession || reg.college || reg.education || reg.course || reg.graduationYear) ? (
                          <div className="flex flex-col text-[12px] text-[#475569] space-y-0.5">
                            {(reg.profession || reg.college || reg.education) && <span className="font-medium truncate whitespace-normal">{reg.profession || reg.college || reg.education}</span>}
                            {reg.course && <span className="truncate whitespace-normal">Course: {reg.course}</span>}
                            {reg.graduationYear && <span>Year: {reg.graduationYear}</span>}
                          </div>
                        ) : (
                          <span className="text-[#94A3B8] text-[12px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right align-middle">
                        <button
                          onClick={(e) => handleDelete(e, reg.id, reg.name)}
                          className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                          title="Delete Registration"
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

      {/* Centered Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!confirmDelete}
        title="Remove Event Registration"
        itemName={confirmDelete?.name}
        from="Event Registrations"
        loading={deleting}
        onConfirm={confirmAndDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default EventRegistrations;
