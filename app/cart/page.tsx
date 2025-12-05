/**
 * @file app/cart/page.tsx
 * @description 장바구니 페이지
 *
 * 사용자의 장바구니 아이템을 표시하고 관리하는 페이지
 */

import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CartList } from "@/components/cart-list";
import { CartSummary } from "@/components/cart-summary";

/**
 * 장바구니 로딩 컴포넌트
 */
function CartSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">장바구니</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className="h-24 w-24 animate-pulse rounded bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
                  <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="space-y-4">
              <div className="h-6 w-32 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
              <div className="h-12 w-full animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 장바구니 페이지
 */
export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">장바구니</h1>

        <Suspense fallback={<CartSkeleton />}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* 장바구니 아이템 목록 */}
            <div className="lg:col-span-2">
              <CartList />
            </div>

            {/* 장바구니 요약 */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

