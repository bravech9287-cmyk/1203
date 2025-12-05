/**
 * @file app/orders/[id]/page.tsx
 * @description 주문 완료 페이지
 *
 * 주문 완료 후 주문 상세 정보를 표시하는 페이지
 */

import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrderById } from "@/actions/order";
import { OrderDetail } from "@/components/order-detail";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 주문 완료 페이지
 */
export default async function OrderPage({ params }: OrderPageProps) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <Link href="/orders">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            주문 목록으로
          </Button>
        </Link>

        {/* 주문 상태에 따른 메시지 */}
        {order.status === "pending" && (
          <div className="mb-8 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              결제 대기 중입니다
            </h1>
            <p className="text-muted-foreground">
              주문 번호: <span className="font-mono font-semibold">{order.id}</span>
            </p>
            <Link href={`/checkout/payment?orderId=${order.id}`} className="mt-4 inline-block">
              <Button>결제하기</Button>
            </Link>
          </div>
        )}
        {order.status === "confirmed" && (
          <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              주문이 완료되었습니다!
            </h1>
            <p className="text-muted-foreground">
              주문 번호: <span className="font-mono font-semibold">{order.id}</span>
            </p>
          </div>
        )}
        {order.status !== "pending" && order.status !== "confirmed" && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-foreground">주문 상세</h1>
            <p className="text-muted-foreground">
              주문 번호: <span className="font-mono font-semibold">{order.id}</span>
            </p>
          </div>
        )}

        {/* 주문 상세 정보 */}
        <OrderDetail order={order} />
      </div>
    </div>
  );
}

