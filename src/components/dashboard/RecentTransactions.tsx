"use client";

import { Transaction } from "@/data/seedTransactions";
import { format, parseISO } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { CHART_COLORS } from "@/constants/chartColors";
import Link from "next/link";

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  // Show only top 5 recent transactions
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (!recent.length) {
    return <p className="text-sm text-[var(--muted)]">No recent transactions.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {recent.map((t) => {
        const isIncome = t.type === "income";
        const Icon = isIncome ? ArrowUpRight : ArrowDownRight;
        const color = isIncome ? "#00a87e" : CHART_COLORS[t.category] || "#e23b4a";

        return (
          <div key={t.id} className="flex items-center justify-between p-3 hover:bg-[var(--surface-alt)] rounded-2xl transition-colors">
            <div className="flex items-center gap-4">
              <div 
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${color}15`, color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium leading-tight text-sm">{t.description}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[var(--muted)] font-medium bg-[var(--surface-alt)] px-2.5 py-0.5 rounded-[9999px]">
                    {t.category}
                  </span>
                  <span className="text-xs text-[var(--muted)]">{format(parseISO(t.date), "MMM dd, yyyy")}</span>
                </div>
              </div>
            </div>
            <div className={`font-medium text-right text-sm tabular-nums ${isIncome ? 'text-[#00a87e]' : ''}`}>
              {isIncome ? "+" : "-"}₹{t.amount.toLocaleString()}
            </div>
          </div>
        );
      })}
      
      <div className="pt-2">
        <Link href="/transactions" className="text-sm font-medium text-[#494fdf] hover:underline">
          View all transactions &rarr;
        </Link>
      </div>
    </div>
  );
}
