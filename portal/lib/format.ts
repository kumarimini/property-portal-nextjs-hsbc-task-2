import type { FieldName } from "./validation";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 0,
});
const plain = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const date = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatPrice = (n: number) => usd.format(n);
export const formatCompactPrice = (n: number) => `$${compact.format(n)}`;
export const formatDate = (iso: string) => date.format(new Date(iso));

export function formatFieldValue(name: FieldName, value: number) {
  return name === "year_built" ? String(value) : plain.format(value);
}

export const formatNumber = (n: number) => plain.format(n);