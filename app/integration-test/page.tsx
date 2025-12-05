/**
 * @file integration-test/page.tsx
 * @description Clerk + Supabase 통합 테스트 페이지
 *
 * 이 페이지는 Clerk와 Supabase의 네이티브 통합이 올바르게 작동하는지 테스트합니다.
 *
 * 테스트 항목:
 * 1. 클라이언트 컴포넌트에서 Supabase 클라이언트 사용
 * 2. 서버 컴포넌트에서 Supabase 클라이언트 사용
 * 3. Server Action에서 Supabase 클라이언트 사용
 * 4. 인증 상태 확인
 * 5. 데이터 CRUD 작업
 */

import { Suspense } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import ServerComponentTest from "./server-component-test";
import ClientComponentTest from "./client-component-test";
import { Button } from "@/components/ui/button";

export default function IntegrationTestPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Clerk + Supabase 통합 테스트</h1>

      <SignedOut>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-yellow-800 mb-4">
            이 페이지를 테스트하려면 먼저 로그인해야 합니다.
          </p>
          <SignInButton mode="modal">
            <Button>로그인</Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="space-y-8">
          {/* 서버 컴포넌트 테스트 */}
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">서버 컴포넌트 테스트</h2>
            <Suspense fallback={<p>로딩 중...</p>}>
              <ServerComponentTest />
            </Suspense>
          </section>

          {/* 클라이언트 컴포넌트 테스트 */}
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">클라이언트 컴포넌트 테스트</h2>
            <ClientComponentTest />
          </section>
        </div>
      </SignedIn>
    </div>
  );
}



