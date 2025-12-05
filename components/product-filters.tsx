/**
 * @file components/product-filters.tsx
 * @description 상품 필터 및 정렬 UI 컴포넌트
 *
 * 카테고리 필터와 정렬 옵션을 제공하는 Client Component
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAllCategories, getCategoryName } from "@/lib/utils/categories";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const categories = getAllCategories();

const sortOptions = [
  { value: "created_at-desc", label: "최신순" },
  { value: "created_at-asc", label: "오래된순" },
  { value: "price-asc", label: "가격 낮은순" },
  { value: "price-desc", label: "가격 높은순" },
  { value: "name-asc", label: "이름 가나다순" },
] as const;

interface ProductFiltersProps {
  currentCategory?: string;
  currentSort: string;
}

/**
 * 상품 필터 및 정렬 컴포넌트
 */
export function ProductFilters({
  currentCategory,
  currentSort,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/products?${params.toString()}`);
  };

  const currentCategoryName = currentCategory
    ? getCategoryName(currentCategory)
    : "전체";

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label || "최신순";

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      {/* 카테고리 필터 */}
      <div className="relative">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
          카테고리: {currentCategoryName}
          <ChevronDown className="h-4 w-4" />
        </Button>

        {categoryOpen && (
          <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-md border bg-popover shadow-lg">
            <div className="p-2">
              <button
                onClick={() => {
                  updateFilter("category", null);
                  setCategoryOpen(false);
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  !currentCategory
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                전체
              </button>
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    updateFilter("category", category.value);
                    setCategoryOpen(false);
                  }}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    currentCategory === category.value
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 정렬 옵션 */}
      <div className="relative">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setSortOpen(!sortOpen)}
        >
          정렬: {currentSortLabel}
          <ChevronDown className="h-4 w-4" />
        </Button>

        {sortOpen && (
          <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-md border bg-popover shadow-lg">
            <div className="p-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateFilter("sort", option.value);
                    setSortOpen(false);
                  }}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    currentSort === option.value
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 필터 초기화 */}
      {(currentCategory || currentSort !== "created_at-desc") && (
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/products");
          }}
        >
          초기화
        </Button>
      )}

      {/* 외부 클릭 시 드롭다운 닫기 */}
      {(categoryOpen || sortOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setCategoryOpen(false);
            setSortOpen(false);
          }}
        />
      )}
    </div>
  );
}

