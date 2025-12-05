/**
 * @file components/cart-summary.tsx
 * @description 장바구니 요약 컴포넌트
 *
 * 장바구니 총액을 표시하고 주문하기 버튼 제공
 */

import { getCartItems } from "@/actions/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * 장바구니 요약 컴포넌트 (Server Component)
 */
export async function CartSummary() {
  const cartItems = await getCartItems();

  if (cartItems.length === 0) {
    return null;
  }

  // 총액 계산
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal >= 50000 ? 0 : 3000; // 5만원 이상 무료배송
  const total = subtotal + shippingFee;

  // 재고 부족 아이템 확인
  const hasOutOfStockItems = cartItems.some(
    (item) => item.quantity > item.product.stock_quantity
  );

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">주문 요약</h2>

      <div className="space-y-3 border-b border-border pb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">상품 금액</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">배송비</span>
          <span className="text-foreground">
            {shippingFee === 0 ? (
              <span className="text-primary">무료</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>
        {subtotal < 50000 && (
          <p className="text-xs text-muted-foreground">
            {formatPrice(50000 - subtotal)}원 더 구매 시 무료배송
          </p>
        )}
      </div>

      <div className="my-4 flex justify-between border-b border-border pb-4">
        <span className="text-lg font-semibold text-foreground">총 결제금액</span>
        <span className="text-2xl font-bold text-foreground">
          {formatPrice(total)}
        </span>
      </div>

      <Link href="/checkout" className="block">
        <Button
          size="lg"
          className="w-full"
          disabled={hasOutOfStockItems}
        >
          주문하기
        </Button>
      </Link>

      {hasOutOfStockItems && (
        <p className="mt-2 text-xs text-destructive">
          재고 부족 상품이 있습니다. 수량을 조정해주세요.
        </p>
      )}
    </div>
  );
}

