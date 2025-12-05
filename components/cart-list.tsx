/**
 * @file components/cart-list.tsx
 * @description 장바구니 아이템 목록 컴포넌트
 *
 * 장바구니에 담긴 상품 목록을 표시하고 수량 변경/삭제 기능 제공
 */

import { getCartItems } from "@/actions/cart";
import { CartItemCard } from "@/components/cart-item-card";
import { EmptyCart } from "@/components/ui/empty-state";

/**
 * 장바구니 아이템 목록 컴포넌트 (Server Component)
 */
export async function CartList() {
  const cartItems = await getCartItems();

  if (cartItems.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-16">
        <EmptyCart />
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

