/**
 * @file components/payment-widget.tsx
 * @description Toss Payments 결제 위젯 컴포넌트
 *
 * Toss Payments 결제 위젯을 통합한 컴포넌트
 * 테스트 모드로 운영
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { confirmPayment } from "@/actions/payment";
import type { PaymentRequest } from "@/types/payment";

// Toss Payments 위젯 스크립트 로드
declare global {
  interface Window {
    TossPayments: any;
  }
}

interface PaymentWidgetProps {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * 결제 위젯 컴포넌트
 */
export function PaymentWidget({
  orderId,
  amount,
  orderName,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
}: PaymentWidgetProps) {
  const router = useRouter();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Toss Payments 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1/payment-widget";
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 위젯 초기화
  useEffect(() => {
    if (!isScriptLoaded || !widgetRef.current || !window.TossPayments) {
      return;
    }

    const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || "test_ck_D4yKeq5bgrpKRd0JYb8QwzYWBn14";
    
    let paymentWidget: any;
    
    try {
      paymentWidget = window.TossPayments.widget(clientKey, {
        customerKey: orderId,
      });

      paymentWidget.renderPaymentMethods(
        "#payment-widget",
        { value: amount },
        { variantKey: "DEFAULT" }
      );
    } catch (error) {
      console.error("Error initializing payment widget:", error);
      onError?.("결제 위젯 초기화에 실패했습니다.");
    }

    return () => {
      // Cleanup은 위젯이 자동으로 처리
    };
  }, [isScriptLoaded, amount, orderId, onError]);

  const handlePayment = async () => {
    if (!window.TossPayments || !isScriptLoaded) {
      onError?.("결제 위젯이 로드되지 않았습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || "test_ck_D4yKeq5bgrpKRd0JYb8QwzYWBn14";
      
      const paymentWidget = window.TossPayments.widget(clientKey, {
        customerKey: orderId,
      });

      // 결제 요청
      await paymentWidget.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/success?orderId=${orderId}`,
        failUrl: `${window.location.origin}/payment/fail?orderId=${orderId}`,
        customerEmail,
        customerName,
        customerPhone,
      });
      
      // requestPayment는 리다이렉트를 수행하므로 여기까지 오지 않음
    } catch (error) {
      console.error("Payment error:", error);
      onError?.(error instanceof Error ? error.message : "결제 요청에 실패했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div id="payment-widget" ref={widgetRef} className="min-h-[400px]"></div>
      <Button
        onClick={handlePayment}
        size="lg"
        className="w-full"
        disabled={isLoading || !isScriptLoaded}
      >
        {isLoading ? "결제 처리 중..." : `${amount.toLocaleString()}원 결제하기`}
      </Button>
    </div>
  );
}

