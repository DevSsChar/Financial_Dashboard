"use client";

import { useMemo } from "react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Transaction } from "@/data/seedTransactions";
import { CHART_COLORS } from "@/constants/chartColors";
import { useAppContext } from "@/context/AppContext";

/* Custom tooltip that NEVER has a square/box outline */
function CustomPieTooltip({ active, payload, isDark }: any) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div
      style={{
        background: isDark ? "#232628" : "#ffffff",
        border: `1px solid ${isDark ? "#44474a" : "#c9c9cd"}`,
        borderRadius: "12px",
        padding: "10px 16px",
        fontSize: "13px",
        color: isDark ? "#ffffff" : "#191c1f",
        lineHeight: 1.5,
        /* kill any outer box from recharts wrapper */
        boxShadow: "none",
        outline: "none",
      }}
    >
      <div style={{ fontWeight: 500, marginBottom: 2 }}>{name}</div>
      <div style={{ color: isDark ? "#828488" : "#8d969e" }}>
        ₹{value.toLocaleString()}
      </div>
    </div>
  );
}

export function CategoryChart({ transactions, type }: { transactions: Transaction[]; type: "income" | "expense" }) {
  const { state } = useAppContext();
  const isDark = state.theme === "dark";

  const data = useMemo(() => {
    const categories = new Map<string, number>();

    transactions
      .filter((t) => t.type === type)
      .forEach((t) => {
        categories.set(t.category, (categories.get(t.category) || 0) + t.amount);
      });

    return Array.from(categories.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, type]);

  if (!data.length) {
    return <div className="text-sm text-[var(--muted)]">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          strokeWidth={0}
          /* Active shape — prevent ugly default outline */
          activeShape={undefined}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[entry.name as keyof typeof CHART_COLORS] || "#ccc"}
              stroke="none"
            />
          ))}
        </Pie>
        <Tooltip
          content={<CustomPieTooltip isDark={isDark} />}
          /* Kill the default wrapper border / outline */
          wrapperStyle={{ outline: "none", border: "none", boxShadow: "none" }}
          cursor={false}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
