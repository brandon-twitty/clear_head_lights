import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stlclearheadlights.com"),
  title: "Clear Head Lights | Professional Headlight Restoration",
  description: "Professional-grade mobile headlight restoration service based in Fenton, MO.",
  keywords: ["mobile headlight restoration", "headlight cleaning", "mobile car detailing", "Fenton MO", "St. Louis", "auto detailing", "headlight repair"],
  openGraph: {
    title: "Clear Head Lights | Call (314) 347-8886", // Added phone number here for maximum visibility
    description: "Don't let foggy headlights put your family at risk. We offer professional-grade mobile headlight restoration in the Fenton, MO area.",
    url: "https://stlclearheadlights.com",
    siteName: "Clear Head Lights",
    images: [
      {
        url: "/images/before-after-v2.png", // Using the before/after placeholder image for good visual impact
        width: 1200,
        height: 630,
        alt: "Before and After Headlight Restoration",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clear Head Lights | Professional Headlight Restoration",
    description: "Professional-grade mobile headlight restoration service based in Fenton, MO.",
    images: ["/images/before-after-v2.png"],
  },
};

import { AuthProvider } from "@/lib/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100 font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
