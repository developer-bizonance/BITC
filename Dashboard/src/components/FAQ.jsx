import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, RefreshCw, X, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({ question: "", answer: "" });
  const [editForm, setEditForm] = useState({ question: "", answer: "" });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
        body: JSON.stringify(form),
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
    if (!window.confirm(`Are you sure you want to remove this FAQ?`)) return;
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
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setFaqs(data.items || faqs.map(f => f.id === editingId ? data.item : f));
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
    <div className="p-5 md:p-6 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" /> FAQ Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage frequently asked questions and answers</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchFaqs}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${notification.type === "error" ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-700 font-semibold"}`}>
          <p>{notification.msg}</p>
        </div>
      )}

      {/* Compact 3-Column Grid */}
      {loading && faqs.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-2xs border border-slate-200 p-8 text-center">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No FAQs found</h3>
          <p className="text-xs text-slate-500">Get started by adding your first FAQ.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all group flex flex-col justify-between">
              <div className="p-4 flex-1">
                <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">{faq.question}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-4 font-normal">{faq.answer}</p>
              </div>
              <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => openEdit(faq)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit FAQ"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id, faq.question)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Add New FAQ</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-faq-form" onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Question</label>
                  <input type="text" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="e.g. What is the fee structure?" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Answer</label>
                  <textarea rows={4} required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="Detailed answer..."></textarea>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="add-faq-form" disabled={submitting} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 flex items-center gap-2">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add FAQ
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
              <h3 className="text-lg font-bold text-gray-900">Edit FAQ</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-faq-form" onSubmit={handleEdit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Question</label>
                  <input type="text" required value={editForm.question} onChange={(e) => setEditForm({ ...editForm, question: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Answer</label>
                  <textarea rows={4} required value={editForm.answer} onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm"></textarea>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="edit-faq-form" disabled={submitting} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 flex items-center gap-2">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />} Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
