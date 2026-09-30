import { formatDate, formatFieldValue, formatPrice } from "@/lib/format";
import type { Estimate } from "@/lib/types";
import { FIELDS } from "@/lib/validation";

interface Props {
  history: Estimate[];
  selectedIds: number[];
  isFull: boolean;
  onToggle: (id: number) => void;
  onClear: () => void;
}

export default function HistoryTable({ history, selectedIds, isFull, onToggle, onClear }: Props) {
  const handleClear = () => {
    if (window.confirm("Clear all estimate history?")) onClear();
  };

  return (
    <section aria-labelledby="history-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="history-heading" className="text-xl font-semibold">
          History ({history.length})
        </h2>
        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-gray-500 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-line"
          >
            Clear history
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="mt-2 text-muted">No estimates yet. Your previous estimates will appear here.</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">
            Tick up to 4 estimates to compare them side by side below.
          </p>
          <div
            className="mt-3 overflow-x-auto rounded-lg border border-line bg-surface"
            role="region"
            aria-label="Estimate history table"
            tabIndex={0}
          >
            <table className="w-full min-w-[56rem] text-sm">
              <caption className="sr-only">Previous estimates, newest first</caption>
              <thead className="bg-page text-left">
                <tr>
                  <th scope="col" className="px-3 py-2">Compare</th>
                  <th scope="col" className="px-3 py-2">#</th>
                  <th scope="col" className="px-3 py-2">Date</th>
                  {FIELDS.map((f) => (
                    <th key={f.name} scope="col" className="px-3 py-2">{f.label}</th>
                  ))}
                  <th scope="col" className="px-3 py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {history.map((e) => {
                  const checked = selectedIds.includes(e.id);
                  return (
                    <tr key={e.id} className="border-t border-line">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!checked && isFull}
                          onChange={() => onToggle(e.id)}
                          aria-label={`Select estimate ${e.id} for comparison`}
                          className="h-4 w-4 accent-brand"
                        />
                      </td>
                      <td className="px-3 py-2">{e.id}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <time dateTime={e.created_at} suppressHydrationWarning>
                          {formatDate(e.created_at)}
                        </time>
                      </td>
                      {FIELDS.map((f) => (
                        <td key={f.name} className="px-3 py-2">
                          {formatFieldValue(f.name, e.inputs[f.name])}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right font-semibold">
                        {formatPrice(e.predicted_price)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}