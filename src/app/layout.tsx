import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

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
    locale: "zh_CN",
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
    <html lang="zh-CN" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet" />
      </head>
      <body
        className="font-sans antialiased min-h-dvh flex flex-col"
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
