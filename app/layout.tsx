import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "Horestco Furniture",
  description: "Transform Your Living Space - Premium furniture collection designed to elevate your home with style, comfort, and sophistication.",
  keywords: "furniture, home decor, living space, premium furniture, modern design",
  authors: [{ name: "Horestco Furniture" }],
  creator: "Horestco Furniture",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://horestco.com.my",
    title: process.env.NEXT_PUBLIC_SITE_NAME || "Horestco Furniture",
    description: "Transform Your Living Space - Premium furniture collection designed to elevate your home with style, comfort, and sophistication.",
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Horestco Furniture",
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_SITE_NAME || "Horestco Furniture",
    description: "Transform Your Living Space - Premium furniture collection designed to elevate your home with style, comfort, and sophistication.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <Header siteName={process.env.NEXT_PUBLIC_SITE_NAME} />
        <main className="relative">
          {children}
        </main>
        <SpeedInsights />
      </body>
    </html>
  );
}
