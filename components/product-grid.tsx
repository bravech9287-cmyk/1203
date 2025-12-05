/**
 * @file components/product-grid.tsx
 * @description 상품 그리드 섹션 컴포넌트
 *
 * 상품 목록을 Grid 레이아웃으로 표시하는 컴포넌트
 */

import type { Product } from "@/types/product";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
}

/**
 * 상품 그리드 섹션 컴포넌트
 *
 * @param products 상품 목록 배열
 */
export function ProductGrid({ products }: ProductGridProps) {
  // 상품이 없는 경우
  if (products.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="mb-4 h-16 w-16 text-muted-foreground/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            등록된 상품이 없습니다
          </h3>
          <p className="text-sm text-muted-foreground">
            곧 새로운 상품이 추가될 예정입니다.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">상품 목록</h2>
        <p className="mt-2 text-muted-foreground">
          총 {products.length}개의 상품이 있습니다
        </p>
      </div>

      {/* 반응형 Grid 레이아웃 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

