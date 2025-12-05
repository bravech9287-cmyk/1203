/**
 * @file types/cart.ts
 * @description 장바구니 관련 TypeScript 타입 정의
 *
 * Supabase cart_items 테이블 스키마와 일치하는 타입 정의
 */

/**
 * 장바구니 아이템 타입
 * Supabase cart_items 테이블 스키마와 일치
 */
export interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

/**
 * 장바구니 아이템과 상품 정보를 함께 포함하는 타입
 */
export interface CartItemWithProduct extends CartItem {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string | null;
    stock_quantity: number;
    is_active: boolean;
    image_url?: string | null;
  };
}

