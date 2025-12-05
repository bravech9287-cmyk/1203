/**
 * @file components/ui/loading-skeleton.tsx
 * @description 로딩 스켈레톤 컴포넌트
 *
 * 데이터 로딩 중 표시할 스켈레톤 UI 컴포넌트
 */

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

/**
 * 기본 로딩 스켈레톤
 */
export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-label="로딩 중"
    />
  );
}

/**
 * 상품 카드 스켈레톤
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-square w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mb-3 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mt-auto h-8 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

/**
 * 상품 그리드 스켈레톤
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

