import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bitc-eight.vercel.app"),
  title: {
    default: "BIZONANCE Industrial Training Centre | Amravati",
    template: "%s | BIZONANCE Industrial Training Centre | Amravati",
  },
  description:
    "BITC (BIZONANCE Industrial Training Centre) is a premier industry-focused tech institute in Amravati offering certifications in Full Stack Development, AI & Machine Learning, Data Science, UI/UX Design, and Management with 100% placement support.",
  keywords: [
    "BITC",
    "BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    "BIZONANCE industrial training centre",
    "BIZONANCE INDIA PRIVATE LIMITED",
    "Industrial training amravati",
    "IT Certifications Amravati",
    "Full stack development certification",
    "AI Machine Learning Training",
    "Data science certification amravati",
    "UI ux design academy",
    "Coding bootcamp amravati",
    "Placement Support IT Certifications",
    "Saturna amravati training institute",
  ],
  authors: [{ name: "BIZONANCE INDIA PRIVATE LIMITED", url: "https://bizonance.in" }],
  creator: "BIZONANCE INDIA PRIVATE LIMITED",
  publisher: "BIZONANCE INDIA PRIVATE LIMITED",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://bitc-eight.vercel.app",
    title: "BIZONANCE Industrial Training Centre | Amravati",
    description:
      "Empowering future professionals with industry-ready skills. Hands-on training in Software, AI, Data Science & Management with top company placements.",
    siteName: "BIZONANCE Industrial Training Centre | Amravati",
    images: [
      {
        url: "/logos.png",
        width: 1200,
        height: 630,
        alt: "BIZONANCE Industrial Training Centre. (BITC) | Amravati Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BIZONANCE Industrial Training Centre | Amravati",
    description:
      "Industry-focused Training Center offering certifications in Full Stack, AI, Data Science & Management with placement assistance.",
    images: ["/logos.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
