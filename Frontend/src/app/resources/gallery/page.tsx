import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";
import GalleryClient, { GalleryMediaItem } from "./GalleryClient";
import { getApiBase, resolveImageUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Campus Gallery",
  description: "Browse photos of campus events, workshops, hackathons, and classroom training at BITC Amravati.",
  openGraph: {
    title: "Campus Gallery | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Photos from BITC campus events, hackathons, and workshops.",
  },
};

function isVideoUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.includes("youtube.com") ||
    clean.includes("youtu.be") ||
    clean.includes("vimeo.com") ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(clean)
  );
}

export default async function GalleryPage() {
  let images: (string | GalleryMediaItem)[] = [];
  let videos: (string | GalleryMediaItem)[] = [];
  
  try {
    const apiUrl = getApiBase();
    
    // Fetch gallery items without caching
    const res = await fetch(`${apiUrl}/gallery`, { 
      cache: "no-store",
      headers: {
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.items)) {
        data.items.forEach((item: any, idx: number) => {
          if (!item || !item.imgUrl) return;
          const rawUrl = String(item.imgUrl).trim();
          const isVideo = item.type === "video" || isVideoUrl(rawUrl);
          const resolved = resolveImageUrl(rawUrl);

          const mediaObj: GalleryMediaItem = {
            id: item.id || `gal-${idx}`,
            title: item.title ? String(item.title).trim() : `Gallery item ${idx + 1}`,
            url: resolved,
            rawUrl: rawUrl,
            type: isVideo ? "video" : "photo"
          };

          if (isVideo) {
            videos.push(mediaObj);
          } else {
            images.push(mediaObj);
          }
        });
      }
    }
  } catch (error) {
    console.warn("Failed to fetch gallery from backend API.", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white pt-16 pb-4 text-slate-900 text-center">
        <div className="container max-w-[1200px] mx-auto px-4">
          <ImageIcon className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Campus <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Gallery</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Glimpses of life at BITC - from intensive training sessions to vibrant campus events.
          </p>
        </div>
      </section>

      {/* Interactive Grid with Tabs */}
      <GalleryClient images={images} videos={videos} />
    </div>
  );
}
