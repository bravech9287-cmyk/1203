/**
 * @file components/cart-icon.tsx
 * @description 장바구니 아이콘 컴포넌트
 *
 * 네비게이션 바에 표시할 장바구니 아이콘 및 개수 표시
 */

import { Suspense } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getCartItemCount } from "@/actions/cart";
import { Button } from "@/components/ui/button";

/**
 * 장바구니 아이콘 컴포넌트 (Server Component)
 */
async function CartIconContent() {
  const count = await getCartItemCount();

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Button>
    </Link>
  );
}

/**
 * 장바구니 아이콘 (Suspense 래퍼)
 */
export function CartIcon() {
  return (
    <Suspense
      fallback={
        <Button variant="ghost" size="icon" disabled>
          <ShoppingCart className="h-5 w-5" />
        </Button>
      }
    >
      <CartIconContent />
    </Suspense>
  );
}

