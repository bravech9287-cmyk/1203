/**
 * @file tests/e2e/homepage.spec.ts
 * @description 홈페이지 E2E 테스트
 *
 * 홈페이지의 기본 기능을 테스트합니다.
 */

import { test, expect } from "@playwright/test";

test.describe("홈페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("홈페이지가 정상적으로 로드되어야 함", async ({ page }) => {
    await expect(page).toHaveTitle(/SaaS 템플릿/);
    await expect(
      page.getByRole("heading", { name: /SaaS 앱 템플릿에 오신 것을 환영/ })
    ).toBeVisible();
  });

  test("히어로 섹션이 표시되어야 함", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: /SaaS 앱 템플릿에 오신 것을 환영/ })
    ).toBeVisible();
  });

  test("CTA 버튼들이 표시되어야 함", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /Storage 파일 업로드 테스트/ })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Clerk \+ Supabase 인증 연동/ })
    ).toBeVisible();
  });

  test("추천 상품 섹션이 표시되어야 함", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /추천 상품/ })
    ).toBeVisible();
  });

  test("상품 목록 섹션이 표시되어야 함", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /상품 목록/ })
    ).toBeVisible();
  });
});

