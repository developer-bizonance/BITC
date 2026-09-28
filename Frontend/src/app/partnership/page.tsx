import type { Metadata } from "next";
import { Handshake } from "lucide-react";
import PartnershipClient from "./PartnershipClient";

export const metadata: Metadata = {
  title: "Partnerships & Collaborations",
  description: "Explore Educational and Corporate partnerships with BITC Amravati.",
  openGraph: {
    title: "Partnerships | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Academic MoU collaborations and Corporate Training programs.",
  },
};

export default function PartnershipPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PartnershipClient />
    </div>
  );
}
