"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { ANIM } from "@/constants/animations";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import dynamic from "next/dynamic";

// Dynamic imports for charts to avoid SSR issues with Recharts
const BalanceChart = dynamic(() => import("@/components/dashboard/BalanceChart").then(mod => mod.BalanceChart), { ssr: false, loading: () => <SkeletonLoader type="card" /> });
const CategoryChart = dynamic(() => import("@/components/dashboard/CategoryChart").then(mod => mod.CategoryChart), { ssr: false, loading: () => <SkeletonLoader type="circle" className="w-[200px] h-[200px] mx-auto" /> });
const RecentTransactions = dynamic(() => import("@/components/dashboard/RecentTransactions").then(mod => mod.RecentTransactions), { ssr: false, loading: () => <SkeletonLoader count={3} /> });

export default function DashboardPage() {
  const { state } = useAppContext();
  const { transactions } = state;

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === "income") acc.totalIncome += curr.amount;
        if (curr.type === "expense") acc.totalExpense += curr.amount;
        acc.balance = acc.totalIncome - acc.totalExpense;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [transactions]);

  const cards = [
    {
      title: "Total Balance",
      amount: balance,
      icon: <Wallet className="w-5 h-5" />,
      color: "#494fdf",
      trend: "+12.5%",
    },
    {
      title: "Total Income",
      amount: totalIncome,
      icon: <ArrowUpRight className="w-5 h-5" />,
      color: "#00a87e",
      trend: "+8.3%",
    },
    {
      title: "Total Expense",
      amount: totalExpense,
      icon: <ArrowDownRight className="w-5 h-5" />,
      color: "#e23b4a",
      trend: "-3.2%",
    },
  ];

  return (
    <motion.div {...ANIM.page} className="max-w-6xl mx-auto space-y-8">
      {/* Page Header — Design.md: Section Heading at weight 500, tight tracking */}
      <header>
        <h1 className="heading-section text-[2rem]">Dashboard</h1>
        <p className="text-[var(--muted)] mt-2 text-[15px]">
          Welcome back — here&apos;s your financial overview.
        </p>
      </header>

      {/* Summary Cards — Design.md: 20px radius, no shadows, flat surfaces */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            {...ANIM.row(i)}
            className="card-surface p-6 flex flex-col justify-between gap-6 group hover:border-[var(--muted)]/40 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--muted)] tracking-wide">{card.title}</span>
              <div
                className="w-10 h-10 rounded-[12px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${card.color}12`, color: card.color }}
              >
                {card.icon}
              </div>
            </div>

            <div>
              <div className="heading-card text-[1.75rem]">
                ₹{card.amount.toLocaleString("en-IN")}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: card.color }} />
                <span className="text-xs font-medium" style={{ color: card.color }}>
                  {card.trend}
                </span>
                <span className="text-xs text-[var(--muted)]">vs last month</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div {...ANIM.row(3)} className="card-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-card text-base">Balance Trend</h2>
              <span className="text-xs text-[var(--muted)] px-3 py-1.5 rounded-[9999px] bg-[var(--surface-alt)]">Last 30 days</span>
            </div>
            <div className="h-[300px] w-full">
              <BalanceChart transactions={transactions} />
            </div>
          </motion.div>

          <motion.div {...ANIM.row(4)} className="card-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-card text-base">Recent Transactions</h2>
            </div>
            <RecentTransactions transactions={transactions} />
          </motion.div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <motion.div {...ANIM.row(5)} className="card-surface p-6">
            <h2 className="heading-card text-base mb-6">Spending Breakdown</h2>
            <div className="h-[250px] w-full flex items-center justify-center">
              <CategoryChart transactions={transactions} type="expense" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
