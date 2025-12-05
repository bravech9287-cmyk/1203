/**
 * @file app/products/[id]/page.tsx
 * @description 상품 상세 페이지
 *
 * 동적 라우트를 사용한 상품 상세 정보 페이지
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/supabase/products";
import { ProductDetail } from "@/components/product-detail";
import { ArrowLeft } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 상품 상세 페이지
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <Link href="/products">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            상품 목록으로
          </Button>
        </Link>

        {/* 상품 상세 정보 */}
        <ProductDetail product={product} />
      </div>
    </div>
  );
}

