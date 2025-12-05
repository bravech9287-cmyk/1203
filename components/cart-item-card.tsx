/**
 * @file components/cart-item-card.tsx
 * @description 장바구니 아이템 카드 컴포넌트
 *
 * 개별 장바구니 아이템을 표시하고 수량 변경/삭제 기능 제공
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CartItemWithProduct } from "@/types/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { updateCartItemQuantity, removeFromCart } from "@/actions/cart";

interface CartItemCardProps {
  cartItem: CartItemWithProduct;
}

/**
 * 장바구니 아이템 카드 컴포넌트
 */
export function CartItemCard({ cartItem }: CartItemCardProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { product, quantity } = cartItem;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > product.stock_quantity) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateCartItemQuantity(cartItem.id, newQuantity);
      router.refresh();
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert(error instanceof Error ? error.message : "수량 변경에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("장바구니에서 삭제하시겠습니까?")) {
      return;
    }

    setIsRemoving(true);
    try {
      await removeFromCart(cartItem.id);
      router.refresh();
    } catch (error) {
      console.error("Error removing item:", error);
      alert(error instanceof Error ? error.message : "삭제에 실패했습니다.");
    } finally {
      setIsRemoving(false);
    }
  };

  const itemTotal = product.price * quantity;
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-4">
      {/* 상품 이미지 */}
      <Link
        href={`/products/${product.id}`}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
      >
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <svg
            className="h-12 w-12 text-muted-foreground/30"
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
      </Link>

      {/* 상품 정보 */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              href={`/products/${product.id}`}
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatPrice(product.price)} × {quantity}개
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isRemoving}
            className="flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* 수량 조절 및 총액 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isUpdating || quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={
                isUpdating ||
                quantity >= product.stock_quantity ||
                isOutOfStock
              }
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
            {isOutOfStock && (
              <span className="text-sm text-destructive">품절</span>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-foreground">
              {formatPrice(itemTotal)}
            </div>
            {product.stock_quantity < quantity && (
              <div className="text-xs text-destructive">
                재고 부족 (재고: {product.stock_quantity}개)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

