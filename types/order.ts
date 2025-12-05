/**
 * @file types/order.ts
 * @description 주문 관련 TypeScript 타입 정의
 *
 * Supabase orders, order_items 테이블 스키마와 일치하는 타입 정의
 */

/**
 * 주문 상태 타입
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

/**
 * 배송지 정보 타입
 */
export interface ShippingAddress {
  recipient: string; // 수령인 이름
  phone: string; // 연락처
  address: string; // 기본 주소
  addressDetail?: string; // 상세 주소
  postalCode?: string; // 우편번호
}

/**
 * 주문 타입
 * Supabase orders 테이블 스키마와 일치
 */
export interface Order {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: ShippingAddress | null;
  order_note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 주문 상세 아이템 타입
 * Supabase order_items 테이블 스키마와 일치
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

/**
 * 주문과 주문 상세 아이템을 함께 포함하는 타입
 */
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

/**
 * 주문 생성 요청 타입
 */
export interface CreateOrderRequest {
  shipping_address: ShippingAddress;
  order_note?: string;
}

