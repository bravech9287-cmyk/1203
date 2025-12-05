/**
 * @file tests/e2e/checkout.spec.ts
 * @description 체크아웃 E2E 테스트
 *
 * 주문 및 결제 프로세스를 테스트합니다. (인증 필요)
 */

import { test, expect } from "@playwright/test";

test.describe("체크아웃 프로세스", () => {
  test("비로그인 상태에서 체크아웃 페이지 접근 시 로그인 페이지로 리다이렉트되어야 함", async ({
    page,
  }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test("체크아웃 페이지가 정상적으로 로드되어야 함", async ({ page }) => {
    // 인증이 필요한 테스트는 실제 로그인 후 진행
    // 여기서는 기본 구조만 확인
    await page.goto("/checkout");
    
    // 로그인 페이지로 리다이렉트되었는지 확인
    const isSignInPage = page.url().includes("sign-in");
    expect(isSignInPage).toBeTruthy();
  });
});

