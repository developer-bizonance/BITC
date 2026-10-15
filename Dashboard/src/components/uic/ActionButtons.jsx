// ActionButtons.jsx
import React, { useState } from "react";

const ActionButtons = ({
  isAdding = false,
  onSave,
  onCancel,
  saveText = "Save",
  addText = "Add",
  cancelText = "Cancel",
}) => {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(); // Wait for the parent function to finish
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 mt-3">
      <button
        onClick={handleSave}
        disabled={loading}
        className={`flex-1 flex items-center justify-center bg-blue-400/30 hover:bg-blue-400/40 text-blue-900 px-4 py-2 rounded ${
          loading ? "cursor-not-allowed opacity-70" : ""
        }`}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-blue-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        )}
        {isAdding ? addText : saveText}
      </button>
      <button
        onClick={onCancel}
        className="flex-1 px-4 py-2 hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
      >
        {cancelText}
      </button>
    </div>
  );
};

export default ActionButtons;
