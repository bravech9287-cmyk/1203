/**
 * @file app/payment/fail/page.tsx
 * @description 결제 실패 페이지
 *
 * Toss Payments 결제 실패 후 콜백 처리
 */

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XCircle } from "lucide-react";

/**
 * 결제 실패 처리 컴포넌트
 */
function PaymentFailHandler() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <XCircle className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">결제에 실패했습니다</h1>
      {message && (
        <p className="mb-2 text-muted-foreground">{message}</p>
      )}
      {code && (
        <p className="mb-6 text-sm text-muted-foreground">에러 코드: {code}</p>
      )}
      <div className="flex gap-4">
        {orderId && (
          <Link href={`/orders/${orderId}`}>
            <Button variant="outline">주문 상세로</Button>
          </Link>
        )}
        <Link href="/cart">
          <Button>장바구니로</Button>
        </Link>
        <Link href="/">
          <Button variant="ghost">홈으로</Button>
        </Link>
      </div>
    </div>
  );
}

/**
 * 결제 실패 페이지
 */
export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4">
          <p className="text-lg text-muted-foreground">로딩 중...</p>
        </div>
      }
    >
      <PaymentFailHandler />
    </Suspense>
  );
}

