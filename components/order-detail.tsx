/**
 * @file components/order-detail.tsx
 * @description 주문 상세 정보 컴포넌트
 *
 * 주문 정보, 배송지, 주문 상품 목록을 표시
 */

import type { OrderWithItems } from "@/types/order";
import { formatPrice } from "@/lib/utils";

interface OrderDetailProps {
  order: OrderWithItems;
}

const statusLabels: Record<string, string> = {
  pending: "결제 대기",
  confirmed: "주문 확인",
  shipped: "배송 중",
  delivered: "배송 완료",
  cancelled: "취소됨",
};

/**
 * 주문 상세 정보 컴포넌트
 */
export function OrderDetail({ order }: OrderDetailProps) {
  const shippingAddress = order.shipping_address;

  return (
    <div className="space-y-6">
      {/* 주문 정보 */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">주문 정보</h2>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">주문 상태</dt>
            <dd className="font-semibold text-foreground">
              {statusLabels[order.status] || order.status}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">주문일시</dt>
            <dd className="text-foreground">
              {new Date(order.created_at).toLocaleString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">총 결제금액</dt>
            <dd className="text-xl font-bold text-foreground">
              {formatPrice(order.total_amount)}
            </dd>
          </div>
        </dl>
      </div>

      {/* 배송지 정보 */}
      {shippingAddress && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">배송지 정보</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-muted-foreground">수령인</dt>
              <dd className="text-foreground">{shippingAddress.recipient}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">연락처</dt>
              <dd className="text-foreground">{shippingAddress.phone}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">주소</dt>
              <dd className="text-foreground">
                {shippingAddress.postalCode && `[${shippingAddress.postalCode}] `}
                {shippingAddress.address}
                {shippingAddress.addressDetail && ` ${shippingAddress.addressDetail}`}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* 주문 메모 */}
      {order.order_note && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold text-foreground">주문 메모</h2>
          <p className="text-muted-foreground">{order.order_note}</p>
        </div>
      )}

      {/* 주문 상품 목록 */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">주문 상품</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-border pb-4 last:border-0"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.product_name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.price)} × {item.quantity}개
                </p>
              </div>
              <p className="font-semibold text-foreground">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-border pt-4">
          <span className="text-lg font-semibold text-foreground">총 결제금액</span>
          <span className="text-2xl font-bold text-foreground">
            {formatPrice(order.total_amount)}
          </span>
        </div>
      </div>
    </div>
  );
}

