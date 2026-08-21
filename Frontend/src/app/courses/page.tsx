import type { Metadata } from "next";
import FeaturedCertifications from "@/components/FeaturedCertifications";

export const metadata: Metadata = {
  title: "All Certification Courses | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
  description: "Explore industry-vetted certification programs in Full Stack Java, Python, MERN, AI & ML, Data Science, Cyber Security, UI/UX Design, and Business Analytics at BITC Amravati.",
  openGraph: {
    title: "All Certification Courses | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Explore industry-vetted certification programs in Full Stack, AI, Data Science, Cyber Security, UI/UX, and Management.",
  },
};

export default function CoursesPage() {
  return (
    <div className="py-12 md:py-20 bg-white min-h-screen">
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center text-center mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-dark mb-4">Our Programs</h1>
            <p className="text-gray-500 text-[16px] md:text-lg max-w-2xl mx-auto">
              Industry-vetted curriculum designed to make you day-one ready. Master the skills that top companies are looking for.
            </p>
          </div>
        </div>

        <FeaturedCertifications />
      </div>
    </div>
  );
}
