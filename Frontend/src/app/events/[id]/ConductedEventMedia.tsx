"use client";

import React, { useState } from "react";
import { Camera, Video, X, ChevronLeft, ChevronRight, Play, ZoomIn } from "lucide-react";

interface ConductedEventMediaProps {
  photos: string[];
  videos: string[];
  eventTitle: string;
}

// Helper to convert various YouTube URL formats to an embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Standard watch, shorts, share, or embed links
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0`;
  }
  return null;
}

export default function ConductedEventMedia({
  photos = [],
  videos = [],
  eventTitle = "Event",
}: ConductedEventMediaProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevPhoto = () => {
    if (lightboxIndex === null || photos.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
  };

  const nextPhoto = () => {
    if (lightboxIndex === null || photos.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % photos.length);
  };

  return (
    <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col items-center">
      {/* Capsule Buttons Switcher */}
      <div className="inline-flex bg-slate-100 p-1.5 rounded-full border border-slate-200/80 shadow-inner mb-10">
        <button
          type="button"
          onClick={() => setActiveTab("photos")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "photos"
              ? "bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-900 shadow-md shadow-orange-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Photos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("videos")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "videos"
              ? "bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-900 shadow-md shadow-orange-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Videos</span>
        </button>
      </div>

      {/* Media Content */}
      <div className="w-full">
        {activeTab === "photos" && (
          <div>
            {photos.length === 0 ? (
              <div className="py-14 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 max-w-lg mx-auto">
                <Camera className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-700 mb-1">No Photos Uploaded</h4>
                <p className="text-xs text-slate-500">
                  Event photos will appear here once uploaded from the dashboard.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                {photos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(idx)}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                  >
                    <img
                      src={photoUrl}
                      alt={`${eventTitle} photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <ZoomIn className="w-5 h-5 text-slate-800" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "videos" && (
          <div>
            {videos.length === 0 ? (
              <div className="py-14 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 max-w-lg mx-auto">
                <Video className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-700 mb-1">No Videos Uploaded</h4>
                <p className="text-xs text-slate-500">
                  Event video highlights will appear here once added from the dashboard.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((videoUrl, idx) => {
                  const youtubeEmbed = getYouTubeEmbedUrl(videoUrl);

                  if (youtubeEmbed) {
                    return (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm"
                      >
                        <iframe
                          src={youtubeEmbed}
                          title={`${eventTitle} video ${idx + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                    );
                  }

                  // Direct video file (mp4, webm, etc.)
                  return (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm flex items-center justify-center"
                    >
                      <video
                        src={videoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal for Full View Photos */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev Photo */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Active Image */}
          <div
            className="max-w-5xl max-h-[85vh] relative flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightboxIndex]}
              alt={`${eventTitle} preview ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </div>

          {/* Next Photo */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer z-10"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

