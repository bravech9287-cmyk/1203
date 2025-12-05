/**
 * @file tests/e2e/cart.spec.ts
 * @description 장바구니 E2E 테스트
 *
 * 장바구니 기능을 테스트합니다. (인증 필요)
 */

import { test, expect } from "@playwright/test";

test.describe("장바구니 기능", () => {
  test("비로그인 상태에서 장바구니 페이지 접근 시 로그인 페이지로 리다이렉트되어야 함", async ({
    page,
  }) => {
    await page.goto("/cart");
    // Clerk 로그인 페이지로 리다이렉트되거나 로그인 모달이 표시됨
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test("상품 상세 페이지에서 장바구니 담기 버튼이 표시되어야 함", async ({
    page,
  }) => {
    await page.goto("/products");
    
    // 첫 번째 상품으로 이동
    const firstProductLink = page.locator('[href^="/products/"]').first();
    const href = await firstProductLink.getAttribute("href");
    
    if (href) {
      await page.goto(href);
      
      // 장바구니 담기 버튼 또는 로그인 버튼이 표시되어야 함
      const addToCartButton = page.getByRole("button", {
        name: /장바구니|로그인/,
      });
      await expect(addToCartButton).toBeVisible();
    }
  });
});

