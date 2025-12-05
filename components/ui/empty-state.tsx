/**
 * @file components/ui/empty-state.tsx
 * @description 빈 상태 컴포넌트
 *
 * 데이터가 없을 때 표시할 빈 상태 UI 컴포넌트
 */

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Package, ShoppingCart, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * 빈 상태 컴포넌트
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const defaultIcon = <Package className="h-16 w-16 text-muted-foreground/30" />;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="mb-4">{icon || defaultIcon}</div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        action.onClick ? (
          <Button onClick={action.onClick}>{action.label}</Button>
        ) : (
          <Link href={action.href}>
            <Button>{action.label}</Button>
          </Link>
        )
      )}
    </div>
  );
}

/**
 * 상품 없음 빈 상태
 */
export function EmptyProducts() {
  return (
    <EmptyState
      icon={<Package className="h-16 w-16 text-muted-foreground/30" />}
      title="등록된 상품이 없습니다"
      description="곧 새로운 상품이 추가될 예정입니다."
    />
  );
}

/**
 * 장바구니 빈 상태
 */
export function EmptyCart() {
  return (
    <EmptyState
      icon={<ShoppingCart className="h-16 w-16 text-muted-foreground/30" />}
      title="장바구니가 비어있습니다"
      description="원하는 상품을 장바구니에 담아보세요."
      action={{
        label: "상품 보러가기",
        href: "/products",
      }}
    />
  );
}

/**
 * 주문 내역 빈 상태
 */
export function EmptyOrders() {
  return (
    <EmptyState
      icon={<FileText className="h-16 w-16 text-muted-foreground/30" />}
      title="주문 내역이 없습니다"
      description="아직 주문한 상품이 없습니다"
      action={{
        label: "상품 보러가기",
        href: "/products",
      }}
    />
  );
}

/**
 * 에러 빈 상태
 */
export function ErrorState({
  title = "문제가 발생했습니다",
  description = "잠시 후 다시 시도해주세요.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertCircle className="h-16 w-16 text-destructive/30" />}
      title={title}
      description={description}
      action={
        onRetry
          ? {
              label: "다시 시도",
              href: "#",
            }
          : undefined
      }
    />
  );
}

