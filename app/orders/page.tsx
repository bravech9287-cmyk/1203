/**
 * @file app/orders/page.tsx
 * @description 주문 내역 페이지 (마이페이지)
 *
 * 사용자의 주문 내역 목록을 표시하는 페이지
 */

import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrders } from "@/actions/order";
import { OrderList } from "@/components/order-list";

/**
 * 주문 내역 로딩 컴포넌트
 */
function OrdersSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">주문 내역</h1>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg border border-border bg-card"
          ></div>
        ))}
      </div>
    </div>
  );
}

/**
 * 주문 내역 페이지
 */
export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">주문 내역</h1>

        <Suspense fallback={<OrdersSkeleton />}>
          <OrderList />
        </Suspense>
      </div>
    </div>
  );
}

