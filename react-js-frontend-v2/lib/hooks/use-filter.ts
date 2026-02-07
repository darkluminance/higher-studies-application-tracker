"use client";

import { useMemo, useState, useCallback } from "react";

interface UseFilterOptions<T> {
  searchFields: (keyof T)[];
  initialQuery?: string;
}

export function useFilter<T extends object>(
  items: T[],
  options: UseFilterOptions<T>
) {
  const { searchFields, initialQuery = "" } = options;
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filterValue, setFilterValue] = useState("");

  const filteredItems = useMemo(() => {
    if (!items) return [];

    return items.filter((item) => {
      // Text search matching
      const matchesSearch =
        !searchQuery ||
        searchFields.some((field) => {
          const value = (item as Record<string, unknown>)[field as string];
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          }
          if (Array.isArray(value)) {
            return value.some(
              (v) =>
                typeof v === "string" &&
                v.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          return false;
        });

      // Filter value matching (for dropdowns)
      const matchesFilter =
        !filterValue ||
        Object.values(item as Record<string, unknown>).some((value) => value === filterValue);

      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, filterValue, searchFields]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setFilterValue("");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filterValue,
    setFilterValue,
    filteredItems,
    clearFilters,
  };
}
