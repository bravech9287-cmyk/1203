/**
 * @file components/category-menu.tsx
 * @description 카테고리 메뉴 컴포넌트
 *
 * 네비게이션 바에 표시할 카테고리 메뉴
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getAllCategories, getCategoryName } from "@/lib/utils/categories";
import { ChevronDown } from "lucide-react";

const categories = getAllCategories();

/**
 * 카테고리 메뉴 컴포넌트
 */
export function CategoryMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="gap-2"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        카테고리
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-2 w-48 rounded-md border bg-popover shadow-lg"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-2">
            <Link
              href="/products"
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              전체 상품
            </Link>
            {categories.map((category) => (
              <Link
                key={category.value}
                href={`/products?category=${category.value}`}
                className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

