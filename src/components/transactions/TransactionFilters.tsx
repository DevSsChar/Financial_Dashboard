"use client";

import { useAppContext } from "@/context/AppContext";
import { Search, SlidersHorizontal } from "lucide-react";
import { CATEGORIES } from "@/constants/categories";

export function TransactionFilters() {
  const { state, dispatch } = useAppContext();
  const { filters } = state;

  return (
    <div className="flex flex-col sm:flex-row gap-3 card-surface p-4">
      {/* Search — Design.md: pill inputs */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-full pl-11 pr-4 py-3 bg-[var(--surface-alt)] text-[var(--foreground)] border-none rounded-[9999px] focus:ring-2 focus:ring-[#494fdf] transition-shadow text-sm outline-none placeholder:text-[var(--muted)]"
          value={filters.search}
          onChange={(e) => dispatch({ type: "SET_FILTER", payload: { search: e.target.value } })}
        />
      </div>

      {/* Dropdowns — explicitly set background/color for mobile dark mode */}
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <select
          className="flex-1 sm:flex-none min-w-[110px] px-4 py-3 bg-[var(--surface-alt)] text-[var(--foreground)] border-none rounded-[9999px] text-sm font-medium focus:ring-2 focus:ring-[#494fdf] outline-none cursor-pointer filter-select"
          value={filters.type}
          onChange={(e) => dispatch({ type: "SET_FILTER", payload: { type: e.target.value as any } })}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="flex-1 sm:flex-none min-w-[130px] px-4 py-3 bg-[var(--surface-alt)] text-[var(--foreground)] border-none rounded-[9999px] text-sm font-medium focus:ring-2 focus:ring-[#494fdf] outline-none cursor-pointer filter-select"
          value={filters.category}
          onChange={(e) => dispatch({ type: "SET_FILTER", payload: { category: e.target.value } })}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={() => dispatch({ type: "RESET_FILTERS" })}
          className="p-3 bg-[var(--surface-alt)] hover:bg-[var(--border)] rounded-[9999px] transition-colors focus:ring-2 focus:ring-[#494fdf] outline-none flex items-center justify-center shrink-0"
          title="Reset Filters"
        >
          <SlidersHorizontal className="w-4 h-4 text-[var(--muted)]" />
        </button>
      </div>
    </div>
  );
}
