"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Transaction } from "@/data/seedTransactions";
import { format } from "date-fns";
import { useAppContext } from "@/context/AppContext";

/* Custom tooltip — no square borders, follows Design.md flat aesthetic */
function CustomBalanceTooltip({ active, payload, label, isDark }: any) {
  if (!active || !payload?.length) return null;
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
        boxShadow: "none",
        outline: "none",
      }}
    >
      <div style={{ color: isDark ? "#828488" : "#8d969e", marginBottom: 4, fontSize: 12 }}>
        {label}
      </div>
      <div style={{ fontWeight: 500, color: "#494fdf" }}>
        ₹{payload[0].value.toLocaleString()}
      </div>
    </div>
  );
}

export function BalanceChart({ transactions }: { transactions: Transaction[] }) {
  const { state } = useAppContext();
  const isDark = state.theme === "dark";

  const data = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setMonth(cutoff.getMonth() - 1);

    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = sorted
      .filter((t) => new Date(t.date) < cutoff)
      .reduce((acc, t) => acc + (t.type === "income" ? t.amount : -t.amount), 0);

    const dailyMap = new Map<string, number>();

    sorted
      .filter((t) => new Date(t.date) >= cutoff)
      .forEach((t) => {
        const dateKey = t.date;
        const current = dailyMap.get(dateKey) || 0;
        dailyMap.set(dateKey, current + (t.type === "income" ? t.amount : -t.amount));
      });

    const points = [];
    const iterDate = new Date(cutoff);
    while (iterDate <= now) {
      const dateStr = format(iterDate, "yyyy-MM-dd");
      if (dailyMap.has(dateStr)) {
        runningBalance += dailyMap.get(dateStr)!;
      }
      points.push({
        date: format(iterDate, "MMM dd"),
        balance: runningBalance,
      });
      iterDate.setDate(iterDate.getDate() + 1);
    }

    return points;
  }, [transactions]);

  if (!transactions.length) return null;

  const gradientColor = "#494fdf";
  const gridStroke = isDark ? "#44474a" : "#e8e8ec";
  const axisColor = isDark ? "#828488" : "#8d969e";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientColor} stopOpacity={0.2} />
            <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: axisColor }}
          minTickGap={40}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: axisColor }}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          width={55}
        />
        <Tooltip
          content={<CustomBalanceTooltip isDark={isDark} />}
          wrapperStyle={{ outline: "none", border: "none", boxShadow: "none" }}
          cursor={{ stroke: isDark ? "#44474a" : "#c9c9cd", strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke={gradientColor}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorBalance)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
