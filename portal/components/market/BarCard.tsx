"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactPrice, formatNumber, formatPrice } from "@/lib/format";

export interface BarDatum {
  label: string;
  value: number;
}

interface Props {
  title: string;
  description: string;
  data: BarDatum[];
  format: "currency" | "count";
  valueName: string;
}

export default function BarCard({ title, description, data, format, valueName }: Props) {
  const full = (n: number) => (format === "currency" ? formatPrice(n) : formatNumber(n));
  const axis = (n: number) => (format === "currency" ? formatCompactPrice(n) : formatNumber(n));
  const summary = data.map((d) => `${d.label}: ${full(d.value)}`).join(", ");

  return (
    <figure className="rounded-lg border border-line bg-surface p-5">
      <figcaption>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-muted">{description}</span>
      </figcaption>

      <div className="mt-3 h-64 w-full" role="img" aria-label={`${title}. ${summary}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              angle={-25}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis tickFormatter={(v: number) => axis(v)} width={64} allowDecimals={false} />
            <Tooltip formatter={(value) => [full(Number(value)), valueName] as [string, string]} />
            <Bar dataKey="value" fill="#c8102e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}