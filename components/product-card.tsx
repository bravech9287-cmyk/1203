/**
 * @file components/product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * 상품 정보를 카드 형태로 표시하는 컴포넌트
 */

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

/**
 * 상품 카드 컴포넌트
 *
 * @param product 상품 정보
 */
export function ProductCard({ product }: ProductCardProps) {
  // 가격 포맷팅 (천 단위 구분)
  const formattedPrice = formatPrice(product.price);

  // 재고 상태 확인
  const isInStock = product.stock_quantity > 0;
  const stockStatus = isInStock
    ? `${product.stock_quantity}개 남음`
    : "품절";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg hover:scale-[1.02]"
    >
      {/* 상품 이미지 영역 */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {/* 임시 placeholder 이미지 */}
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <svg
            className="h-24 w-24 text-muted-foreground/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* 재고 상태 배지 */}
        {!isInStock && (
          <div className="absolute right-2 top-2 rounded-full bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">
            품절
          </div>
        )}

        {/* 카테고리 배지 */}
        {product.category && (
          <div className="absolute left-2 top-2 rounded-full bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
            {product.category}
          </div>
        )}
      </div>

      {/* 상품 정보 영역 */}
      <div className="flex flex-1 flex-col p-4">
        {/* 상품 이름 */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* 상품 설명 (선택적) */}
        {product.description && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        )}

        {/* 가격 및 재고 정보 */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-card-foreground">
              {formattedPrice}
            </span>
            {isInStock && (
              <span className="text-xs text-muted-foreground">
                {stockStatus}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

