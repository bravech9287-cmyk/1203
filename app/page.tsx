import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiSupabaseFill } from "react-icons/ri";
import { ProductGrid } from "@/components/product-grid";
import { FeaturedProducts } from "@/components/featured-products";
import { getProducts } from "@/lib/supabase/products";

/**
 * 상품 목록 로딩 컴포넌트
 */
function ProductGridSkeleton() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted"></div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
          >
            <div className="aspect-square w-full animate-pulse bg-muted"></div>
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-muted"></div>
              <div className="mb-3 h-4 w-full animate-pulse rounded bg-muted"></div>
              <div className="mt-auto h-8 w-1/2 animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 상품 목록 컴포넌트 (Server Component)
 */
async function ProductList() {
  try {
    const result = await getProducts();
    
    // 페이지네이션 결과인지 확인하고 Product[]로 변환
    const products = Array.isArray(result) ? result : result.products;

    return <ProductGrid products={products} />;
  } catch (error) {
    console.error("Error in ProductList:", error);
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="mb-4 h-16 w-16 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            상품을 불러오는데 실패했습니다
          </h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다"}
          </p>
        </div>
      </section>
    );
  }
}

export default function Home() {
  return (
    <>
      {/* 히어로 섹션 */}
      <main 
        className="min-h-[calc(100vh-80px)] flex items-center px-8 py-16 lg:py-24 relative"
        style={{
          backgroundImage: "url('/hero-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* 어두운 오버레이로 텍스트 가독성 향상 */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        
        {/* 콘텐츠 */}
        <section className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start lg:items-center relative z-10">
          {/* 좌측: 환영 메시지 */}
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white drop-shadow-lg">
              SaaS 앱 템플릿에 오신 것을 환영
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 drop-shadow-md leading-relaxed">
              Next.js, Shadcn, Clerk, Supabase, TailwindCSS로 구동되는 완전한
              기능의 템플릿으로 다음 프로젝트를 시작하세요.
            </p>
          </div>

          {/* 우측: 버튼 두 개 세로 정렬 */}
          <div className="flex flex-col gap-6">
            <Link href="/storage-test" className="w-full">
              <Button className="w-full h-28 flex items-center justify-center gap-4 text-xl shadow-lg hover:shadow-xl transition-shadow bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                <RiSupabaseFill className="w-8 h-8" />
                <span>Storage 파일 업로드 테스트</span>
              </Button>
            </Link>
            <Link href="/auth-test" className="w-full">
              <Button
                className="w-full h-28 flex items-center justify-center gap-4 text-xl shadow-lg hover:shadow-xl transition-shadow bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                variant="outline"
              >
                <RiSupabaseFill className="w-8 h-8" />
                <span>Clerk + Supabase 인증 연동</span>
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* 추천 상품 섹션 */}
      <FeaturedProducts />

      {/* 전체 상품 그리드 섹션 */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductList />
      </Suspense>
    </>
  );
}
