/**
 * @file app/error.tsx
 * @description 전역 에러 바운더리
 *
 * 애플리케이션 전역에서 발생하는 에러를 처리합니다.
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 전역 에러 바운더리 컴포넌트
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (실제 운영 환경에서는 에러 추적 서비스로 전송)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        문제가 발생했습니다
      </h1>
      <p className="mb-4 text-muted-foreground">
        예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      {error.message && (
        <p className="mb-6 rounded-lg bg-muted p-3 text-sm font-mono text-muted-foreground">
          {error.message}
        </p>
      )}
      <div className="flex gap-4">
        <Button onClick={reset} variant="default" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            홈으로
          </Button>
        </Link>
      </div>
    </div>
  );
}

