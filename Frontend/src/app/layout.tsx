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
    default: "BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    template: "%s | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
  },
  description:
    "BITC (BIZONANCE Industrial Training Centre) is a premier industry-focused tech institute in Amravati offering courses in Full Stack Development, AI & Machine Learning, Data Science, Cyber Security, UI/UX Design, and Management with 100% placement support.",
  keywords: [
    "BITC",
    "BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    "BIZONANCE Industrial Training Centre",
    "BIZONANCE INDIA PRIVATE LIMITED",
    "Industrial Training Amravati",
    "IT Courses Amravati",
    "Full Stack Development Course",
    "AI Machine Learning Training",
    "Data Science Course Amravati",
    "UI UX Design Academy",
    "Coding Bootcamp Amravati",
    "Placement Support IT Courses",
    "Saturna Amravati Training Institute",
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
    title: "BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description:
      "Empowering Future Professionals with Industry-Ready Skills. Hands-on training in Software, AI, Data Science & Management with top company placements.",
    siteName: "BIZONANCE Industrial Training Centre. (BITC) | Amravati",
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
    title: "BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description:
      "Industry-focused Training Center offering courses in Full Stack, AI, Data Science & Management with placement assistance.",
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
