import { formatCompactPrice, formatNumber, formatPrice } from "@/lib/format";
import type { MarketSummary } from "@/lib/marketTypes";

export default function SummaryCards({ summary }: { summary: MarketSummary }) {
  const items = [
    { label: "Properties", value: formatNumber(summary.count) },
    { label: "Average price", value: formatPrice(summary.averagePrice) },
    { label: "Median price", value: formatPrice(summary.medianPrice) },
    {
      label: "Price range",
      value: `${formatCompactPrice(summary.minPrice)} – ${formatCompactPrice(summary.maxPrice)}`,
    },
    { label: "Avg price per sq ft", value: formatPrice(summary.averagePricePerSqFt) },
    { label: "Avg size (sq ft)", value: formatNumber(Math.round(summary.averageSquareFootage)) },
    { label: "Avg year built", value: String(Math.round(summary.averageYearBuilt)) },
    { label: "Avg school rating", value: summary.averageSchoolRating.toFixed(1) },
  ];

  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-line bg-surface p-4">
          <dt className="text-sm text-muted">{item.label}</dt>
          <dd className="mt-1 text-2xl font-bold">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}