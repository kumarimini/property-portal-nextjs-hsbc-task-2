import { formatFieldValue, formatPrice } from "@/lib/format";
import type { Estimate } from "@/lib/types";
import { FIELDS } from "@/lib/validation";
import PriceChart from "./PriceChart";

interface Props {
  latest: Estimate | null;
  history: Estimate[];
}

export default function ResultPanel({ latest, history }: Props) {
  const recent = history.slice(0, 6).reverse();
  const chartData = recent.map((e) => ({
    label: `#${e.id}`,
    price: e.predicted_price,
    highlight: latest ? e.id === latest.id : false,
  }));

  return (
    <div>
      {/* Announces new results to screen readers */}
      <p role="status" className="sr-only">
        {latest ? `Estimate ready: ${formatPrice(latest.predicted_price)}` : ""}
      </p>

      <section
        aria-labelledby="result-heading"
        className="rounded-lg border border-line bg-surface p-6"
      >
        <h2 id="result-heading" className="text-xl font-semibold">
          {latest ? `Estimate #${latest.id}` : "Estimate"}
        </h2>

        {!latest ? (
          <p className="mt-2 text-muted">
            Fill in the property details and choose “Get estimate” to see the result here.
          </p>
        ) : (
          <div key={latest.id} className="animate-fade-in">
            <p className="mt-2 text-4xl font-bold text-brand">
              {formatPrice(latest.predicted_price)}
            </p>

            <table className="mt-4 w-full text-sm">
              <caption className="sr-only">
                Inputs and predicted price for estimate {latest.id}
              </caption>
              <tbody>
                {FIELDS.map((f) => (
                  <tr key={f.name} className="border-t border-line">
                    <th scope="row" className="py-2 pr-4 text-left font-medium text-muted">
                      {f.label}
                    </th>
                    <td className="py-2 text-right">
                      {formatFieldValue(f.name, latest.inputs[f.name])}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-ink font-semibold">
                  <th scope="row" className="py-2 pr-4 text-left">
                    Estimated price
                  </th>
                  <td className="py-2 text-right">{formatPrice(latest.predicted_price)}</td>
                </tr>
              </tbody>
            </table>

            <PriceChart data={chartData} title="Recent estimates (latest highlighted)" />
          </div>
        )}
      </section>
    </div>
  );
}