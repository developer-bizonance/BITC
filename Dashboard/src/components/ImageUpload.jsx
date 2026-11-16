import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { getApiUrl, getServerBase, resolveImageUrl } from "../utils";

const ImageUpload = ({ value, onChange, className = "", heightClassName = "h-[240px]", category = "misc" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // API base and server root
  const apiUrl = getApiUrl();
  const serverBase = getServerBase();

  // Build display URL for preview
  const previewUrl = resolveImageUrl(value);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Please select an image or video file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Pass the current (old) image URL so the server can delete it
      const oldUrl = value || "";
      const uploadUrl = `${apiUrl}/upload?category=${encodeURIComponent(category)}${oldUrl ? `&oldUrl=${encodeURIComponent(oldUrl)}` : ""}`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store the relative path (e.g. "/uploads/abc.png") in the DB
        // The preview will resolve it using serverBase above
        onChange(data.url);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error during upload');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleClear = async () => {
    // Delete the image from server if it's a local upload
    if (value && !value.startsWith("http")) {
      try {
        await fetch(`${apiUrl}/upload`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
      } catch (_) {}
    } else if (value && value.includes("/uploads/")) {
      // It's a full URL to our own server — still delete it
      try {
        const relativePath = "/uploads/" + value.split("/uploads/")[1];
        await fetch(`${apiUrl}/upload`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: relativePath }),
        });
      } catch (_) {}
    }
    onChange('');
  };

  return (
    <div className={`w-full ${className}`}>
      {value ? (
        <div className={`relative w-full rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-3 group ${heightClassName}`}>
          {previewUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video src={previewUrl} controls className="max-h-full max-w-full object-contain" />
          ) : (
            <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow-lg transform hover:scale-105 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          <label className={`w-full ${heightClassName} flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            error ? 'border-red-300 bg-red-50 hover:bg-red-100' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}>
            <div className="flex flex-col items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              ) : (
                <Upload className={`w-8 h-8 mb-3 ${error ? 'text-red-400' : 'text-gray-400'}`} />
              )}
              <p className="text-sm font-semibold text-gray-700">
                {isUploading ? 'Uploading...' : 'Click to upload image'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Image (max. 5MB)</p>
            </div>
            <input
              type="file"
              className="hidden text-gray-500"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
    </div>
  );
};

export default ImageUpload;

