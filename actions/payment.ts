/**
 * @file actions/payment.ts
 * @description 결제 관련 Server Actions
 *
 * 결제 승인 및 주문 상태 업데이트
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * 결제 승인 및 주문 상태 업데이트
 */
export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다.");
  }

  const supabase = createClerkSupabaseClient();

  // 주문 조회 및 검증
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("clerk_id", userId)
    .single();

  if (orderError || !order) {
    throw new Error("주문을 찾을 수 없습니다.");
  }

  // 금액 검증
  if (order.total_amount !== amount) {
    throw new Error("결제 금액이 주문 금액과 일치하지 않습니다.");
  }

  // 이미 결제 완료된 주문인지 확인
  if (order.status !== "pending") {
    throw new Error("이미 처리된 주문입니다.");
  }

  // 주문 상태를 'confirmed'로 업데이트
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "confirmed",
    })
    .eq("id", orderId)
    .eq("clerk_id", userId);

  if (updateError) {
    console.error("Error updating order status:", updateError);
    throw new Error(`주문 상태 업데이트에 실패했습니다: ${updateError.message}`);
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true };
}

