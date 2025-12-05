import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 가격을 천 단위 구분자와 함께 포맷팅
 *
 * @param price 가격 (숫자)
 * @returns 포맷팅된 가격 문자열 (예: "12,000원")
 *
 * @example
 * ```ts
 * formatPrice(12000) // "12,000원"
 * formatPrice(500) // "500원"
 * ```
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`
}
