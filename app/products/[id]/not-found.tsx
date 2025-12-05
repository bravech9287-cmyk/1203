/**
 * @file app/products/[id]/not-found.tsx
 * @description 상품을 찾을 수 없을 때 표시할 페이지
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">
          상품을 찾을 수 없습니다
        </h1>
        <p className="mb-8 text-muted-foreground">
          요청하신 상품이 존재하지 않거나 삭제되었습니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products">
            <Button>상품 목록으로</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">홈으로</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

