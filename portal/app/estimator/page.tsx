import EstimatorClient from "@/components/estimator/EstimatorClient";
import { getEstimates } from "@/lib/estimatorApi";
import type { Estimate } from "@/lib/types";

export const metadata = { title: "Property Value Estimator" };

export default async function EstimatorPage() {
  let initialHistory: Estimate[] = [];
  let initialError: string | null = null;

  try {
    initialHistory = await getEstimates();
  } catch (e) {
    initialError = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Property Value Estimator</h1>
      <p className="mt-2 mb-8 max-w-2xl text-muted">
        Enter a property&apos;s details to get a price estimate, review your previous
        estimates, and compare properties side by side.
      </p>
      <EstimatorClient initialHistory={initialHistory} initialError={initialError} />
    </div>
  );
}