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
  title: "SaaS 템플릿",
  description: "Next.js + Clerk + Supabase 보일러플레이트",
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
