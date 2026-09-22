"use client";

import { useState } from "react";

export default function GalleryClient({ images, videos }: { images: string[], videos: string[] }) {
  const [activeTab, setActiveTab] = useState<"photo" | "video">("photo");

  // Helper to extract YouTube video ID from various YouTube URL formats
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <section className="pb-16 pt-4">
      <div className="container max-w-[1200px] mx-auto px-4">
        {/* Tabs (Capsules) */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("photo")}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === "photo" 
                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === "video" 
                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Videos
          </button>
        </div>

        {/* Content */}
        {activeTab === "photo" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.length > 0 ? images.map((src, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm bg-gray-200 aspect-[4/3]">
                <img 
                  src={src} 
                  alt={`Gallery image ${i + 1}`} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            )) : (
              <p className="text-center text-slate-500 col-span-3 py-10">No photos available.</p>
            )}
          </div>
        )}

        {activeTab === "video" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.length > 0 ? videos.map((src, i) => {
              const videoId = getYouTubeId(src);
              if (!videoId) return null;
              
              return (
                <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm bg-black aspect-[4/3]">
                  <iframe 
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`Video ${i + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full object-cover border-0 pointer-events-none"
                  />
                </div>
              );
            }) : (
              <p className="text-center text-slate-500 col-span-3 py-10">No videos available.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
