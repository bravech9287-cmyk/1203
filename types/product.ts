/**
 * @file types/product.ts
 * @description 상품 관련 TypeScript 타입 정의
 *
 * Supabase products 테이블 스키마와 일치하는 타입 정의
 */

/**
 * 상품 정보 타입
 * Supabase products 테이블 스키마와 일치
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 상품 목록 조회 옵션
 */
export interface GetProductsOptions {
  /** 활성화된 상품만 조회 */
  activeOnly?: boolean;
  /** 카테고리 필터 */
  category?: string;
  /** 정렬 기준 */
  sortBy?: "created_at" | "price" | "name";
  /** 정렬 방향 */
  sortOrder?: "asc" | "desc";
  /** 조회 개수 제한 */
  limit?: number;
  /** 페이지네이션: 페이지 번호 (1부터 시작) */
  page?: number;
  /** 페이지네이션: 페이지당 항목 수 */
  pageSize?: number;
}

/**
 * 페이지네이션된 상품 목록 결과
 */
export interface PaginatedProductsResult {
  /** 상품 목록 */
  products: Product[];
  /** 전체 상품 개수 */
  totalCount: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 현재 페이지 번호 */
  currentPage: number;
  /** 페이지당 항목 수 */
  pageSize: number;
}

