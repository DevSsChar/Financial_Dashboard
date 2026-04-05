"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { useAppContext } from "@/context/AppContext";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { ANIM } from "@/constants/animations";
import { TrendingUp, TrendingDown, Layers } from "lucide-react";

/* Custom tooltip — Design.md: rounded, border-based, no shadow/outline */
function CustomChartTooltip({ active, payload, label, isDark }: any) {
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
        lineHeight: 1.6,
        boxShadow: "none",
        outline: "none",
      }}
    >
      <div style={{ color: isDark ? "#828488" : "#8d969e", marginBottom: 4, fontSize: 12 }}>
        {label}
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: p.color, flexShrink: 0 }} />
          <span style={{ fontWeight: 500 }}>
            {p.dataKey}: ₹{p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function InsightsPage() {
  const { state } = useAppContext();
  const { transactions } = state;
  const isDark = state.theme === "dark";

  const { monthlyData, topCategory, totalIncome, totalExpense } = useMemo(() => {
    const now = new Date();
    const fourMonthsAgo = new Date(now);
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const filtered = transactions.filter((t) => new Date(t.date) >= fourMonthsAgo);

    const monthlyMap = new Map<string, { income: number; expense: number }>();
    const categoryMap = new Map<string, number>();
    let totalInc = 0;
    let totalExp = 0;

    filtered.forEach((t) => {
      const monthStr = format(parseISO(t.date), "MMM yyyy");
      if (!monthlyMap.has(monthStr)) {
        monthlyMap.set(monthStr, { income: 0, expense: 0 });
      }
      const current = monthlyMap.get(monthStr)!;
      if (t.type === "income") {
        current.income += t.amount;
        totalInc += t.amount;
      }
      if (t.type === "expense") {
        current.expense += t.amount;
        totalExp += t.amount;
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
      }
    });

    const monthlyData = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        Income: data.income,
        Expense: data.expense,
      }))
      .reverse();

    let topCat = { name: "None", amount: 0 };
    categoryMap.forEach((val, key) => {
      if (val > topCat.amount) topCat = { name: key, amount: val };
    });

    return { monthlyData, topCategory: topCat, totalIncome: totalInc, totalExpense: totalExp };
  }, [transactions]);

  const gridStroke = isDark ? "#44474a" : "#e8e8ec";
  const axisColor = isDark ? "#828488" : "#8d969e";

  if (!transactions.length) {
    return <div className="p-8 text-center text-[var(--muted)]">No data available for insights</div>;
  }

  return (
    <motion.div {...ANIM.page} className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="heading-section text-[2rem]">Insights Hub</h1>
        <p className="text-[var(--muted)] mt-2 text-[15px]">
          Deep dive into your financial patterns.
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div {...ANIM.row(0)} className="card-surface p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-[12px] bg-[#494fdf]/8 text-[#494fdf]">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-sm text-[var(--muted)]">Top Expense Category</span>
          </div>
          <div className="heading-card text-[1.5rem]">{topCategory.name}</div>
          <p className="text-sm text-[var(--muted)] mt-1.5">₹{topCategory.amount.toLocaleString()} spent</p>
        </motion.div>

        <motion.div {...ANIM.row(1)} className="card-surface p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-[12px] bg-[#00a87e]/8 text-[#00a87e]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-sm text-[var(--muted)]">Total Income (4mo)</span>
          </div>
          <div className="heading-card text-[1.5rem] text-[#00a87e]">₹{totalIncome.toLocaleString()}</div>
        </motion.div>

        <motion.div {...ANIM.row(2)} className="card-surface p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-[12px] bg-[#e23b4a]/8 text-[#e23b4a]">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-sm text-[var(--muted)]">Total Expense (4mo)</span>
          </div>
          <div className="heading-card text-[1.5rem] text-[#e23b4a]">₹{totalExpense.toLocaleString()}</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...ANIM.row(3)} className="card-surface p-6">
          <h2 className="heading-card text-base mb-6">Income vs Expense</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncomeInsight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a87e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00a87e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenseInsight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e23b4a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#e23b4a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: axisColor }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: axisColor }} />
                <Tooltip
                  content={<CustomChartTooltip isDark={isDark} />}
                  wrapperStyle={{ outline: "none", border: "none", boxShadow: "none" }}
                  cursor={{ stroke: isDark ? "#44474a" : "#c9c9cd", strokeDasharray: "4 4" }}
                />
                <Area type="monotone" dataKey="Income" stroke="#00a87e" strokeWidth={2} fillOpacity={1} fill="url(#colorIncomeInsight)" />
                <Area type="monotone" dataKey="Expense" stroke="#e23b4a" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenseInsight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...ANIM.row(4)} className="card-surface p-6">
          <h2 className="heading-card text-base mb-6">Monthly Cash Flow</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: axisColor }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: axisColor }} />
                <Tooltip
                  content={<CustomChartTooltip isDark={isDark} />}
                  wrapperStyle={{ outline: "none", border: "none", boxShadow: "none" }}
                  cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", radius: 8 }}
                />
                <Bar dataKey="Income" fill="#00a87e" radius={[8, 8, 0, 0]} barSize={20} />
                <Bar dataKey="Expense" fill="#e23b4a" radius={[8, 8, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
