"use client";
import React from "react";

const deletemodal = ({
  show,
  message = "Are you sure?",
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-[90%] max-w-sm">
        <h2 className="text-lg font-semibold mb-4">{message}</h2>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default deletemodal;
