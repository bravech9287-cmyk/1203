/**
 * @file components/order-list-item.tsx
 * @description 주문 목록 아이템 컴포넌트
 *
 * 개별 주문 정보를 카드 형태로 표시
 */

import Link from "next/link";
import type { OrderWithItems } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package } from "lucide-react";

interface OrderListItemProps {
  order: OrderWithItems;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "결제 대기", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  confirmed: { label: "주문 확인", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  shipped: { label: "배송 중", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  delivered: { label: "배송 완료", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  cancelled: { label: "취소됨", color: "bg-red-500/10 text-red-600 dark:text-red-400" },
};

/**
 * 주문 목록 아이템 컴포넌트
 */
export function OrderListItem({ order }: OrderListItemProps) {
  const status = statusLabels[order.status] || {
    label: order.status,
    color: "bg-muted text-muted-foreground",
  };

  const orderDate = new Date(order.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const firstItemName = order.items[0]?.product_name || "";
  const displayName =
    order.items.length === 1
      ? firstItemName
      : `${firstItemName} 외 ${order.items.length - 1}개`;

  return (
    <Link href={`/orders/${order.id}`}>
      <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="font-mono text-sm text-muted-foreground">
                {order.id.slice(0, 8)}...
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${status.color}`}
              >
                {status.label}
              </span>
            </div>
            <h3 className="mb-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {displayName}
            </h3>
            <p className="mb-2 text-sm text-muted-foreground">
              {orderDate} · 총 {itemCount}개
            </p>
            <p className="text-xl font-bold text-foreground">
              {formatPrice(order.total_amount)}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="ml-4">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Link>
  );
}

