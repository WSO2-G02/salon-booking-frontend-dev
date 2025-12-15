import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurora Glam | Luxury Salon",
  description: "Experience the elegance of Aurora Salon - where expert care meets luxurious services for a transformative beauty experience in Sri Lanka.",
  keywords: ["salon", "beauty", "hair", "nails", "skincare", "Aurora", "Sri Lanka", "luxury"],
  authors: [{ name: "Aurora Glam" }],
  metadataBase: new URL("https://aurora-glam.com"),
  openGraph: {
    title: "Aurora Glam | Luxury Salon",
    description: "Where expert care meets luxurious services for a transformative beauty experience in Sri Lanka.",
    url: "https://aurora-glam.com",
    type: "website",
    locale: "en_US",
    siteName: "Aurora Glam",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aurora Glam - Luxury Salon in Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurora Glam | Luxury Salon",
    description: "Where expert care meets luxurious services for a transformative beauty experience in Sri Lanka.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
