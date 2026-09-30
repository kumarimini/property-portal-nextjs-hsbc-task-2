import { MARKET_API_URL } from "./config";
import { toQueryString, type MarketFilters } from "./marketFilters";
import type {
  DistributionBucket,
  MarketData,
  MarketSummary,
  Property,
  SegmentStat,
} from "./marketTypes";

async function errorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.message === "string" && body.message) return body.message;
  } catch {
    // the response had no JSON body
  }
  return `The request failed (status ${res.status}).`;
}

async function get<T>(
  path: string,
  filters: MarketFilters,
  extra: Record<string, string> = {}
): Promise<T> {
  const params = new URLSearchParams(toQueryString(filters));
  for (const [key, value] of Object.entries(extra)) params.set(key, value);
  const qs = params.toString();

  let res: Response;
  try {
    res = await fetch(`${MARKET_API_URL}${path}${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Could not reach the market analysis service. Please check that it is running."
    );
  }
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json() as Promise<T>;
}

/** Loads everything the dashboard needs, with the five requests running in parallel. */
export async function getMarketData(filters: MarketFilters): Promise<MarketData> {
  const [summary, distribution, bedroomSegments, decadeSegments, properties] =
    await Promise.all([
      get<MarketSummary>("/api/market/summary", filters),
      get<DistributionBucket[]>("/api/market/distribution", filters),
      get<SegmentStat[]>("/api/market/segments", filters, { groupBy: "bedrooms" }),
      get<SegmentStat[]>("/api/market/segments", filters, { groupBy: "decade" }),
      get<Property[]>("/api/properties", filters),
    ]);

  return { summary, distribution, bedroomSegments, decadeSegments, properties };
}