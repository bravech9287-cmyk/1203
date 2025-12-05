/**
 * @file components/cart-list.tsx
 * @description 장바구니 아이템 목록 컴포넌트
 *
 * 장바구니에 담긴 상품 목록을 표시하고 수량 변경/삭제 기능 제공
 */

import { getCartItems } from "@/actions/cart";
import { CartItemCard } from "@/components/cart-item-card";

/**
 * 장바구니 아이템 목록 컴포넌트 (Server Component)
 */
export async function CartList() {
  const cartItems = await getCartItems();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-16 text-center">
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          장바구니가 비어있습니다
        </h3>
        <p className="text-sm text-muted-foreground">
          상품을 장바구니에 담아보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <CartItemCard key={item.id} cartItem={item} />
      ))}
    </div>
  );
}

