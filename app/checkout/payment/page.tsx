/**
 * @file app/checkout/payment/page.tsx
 * @description 결제 페이지
 *
 * 주문 생성 후 결제 진행 페이지
 */

import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrderById } from "@/actions/order";
import { PaymentWidget } from "@/components/payment-widget";
import { useUser } from "@clerk/nextjs";
import { PaymentPageClient } from "@/components/payment-page-client";

interface PaymentPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

/**
 * 결제 페이지
 */
export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    redirect("/checkout");
  }

  const order = await getOrderById(orderId);

  if (!order) {
    redirect("/checkout");
  }

  // 이미 결제 완료된 주문인지 확인
  if (order.status !== "pending") {
    redirect(`/orders/${orderId}`);
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">결제하기</h1>
        <PaymentPageClient order={order} />
      </div>
    </div>
  );
}

