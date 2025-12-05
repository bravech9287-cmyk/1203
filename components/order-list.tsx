/**
 * @file components/order-list.tsx
 * @description 주문 목록 컴포넌트
 *
 * 사용자의 주문 내역 목록을 표시
 */

import { getOrders } from "@/actions/order";
import { OrderListItem } from "@/components/order-list-item";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 주문 목록 컴포넌트 (Server Component)
 */
export async function OrderList() {
  const orders = await getOrders();

  if (orders.length === 0) {
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          주문 내역이 없습니다
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          아직 주문한 상품이 없습니다
        </p>
        <Link href="/products">
          <Button>상품 보러가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderListItem key={order.id} order={order} />
      ))}
    </div>
  );
}

