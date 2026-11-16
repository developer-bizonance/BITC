import type { Metadata } from "next";
import { Suspense } from "react";
import PartnershipClient from "../PartnershipClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

export function generateStaticParams() {
  return [
    { type: "educational" },
    { type: "corporate" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const isCorporate = type === "corporate";
  const title = isCorporate
    ? "Corporate Partnership | BIZONANCE Industrial Training Centre. (BITC)"
    : "Educational Partnership | BIZONANCE Industrial Training Centre. (BITC)";
  const description = isCorporate
    ? "Partner with leading enterprises to build robust corporate workforces with BITC."
    : "Explore Academic MoU collaborations and educational partnerships with BITC.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: "/og-image.png",
          secureUrl: "/og-image.png",
          width: 1200,
          height: 630,
          type: "image/png",
          alt: "BIZONANCE Industrial Training Centre. (BITC) Logo",
        },
      ],
    },
  };
}

export default async function DynamicPartnershipPage({ params }: PageProps) {
  const { type } = await params;
  if (type !== "educational" && type !== "corporate") {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Suspense fallback={null}>
        <PartnershipClient initialTab={type as "educational" | "corporate"} />
      </Suspense>
    </div>
  );
}

