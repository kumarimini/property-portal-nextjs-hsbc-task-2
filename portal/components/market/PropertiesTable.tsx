"use client";

import { useTableControls, type TableColumn } from "@/hooks/useTableControls";
import { formatNumber, formatPrice } from "@/lib/format";
import type { Property } from "@/lib/marketTypes";

// Defined outside the component so the list is created once, not on every render
const COLUMNS: TableColumn<Property>[] = [
  { key: "id", label: "ID", value: (p) => p.id, format: (n) => String(n) },
  { key: "squareFootage", label: "Sq ft", value: (p) => p.squareFootage, format: formatNumber },
  { key: "bedrooms", label: "Beds", value: (p) => p.bedrooms, format: formatNumber },
  { key: "bathrooms", label: "Baths", value: (p) => p.bathrooms, format: formatNumber },
  { key: "yearBuilt", label: "Year built", value: (p) => p.yearBuilt, format: (n) => String(n) },
  { key: "lotSize", label: "Lot size", value: (p) => p.lotSize, format: formatNumber },
  { key: "distance", label: "Distance", value: (p) => p.distanceToCityCenter, format: formatNumber },
  { key: "school", label: "School", value: (p) => p.schoolRating, format: formatNumber },
  { key: "pricePerSqFt", label: "Price / sq ft", value: (p) => p.price / p.squareFootage, format: formatPrice },
  { key: "price", label: "Price", value: (p) => p.price, format: formatPrice },
];

export default function PropertiesTable({ properties }: { properties: Property[] }) {
  const t = useTableControls(properties, COLUMNS, 10, { key: "price", direction: "desc" });

  const first = t.total === 0 ? 0 : t.page * t.pageSize + 1;
  const last = Math.min((t.page + 1) * t.pageSize, t.total);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <label htmlFor="table-search" className="block text-sm font-medium">
            Search table
          </label>
          <input
            id="table-search"
            type="search"
            value={t.query}
            onChange={(e) => t.setQuery(e.target.value)}
            placeholder="Any value, e.g. 1998"
            className="mt-1 w-64 max-w-full rounded-md border border-gray-500 bg-white px-3 py-2"
          />
        </div>
        <p role="status" className="text-sm text-muted">
          Showing {first}–{last} of {t.total}
        </p>
      </div>

      <div
        className="mt-3 overflow-x-auto rounded-lg border border-line bg-surface"
        role="region"
        aria-label="Properties table"
        tabIndex={0}
      >
        <table className="w-full min-w-[52rem] text-sm">
          <caption className="sr-only">
            Properties matching the current filters. Use the column buttons to sort.
          </caption>
          <thead className="bg-page">
            <tr>
              {COLUMNS.map((c) => {
                const active = t.sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (t.direction === "asc" ? "ascending" : "descending") : "none"}
                    className="px-3 py-2 text-right whitespace-nowrap"
                  >
                    <button
                      type="button"
                      onClick={() => t.toggleSort(c.key)}
                      className="inline-flex items-center gap-1 font-semibold hover:text-brand"
                    >
                      {c.label}
                      <span aria-hidden="true">
                        {active ? (t.direction === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {t.visible.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-3 py-6 text-center text-muted">
                  No rows match your search.
                </td>
              </tr>
            ) : (
              t.visible.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  {COLUMNS.map((c) => (
                    <td key={c.key} className="px-3 py-2 text-right tabular-nums">
                      {c.format(c.value(p))}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <nav aria-label="Table pagination" className="mt-3 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={t.prevPage}
          disabled={t.page === 0}
          className="rounded-md border border-gray-500 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-line disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-muted">
          Page {t.page + 1} of {t.pageCount}
        </span>
        <button
          type="button"
          onClick={t.nextPage}
          disabled={t.page >= t.pageCount - 1}
          className="rounded-md border border-gray-500 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-line disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </div>
  );
}