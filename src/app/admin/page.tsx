"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ANIM } from "@/constants/animations";
import { useAppContext } from "@/context/AppContext";
import { TransactionsView } from "@/components/transactions/TransactionsView";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import { Toast, ToastContainer, ToastProps } from "@/components/ui/Toast";
import { AlertTriangle, ShieldX, Plus } from "lucide-react";

export default function AdminPage() {
  const { state } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [toasts, setToasts] = useState<Omit<ToastProps, "onDismiss">[]>([]);

  const addToast = useCallback((message: string, type: ToastProps["type"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (state.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center space-y-5">
        <div className="p-5 bg-[#e23b4a]/8 rounded-full">
          <ShieldX className="w-12 h-12 text-[#e23b4a]" />
        </div>
        <h1 className="heading-section text-[1.75rem]">Access Denied</h1>
        <p className="text-[var(--muted)] text-[15px] max-w-sm leading-relaxed">
          This page is restricted to administrators. Switch your role
          using the toggle in the navigation bar to access CRUD features.
        </p>
      </div>
    );
  }

  return (
    <motion.div {...ANIM.page} className="max-w-6xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="heading-section text-[2rem] text-[#e23b4a]">
              Admin Dashboard
            </h1>
            <p className="text-[var(--muted)] mt-2 text-[15px]">
              Full CRUD access. Add, edit, or delete transactions.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-pill btn-primary !py-3 !px-6 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-[#ec7e00]/8 border border-[#ec7e00]/15 rounded-[9999px] text-sm text-[#ec7e00]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="text-xs sm:text-sm">
            <strong>Tip:</strong> Add{" "}
            <code className="bg-[var(--surface-alt)] px-1.5 py-0.5 rounded-md text-xs font-mono">
              ?simulateErrors=true
            </code>{" "}
            to the URL for API failure simulation.
          </span>
        </div>
      </header>

      <TransactionsView />

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={(msg) => addToast(msg, "success")}
        onError={(msg) => addToast(msg, "error")}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </motion.div>
  );
}
