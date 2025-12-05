/**
 * @file app/global-error.tsx
 * @description 전역 에러 바운더리 (루트 레이아웃 에러)
 *
 * 루트 레이아웃에서 발생하는 에러를 처리합니다.
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 전역 에러 바운더리 컴포넌트 (루트 레이아웃용)
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // 에러 로깅
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="mb-6 rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">심각한 오류가 발생했습니다</h1>
          <p className="mb-4 text-muted-foreground">
            애플리케이션을 초기화하는 중 오류가 발생했습니다.
          </p>
          {error.message && (
            <p className="mb-6 rounded-lg bg-muted p-3 text-sm font-mono text-muted-foreground">
              {error.message}
            </p>
          )}
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>
        </div>
      </body>
    </html>
  );
}

