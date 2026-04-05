import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Search, SlidersHorizontal, Download, ChevronDown, ChevronUp, X } from "lucide-react";
import { CATEGORIES } from "@/constants/categories";
import { motion, AnimatePresence } from "framer-motion";

type TransactionFiltersProps = {
  onExportCSV?: () => void;
  onExportJSON?: () => void;
};

export function TransactionFilters({ onExportCSV, onExportJSON }: TransactionFiltersProps) {
  const { state, dispatch } = useAppContext();
  const { filters } = state;
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="flex flex-col gap-3 card-surface p-4">
      <div className="flex flex-col sm:flex-row gap-3">
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
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-3 rounded-[9999px] text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            showAdvanced ? "bg-[#494fdf] text-white" : "bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--border)]"
          }`}
          title="Toggle Advanced Filters"
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Advanced</span>
        </button>

        <button
          onClick={() => dispatch({ type: "RESET_FILTERS" })}
          className="p-3 bg-[var(--surface-alt)] hover:bg-[var(--border)] rounded-[9999px] transition-colors focus:ring-2 focus:ring-[#494fdf] outline-none flex items-center justify-center shrink-0 text-[var(--muted)] hover:text-[var(--foreground)]"
          title="Reset Filters"
        >
          <X className="w-4 h-4" /> {/* Wait I didn't import X, I will use "Clear" text instead or just keep it simple */}
        </button>
      </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-1 border-t border-[var(--border)] flex flex-col md:flex-row gap-4">
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-medium px-2">Min Amount</label>
                  <input
                    type="number"
                    placeholder="₹0"
                    className="w-full px-4 py-2 bg-[var(--surface-alt)] text-[var(--foreground)] border-none rounded-[9999px] text-sm outline-none placeholder:text-[var(--muted)]"
                    value={filters.amountMin}
                    onChange={(e) => dispatch({ type: "SET_FILTER", payload: { amountMin: e.target.value === "" ? "" : Number(e.target.value) } })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-medium px-2">Max Amount</label>
                  <input
                    type="number"
                    placeholder="₹ No limit"
                    className="w-full px-4 py-2 bg-[var(--surface-alt)] text-[var(--foreground)] border-none rounded-[9999px] text-sm outline-none placeholder:text-[var(--muted)]"
                    value={filters.amountMax}
                    onChange={(e) => dispatch({ type: "SET_FILTER", payload: { amountMax: e.target.value === "" ? "" : Number(e.target.value) } })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-medium px-2">From Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-[var(--surface-alt)] text-[var(--foreground)] border-none rounded-[9999px] text-sm outline-none"
                    value={filters.dateFrom}
                    onChange={(e) => dispatch({ type: "SET_FILTER", payload: { dateFrom: e.target.value } })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-medium px-2">To Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-[var(--surface-alt)] text-[var(--foreground)] border-none rounded-[9999px] text-sm outline-none"
                    value={filters.dateTo}
                    onChange={(e) => dispatch({ type: "SET_FILTER", payload: { dateTo: e.target.value } })}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 items-end shrink-0 pt-2 lg:pt-0">
                <button
                  onClick={onExportCSV}
                  className="flex-1 px-4 py-2 bg-[var(--surface-alt)] hover:bg-[var(--border)] text-[var(--foreground)] rounded-[9999px] text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#00a87e]" />
                  CSV
                </button>
                <button
                  onClick={onExportJSON}
                  className="flex-1 px-4 py-2 bg-[var(--surface-alt)] hover:bg-[var(--border)] text-[var(--foreground)] rounded-[9999px] text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#ec7e00]" />
                  JSON
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
