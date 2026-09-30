import { formatFieldValue, formatPrice } from "@/lib/format";
import type { Estimate } from "@/lib/types";
import { FIELDS } from "@/lib/validation";
import PriceChart from "./PriceChart";

export default function ComparisonView({ estimates }: { estimates: Estimate[] }) {
  return (
    <section aria-labelledby="compare-heading">
      <h2 id="compare-heading" className="text-xl font-semibold">
        Compare properties
      </h2>

      {estimates.length < 2 ? (
        <p className="mt-2 text-muted">
          Tick at least two estimates in the history table to compare them side by side.
        </p>
      ) : (
        <Comparison estimates={estimates} />
      )}
    </section>
  );
}

function Comparison({ estimates }: { estimates: Estimate[] }) {
  const prices = estimates.map((e) => e.predicted_price);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const hasSpread = max !== min;

  const chartData = estimates.map((e) => ({
    label: `#${e.id}`,
    price: e.predicted_price,
    highlight: hasSpread && e.predicted_price === max,
  }));

  return (
    <div className="mt-3 animate-fade-in">
      <div
        className="overflow-x-auto rounded-lg border border-line bg-surface"
        role="region"
        aria-label="Comparison table"
        tabIndex={0}
      >
        <table className="w-full text-sm">
          <caption className="sr-only">Side-by-side comparison of the selected estimates</caption>
          <thead className="bg-page text-left">
            <tr>
              <th scope="col" className="px-4 py-2">
                <span className="sr-only">Attribute</span>
              </th>
              {estimates.map((e) => (
                <th key={e.id} scope="col" className="px-4 py-2">
                  Estimate #{e.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((f) => (
              <tr key={f.name} className="border-t border-line">
                <th scope="row" className="px-4 py-2 text-left font-medium text-muted">
                  {f.label}
                </th>
                {estimates.map((e) => (
                  <td key={e.id} className="px-4 py-2">
                    {formatFieldValue(f.name, e.inputs[f.name])}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-line">
              <th scope="row" className="px-4 py-2 text-left font-medium text-muted">
                Price per sq ft
              </th>
              {estimates.map((e) => (
                <td key={e.id} className="px-4 py-2">
                  {formatPrice(e.predicted_price / e.inputs.square_footage)}
                </td>
              ))}
            </tr>
            <tr className="border-t-2 border-ink font-semibold">
              <th scope="row" className="px-4 py-2 text-left">
                Estimated price
              </th>
              {estimates.map((e) => (
                <td key={e.id} className="px-4 py-2">
                  {formatPrice(e.predicted_price)}
                  {hasSpread && e.predicted_price === max && (
                    <span className="ml-2 text-xs font-medium text-brand">(highest)</span>
                  )}
                  {hasSpread && e.predicted_price === min && (
                    <span className="ml-2 text-xs font-medium text-muted">(lowest)</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <PriceChart data={chartData} title="Estimated price by property (highest highlighted)" />
    </div>
  );
}