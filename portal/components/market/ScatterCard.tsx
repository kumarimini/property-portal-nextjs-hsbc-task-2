"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactPrice, formatNumber, formatPrice } from "@/lib/format";

export interface ScatterPoint {
  sqft: number;
  price: number;
}

export default function ScatterCard({ points }: { points: ScatterPoint[] }) {
  return (
    <figure className="rounded-lg border border-line bg-surface p-5">
      <figcaption>
        <span className="block font-semibold">Size vs price</span>
        <span className="block text-sm text-muted">Each dot is one property</span>
      </figcaption>

      <div
        className="mt-3 h-64 w-full"
        role="img"
        aria-label={`Scatter plot of square footage against price for ${points.length} properties`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="sqft"
              name="Square footage"
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => formatNumber(v)}
              height={48}
              label={{ value: "Square footage", position: "insideBottom", offset: -4 }}
            />
            <YAxis
              type="number"
              dataKey="price"
              name="Price"
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => formatCompactPrice(v)}
              width={64}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value, name) =>
                name === "Price" ? formatPrice(Number(value)) : formatNumber(Number(value))
              }
            />
            <Scatter data={points} fill="#c8102e" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}