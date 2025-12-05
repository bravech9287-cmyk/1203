/**
 * @file app/robots.ts
 * @description robots.txt 생성
 *
 * 검색 엔진 크롤러를 위한 robots.txt 파일을 생성합니다.
 */

import { MetadataRoute } from "next";

/**
 * robots.txt 생성
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/checkout/",
          "/orders/",
          "/payment/",
          "/auth-test/",
          "/integration-test/",
          "/storage-test/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

