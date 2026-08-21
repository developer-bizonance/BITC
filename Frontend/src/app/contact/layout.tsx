import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
  description: "Get in touch with BIZONANCE Industrial Training Centre. (BITC) in Amravati. Visit our Saturna campus or call +91 89567 27311 for course inquiries and admissions.",
  keywords: ["Contact BITC", "BIZONANCE Contact Number", "BITC Amravati Address", "Saturna Amravati Training Center", "BITC Email", "BIZONANCE Industrial Training Centre. (BITC) | Amravati"],
  openGraph: {
    title: "Contact Us | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Connect with the BITC team in Amravati for admissions, program details, and industry partnerships.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
