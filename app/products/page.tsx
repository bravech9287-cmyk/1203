/**
 * @file app/products/page.tsx
 * @description 상품 목록 페이지
 *
 * 카테고리 필터 및 정렬 기능이 있는 상품 목록 페이지
 */

import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { ProductFilters } from "@/components/product-filters";
import { ProductPagination } from "@/components/product-pagination";
import { getProducts } from "@/lib/supabase/products";
import type { PaginatedProductsResult } from "@/types/product";

/**
 * 상품 목록 로딩 컴포넌트
 */
function ProductListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted"></div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
          >
            <div className="aspect-square w-full animate-pulse bg-muted"></div>
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-muted"></div>
              <div className="mb-3 h-4 w-full animate-pulse rounded bg-muted"></div>
              <div className="mt-auto h-8 w-1/2 animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 상품 목록 컴포넌트 (Server Component)
 */
async function ProductList({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const category = params.category || undefined;
  const sort = params.sort || "created_at-desc";
  const page = parseInt(params.page || "1", 10);
  const pageSize = 12; // 페이지당 12개 상품

  // 정렬 옵션 파싱
  const [sortBy, sortOrder] = sort.split("-") as [
    "created_at" | "price" | "name",
    "asc" | "desc"
  ];

  const result = await getProducts({
    category,
    sortBy,
    sortOrder,
    activeOnly: true,
    page,
    pageSize,
  });

  // 페이지네이션 결과인지 확인
  if ("totalCount" in result) {
    const paginatedResult = result as PaginatedProductsResult;
    return (
      <>
        <ProductGrid products={paginatedResult.products} />
        <ProductPagination
          currentPage={paginatedResult.currentPage}
          totalPages={paginatedResult.totalPages}
        />
      </>
    );
  }

  // 페이지네이션 없이 반환 (기존 호환성)
  return <ProductGrid products={result} />;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">상품 목록</h1>
          <p className="mt-2 text-muted-foreground">
            다양한 카테고리의 상품을 만나보세요
          </p>
        </div>

        {/* 필터 및 정렬 UI */}
        <ProductFilters
          currentCategory={params.category}
          currentSort={params.sort || "created_at-desc"}
        />

        {/* 상품 그리드 및 페이지네이션 */}
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

