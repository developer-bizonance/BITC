import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";
import GalleryClient from "./GalleryClient";
import { getApiBase } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Campus Gallery",
  description: "Browse photos of campus events, workshops, hackathons, and classroom training at BITC Amravati.",
  openGraph: {
    title: "Campus Gallery | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Photos from BITC campus events, hackathons, and workshops.",
  },
};

export default async function GalleryPage() {
  let images: string[] = [];
  let videos: any[] = [];
  
  try {
    const apiUrl = getApiBase();
    
    // Fetch gallery items
    const res = await fetch(`${apiUrl}/gallery`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.items) {
        data.items.forEach((item: any) => {
          if (item.imgUrl) {
            if (item.imgUrl.match(/\.(mp4|webm|ogg|mov)$/i) || item.imgUrl.includes("youtube.com") || item.imgUrl.includes("youtu.be")) {
              videos.push(item.imgUrl);
            } else {
              images.push(item.imgUrl);
            }
          }
        });
      }
    }

  } catch (error) {
    console.warn("Failed to fetch gallery from backend API.");
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white pt-16 pb-4 text-slate-900 text-center">
        <div className="container max-w-[1200px] mx-auto px-4">
          <ImageIcon className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">Campus <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Gallery</span></h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Glimpses of life at BITC - from intensive training sessions to vibrant campus events.</p>
        </div>
      </section>

      {/* Interactive Grid with Tabs */}
      <GalleryClient images={images} videos={videos} />
    </div>
  );
}
