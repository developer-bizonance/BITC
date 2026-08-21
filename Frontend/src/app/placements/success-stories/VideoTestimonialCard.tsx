"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";

const getYouTubeID = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function VideoTestimonialCard({ video }: { video: any }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const ytId = getYouTubeID(video.youtubeUrl || "");
  const thumbnailUrl = ytId 
    ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` 
    : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="group cursor-pointer">
      <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden relative shadow-lg mb-4">
        {isPlaying && ytId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          ></iframe>
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 cursor-pointer"
            style={{ backgroundImage: `url('${thumbnailUrl}')` }}
            onClick={() => setIsPlaying(true)}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-orange-500/30 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)]">
                <PlayCircle className="w-8 h-8 ml-1" />
              </div>
            </div>
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{video.title}</h3>
      <p className="text-gray-500 font-medium">{video.name} • BITC Alumni</p>
    </div>
  );
}
