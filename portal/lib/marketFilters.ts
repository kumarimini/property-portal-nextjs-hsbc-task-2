export const FILTER_KEYS = [
  "bedrooms",
  "minPrice",
  "maxPrice",
  "minSqft",
  "maxSqft",
  "minYearBuilt",
  "maxYearBuilt",
  "minSchoolRating",
] as const;

export type FilterKey = (typeof FILTER_KEYS)[number];
export type MarketFilters = Partial<Record<FilterKey, string>>;
export type FilterValues = Record<FilterKey, string>;
export type FilterErrors = Partial<Record<FilterKey, string>>;

export const emptyFilterValues: FilterValues = {
  bedrooms: "",
  minPrice: "",
  maxPrice: "",
  minSqft: "",
  maxSqft: "",
  minYearBuilt: "",
  maxYearBuilt: "",
  minSchoolRating: "",
};

/** Reads the filters out of the page URL, ignoring anything we don't know. */
export function parseFilters(
  params: Record<string, string | string[] | undefined>
): MarketFilters {
  const result: MarketFilters = {};
  for (const key of FILTER_KEYS) {
    const raw = params[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value !== undefined && value.trim() !== "") result[key] = value.trim();
  }
  return result;
}

/** Turns filters into "bedrooms=3&minPrice=200000" (empty ones are skipped). */
export function toQueryString(filters: MarketFilters): string {
  const qs = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filters[key];
    if (value) qs.set(key, value);
  }
  return qs.toString();
}

const RULES: Record<FilterKey, { label: string; integer?: boolean; max?: number }> = {
  bedrooms: { label: "Bedrooms", integer: true },
  minPrice: { label: "Min price" },
  maxPrice: { label: "Max price" },
  minSqft: { label: "Min sq ft" },
  maxSqft: { label: "Max sq ft" },
  minYearBuilt: { label: "Built from", integer: true },
  maxYearBuilt: { label: "Built up to", integer: true },
  minSchoolRating: { label: "Min school rating", max: 10 },
};

function checkRange(
  values: FilterValues,
  errors: FilterErrors,
  minKey: FilterKey,
  maxKey: FilterKey,
  message: string
) {
  if (errors[minKey] || errors[maxKey]) return;
  const min = values[minKey].trim();
  const max = values[maxKey].trim();
  if (min !== "" && max !== "" && Number(min) > Number(max)) errors[maxKey] = message;
}

export function validateFilters(values: FilterValues): FilterErrors {
  const errors: FilterErrors = {};

  for (const key of FILTER_KEYS) {
    const raw = values[key].trim();
    if (raw === "") continue;
    const rule = RULES[key];

    if (!/^\d+(\.\d+)?$/.test(raw)) {
      errors[key] = `${rule.label} must be a positive number.`;
      continue;
    }
    const num = Number(raw);
    if (rule.integer && !Number.isInteger(num)) {
      errors[key] = `${rule.label} must be a whole number.`;
    } else if (rule.max !== undefined && num > rule.max) {
      errors[key] = `${rule.label} must be at most ${rule.max}.`;
    }
  }

  checkRange(values, errors, "minPrice", "maxPrice", "Max price must be at least the min price.");
  checkRange(values, errors, "minSqft", "maxSqft", "Max sq ft must be at least the min sq ft.");
  checkRange(values, errors, "minYearBuilt", "maxYearBuilt", "“Built up to” must be the same year or later than “Built from”.");

  return errors;
}