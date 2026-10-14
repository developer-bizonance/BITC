"use client";

import { useState } from "react";
import { resolveImageUrl } from "@/lib/utils";
import { Play, Image as ImageIcon, Video, Maximize2, X } from "lucide-react";

export interface GalleryMediaItem {
  id?: string;
  title?: string;
  url: string;
  rawUrl?: string;
  type?: "photo" | "video";
}

export const getYouTubeId = (url: string): string | null => {
  if (!url || typeof url !== "string") return null;
  const clean = url.trim();
  // Match youtube.com/shorts/ID
  const shortsMatch = clean.match(/(?:youtube\.com|youtu\.be)\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];
  // Match youtube.com/live/ID
  const liveMatch = clean.match(/(?:youtube\.com|youtu\.be)\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch && liveMatch[1]) return liveMatch[1];
  // Standard watch?v=, youtu.be/, embed/, etc.
  const standardMatch = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (standardMatch && standardMatch[1]) return standardMatch[1];
  // Generic fallback
  const genericMatch = clean.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  if (genericMatch && genericMatch[2] && genericMatch[2].length === 11) return genericMatch[2];
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  return null;
};

export const getVimeoId = (url: string): string | null => {
  if (!url || typeof url !== "string") return null;
  const match = url.trim().match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+))/);
  return match ? match[1] : null;
};

interface GalleryClientProps {
  images: (string | GalleryMediaItem)[];
  videos: (string | GalleryMediaItem)[];
}

export default function GalleryClient({ images = [], videos = [] }: GalleryClientProps) {
  const [activeTab, setActiveTab] = useState<"photo" | "video">("photo");
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string } | null>(null);

  const getItemData = (item: string | GalleryMediaItem, index: number, fallbackLabel: string) => {
    if (typeof item === "string") {
      const cleanUrl = resolveImageUrl(item);
      return {
        id: `media-${index}`,
        url: cleanUrl,
        rawUrl: item,
        title: `${fallbackLabel} ${index + 1}`,
      };
    }
    const cleanUrl = resolveImageUrl(item.url || item.rawUrl || "");
    return {
      id: item.id || `media-${index}`,
      url: cleanUrl,
      rawUrl: item.rawUrl || item.url,
      title: item.title && item.title.trim() ? item.title.trim() : `${fallbackLabel} ${index + 1}`,
    };
  };

  return (
    <section className="pb-20 pt-4">
      <div className="container max-w-[1200px] mx-auto px-4">
        {/* Tabs (Capsules) */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("photo")}
            className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === "photo"
                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Photos
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === "photo" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
            }`}>
              {images.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("video")}
            className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === "video"
                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Video className="w-4 h-4" />
            Videos
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === "video" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
            }`}>
              {videos.length}
            </span>
          </button>
        </div>

        {/* Photos Grid */}
        {activeTab === "photo" && (
          <div>
            {images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {images.map((item, i) => {
                  const data = getItemData(item, i, "Photo");
                  return (
                    <div
                      key={data.id}
                      onClick={() => setSelectedPhoto({ url: data.url, title: data.title })}
                      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl bg-slate-100 aspect-[4/3] cursor-pointer transition-all duration-300 border border-slate-100"
                    >
                      <img
                        src={data.url}
                        alt={data.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop";
                        }}
                      />
                      {/* Gradient Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                        <div className="flex items-center justify-between text-white">
                          <p className="font-semibold text-sm line-clamp-2 drop-shadow-sm">{data.title}</p>
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 ml-2">
                            <Maximize2 className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-semibold text-base">No photos available.</p>
                <p className="text-slate-400 text-sm mt-1">Campus photos will appear here once added.</p>
              </div>
            )}
          </div>
        )}

        {/* Videos Grid */}
        {activeTab === "video" && (
          <div>
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {videos.map((item, i) => {
                  const data = getItemData(item, i, "Video");
                  const youtubeId = getYouTubeId(data.rawUrl) || getYouTubeId(data.url);
                  const vimeoId = getVimeoId(data.rawUrl) || getVimeoId(data.url);

                  return (
                    <div
                      key={data.id}
                      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl bg-slate-900 aspect-[4/3] flex flex-col justify-between border border-slate-800 transition-all duration-300"
                    >
                      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        {youtubeId ? (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                            title={data.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full object-cover border-0"
                            loading="lazy"
                          />
                        ) : vimeoId ? (
                          <iframe
                            src={`https://player.vimeo.com/video/${vimeoId}?dnt=1`}
                            title={data.title}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full object-cover border-0"
                            loading="lazy"
                          />
                        ) : (
                          <video
                            src={data.url}
                            controls
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-contain bg-black"
                          />
                        )}
                      </div>

                      {/* Video Title Banner */}
                      <div className="px-4 py-3 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 text-primary shrink-0" />
                        <h3 className="text-xs font-semibold text-slate-200 truncate" title={data.title}>
                          {data.title}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-semibold text-base">No videos available.</p>
                <p className="text-slate-400 text-sm mt-1">Campus videos will appear here once added.</p>
              </div>
            )}
          </div>
        )}

        {/* Photo Modal Lightbox */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] bg-transparent flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
              <p className="text-white font-medium text-sm mt-3 text-center px-4">
                {selectedPhoto.title}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
