"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmDialogProps) {
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
            onClick={onCancel}
          />

          {/* Dialog — Design.md: 20px radius, zero shadows, border-based depth */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 p-6 bg-[var(--surface)] rounded-[20px] border border-[var(--border)]"
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`p-4 rounded-full mb-5 ${
                  isDestructive ? "bg-[#e23b4a]/10" : "bg-[var(--surface-alt)]"
                }`}
              >
                <AlertCircle
                  className={`w-8 h-8 ${
                    isDestructive ? "text-[#e23b4a]" : "text-[var(--muted)]"
                  }`}
                />
              </div>

              <h2 className="heading-card text-xl mb-2">{title}</h2>
              <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
                {description}
              </p>

              {/* Buttons — Design.md: pill shape, generous padding */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={onCancel}
                  className="btn-pill btn-secondary flex-1 !py-3"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`btn-pill flex-1 !py-3 ${
                    isDestructive ? "btn-danger" : "btn-primary"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
