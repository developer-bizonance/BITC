import React, { useState, useEffect, useRef } from "react";
import { Edit2, Plus, Trash2, GripVertical, Save, X, MessageSquare } from "lucide-react";
import { getApiUrl } from "../utils";
import DeleteConfirmModal from "./uic/DeleteConfirmModal.jsx";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Create a generator for simple IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

const SortableEnquiryItem = ({ item, index, editingIndex, editValue, setEditValue, startEdit, saveEdit, handleRemove, setEditingIndex }) => {
  const isEditing = editingIndex === index;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.4 : 1,
    position: isDragging ? "relative" : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3.5 sm:p-4 bg-white transition-colors border-b border-gray-100 last:border-0 ${
        isDragging
          ? "shadow-lg ring-2 ring-blue-400 rounded-lg bg-blue-50/40 relative z-50"
          : "hover:bg-gray-50/80"
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="p-1.5 -ml-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50/80 rounded-md cursor-grab active:cursor-grabbing touch-none select-none transition-colors shrink-0"
          style={{ touchAction: "none" }}
          title="Drag to reorder"
        >
          <GripVertical size={18} />
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") setEditingIndex(null);
            }}
            className="flex-1 px-3 py-1.5 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium bg-white text-sm"
            autoFocus
          />
        ) : (
          <span
            {...attributes}
            {...listeners}
            className="font-medium text-gray-700 text-sm truncate cursor-grab active:cursor-grabbing select-none"
            style={{ touchAction: "none" }}
            title="Drag to reorder"
          >
            {item.value}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4 shrink-0">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={saveEdit}
              className="p-2 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-full transition-colors cursor-pointer"
              title="Save"
            >
              <Save size={18} />
            </button>
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              title="Cancel"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startEdit(index, item.value);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(index);
              }}
              className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
              title="Remove"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default function EnquiryTypes() {
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // { index, value }
  const [isAdding, setIsAdding] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState("");
  const newRowRef = useRef(null);

  const fetchEnquiryTypes = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${getApiUrl()}/cms/enquiryTypes`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const uniqueVals = Array.from(
        new Set((data || []).map((val) => (typeof val === "string" ? val.trim() : "")).filter(Boolean))
      );
      setTypes(uniqueVals.map((val) => ({ id: generateId(), value: val })));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiryTypes();
  }, []);

  const saveTypes = async (newTypes) => {
    setIsSaving(true);
    try {
      const plainArray = newTypes.map((t) => t.value);
      const res = await fetch(`${getApiUrl()}/cms/enquiryTypes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: plainArray }),
      });
      if (!res.ok) throw new Error("Failed to save enquiry types");
      setTypes(newTypes);
    } catch (err) {
      console.error("Error saving enquiry types:", err);
      setError(err.message);
      fetchEnquiryTypes();
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setNewOptionValue("");
    setEditingIndex(null);
    setTimeout(() => {
      if (newRowRef.current) {
        newRowRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 50);
  };

  const handleSaveNew = () => {
    const trimmed = (newOptionValue || "").trim();
    if (!trimmed) return;
    if (types.some((t) => t.value.toLowerCase() === trimmed.toLowerCase())) {
      setError(`"${trimmed}" already exists.`);
      return;
    }
    const newTypes = [...types, { id: generateId(), value: trimmed }];
    saveTypes(newTypes);
    setNewOptionValue("");
    setIsAdding(false);
  };

  const handleCancelAdd = () => {
    setNewOptionValue("");
    setIsAdding(false);
  };

  const handleRemove = (index) => {
    const item = types[index];
    setConfirmDelete({ index, value: item ? item.value : "this enquiry type" });
  };

  const confirmAndDelete = () => {
    if (!confirmDelete) return;
    const newTypes = types.filter((_, i) => i !== confirmDelete.index);
    saveTypes(newTypes);
    setConfirmDelete(null);
  };

  const startEdit = (index, value) => {
    setIsAdding(false);
    setEditingIndex(index);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const trimmed = (editValue || "").trim();
    if (!trimmed) {
      setEditingIndex(null);
      return;
    }
    const newTypes = [...types];
    newTypes[editingIndex] = { ...newTypes[editingIndex], value: trimmed };
    saveTypes(newTypes);
    setEditingIndex(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTypes((prevTypes) => {
        const oldIndex = prevTypes.findIndex((t) => t.id === active.id);
        const newIndex = prevTypes.findIndex((t) => t.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newTypes = arrayMove(prevTypes, oldIndex, newIndex);
          saveTypes(newTypes);
          return newTypes;
        }
        return prevTypes;
      });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-normal">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Enquiry Types</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-amber-50 text-amber-700 border border-amber-100">
                  {types.length} Options
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage the options available in the Contact form dropdown
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartAdd}
          disabled={isSaving}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5 text-blue-700" />
          Add Option
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <ul className="flex flex-col">
            <SortableContext items={types.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {types.map((item, index) => (
                <SortableEnquiryItem
                  key={item.id}
                  item={item}
                  index={index}
                  editingIndex={editingIndex}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  startEdit={startEdit}
                  saveEdit={saveEdit}
                  handleRemove={handleRemove}
                  setEditingIndex={setEditingIndex}
                />
              ))}
            </SortableContext>

            {isAdding && (
              <li
                ref={newRowRef}
                className="flex items-center justify-between p-4 bg-blue-50/70 border-t border-blue-200 transition-colors animate-in fade-in duration-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-blue-500 shrink-0">
                    <Plus size={18} />
                  </div>
                  <input
                    type="text"
                    value={newOptionValue}
                    onChange={(e) => setNewOptionValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveNew();
                      if (e.key === "Escape") handleCancelAdd();
                    }}
                    className="flex-1 px-3.5 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium bg-white shadow-sm text-sm"
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    onClick={handleSaveNew}
                    disabled={isSaving || !newOptionValue.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full shadow-xs transition-all disabled:opacity-40 cursor-pointer"
                    title="Save Option (Enter)"
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancelAdd}
                    className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    title="Cancel (Esc)"
                  >
                    <X size={18} />
                  </button>
                </div>
              </li>
            )}

            {!isAdding && types.length === 0 && (
              <li className="p-8 text-center text-gray-500">No enquiry types found. Add one to get started.</li>
            )}
          </ul>
        </DndContext>
      </div>

      <DeleteConfirmModal
        isOpen={!!confirmDelete}
        title="Remove Enquiry Type"
        itemName={confirmDelete?.value}
        from="Enquiry Types"
        onConfirm={confirmAndDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
