"use client";

import { useCompareSelection } from "@/hooks/useCompareSelection";
import { useEstimates } from "@/hooks/useEstimates";
import type { Estimate } from "@/lib/types";
import ComparisonView from "./ComparisonView";
import EstimateForm from "./EstimateForm";
import HistoryTable from "./HistoryTable";
import ResultPanel from "./ResultPanel";

interface Props {
  initialHistory: Estimate[];
  initialError: string | null;
}

export default function EstimatorClient({ initialHistory, initialError }: Props) {
  const { history, latest, loadError, isSubmitting, error, submit, clear, reload } =
    useEstimates(initialHistory, initialError);
  const selection = useCompareSelection(4);

  const selected = selection.ids
    .map((id) => history.find((e) => e.id === id))
    .filter((e): e is Estimate => e !== undefined);

  const handleClear = async () => {
    const ok = await clear();
    if (ok) selection.clear();
  };

  return (
    <div className="space-y-10">
      {loadError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-800"
        >
          <span>Couldn&apos;t load your previous estimates: {loadError}</span>
          <button
            type="button"
            onClick={reload}
            className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <EstimateForm onSubmit={submit} isSubmitting={isSubmitting} error={error} />
        <ResultPanel latest={latest} history={history} />
      </div>

      <HistoryTable
        history={history}
        selectedIds={selection.ids}
        isFull={selection.isFull}
        onToggle={selection.toggle}
        onClear={handleClear}
      />

      <ComparisonView estimates={selected} />
    </div>
  );
}