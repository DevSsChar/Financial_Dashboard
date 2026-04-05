"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { CATEGORIES, Category } from "@/constants/categories";
import { Transaction } from "@/data/seedTransactions";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

type AddTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export function AddTransactionModal({ isOpen, onClose, onSuccess, onError }: AddTransactionModalProps) {
  const { dispatch } = useAppContext();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "Food" as Category,
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.description.trim() || !form.amount || Number(form.amount) <= 0) {
      onError("Please fill all fields with valid values.");
      return;
    }

    setIsSubmitting(true);

    const newTx: Transaction = {
      id: uuidv4(),
      date: form.date,
      description: form.description.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      tags: [],
    };

    // Optimistic add
    dispatch({ type: "ADD_TRANSACTION", payload: newTx });
    onClose();
    onSuccess(`"${newTx.description}" added successfully.`);

    try {
      const { mockApi } = await import("@/services/mockApi");
      await mockApi.addTransaction(newTx);
    } catch (err) {
      dispatch({ type: "ADD_TRANSACTION_ROLLBACK", payload: newTx.id });
      onError(err instanceof Error ? err.message : "Failed to add — transaction rolled back.");
    } finally {
      setIsSubmitting(false);
      // Reset form
      setForm({
        description: "",
        amount: "",
        type: "expense",
        category: "Food",
        date: format(new Date(), "yyyy-MM-dd"),
      });
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-[var(--surface-alt)] text-[var(--foreground)] border-none rounded-[9999px] focus:ring-2 focus:ring-[#494fdf] transition-shadow text-sm outline-none placeholder:text-[var(--muted)]";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-[var(--surface)] rounded-[20px] border border-[var(--border)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <h2 className="heading-card text-lg">Add Transaction</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-[9999px] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-alt)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Type Toggle */}
              <div className="flex items-center bg-[var(--surface-alt)] rounded-[9999px] p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: "expense" }))}
                  className={`flex-1 py-2.5 rounded-[9999px] text-sm font-medium transition-all duration-200 ${
                    form.type === "expense"
                      ? "bg-[var(--surface)] text-[#e23b4a]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: "income" }))}
                  className={`flex-1 py-2.5 rounded-[9999px] text-sm font-medium transition-all duration-200 ${
                    form.type === "income"
                      ? "bg-[var(--surface)] text-[#00a87e]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Grocery Store"
                  className={inputClass}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  autoFocus
                />
              </div>

              {/* Amount + Date row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="0"
                    className={inputClass}
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">
                    Date
                  </label>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, category: cat }))}
                      className={`px-3.5 py-1.5 rounded-[9999px] text-xs font-medium transition-all duration-200 border ${
                        form.category === cat
                          ? "bg-[var(--foreground)] text-[var(--background)] border-transparent"
                          : "bg-transparent text-[var(--muted)] border-[var(--border)] hover:text-[var(--foreground)] hover:border-[var(--muted)]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-pill btn-secondary flex-1 !py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-pill flex-1 !py-3 ${
                    form.type === "income" ? "!bg-[#00a87e] text-white hover:!bg-[#008f6b]" : "btn-primary"
                  } disabled:opacity-50`}
                >
                  {isSubmitting ? "Adding..." : `Add ${form.type === "income" ? "Income" : "Expense"}`}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
