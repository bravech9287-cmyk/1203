/**
 * @file app/manifest.ts
 * @description Web App Manifest 생성
 *
 * PWA 및 모바일 앱 설치를 위한 manifest.json을 생성합니다.
 */

import { MetadataRoute } from "next";

/**
 * manifest.json 생성
 */
export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  return {
    name: "SaaS 템플릿",
    short_name: "SaaS 템플릿",
    description: "Next.js 15 + Clerk + Supabase로 구동되는 쇼핑몰",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

