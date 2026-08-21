import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";

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
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/gallery`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.items) {
        images = data.items.map((item: any) => item.imgUrl);
      }
    }
  } catch (error) {
    console.warn("Failed to fetch gallery from backend API.");
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white py-16 text-slate-900 text-center border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4">
          <ImageIcon className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">Photo <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Gallery</span></h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Glimpses of life at BITC - from intensive training sessions to vibrant campus events.</p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((src, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm bg-gray-200 aspect-[4/3]">
                <img 
                  src={src} 
                  alt={`Gallery image ${i + 1}`} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
