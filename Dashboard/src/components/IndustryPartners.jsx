import { resolveImageUrl, getApiUrl, getSiteUrl } from "../utils";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, Image as ImageIcon, GripVertical, Building2, Briefcase, Eye, EyeOff } from "lucide-react";
import ImageUpload from "./ImageUpload";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const formatAndDedupePartners = (list) => {
  const unique = [];
  const seenIds = new Set();
  const seenNames = new Set();
  for (const p of list || []) {
    if (!p) continue;
    const id = p.id ? String(p.id).trim() : "";
    const normName = p.name ? p.name.trim().toLowerCase() : "";

    if (id && seenIds.has(id)) continue;
    if (normName && seenNames.has(normName)) continue;

    if (id) seenIds.add(id);
    if (normName) seenNames.add(normName);

    unique.push({
      ...p,
      logo: p.logo?.trim() || "",
    });
  }
  return unique;
};

const SortablePartnerCard = ({ partner, onEdit, onDelete, onToggleVisibility }) => {
  const isVisible = partner.isActive !== false;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: partner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const initialLogo = partner.logo?.trim() || "";
  const [imgSrc, setImgSrc] = useState(() => (initialLogo ? resolveImageUrl(initialLogo) : ""));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const freshLogo = partner.logo?.trim() || "";
    setImgSrc(freshLogo ? resolveImageUrl(freshLogo) : "");
    setHasError(false);
  }, [partner.logo]);

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-2xl p-3 border transition-all duration-200 flex flex-col justify-between relative ${
        isDragging
          ? "border-blue-500 ring-2 ring-blue-100 shadow-lg z-20"
          : !isVisible
          ? "bg-slate-100/70 border-dashed border-amber-300 shadow-none opacity-85"
          : "bg-slate-50/80 hover:bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-md"
      }`}
    >
      {/* Action Buttons: Toggle Visibility, Edit & Delete */}
      <div className="absolute top-2 right-2 flex flex-col items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 pointer-events-auto">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onToggleVisibility) onToggleVisibility(partner);
          }}
          title={isVisible ? "Currently Visible on website (Click to Hide)" : "Currently Hidden from website (Click to Show)"}
          className={`w-7 h-7 rounded-lg border shadow-xs flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 pointer-events-auto hover:scale-110 ${
            isVisible
              ? "bg-emerald-50 text-emerald-600 border-emerald-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-md"
              : "bg-amber-50 text-amber-600 border-amber-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-md"
          }`}
        >
          {isVisible ? (
            <Eye className="w-3.5 h-3.5 transition-transform duration-300" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 transition-transform duration-300" />
          )}
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onEdit) onEdit(partner);
          }}
          title="Edit Partner"
          className="w-7 h-7 rounded-lg bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 shadow-xs flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 pointer-events-auto"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onDelete) onDelete(partner.id, partner.name);
          }}
          title="Delete Partner"
          className="w-7 h-7 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-lg border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95 pointer-events-auto"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Card Content & Logo */}
      <div className="h-20 sm:h-24 flex items-center justify-center relative px-2 py-1 my-1">
        {imgSrc && !hasError ? (
          <img
            src={imgSrc}
            alt={partner.name}
            onError={handleImageError}
            className={`max-h-12 sm:max-h-14 w-auto max-w-[85%] object-contain pointer-events-none transition-all duration-200 ${
              !isVisible ? "grayscale opacity-50" : ""
            }`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-black text-sm flex items-center justify-center mb-0.5">
              {partner.name ? partner.name.slice(0, 2).toUpperCase() : "IP"}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">No Logo</span>
          </div>
        )}

        {/* Drag handle in bottom-left */}
        <div
          {...attributes}
          {...listeners}
          className="absolute bottom-0.5 left-0.5 p-1 bg-white/90 hover:bg-white rounded-md text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all shadow-xs z-20 pointer-events-auto"
          title="Drag to reorder"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Name Footer */}
      <div className="pt-1.5 border-t border-slate-100 text-center">
        <h3 className="font-semibold text-slate-800 text-xs truncate">{partner.name}</h3>
      </div>
    </div>
  );
};

const IndustryPartners = ({
  type = "partnerships",
  apiPath: propApiPath,
  title,
  subtitle,
}) => {
  const isTopRecruiter = type === "top-recruiters" || type === "hiring" || type === "hiring-partners" || propApiPath === "hiring-partners";
  const apiPath = propApiPath || (isTopRecruiter ? "hiring-partners" : "industry-partners");
  const partnerLabel = isTopRecruiter ? "Top Recruiter" : "Industrial Partner";
  const pageTitle = title || (isTopRecruiter ? "Top Recruiters" : "Industrial Partners");
  const pageSubtitle = subtitle || (
    isTopRecruiter
      ? "Manage recruiters displayed in the Home page 'Trusted By' section and 'Our Top Recruiters' section (/placements/partners)."
      : "Manage corporate company partners displayed in the 'Our Industrial Partners' section on the website (/partnership?tab=corporate)."
  );

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({ name: "", logo: "", isActive: true });
  const [editForm, setEditForm] = useState({ name: "", logo: "" });

  const apiUrl = getApiUrl();

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

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const getVisibilityKey = () => `bitc_${apiPath || "industry"}_visibility_map`;

  const getSavedVisibilityMap = () => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(getVisibilityKey()) : null;
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveVisibility = (id, isActive) => {
    try {
      const map = getSavedVisibilityMap();
      map[id] = Boolean(isActive);
      if (typeof window !== "undefined") {
        localStorage.setItem(getVisibilityKey(), JSON.stringify(map));
      }
    } catch {}
  };

  const fetchPartners = async () => {
    setLoading(true);
    try {
      let apiPartners = [];
      try {
        const res = await fetch(`${apiUrl}/${apiPath}?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          apiPartners = data.partners || [];
        }
      } catch (e) {
        console.warn("Backend API fetch notice:", e);
      }

      // Fallback to Next.js API if needed
      if (apiPartners.length === 0) {
        try {
          const res = await fetch(`${getSiteUrl()}/api/${apiPath}`);
          if (res.ok) {
            const data = await res.json();
            apiPartners = data.partners || [];
          }
        } catch {}
      }

      const visibilityMap = getSavedVisibilityMap();
      const withVisibility = apiPartners.map((p) => {
        let active = true;
        if (visibilityMap[p.id] !== undefined) {
          active = Boolean(visibilityMap[p.id]);
        } else if (p.isActive !== undefined) {
          active = p.isActive !== false && p.isActive !== "false";
        }
        return { ...p, isActive: active };
      });

      setPartners(formatAndDedupePartners(withVisibility));
    } catch (err) {
      console.warn("Failed to fetch industry partners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [type, apiPath]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showNotification("Please fill in the company name", "error");
      return;
    }
    if (!form.logo?.trim()) {
      showNotification("Please upload the company logo", "error");
      return;
    }
    setSubmitting(true);
    try {
      let added = false;
      let newPartnerData = null;
      let returnedPartners = null;
      let errorMessage = "Failed to add partner. Please try again.";

      // 1. Try Backend API
      try {
        const res = await fetch(`${apiUrl}/${apiPath}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          added = true;
          newPartnerData = data.partner;
          if (data.partners && Array.isArray(data.partners)) {
            returnedPartners = data.partners;
          }
        } else if (data.error) {
          errorMessage = data.error;
        }
      } catch (e) {
        console.warn("Backend add partner notice:", e);
      }

      // 2. Try Next.js API Fallback
      if (!added) {
        try {
          const res = await fetch(`${getSiteUrl()}/api/${apiPath}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
          const data = await res.json();
          if (res.ok) {
            added = true;
            newPartnerData = data.partner;
            if (data.partners && Array.isArray(data.partners)) {
              returnedPartners = data.partners;
            }
          } else if (data.error) {
            errorMessage = data.error;
          }
        } catch {}
      }

      if (added) {
        if (returnedPartners) {
          setPartners(formatAndDedupePartners(returnedPartners));
        } else if (newPartnerData) {
          setPartners((prev) => formatAndDedupePartners([...prev, newPartnerData]));
        } else {
          await fetchPartners();
        }
        setIsAddOpen(false);
        setForm({ name: "", logo: "", isActive: true });
        showNotification(`${partnerLabel} added successfully!`);
      } else {
        showNotification(errorMessage, "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id, name) => {
    setConfirmDelete({ id, name });
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    const { id, name } = confirmDelete;
    setDeleting(true);
    try {
      let deleted = false;
      let returnedPartners = null;

      // 1. Try Backend API
      try {
        const res = await fetch(`${apiUrl}/${apiPath}/${id}`, { method: "DELETE" });
        if (res.ok) {
          deleted = true;
          const data = await res.json();
          if (data.partners && Array.isArray(data.partners)) {
            returnedPartners = data.partners;
          }
        }
      } catch (e) {
        console.warn("Backend delete partner notice:", e);
      }

      // 2. Try Next.js API Fallback
      if (!deleted) {
        try {
          const res = await fetch(`${getSiteUrl()}/api/${apiPath}?id=${id}`, { method: "DELETE" });
          if (res.ok) {
            deleted = true;
            const data = await res.json();
            if (data.partners && Array.isArray(data.partners)) {
              returnedPartners = data.partners;
            }
          }
        } catch {}
      }

      if (deleted) {
        if (returnedPartners) {
          setPartners(formatAndDedupePartners(returnedPartners));
        } else {
          setPartners((prev) => prev.filter((p) => p.id !== id));
        }
        showNotification(`"${name}" removed successfully.`);
      } else {
        showNotification("Failed to delete partner.", "error");
      }
    } catch (err) {
      showNotification("Network error while deleting partner", "error");
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const openEdit = (partner) => {
    const currentLogo = partner.logo?.trim() || "";
    setEditingId(partner.id);
    setEditForm({ name: partner.name || "", logo: currentLogo, isActive: partner.isActive !== false });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      showNotification("Please enter company name", "error");
      return;
    }
    if (!editForm.logo?.trim()) {
      showNotification("Please upload the company logo", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/${apiPath}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.partners && Array.isArray(data.partners)) {
          setPartners(formatAndDedupePartners(data.partners));
        } else {
          setPartners((prev) =>
            formatAndDedupePartners(
              prev.map((p) => (p.id === editingId ? { ...p, ...data.partner, ...editForm } : p))
            )
          );
        }
        setIsEditOpen(false);
        setEditingId(null);
        showNotification(`${partnerLabel} updated successfully!`);
      } else {
        showNotification(data.error || "Failed to update", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  
  const handleToggleVisibility = async (partner) => {
    const newIsActive = partner.isActive === false ? true : false;

    // 1. Immediately persist to localStorage
    saveVisibility(partner.id, newIsActive);

    // 2. Optimistic UI update
    setPartners((prev) =>
      prev.map((p) => (p.id === partner.id ? { ...p, isActive: newIsActive } : p))
    );

    try {
      // Try Backend PATCH toggle endpoint first
      let toggled = false;
      let updatedPartners = null;
      try {
        const patchRes = await fetch(`${apiUrl}/${apiPath}/${partner.id}/toggle`, {
          method: "PATCH",
        });
        if (patchRes.ok) {
          toggled = true;
          const data = await patchRes.json();
          if (data.partners && Array.isArray(data.partners)) {
            updatedPartners = data.partners;
          }
        }
      } catch (e) {
        console.warn("PATCH toggle error:", e);
      }

      // Fallback to PUT
      if (!toggled) {
        const res = await fetch(`${apiUrl}/${apiPath}/${partner.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...partner,
            isActive: newIsActive,
          }),
        });
        if (res.ok) {
          toggled = true;
          const data = await res.json();
          if (data.partners && Array.isArray(data.partners)) {
            updatedPartners = data.partners;
          }
        }
      }

      // Dual-sync to Next.js API
      try {
        await fetch(`${getSiteUrl()}/api/${apiPath}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: partner.id,
            isActive: newIsActive,
          }),
        });
      } catch (siteSyncErr) {
        console.warn("Dual site sync notice:", siteSyncErr);
      }

      showNotification(
        `"${partner.name}" is now ${newIsActive ? "visible on" : "hidden from"} website.`
      );
    } catch (err) {
      console.warn("Network notice:", err);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = partners.findIndex((item) => item.id === active.id);
    const newIndex = partners.findIndex((item) => item.id === over.id);

    const newPartners = arrayMove(partners, oldIndex, newIndex);
    setPartners(newPartners);

    try {
      const orderedIds = newPartners.map((p) => p.id);
      const res = await fetch(`${apiUrl}/${apiPath}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) {
        throw new Error("Failed to save order");
      }
    } catch (err) {
      showNotification("Failed to save new order", "error");
      fetchPartners(); // revert on fail
    }
  };

  return (
    <div className="bg-transparent p-5 md:p-6 pt-6 md:pt-7 space-y-6 animate-in fade-in duration-200">
      {/* Custom Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Remove {partnerLabel}</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-700">"{confirmDelete.name}"</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAndDelete}
                disabled={deleting}
                className="px-5 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header matching Academic Partners */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-normal">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{pageTitle}</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {pageSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPartners}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            title="Refresh Partners"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-blue-700" />
            Add New {isTopRecruiter ? "Recruiter" : "Partner"}
          </button>
        </div>
      </div>

        {notification && (
          <div
            className={`p-4 rounded-xl shadow-sm border ${
              notification.type === "error"
                ? "bg-red-50 border-red-100 text-red-700"
                : "bg-green-50 border-green-100 text-green-700"
            } flex items-center justify-between animate-in fade-in slide-in-from-top-4`}
          >
            <p className="text-sm font-medium">{notification.msg}</p>
            <button onClick={() => setNotification(null)}>
              <X className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : partners.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No {partnerLabel.toLowerCase()}s found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't added any {partnerLabel.toLowerCase()}s yet. Add a partner to see them displayed here.
            </p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-4 h-4 text-blue-700" />
              Add Your First {isTopRecruiter ? "Recruiter" : "Partner"}
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={partners.map(p => p.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {partners.map((partner) => (
                  <SortablePartnerCard
                    key={partner.id}
                    partner={partner}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onToggleVisibility={handleToggleVisibility}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Add Modal */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
              <button
                onClick={() => setIsAddOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-normal">
                  {isTopRecruiter ? <Briefcase className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Add {partnerLabel}</h3>
                  <p className="text-xs text-gray-400">
                    {isTopRecruiter
                      ? "Enter company name and upload recruiter logo"
                      : "Enter company name and upload partner logo"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                {/* 1. Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                  />
                </div>

                {/* 2. Logo */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Company Logo <span className="text-red-500">*</span>
                  </label>
                  <ImageUpload
                    value={form.logo}
                    onChange={(url) => setForm({ ...form, logo: url })}
                    category="partners"
                    heightClassName="h-[180px]"
                  />
                </div>

                {/* Action Buttons on Bottom Right */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
              <button
                onClick={() => setIsEditOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-normal">
                  {isTopRecruiter ? <Briefcase className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Edit {partnerLabel}</h3>
                  <p className="text-xs text-gray-400">
                    {isTopRecruiter
                      ? "Update company name and recruiter logo"
                      : "Update company name and partner logo"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* 1. Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                  />
                </div>

                {/* 2. Logo */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Company Logo <span className="text-red-500">*</span>
                  </label>
                  <ImageUpload
                    value={editForm.logo}
                    onChange={(url) => setEditForm({ ...editForm, logo: url })}
                    category="partners"
                    heightClassName="h-[180px]"
                  />
                </div>

                {/* Action Buttons on Bottom Right */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : `Update ${partnerLabel}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default IndustryPartners;
