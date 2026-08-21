import type { Metadata } from "next";
import { Hammer } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Infrastructure",
  description: "Explore the modern facilities and labs at BIZONANCE Industrial Training Centre (BITC) in Amravati.",
  openGraph: {
    title: "Our Infrastructure | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Explore our modern tech labs and campus infrastructure.",
  },
};

export default function OurInfrastructurePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] text-[15px] items-center justify-center bg-gray-50 py-20">
      <div className="text-center px-4 max-w-lg">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
          <Hammer className="w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Coming Soon</h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed font-medium">
          We are currently working on showcasing our state-of-the-art infrastructure. Please check back later!
        </p>
        <Link 
          href="/" 
          className="inline-flex h-14 items-center justify-center rounded-full px-10 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)]"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
