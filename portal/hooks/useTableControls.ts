"use client";

import { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc";

export interface TableColumn<T> {
  key: string;
  label: string;
  value: (row: T) => number;
  format: (value: number) => string;
}

export function useTableControls<T>(
  rows: T[],
  columns: TableColumn<T>[],
  pageSize = 10,
  initialSort?: { key: string; direction: SortDirection }
) {
  const [sortKey, setSortKey] = useState(initialSort?.key ?? columns[0].key);
  const [direction, setDirection] = useState<SortDirection>(initialSort?.direction ?? "asc");
  const [query, setQueryState] = useState("");
  const [page, setPage] = useState(0);

  const processed = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered =
      q === ""
        ? rows
        : rows.filter((row) =>
            columns.some((c) => c.format(c.value(row)).toLowerCase().includes(q))
          );

    const column = columns.find((c) => c.key === sortKey) ?? columns[0];
    const sign = direction === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => sign * (column.value(a) - column.value(b)));
  }, [rows, columns, query, sortKey, direction]);

  const pageCount = Math.max(1, Math.ceil(processed.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = processed.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const toggleSort = (key: string) => {
    if (key === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("asc");
    }
    setPage(0);
  };

  const setQuery = (value: string) => {
    setQueryState(value);
    setPage(0);
  };

  return {
    visible,
    total: processed.length,
    sortKey,
    direction,
    toggleSort,
    query,
    setQuery,
    page: currentPage,
    pageCount,
    pageSize,
    nextPage: () => setPage(Math.min(currentPage + 1, pageCount - 1)),
    prevPage: () => setPage(Math.max(currentPage - 1, 0)),
  };
}