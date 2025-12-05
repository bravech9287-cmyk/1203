/**
 * @file components/add-to-cart-button.tsx
 * @description 장바구니 담기 버튼 컴포넌트
 *
 * 상품 상세 페이지에서 사용하는 장바구니 담기 버튼
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/actions/cart";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 장바구니 담기 버튼 컴포넌트
 */
export function AddToCartButton({
  productId,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await addToCart(productId, 1);
      // 성공 시 장바구니 페이지로 이동하거나 토스트 표시
      router.refresh();
      // 간단한 피드백을 위해 잠시 후 장바구니로 이동할 수 있도록
    } catch (err) {
      setError(err instanceof Error ? err.message : "장바구니 추가에 실패했습니다.");
      console.error("Error adding to cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button size="lg" className={className} disabled={disabled}>
          <ShoppingCart className="h-5 w-5" />
          로그인 후 장바구니에 담기
        </Button>
      </SignInButton>
    );
  }

  return (
    <div className="w-full">
      <Button
        size="lg"
        className={className}
        disabled={disabled || isLoading}
        onClick={handleAddToCart}
      >
        <ShoppingCart className="h-5 w-5" />
        {isLoading ? "추가 중..." : "장바구니에 담기"}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

