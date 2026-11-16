import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, CircleHelp } from "lucide-react";
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
import { getApiUrl } from "../utils";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, title }

  const [form, setForm] = useState({ question: "", answer: "" });
  const [editForm, setEditForm] = useState({ question: "", answer: "" });

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

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/faq`);
      if (res.ok) {
        const data = await res.json();
        if (data.items) setFaqs(data.items);
      }
    } catch (err) {
      console.warn("Failed to fetch FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFaqs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        fetch(`${apiUrl}/faq/reorder`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderedIds: newOrder.map((item) => item.id),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.items) setFaqs(data.items);
            showNotification("FAQ order updated successfully!");
          })
          .catch((err) => {
            console.error("Failed to reorder FAQs:", err);
            showNotification("Failed to reorder FAQs", "error");
          });

        return newOrder;
      });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      showNotification("Please fill in both question and answer", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/faq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: form.question.trim(),
          answer: form.answer.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFaqs(data.items || [data.item, ...faqs]);
        setIsAddOpen(false);
        setForm({ question: "", answer: "" });
        showNotification("FAQ added successfully!");
      } else {
        showNotification(data.error || "Failed to add FAQ", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, question) => {
    setConfirmDelete({ id, title: question });
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    const { id, title } = confirmDelete;
    setConfirmDelete(null);
    try {
      const res = await fetch(`${apiUrl}/faq/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setFaqs(data.items || faqs.filter((f) => f.id !== id));
        showNotification("FAQ removed.");
      } else {
        showNotification(data.error || "Failed to delete FAQ", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    }
  };

  const openEdit = (faq) => {
    setEditingId(faq.id);
    setEditForm({ question: faq.question, answer: faq.answer });
    setIsEditOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.question.trim() || !editForm.answer.trim()) {
      showNotification("Please fill in both fields", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/faq/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: editForm.question.trim(),
          answer: editForm.answer.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFaqs(data.items || faqs.map((f) => (f.id === editingId ? data.item : f)));
        setIsEditOpen(false);
        showNotification("FAQ updated successfully!");
      } else {
        showNotification(data.error || "Failed to update FAQ", "error");
      }
    } catch (err) {
      showNotification("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Custom Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">Remove FAQ</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-700">"{confirmDelete.title}"</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndDelete}
                className="px-5 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-normal">
              <CircleHelp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">FAQ Management</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {faqs.length} Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage frequently asked questions and answers
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New FAQ
        </button>
      </div>

      {notification && (
        <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${notification.type === "error" ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-700 font-semibold"}`}>
          <p>{notification.msg}</p>
        </div>
      )}

      {/* Compact 3-Column Grid with Drag & Drop */}
      {loading && faqs.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-transparent p-8 text-center">
          <CircleHelp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-600 mb-1">No FAQs found</h3>
          <p className="text-xs text-slate-500">Get started by adding your first FAQ.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={faqs.map((f) => f.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {faqs.map((faq) => (
                <SortableItem
                  key={faq.id}
                  id={faq.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div className="p-4 flex-1">
                    <h3 className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">
                      {faq.question}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-4 font-normal">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(faq)}
                      className="w-8 h-8 flex items-center justify-center bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer active:scale-95"
                      title="Edit FAQ"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id, faq.question)}
                      className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                      title="Delete FAQ"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-medium text-gray-600">Add New FAQ</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-faq-form" onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Question</label>
                  <input type="text" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Answer</label>
                  <textarea rows={4} required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-sm text-gray-500"></textarea>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsAddOpen(false)} className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50">Cancel</button>
              <button type="submit" form="add-faq-form" disabled={submitting} className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin shrink-0" /> : <Plus className="w-4 h-4 shrink-0" />} <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-medium text-gray-600">Edit FAQ</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-faq-form" onSubmit={handleEdit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Question</label>
                  <input type="text" required value={editForm.question} onChange={(e) => setEditForm({ ...editForm, question: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Answer</label>
                  <textarea rows={4} required value={editForm.answer} onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-sm text-gray-500"></textarea>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50">Cancel</button>
              <button type="submit" form="edit-faq-form" disabled={submitting} className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin shrink-0" /> : <Pencil className="w-4 h-4 shrink-0" />} <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
