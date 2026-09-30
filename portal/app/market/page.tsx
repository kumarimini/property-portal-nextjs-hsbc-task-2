import Dashboard from "@/components/market/Dashboard";
import FilterBar from "@/components/market/FilterBar";
import { getMarketData } from "@/lib/marketApi";
import { parseFilters, toQueryString } from "@/lib/marketFilters";
import type { MarketData } from "@/lib/marketTypes";

export const metadata = { title: "Property Market Analysis" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MarketPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(await searchParams);

  let data: MarketData | null = null;
  let error: string | null = null;
  try {
    data = await getMarketData(filters);
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Property Market Analysis</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Explore market statistics for the housing dataset and filter it by property
          segment. The URL keeps your filters, so you can share or bookmark a view.
        </p>
      </div>

      {/* key remounts the form when the URL filters change (e.g. Back button) */}
      <FilterBar key={toQueryString(filters)} initialFilters={filters} />

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 p-4 text-red-800"
        >
          <p className="font-semibold">Couldn&apos;t load the market data</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : (
        data && <Dashboard data={data} />
      )}
    </div>
  );
}