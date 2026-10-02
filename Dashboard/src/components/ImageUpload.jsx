import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

const ImageUpload = ({ value, onChange, className = "" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Use the same API URL logic as the rest of the app
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Construct the full URL if necessary, or just store the relative path
        // Using full URL for immediate preview might be better, but storing relative path is better for DB
        // Let's store what the backend returns
        const finalUrl = `http://localhost:5000${data.url}`; // Assuming backend is on port 5000
        onChange(finalUrl);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error during upload');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`w-full ${className}`}>
      {value ? (
        <div className="relative w-full rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-2 group h-[240px]">
          <img src={value} alt="Preview" className="max-h-full max-w-full object-contain" />
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
          <label className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
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
              <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
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
