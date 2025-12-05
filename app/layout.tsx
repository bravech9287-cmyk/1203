import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Noto_Sans_KR } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { clerkLocalization } from "@/lib/clerk-localization";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SaaS 템플릿",
    template: "%s | SaaS 템플릿",
  },
  description: "Next.js 15 + Clerk + Supabase로 구동되는 쇼핑몰",
  keywords: ["Next.js", "Clerk", "Supabase", "쇼핑몰", "E-commerce"],
  authors: [{ name: "SaaS Template" }],
  creator: "SaaS Template",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "SaaS 템플릿",
    title: "SaaS 템플릿",
    description: "Next.js 15 + Clerk + Supabase로 구동되는 쇼핑몰",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SaaS 템플릿",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS 템플릿",
    description: "Next.js 15 + Clerk + Supabase로 구동되는 쇼핑몰",
    images: ["/og-image.png"],
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
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={clerkLocalization}>
      <html lang="ko">
        <body
          className={`${notoSansKR.variable} font-sans antialiased`}
        >
          <SyncUserProvider>
            <Navbar />
            {children}
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
