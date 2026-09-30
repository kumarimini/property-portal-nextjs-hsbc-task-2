import type { MarketData } from "@/lib/marketTypes";
import BarCard from "./BarCard";
import PropertiesTable from "./PropertiesTable";
import ScatterCard from "./ScatterCard";
import SummaryCards from "./SummaryCards";

export default function Dashboard({ data }: { data: MarketData }) {
  const { summary } = data;

  if (summary.count === 0) {
    return (
      <p
        role="status"
        className="rounded-lg border border-line bg-surface p-6 text-muted"
      >
        No properties match these filters. Try widening the ranges, or reset the filters.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="mb-3 text-xl font-semibold">
          Market overview
        </h2>
        <SummaryCards summary={summary} />
      </section>

      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="mb-3 text-xl font-semibold">
          Market charts
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <BarCard
            title="Price distribution"
            description="Number of properties in each price band"
            data={data.distribution.map((b) => ({ label: b.label, value: b.count }))}
            format="count"
            valueName="Properties"
          />
          <BarCard
            title="Average price by bedrooms"
            description="How price changes with house size"
            data={data.bedroomSegments.map((s) => ({ label: s.segment, value: s.averagePrice }))}
            format="currency"
            valueName="Average price"
          />
          <BarCard
            title="Average price by decade built"
            description="How price changes with property age"
            data={data.decadeSegments.map((s) => ({ label: s.segment, value: s.averagePrice }))}
            format="currency"
            valueName="Average price"
          />
          <ScatterCard
            points={data.properties.map((p) => ({ sqft: p.squareFootage, price: p.price }))}
          />
        </div>
      </section>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading" className="mb-3 text-xl font-semibold">
          Properties
        </h2>
        <PropertiesTable properties={data.properties} />
      </section>
    </div>
  );
}