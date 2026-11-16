import React from "react";

const DeleteConfirmModal = ({
  isOpen,
  title = "Confirm Deletion",
  message,
  itemName = "",
  from = "",
  onConfirm,
  onCancel,
  loading = false,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {message ? (
            message
          ) : (
            <>
              Are you sure you want to remove{" "}
              {itemName && <span className="font-semibold text-slate-700">"{itemName}"</span>}
              {from ? ` from ${from}` : ""}?
            </>
          )}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
