/**
 * @file app/checkout/page.tsx
 * @description 주문 페이지 (체크아웃)
 *
 * 배송지 정보 입력 및 주문 생성 페이지
 */

import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { CheckoutSummary } from "@/components/checkout-summary";

/**
 * 체크아웃 로딩 컴포넌트
 */
function CheckoutSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">주문하기</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-64 animate-pulse rounded-lg border border-border bg-card"></div>
        </div>
        <div className="space-y-4">
          <div className="h-64 animate-pulse rounded-lg border border-border bg-card"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * 주문 페이지
 */
export default async function CheckoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">주문하기</h1>

        <Suspense fallback={<CheckoutSkeleton />}>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* 주문 폼 */}
            <div>
              <CheckoutForm />
            </div>

            {/* 주문 요약 */}
            <div>
              <CheckoutSummary />
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

