"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { TransactionFilters } from "./TransactionFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast, ToastContainer, ToastProps } from "@/components/ui/Toast";
import { format, parseISO } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";
import { ANIM } from "@/constants/animations";
import { Transaction } from "@/data/seedTransactions";
import { EditTransactionModal } from "./EditTransactionModal";

export function TransactionsView() {
  const { state, dispatch } = useAppContext();
  const { transactions, filters, role } = state;
  const isAdmin = role === "admin";

  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [toasts, setToasts] = useState<Omit<ToastProps, "onDismiss">[]>([]);

  const addToast = useCallback((message: string, type: ToastProps["type"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.type !== "all" && t.type !== filters.type) return false;
        if (filters.category && t.category !== filters.category) return false;
        if (filters.amountMin !== "" && t.amount < Number(filters.amountMin)) return false;
        if (filters.amountMax !== "" && t.amount > Number(filters.amountMax)) return false;
        if (filters.dateFrom && t.date < filters.dateFrom) return false;
        if (filters.dateTo && t.date > filters.dateTo) return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "date") {
          return filters.sortDir === "desc"
            ? new Date(b.date).getTime() - new Date(a.date).getTime()
            : new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (filters.sortBy === "amount") {
          return filters.sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, filters]);

  const handleExportCSV = useCallback(() => {
    const headers = ["ID,Date,Description,Amount,Type,Category"];
    const rows = filtered.map(t => 
      `${t.id},${t.date},"${t.description.replace(/"/g, '""')}",${t.amount},${t.type},${t.category}`
    );
    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${format(new Date(), "yyyyMMdd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Exported to CSV successfully", "success");
  }, [filtered, addToast]);

  const handleExportJSON = useCallback(() => {
    const jsonContent = JSON.stringify(filtered, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${format(new Date(), "yyyyMMdd")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Exported to JSON successfully", "success");
  }, [filtered, addToast]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const tx = deleteTarget;
    setDeleteTarget(null);

    dispatch({ type: "DELETE_TRANSACTION", payload: tx.id });
    addToast(`"${tx.description}" deleted successfully.`, "success");

    try {
      const { mockApi } = await import("@/services/mockApi");
      await mockApi.deleteTransaction(tx.id);
    } catch (err) {
      dispatch({ type: "DELETE_TRANSACTION_ROLLBACK", payload: tx });
      addToast(
        err instanceof Error ? err.message : "Delete failed — transaction restored.",
        "error"
      );
    }
  };

  return (
    <div className="space-y-6">
      <TransactionFilters onExportCSV={handleExportCSV} onExportJSON={handleExportJSON} />

      <div className="card-surface overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="No transactions found" description="Try adjusting your filters or search terms." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-alt)]">
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">Date</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">Description</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">Category</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em] text-right">Amount</th>
                  {isAdmin && <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em] text-center w-28">Actions</th>}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((t, i) => (
                    <motion.tr
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i * 0.03, 0.3) } }}
                      exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-alt)] transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm text-[var(--muted)] whitespace-nowrap">
                        {format(parseISO(t.date), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {t.description}
                        {t.tags && t.tags.length > 0 && (
                          <span className="block mt-1 text-[11px] text-[var(--muted)] font-normal">
                            #{t.tags.join(", ")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--muted)]">
                        <span className="bg-[var(--surface-alt)] px-3 py-1 rounded-[9999px] text-[11px] font-medium">
                          {t.category}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-medium text-right whitespace-nowrap tabular-nums ${
                          t.type === "income" ? "text-[#00a87e]" : ""
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              className="p-2 rounded-[9999px] text-[var(--muted)] hover:text-[#494fdf] hover:bg-[#494fdf]/8 transition-colors"
                              aria-label={`Edit ${t.description}`}
                              onClick={() => setEditTarget(t)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 rounded-[9999px] text-[var(--muted)] hover:text-[#e23b4a] hover:bg-[#e23b4a]/8 transition-colors"
                              aria-label={`Delete ${t.description}`}
                              onClick={() => setDeleteTarget(t)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Transaction"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.description}"? This action will be simulated and may be rolled back.`
            : ""
        }
        confirmText="Delete"
        cancelText="Keep"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDestructive
      />

      <EditTransactionModal
        isOpen={!!editTarget}
        transaction={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={(msg) => addToast(msg, "success")}
        onError={(msg) => addToast(msg, "error")}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
