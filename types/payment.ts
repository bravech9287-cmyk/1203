/**
 * @file types/payment.ts
 * @description 결제 관련 TypeScript 타입 정의
 *
 * Toss Payments 결제 관련 타입 정의
 */

/**
 * 결제 요청 타입
 */
export interface PaymentRequest {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}

/**
 * 결제 성공 응답 타입
 */
export interface PaymentSuccessResponse {
  paymentKey: string;
  orderId: string;
  amount: number;
}

/**
 * 결제 실패 응답 타입
 */
export interface PaymentFailureResponse {
  code: string;
  message: string;
  orderId: string;
}

