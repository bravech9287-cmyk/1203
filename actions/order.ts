/**
 * @file actions/order.ts
 * @description 주문 관련 Server Actions
 *
 * 주문 생성, 조회 기능
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import type {
  Order,
  OrderWithItems,
  CreateOrderRequest,
  ShippingAddress,
} from "@/types/order";
import { getCartItems } from "./cart";
import { revalidatePath } from "next/cache";

/**
 * 주문 생성
 */
export async function createOrder(
  request: CreateOrderRequest
): Promise<OrderWithItems> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다.");
  }

  const supabase = createClerkSupabaseClient();

  // 장바구니 아이템 조회
  const cartItems = await getCartItems();

  if (cartItems.length === 0) {
    throw new Error("장바구니가 비어있습니다.");
  }

  // 재고 확인 및 총액 계산
  let totalAmount = 0;
  const orderItems: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }> = [];

  for (const cartItem of cartItems) {
    const { product } = cartItem;

    // 재고 확인
    if (cartItem.quantity > product.stock_quantity) {
      throw new Error(
        `${product.name}의 재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`
      );
    }

    if (!product.is_active) {
      throw new Error(`${product.name}은(는) 판매 중지된 상품입니다.`);
    }

    const itemTotal = product.price * cartItem.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      quantity: cartItem.quantity,
      price: product.price,
    });
  }

  // 주문 생성 (트랜잭션 처리)
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      clerk_id: userId,
      total_amount: totalAmount,
      status: "pending",
      shipping_address: request.shipping_address as any,
      order_note: request.order_note || null,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError);
    throw new Error(`주문 생성에 실패했습니다: ${orderError?.message}`);
  }

  // 주문 상세 아이템 생성
  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(
      orderItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
      }))
    );

  if (orderItemsError) {
    console.error("Error creating order items:", orderItemsError);
    // 주문 삭제 (롤백)
    await supabase.from("orders").delete().eq("id", order.id);
    throw new Error(
      `주문 상세 생성에 실패했습니다: ${orderItemsError.message}`
    );
  }

  // 재고 차감
  for (const cartItem of cartItems) {
    const { error: stockError } = await supabase
      .from("products")
      .update({
        stock_quantity:
          cartItem.product.stock_quantity - cartItem.quantity,
      })
      .eq("id", cartItem.product.id);

    if (stockError) {
      console.error("Error updating stock:", stockError);
      // 주문 삭제 (롤백)
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error(`재고 업데이트에 실패했습니다: ${stockError.message}`);
    }
  }

  // 장바구니 비우기
  const { error: clearError } = await supabase
    .from("cart_items")
    .delete()
    .eq("clerk_id", userId);

  if (clearError) {
    console.error("Error clearing cart:", clearError);
    // 주문은 이미 생성되었으므로 경고만 출력
  }

  revalidatePath("/cart");
  revalidatePath("/orders");

  // 주문 상세 정보 조회
  const orderWithItems = await getOrderById(order.id);
  if (!orderWithItems) {
    throw new Error("주문 조회에 실패했습니다.");
  }

  return orderWithItems;
}

/**
 * 주문 ID로 주문 조회
 */
export async function getOrderById(
  orderId: string
): Promise<OrderWithItems | null> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다.");
  }

  const supabase = createClerkSupabaseClient();

  // 주문 조회
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("clerk_id", userId)
    .single();

  if (orderError || !order) {
    if (orderError?.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching order:", orderError);
    throw new Error(`주문 조회에 실패했습니다: ${orderError?.message}`);
  }

  // 주문 상세 아이템 조회
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("Error fetching order items:", itemsError);
    throw new Error(
      `주문 상세 조회에 실패했습니다: ${itemsError.message}`
    );
  }

  return {
    ...order,
    items: orderItems || [],
  } as OrderWithItems;
}

/**
 * 현재 사용자의 주문 목록 조회
 */
export async function getOrders(): Promise<OrderWithItems[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다.");
  }

  const supabase = createClerkSupabaseClient();

  // 주문 목록 조회
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("clerk_id", userId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
    throw new Error(`주문 목록 조회에 실패했습니다: ${ordersError.message}`);
  }

  if (!orders || orders.length === 0) {
    return [];
  }

  // 각 주문의 상세 아이템 조회
  const ordersWithItems: OrderWithItems[] = [];

  for (const order of orders) {
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true });

    ordersWithItems.push({
      ...order,
      items: orderItems || [],
    } as OrderWithItems);
  }

  return ordersWithItems;
}

