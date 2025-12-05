/**
 * @file lib/utils/categories.ts
 * @description 카테고리 관련 유틸리티 함수
 *
 * 카테고리 한글명 변환, 아이콘 매핑 등
 */

/**
 * 카테고리 한글명 매핑
 */
const CATEGORY_NAMES: Record<string, string> = {
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활/가정",
};

/**
 * 카테고리 아이콘 매핑 (lucide-react 아이콘 이름)
 */
const CATEGORY_ICONS: Record<string, string> = {
  electronics: "Smartphone",
  clothing: "Shirt",
  books: "Book",
  food: "Coffee",
  sports: "Dumbbell",
  beauty: "Sparkles",
  home: "Home",
};

/**
 * 카테고리 영문명을 한글명으로 변환
 *
 * @param category 영문 카테고리명
 * @returns 한글 카테고리명 또는 원본 (매핑이 없는 경우)
 *
 * @example
 * ```ts
 * getCategoryName('electronics') // "전자제품"
 * getCategoryName('unknown') // "unknown"
 * ```
 */
export function getCategoryName(category: string | null): string {
  if (!category) return "전체";
  return CATEGORY_NAMES[category] || category;
}

/**
 * 카테고리 아이콘 이름 가져오기
 *
 * @param category 영문 카테고리명
 * @returns lucide-react 아이콘 이름 또는 null
 *
 * @example
 * ```ts
 * getCategoryIcon('electronics') // "Smartphone"
 * ```
 */
export function getCategoryIcon(category: string | null): string | null {
  if (!category) return null;
  return CATEGORY_ICONS[category] || null;
}

/**
 * 모든 카테고리 목록 가져오기
 *
 * @returns 카테고리 배열 [{ value: 'electronics', label: '전자제품' }, ...]
 */
export function getAllCategories(): Array<{ value: string; label: string }> {
  return Object.entries(CATEGORY_NAMES).map(([value, label]) => ({
    value,
    label,
  }));
}

/**
 * 카테고리 존재 여부 확인
 *
 * @param category 카테고리명
 * @returns 존재 여부
 */
export function isValidCategory(category: string | null): boolean {
  if (!category) return false;
  return category in CATEGORY_NAMES;
}

