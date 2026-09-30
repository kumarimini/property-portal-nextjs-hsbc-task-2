"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import {
  FILTER_KEYS,
  emptyFilterValues,
  toQueryString,
  validateFilters,
  type FilterErrors,
  type FilterKey,
  type FilterValues,
  type MarketFilters,
} from "@/lib/marketFilters";

const NUMBER_FIELDS: { name: FilterKey; label: string; placeholder: string }[] = [
  { name: "minPrice", label: "Min price", placeholder: "e.g. 200000" },
  { name: "maxPrice", label: "Max price", placeholder: "e.g. 350000" },
  { name: "minSqft", label: "Min sq ft", placeholder: "e.g. 1200" },
  { name: "maxSqft", label: "Max sq ft", placeholder: "e.g. 2500" },
  { name: "minYearBuilt", label: "Built from (year)", placeholder: "e.g. 1990" },
  { name: "maxYearBuilt", label: "Built up to (year)", placeholder: "e.g. 2010" },
  { name: "minSchoolRating", label: "Min school rating", placeholder: "0 to 10" },
];

const inputClass = (hasError: boolean) =>
  `mt-1 w-full rounded-md border bg-white px-3 py-2 ${
    hasError ? "border-red-600" : "border-gray-500"
  }`;

export default function FilterBar({ initialFilters }: { initialFilters: MarketFilters }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<FilterValues>({ ...emptyFilterValues, ...initialFilters });
  const [errors, setErrors] = useState<FilterErrors>({});

  const setValue = (name: FilterKey, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const navigate = (filters: MarketFilters) => {
    const qs = toQueryString(filters);
    startTransition(() => {
      router.push(qs ? `/market?${qs}` : "/market", { scroll: false });
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateFilters(values);
    setErrors(result);

    const firstInvalid = FILTER_KEYS.find((key) => result[key]);
    if (firstInvalid) {
      document.getElementById(`filter-${firstInvalid}`)?.focus();
      return;
    }
    navigate(values);
  };

  const handleReset = () => {
    setValues(emptyFilterValues);
    setErrors({});
    navigate({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="filters-heading"
      aria-busy={isPending}
      className="rounded-lg border border-line bg-surface p-6"
    >
      <h2 id="filters-heading" className="text-xl font-semibold">
        Filter property segments
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="filter-bedrooms" className="block text-sm font-medium">
            Bedrooms
          </label>
          <select
            id="filter-bedrooms"
            value={values.bedrooms}
            onChange={(e) => setValue("bedrooms", e.target.value)}
            className={inputClass(false)}
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {NUMBER_FIELDS.map((field) => {
          const id = `filter-${field.name}`;
          const message = errors[field.name];
          return (
            <div key={field.name}>
              <label htmlFor={id} className="block text-sm font-medium">
                {field.label}
              </label>
              <input
                id={id}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(e) => setValue(field.name, e.target.value)}
                aria-invalid={message ? true : undefined}
                aria-describedby={message ? `${id}-error` : undefined}
                className={inputClass(Boolean(message))}
              />
              {message && (
                <p id={`${id}-error`} className="mt-1 text-sm font-medium text-red-700">
                  {message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {isPending ? "Applying…" : "Apply filters"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-md border border-gray-500 px-4 py-2 font-medium transition-colors hover:bg-line"
        >
          Reset
        </button>
        <p role="status" className="text-sm text-muted">
          {isPending ? "Updating results…" : ""}
        </p>
      </div>
    </form>
  );
}