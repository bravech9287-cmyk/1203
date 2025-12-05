/**
 * @file app/payment/success/page.tsx
 * @description 결제 성공 페이지
 *
 * Toss Payments 결제 성공 후 콜백 처리
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmPayment } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

/**
 * 결제 성공 처리 컴포넌트
 */
function PaymentSuccessHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!orderId) {
        setError("주문 정보가 올바르지 않습니다.");
        setStatus("error");
        return;
      }

      // 테스트 모드: paymentKey가 없어도 주문 상태만 업데이트
      // 실제 운영 환경에서는 Toss Payments API를 호출하여 결제를 승인해야 합니다
      try {
        if (paymentKey && amount) {
          // 결제 승인 및 주문 상태 업데이트
          await confirmPayment(paymentKey, orderId, parseInt(amount, 10));
        } else {
          // 테스트 모드: 주문 상태만 확인 (이미 confirmed 상태일 수 있음)
          // 실제로는 Toss Payments API를 호출해야 합니다
        }
        setStatus("success");
        
        // 2초 후 주문 상세 페이지로 이동
        setTimeout(() => {
          router.push(`/orders/${orderId}`);
        }, 2000);
      } catch (err) {
        console.error("Payment confirmation error:", err);
        setError(err instanceof Error ? err.message : "결제 승인에 실패했습니다.");
        setStatus("error");
      }
    };

    processPayment();
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">결제를 확인하는 중...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <svg
            className="h-12 w-12 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">결제 확인 실패</h1>
        <p className="mb-6 text-muted-foreground">{error}</p>
        <div className="flex gap-4">
          <Link href="/orders">
            <Button variant="outline">주문 내역으로</Button>
          </Link>
          <Link href="/">
            <Button>홈으로</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4">
        <CheckCircle2 className="h-12 w-12 text-primary" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">결제가 완료되었습니다!</h1>
      <p className="mb-6 text-muted-foreground">주문 상세 페이지로 이동합니다...</p>
      <Link href={`/orders/${searchParams.get("orderId")}`}>
        <Button>주문 상세 보기</Button>
      </Link>
    </div>
  );
}

/**
 * 결제 성공 페이지
 */
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">결제를 확인하는 중...</p>
        </div>
      }
    >
      <PaymentSuccessHandler />
    </Suspense>
  );
}

