import { resolveImageUrl, getApiUrl } from "../utils";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, Image as ImageIcon, GripVertical } from "lucide-react";
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

const SortablePartnerCard = ({ partner, onEdit, onDelete }) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all flex flex-col ${isDragging ? "border-blue-500 ring-2 ring-blue-100 shadow-lg" : "border-gray-100"}`}
    >
      <div 
        className="aspect-square bg-gray-50 flex items-center justify-center relative p-6"
      >
        {partner.logo ? (
          <img
            src={resolveImageUrl(partner.logo)}
            alt={partner.name}
            className="w-full h-full object-contain pointer-events-none"
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-gray-300 pointer-events-none" />
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit(partner)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(partner.id, partner.name)}
            className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg text-white transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-2 left-2 p-1.5 bg-white/80 hover:bg-white rounded-md text-gray-500 hover:text-gray-900 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all shadow-sm"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
      <div className="p-3 border-t border-gray-50 text-center">
        <h3 className="font-medium text-gray-900 text-sm truncate">{partner.name}</h3>
      </div>
    </div>
  );
};

const IndustryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({ name: "", logo: "" });
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

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/industry-partners`);
      if (res.ok) {
        const data = await res.json();
        const apiPartners = data.partners || [];
        // Remove duplicates by name
        const uniquePartners = [];
        const seen = new Set();
        for (const p of apiPartners) {
          if (!seen.has(p.name?.trim().toLowerCase())) {
            seen.add(p.name?.trim().toLowerCase());
            uniquePartners.push(p);
          }
        }
        setPartners(uniquePartners);
      }
    } catch (err) {
      console.warn("Failed to fetch industry partners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.logo) {
      showNotification("Please fill in the partner name and upload a logo", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/industry-partners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setPartners(data.partners || [...partners, data.partner]);
        setIsAddOpen(false);
        setForm({ name: "", logo: "" });
        showNotification("Industry partner added successfully!");
      } else {
        showNotification(data.error || "Failed to add partner", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}"?`)) return;
    try {
      const res = await fetch(`${apiUrl}/industry-partners/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setPartners(data.partners || partners.filter((p) => p.id !== id));
        showNotification("Industry partner removed.");
      } else {
        showNotification(data.error || "Failed to delete partner", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    }
  };

  const openEdit = (partner) => {
    setEditingId(partner.id);
    setEditForm({ name: partner.name || "", logo: partner.logo || "" });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.logo) {
      showNotification("Please provide both a name and a logo", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/industry-partners/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setPartners(data.partners || partners.map((p) => (p.id === editingId ? data.partner : p)));
        setIsEditOpen(false);
        setEditingId(null);
        showNotification("Industry partner updated!");
      } else {
        showNotification(data.error || "Failed to update", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
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
      const res = await fetch(`${apiUrl}/industry-partners/reorder`, {
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
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Industry Partners</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage the companies displayed in the "Our industry partners" section.
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={fetchPartners}
              className="px-4 py-2 hover: text-sm flex items-center justify-center hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 hover: text-sm bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Partner
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
            <h3 className="text-lg font-medium text-gray-900 mb-1">No industry partners found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't added any industry partners yet. Add a partner to see them displayed here.
            </p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 hover: text-sm bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Your First Partner
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
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {partners.map((partner) => (
                  <SortablePartnerCard
                    key={partner.id}
                    partner={partner}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Add Modal */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Add Industry Partner</h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. TCS, Wipro, Google"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Company Logo</label>
                  <ImageUpload category="partners"
                    onChange={(url) => setForm({ ...form, logo: url })}
                    label="Logo"
                  />
                  {form.logo && (
                    <div className="mt-3 relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 h-24 flex items-center justify-center">
                      <img src={resolveImageUrl(form.logo)} alt="Preview" className="max-h-20 max-w-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, logo: "" })}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 shadow-sm hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 px-4 py-2.5 hover: text-sm bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !form.logo}
                    className="flex-1 px-4 py-2.5 hover: disabled:opacity-50 disabled:cursor-not-allowed text-sm hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
                  >
                    {submitting ? "Adding..." : "Add Partner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Edit Industry Partner</h3>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Company Logo</label>
                  <ImageUpload category="partners"
                    onChange={(url) => setEditForm({ ...editForm, logo: url })}
                    label="Logo"
                  />
                  {editForm.logo && (
                    <div className="mt-3 relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 h-24 flex items-center justify-center">
                      <img src={resolveImageUrl(editForm.logo)} alt="Preview" className="max-h-20 max-w-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, logo: "" })}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 shadow-sm hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 px-4 py-2.5 hover: text-sm bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !editForm.logo}
                    className="flex-1 px-4 py-2.5 hover: disabled:opacity-50 disabled:cursor-not-allowed text-sm hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryPartners;
