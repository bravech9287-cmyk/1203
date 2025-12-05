/**
 * @file components/order-list.tsx
 * @description 주문 목록 컴포넌트
 *
 * 사용자의 주문 내역 목록을 표시
 */

import { getOrders } from "@/actions/order";
import { OrderListItem } from "@/components/order-list-item";
import { EmptyOrders } from "@/components/ui/empty-state";

/**
 * 주문 목록 컴포넌트 (Server Component)
 */
export async function OrderList() {
  const orders = await getOrders();

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-16">
        <EmptyOrders />
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

