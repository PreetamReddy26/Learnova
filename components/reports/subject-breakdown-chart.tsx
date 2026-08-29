"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface SubjectBreakdownChartProps {
  data: { subject: string; scorePercent: number }[]
}

export function SubjectBreakdownChart({ data }: SubjectBreakdownChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid
          vertical={false}
          stroke="var(--color-border)"
          strokeDasharray="0"
        />
        <XAxis
          dataKey="subject"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--color-foreground)" }}
          formatter={(value) => [`${value}%`, "Average score"]}
        />
        <Bar
          dataKey="scorePercent"
          fill="var(--color-brand)"
          radius={[4, 4, 0, 0]}
          barSize={24}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
