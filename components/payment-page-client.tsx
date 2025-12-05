/**
 * @file components/payment-page-client.tsx
 * @description 결제 페이지 클라이언트 컴포넌트
 *
 * 사용자 정보를 가져와서 결제 위젯에 전달
 */

"use client";

import { useUser } from "@clerk/nextjs";
import { PaymentWidget } from "@/components/payment-widget";
import type { OrderWithItems } from "@/types/order";
import { formatPrice } from "@/lib/utils";

interface PaymentPageClientProps {
  order: OrderWithItems;
}

/**
 * 결제 페이지 클라이언트 컴포넌트
 */
export function PaymentPageClient({ order }: PaymentPageClientProps) {
  const { user } = useUser();

  const orderName =
    order.items.length === 1
      ? order.items[0].product_name
      : `${order.items[0].product_name} 외 ${order.items.length - 1}개`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* 주문 요약 */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">주문 요약</h2>
        <div className="mb-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">주문 번호</span>
            <span className="font-mono text-sm text-foreground">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">주문 상품</span>
            <span className="text-foreground">{orderName}</span>
          </div>
        </div>
        <div className="border-t border-border pt-4">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-foreground">총 결제금액</span>
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>
      </div>

      {/* 결제 위젯 */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">결제 수단 선택</h2>
        <PaymentWidget
          orderId={order.id}
          amount={order.total_amount}
          orderName={orderName}
          customerName={user?.fullName || user?.firstName || "고객"}
          customerEmail={user?.primaryEmailAddress?.emailAddress}
        />
      </div>
    </div>
  );
}

