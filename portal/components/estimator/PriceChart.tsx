"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactPrice, formatPrice } from "@/lib/format";

export interface ChartDatum {
  label: string;
  price: number;
  highlight?: boolean;
}

export default function PriceChart({ data, title }: { data: ChartDatum[]; title: string }) {
  const summary = data.map((d) => `${d.label} ${formatPrice(d.price)}`).join(", ");

  return (
    <figure className="mt-6">
      <figcaption className="text-sm font-medium text-muted">{title}</figcaption>
      <div className="mt-2 h-64 w-full" role="img" aria-label={`${title}: ${summary}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis tickFormatter={(v: number) => formatCompactPrice(v)} width={64} />
            <Tooltip formatter={(value) => formatPrice(Number(value))} />
            <Bar dataKey="price" radius={[4, 4, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.label} fill={d.highlight ? "#c8102e" : "#6b7280"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}