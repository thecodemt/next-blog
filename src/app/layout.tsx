import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Modern Blog",
    template: "%s | Modern Blog"
  },
  description: "A modern full-stack blog system built with Next.js, TypeScript, and Tailwind CSS",
  keywords: ["blog", "nextjs", "typescript", "tailwind", "modern"],
  authors: [{ name: "Modern Blog Team" }],
  creator: "Modern Blog",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://modern-blog.vercel.app",
    siteName: "Modern Blog",
    title: "Modern Blog",
    description: "A modern full-stack blog system built with Next.js, TypeScript, and Tailwind CSS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Blog",
    description: "A modern full-stack blog system built with Next.js, TypeScript, and Tailwind CSS",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
