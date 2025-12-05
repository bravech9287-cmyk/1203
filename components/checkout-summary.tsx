/**
 * @file components/checkout-summary.tsx
 * @description 주문 요약 컴포넌트
 *
 * 체크아웃 페이지에서 주문할 상품 목록과 총액 표시
 */

import { getCartItems } from "@/actions/cart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

/**
 * 주문 요약 컴포넌트 (Server Component)
 */
export async function CheckoutSummary() {
  const cartItems = await getCartItems();

  if (cartItems.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-center text-muted-foreground">
          장바구니가 비어있습니다.
        </p>
        <Link href="/products" className="mt-4 block text-center text-primary hover:underline">
          상품 보러가기
        </Link>
      </div>
    );
  }

  // 총액 계산
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal >= 50000 ? 0 : 3000; // 5만원 이상 무료배송
  const total = subtotal + shippingFee;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold text-foreground">주문 상품</h2>

      <div className="mb-6 space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-border pb-3 last:border-0"
          >
            <div className="flex-1">
              <p className="font-medium text-foreground">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.product.price)} × {item.quantity}개
              </p>
            </div>
            <p className="font-semibold text-foreground">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-border pt-4">
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
        <div className="flex justify-between border-t border-border pt-2">
          <span className="text-lg font-semibold text-foreground">총 결제금액</span>
          <span className="text-2xl font-bold text-foreground">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

