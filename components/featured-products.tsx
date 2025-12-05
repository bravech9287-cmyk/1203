/**
 * @file components/featured-products.tsx
 * @description 추천 상품 섹션 컴포넌트
 *
 * 홈 페이지에 표시할 추천 상품 섹션
 */

import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/supabase/products";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/**
 * 추천 상품 목록 컴포넌트 (Server Component)
 */
async function FeaturedProductList() {
  try {
    // 인기 상품을 가격이 높은 순으로 8개 조회 (추천 상품으로 표시)
    const result = await getProducts({
      activeOnly: true,
      sortBy: "price",
      sortOrder: "desc",
      limit: 8,
    });

    // 페이지네이션 결과인지 확인하고 Product[]로 변환
    const products = Array.isArray(result) ? result : result.products;

    if (products.length === 0) {
      return null;
    }

    return <ProductGrid products={products} />;
  } catch (error) {
    console.error("Error in FeaturedProductList:", error);
    // 에러 발생 시 빈 상태 반환 (사용자에게는 표시하지 않음)
    return null;
  }
}

/**
 * 추천 상품 섹션 로딩 컴포넌트
 */
function FeaturedProductsSkeleton() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted"></div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
          >
            <div className="aspect-square w-full animate-pulse bg-muted"></div>
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-muted"></div>
              <div className="mt-auto h-8 w-1/2 animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 추천 상품 섹션 컴포넌트
 */
export function FeaturedProducts() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">추천 상품</h2>
            <p className="mt-2 text-muted-foreground">
              인기 상품을 만나보세요
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProductList />
        </Suspense>
      </div>
    </section>
  );
}

