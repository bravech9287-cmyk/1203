/**
 * @file app/sitemap.ts
 * @description sitemap.xml 생성
 *
 * 검색 엔진을 위한 사이트맵을 생성합니다.
 */

import { MetadataRoute } from "next";
import { getProducts } from "@/lib/supabase/products";

/**
 * sitemap.xml 생성
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // 동적 페이지 (상품 상세 페이지)
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts({ activeOnly: true });
    const productList = Array.isArray(products) ? products : products.products;

    productPages = productList.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error generating product sitemap:", error);
  }

  return [...staticPages, ...productPages];
}

