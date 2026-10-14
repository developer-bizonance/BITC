import React, { useState, useEffect } from "react";
import { Edit2, Plus, Trash2, GripVertical, Save, X } from "lucide-react";
import { getApiUrl } from "../utils";
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${isDragging ? 'shadow-lg ring-2 ring-blue-400 rounded-lg relative' : ''}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div {...attributes} {...listeners} className="text-gray-400 cursor-grab active:cursor-grabbing hover:text-blue-600">
          <GripVertical size={18} />
        </div>
        
        {editingIndex === index ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span className="font-medium text-gray-700">{item.value}</span>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4">
        {editingIndex === index ? (
          <>
            <button onClick={saveEdit} className="p-2 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-full transition-colors" title="Save">
              <Save size={18} />
            </button>
            <button onClick={() => setEditingIndex(null)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors" title="Cancel">
              <X size={18} />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => startEdit(index, item.value)} className="p-2 text-gray-500 hover:bg-blue-100 hover:text-blue-700 rounded-full transition-colors" title="Edit">
              <Edit2 size={18} />
            </button>
            <button onClick={() => handleRemove(index)} className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-700 rounded-full transition-colors" title="Remove">
              <Trash2 size={18} />
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

  const fetchEnquiryTypes = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${getApiUrl()}/cms/enquiryTypes`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTypes((data || []).map(val => ({ id: generateId(), value: val })));
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
      const plainArray = newTypes.map(t => t.value);
      const res = await fetch(`${getApiUrl()}/cms/enquiryTypes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: plainArray }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setTypes(newTypes);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    const newTypes = [...types, { id: generateId(), value: "New Enquiry Type" }];
    saveTypes(newTypes);
  };

  const handleRemove = (index) => {
    if (!window.confirm("Are you sure you want to remove this enquiry type?")) return;
    const newTypes = types.filter((_, i) => i !== index);
    saveTypes(newTypes);
  };

  const startEdit = (index, value) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const saveEdit = () => {
    const newTypes = [...types];
    newTypes[editingIndex] = { ...newTypes[editingIndex], value: editValue };
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
      const oldIndex = types.findIndex((t) => t.id === active.id);
      const newIndex = types.findIndex((t) => t.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newTypes = arrayMove(types, oldIndex, newIndex);
        saveTypes(newTypes);
      }
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiry Types</h1>
          <p className="text-gray-500 mt-1">Manage the options available in the Contact form dropdown.</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 hover: disabled:opacity-50 hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
        >
          <Plus size={18} />
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
            {types.length === 0 && (
              <li className="p-8 text-center text-gray-500">No enquiry types found. Add one to get started.</li>
            )}
          </ul>
        </DndContext>
      </div>
    </div>
  );
}
