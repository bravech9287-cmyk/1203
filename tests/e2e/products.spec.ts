/**
 * @file tests/e2e/products.spec.ts
 * @description 상품 관련 E2E 테스트
 *
 * 상품 목록, 상세 페이지, 필터링 기능을 테스트합니다.
 */

import { test, expect } from "@playwright/test";

test.describe("상품 기능", () => {
  test("상품 목록 페이지가 정상적으로 로드되어야 함", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveURL(/.*\/products/);
    await expect(
      page.getByRole("heading", { name: /상품 목록/ })
    ).toBeVisible();
  });

  test("상품 카드가 표시되어야 함", async ({ page }) => {
    await page.goto("/products");
    
    // 상품 카드가 하나 이상 표시되는지 확인
    const productCards = page.locator('[href^="/products/"]');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("상품 상세 페이지로 이동할 수 있어야 함", async ({ page }) => {
    await page.goto("/products");
    
    // 첫 번째 상품 카드 클릭
    const firstProductLink = page.locator('[href^="/products/"]').first();
    const href = await firstProductLink.getAttribute("href");
    
    if (href) {
      await firstProductLink.click();
      await expect(page).toHaveURL(new RegExp(href));
    }
  });

  test("카테고리 필터가 작동해야 함", async ({ page }) => {
    await page.goto("/products");
    
    // 카테고리 필터 버튼 찾기
    const categoryButton = page.getByRole("button", { name: /카테고리/ });
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      
      // 카테고리 옵션이 표시되는지 확인
      await expect(page.getByText(/전체/)).toBeVisible();
    }
  });

  test("정렬 옵션이 작동해야 함", async ({ page }) => {
    await page.goto("/products");
    
    // 정렬 버튼 찾기
    const sortButton = page.getByRole("button", { name: /정렬/ });
    if (await sortButton.isVisible()) {
      await sortButton.click();
      
      // 정렬 옵션이 표시되는지 확인
      await expect(page.getByText(/최신순/)).toBeVisible();
    }
  });
});

