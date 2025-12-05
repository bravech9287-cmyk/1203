/**
 * @file actions/cart.ts
 * @description 장바구니 관련 Server Actions
 *
 * 장바구니 추가, 삭제, 수량 변경, 조회 기능
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import type { CartItem, CartItemWithProduct } from "@/types/cart";
import { revalidatePath } from "next/cache";

/**
 * 현재 사용자의 장바구니 아이템 조회
 */
export async function getCartItems(): Promise<CartItemWithProduct[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다.");
  }

  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      product:products(*)
    `
    )
    .eq("clerk_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cart items:", error);
    throw new Error(`장바구니를 불러오는데 실패했습니다: ${error.message}`);
  }

  // 타입 변환
  return (data || []).map((item: any) => ({
    ...item,
    product: item.product,
  })) as CartItemWithProduct[];
}

/**
 * 장바구니에 상품 추가
 */
export async function addToCart(productId: string, quantity: number = 1) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다.");
  }

  if (quantity <= 0) {
    throw new Error("수량은 1개 이상이어야 합니다.");
  }

  const supabase = createClerkSupabaseClient();

  // 상품 존재 및 재고 확인
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, stock_quantity, is_active")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    throw new Error("상품을 찾을 수 없습니다.");
  }

  if (!product.is_active) {
    throw new Error("판매 중지된 상품입니다.");
  }

  // 기존 장바구니 아이템 확인
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("clerk_id", userId)
    .eq("product_id", productId)
    .single();

  if (existingItem) {
    // 기존 아이템이 있으면 수량 업데이트
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock_quantity) {
      throw new Error(
        `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`
      );
    }

    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", existingItem.id);

    if (updateError) {
      console.error("Error updating cart item:", updateError);
      throw new Error(`장바구니 업데이트에 실패했습니다: ${updateError.message}`);
    }
  } else {
    // 새 아이템 추가
    if (quantity > product.stock_quantity) {
      throw new Error(
        `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`
      );
    }

    const { error: insertError } = await supabase
      .from("cart_items")
      .insert({
        clerk_id: userId,
        product_id: productId,
        quantity,
      });

    if (insertError) {
      console.error("Error adding to cart:", insertError);
      throw new Error(`장바구니 추가에 실패했습니다: ${insertError.message}`);
    }
  }

  revalidatePath("/cart");
  revalidatePath("/products");
}

/**
 * 장바구니 아이템 수량 변경
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다.");
  }

  if (quantity <= 0) {
    throw new Error("수량은 1개 이상이어야 합니다.");
  }

  const supabase = createClerkSupabaseClient();

  // 장바구니 아이템 확인 (본인 것인지 확인)
  const { data: cartItem, error: cartError } = await supabase
    .from("cart_items")
    .select("*, product:products(stock_quantity)")
    .eq("id", cartItemId)
    .eq("clerk_id", userId)
    .single();

  if (cartError || !cartItem) {
    throw new Error("장바구니 아이템을 찾을 수 없습니다.");
  }

  // 재고 확인
  const product = cartItem.product as any;
  if (quantity > product.stock_quantity) {
    throw new Error(
      `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`
    );
  }

  // 수량 업데이트
  const { error: updateError } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .eq("clerk_id", userId);

  if (updateError) {
    console.error("Error updating cart item quantity:", updateError);
    throw new Error(
      `수량 변경에 실패했습니다: ${updateError.message}`
    );
  }

  revalidatePath("/cart");
}

/**
 * 장바구니 아이템 삭제
 */
export async function removeFromCart(cartItemId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다.");
  }

  const supabase = createClerkSupabaseClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("clerk_id", userId);

  if (error) {
    console.error("Error removing cart item:", error);
    throw new Error(`장바구니에서 삭제하는데 실패했습니다: ${error.message}`);
  }

  revalidatePath("/cart");
}

/**
 * 장바구니 전체 비우기
 */
export async function clearCart() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다.");
  }

  const supabase = createClerkSupabaseClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("clerk_id", userId);

  if (error) {
    console.error("Error clearing cart:", error);
    throw new Error(`장바구니 비우기에 실패했습니다: ${error.message}`);
  }

  revalidatePath("/cart");
}

/**
 * 장바구니 아이템 개수 조회
 */
export async function getCartItemCount(): Promise<number> {
  const { userId } = await auth();

  if (!userId) {
    return 0;
  }

  const supabase = createClerkSupabaseClient();

  const { count, error } = await supabase
    .from("cart_items")
    .select("*", { count: "exact", head: true })
    .eq("clerk_id", userId);

  if (error) {
    console.error("Error getting cart count:", error);
    return 0;
  }

  return count || 0;
}

