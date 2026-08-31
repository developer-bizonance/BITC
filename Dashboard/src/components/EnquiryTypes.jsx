import React, { useState, useEffect } from "react";
import { Edit2, Plus, Trash2, GripVertical, Save, X } from "lucide-react";

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cms/enquiryTypes`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTypes(data || []);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cms/enquiryTypes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newTypes }),
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
    const newTypes = [...types, "New Enquiry Type"];
    saveTypes(newTypes);
  };

  const handleRemove = (index) => {
    if (!window.confirm("Are you sure you want to remove this enquiry type?")) return;
    const newTypes = types.filter((_, i) => i !== index);
    saveTypes(newTypes);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newTypes = [...types];
    const temp = newTypes[index];
    newTypes[index] = newTypes[index - 1];
    newTypes[index - 1] = temp;
    saveTypes(newTypes);
  };

  const handleMoveDown = (index) => {
    if (index === types.length - 1) return;
    const newTypes = [...types];
    const temp = newTypes[index];
    newTypes[index] = newTypes[index + 1];
    newTypes[index + 1] = temp;
    saveTypes(newTypes);
  };

  const startEdit = (index, value) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const saveEdit = () => {
    const newTypes = [...types];
    newTypes[editingIndex] = editValue;
    saveTypes(newTypes);
    setEditingIndex(null);
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
        <ul className="divide-y divide-gray-100">
          {types.map((type, index) => (
            <li key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              
              <div className="flex items-center gap-4 flex-1">
                <div className="text-gray-400 cursor-grab flex flex-col gap-1">
                  <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="hover:text-blue-600 disabled:opacity-30">↑</button>
                  <button onClick={() => handleMoveDown(index)} disabled={index === types.length - 1} className="hover:text-blue-600 disabled:opacity-30">↓</button>
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
                  <span className="font-medium text-gray-700">{type}</span>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                {editingIndex === index ? (
                  <>
                    <button onClick={saveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Save">
                      <Save size={18} />
                    </button>
                    <button onClick={() => setEditingIndex(null)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Cancel">
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(index, type)} className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleRemove(index)} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg" title="Remove">
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>

            </li>
          ))}
          {types.length === 0 && (
            <li className="p-8 text-center text-gray-500">No enquiry types found. Add one to get started.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
