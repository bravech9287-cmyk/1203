/**
 * @file components/product-detail.tsx
 * @description 상품 상세 정보 컴포넌트
 *
 * 상품의 상세 정보를 표시하는 컴포넌트
 */

import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { getCategoryName } from "@/lib/utils/categories";
import { AddToCartButton } from "@/components/add-to-cart-button";

interface ProductDetailProps {
  product: Product;
}

/**
 * 상품 상세 정보 컴포넌트
 *
 * @param product 상품 정보
 */
export function ProductDetail({ product }: ProductDetailProps) {
  const formattedPrice = formatPrice(product.price);
  const isInStock = product.stock_quantity > 0;
  const categoryName = getCategoryName(product.category);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* 상품 이미지 영역 */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted">
        {/* 임시 placeholder 이미지 */}
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <svg
            className="h-48 w-48 text-muted-foreground/30"
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
          <div className="absolute right-4 top-4 rounded-full bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground">
            품절
          </div>
        )}
      </div>

      {/* 상품 정보 영역 */}
      <div className="flex flex-col gap-6">
        {/* 카테고리 */}
        {product.category && (
          <div className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {categoryName}
          </div>
        )}

        {/* 상품 이름 */}
        <h1 className="text-4xl font-bold text-foreground">{product.name}</h1>

        {/* 가격 */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-foreground">
            {formattedPrice}
          </span>
        </div>

        {/* 재고 정보 */}
        <div className="flex items-center gap-4">
          {isInStock ? (
            <span className="text-sm text-muted-foreground">
              재고: {product.stock_quantity}개
            </span>
          ) : (
            <span className="text-sm font-semibold text-destructive">
              품절
            </span>
          )}
        </div>

        {/* 구분선 */}
        <div className="border-t border-border"></div>

        {/* 상품 설명 */}
        {product.description && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              상품 설명
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* 구분선 */}
        <div className="border-t border-border"></div>

        {/* 장바구니 담기 버튼 */}
        <div className="mt-auto">
          <AddToCartButton
            productId={product.id}
            disabled={!isInStock}
            className="w-full gap-2"
          />
        </div>

        {/* 상품 정보 */}
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            상품 정보
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">상품 ID</dt>
              <dd className="font-mono text-foreground">{product.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">카테고리</dt>
              <dd className="text-foreground">{categoryName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">등록일</dt>
              <dd className="text-foreground">
                {new Date(product.created_at).toLocaleDateString("ko-KR")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

