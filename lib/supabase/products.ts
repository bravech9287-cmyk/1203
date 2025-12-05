/**
 * @file lib/supabase/products.ts
 * @description Supabase에서 상품 데이터를 조회하는 함수들
 *
 * Server Component에서 사용하는 상품 조회 함수
 */

import { createClerkSupabaseClient } from "./server";
import { createClient } from "@supabase/supabase-js";
import type {
  Product,
  GetProductsOptions,
  PaginatedProductsResult,
} from "@/types/product";

/**
 * 공개 데이터 조회용 Supabase 클라이언트 (인증 불필요)
 * 상품 목록은 공개 데이터이므로 인증 없이 조회 가능
 */
function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해주세요."
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * 활성화된 상품 목록 조회 (Server Component용)
 *
 * @param options 조회 옵션
 * @returns 상품 목록 배열 또는 페이지네이션된 결과
 *
 * @example
 * ```tsx
 * // Server Component에서 사용
 * import { getProducts } from '@/lib/supabase/products';
 *
 * export default async function HomePage() {
 *   const products = await getProducts();
 *   return <ProductGrid products={products} />;
 * }
 * ```
 */
export async function getProducts(
  options: GetProductsOptions = {}
): Promise<Product[] | PaginatedProductsResult> {
  try {
    // 환경 변수 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
    }

    // 상품 목록은 공개 데이터이므로 인증 없이 조회 가능
    const supabase = createPublicSupabaseClient();

    // 페이지네이션 옵션이 있으면 페이지네이션된 결과 반환
    if (options.page && options.pageSize) {
      return getProductsPaginated(options as GetProductsOptions & { page: number; pageSize: number });
    }

    // 기존 로직 (페이지네이션 없음)
    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

  // 활성화된 상품만 조회 (기본값: true)
  if (options.activeOnly !== false) {
    query = query.eq("is_active", true);
  }

  // 카테고리 필터
  if (options.category) {
    query = query.eq("category", options.category);
  }

  // 정렬 옵션
  if (options.sortBy) {
    const ascending = options.sortOrder === "asc";
    query = query.order(options.sortBy, { ascending });
  }

  // 개수 제한
  if (options.limit) {
    query = query.limit(options.limit);
  }

    const { data, error } = await query;

    if (error) {
      // 에러 정보를 안전하게 추출
      const errorMessage = 
        error?.message || 
        error?.details || 
        error?.hint || 
        error?.code || 
        "알 수 없는 오류가 발생했습니다";
      
      // 에러 객체의 모든 속성을 안전하게 로깅
      const errorInfo: Record<string, any> = {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      };

      // 추가 속성 확인 (안전하게)
      try {
        if (error && typeof error === 'object') {
          if ('status' in error) errorInfo.status = (error as any).status;
          if ('statusText' in error) errorInfo.statusText = (error as any).statusText;
          
          // 에러 객체의 모든 키 추출
          const errorKeys = Object.keys(error);
          errorInfo.keys = errorKeys;
          
          // 각 키의 값을 안전하게 추출
          errorKeys.forEach(key => {
            try {
              const value = (error as any)[key];
              if (value !== undefined && value !== null) {
                errorInfo[key] = typeof value === 'object' ? JSON.stringify(value) : value;
              }
            } catch (e) {
              // 무시
            }
          });
        }
      } catch (e) {
        errorInfo.serializationError = String(e);
      }
      
      console.error("Error fetching products:", {
        ...errorInfo,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
      });
      
      throw new Error(`상품 목록을 불러오는데 실패했습니다: ${errorMessage}`);
    }

    // data가 null이거나 undefined인 경우 빈 배열 반환
    if (!data) {
      console.warn("getProducts: data is null or undefined");
      return [];
    }

    return (data as Product[]) || [];
  } catch (error) {
    // 예상치 못한 에러 처리
    if (error instanceof Error) {
      console.error("Unexpected error in getProducts:", error);
      throw error;
    }
    console.error("Unknown error in getProducts:", error);
    throw new Error(
      `상품 목록을 불러오는데 실패했습니다: ${String(error)}`
    );
  }
}

/**
 * 페이지네이션된 상품 목록 조회
 *
 * @param options 조회 옵션 (page, pageSize 필수)
 * @returns 페이지네이션된 상품 목록 결과
 */
async function getProductsPaginated(
  options: GetProductsOptions & { page: number; pageSize: number }
): Promise<PaginatedProductsResult> {
  // 상품 목록은 공개 데이터이므로 인증 없이 조회 가능
  const supabase = createPublicSupabaseClient();
  const { page, pageSize } = options;

  // 전체 개수 조회를 위한 쿼리
  let countQuery = supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // 데이터 조회를 위한 쿼리
  let dataQuery = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  // 활성화된 상품만 조회 (기본값: true)
  if (options.activeOnly !== false) {
    countQuery = countQuery.eq("is_active", true);
    dataQuery = dataQuery.eq("is_active", true);
  }

  // 카테고리 필터
  if (options.category) {
    countQuery = countQuery.eq("category", options.category);
    dataQuery = dataQuery.eq("category", options.category);
  }

  // 정렬 옵션
  if (options.sortBy) {
    const ascending = options.sortOrder === "asc";
    dataQuery = dataQuery.order(options.sortBy, { ascending });
  }

  // 페이지네이션 범위 계산
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 병렬로 개수와 데이터 조회
  const [countResult, dataResult] = await Promise.all([
    countQuery,
    dataQuery.range(from, to),
  ]);

  if (countResult.error) {
    console.error("Error fetching product count:", countResult.error);
    throw new Error(
      `상품 개수를 불러오는데 실패했습니다: ${countResult.error.message}`
    );
  }

  if (dataResult.error) {
    console.error("Error fetching products:", dataResult.error);
    throw new Error(
      `상품 목록을 불러오는데 실패했습니다: ${dataResult.error.message}`
    );
  }

  const totalCount = countResult.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const products = (dataResult.data as Product[]) || [];

  return {
    products,
    totalCount,
    totalPages,
    currentPage: page,
    pageSize,
  };
}

/**
 * 특정 상품 조회 (Server Component용)
 *
 * @param productId 상품 ID
 * @returns 상품 정보 또는 null
 */
export async function getProductById(
  productId: string
): Promise<Product | null> {
  // 상품 상세는 공개 데이터이므로 인증 없이 조회 가능
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // 상품을 찾을 수 없음
      return null;
    }
    console.error("Error fetching product:", error);
    throw new Error(`상품을 불러오는데 실패했습니다: ${error.message}`);
  }

  return (data as Product) || null;
}

/**
 * 카테고리 목록 조회
 *
 * @returns 고유한 카테고리 배열
 */
export async function getCategories(): Promise<string[]> {
  // 카테고리 목록은 공개 데이터이므로 인증 없이 조회 가능
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("is_active", true)
    .not("category", "is", null);

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  // 고유한 카테고리만 추출
  const categories = Array.from(
    new Set(data.map((item) => item.category).filter(Boolean))
  ) as string[];

  return categories.sort();
}

