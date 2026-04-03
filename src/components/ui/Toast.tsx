"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ANIM } from "@/constants/animations";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect } from "react";

export type ToastProps = {
  id: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onDismiss: (id: string) => void;
  duration?: number;
};

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-[#00a87e]" />,
  error: <XCircle className="w-5 h-5 text-[#e23b4a]" />,
  warning: <AlertCircle className="w-5 h-5 text-[#ec7e00]" />,
  info: <Info className="w-5 h-5 text-[#494fdf]" />,
};

export function Toast({ id, message, type = "info", onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onDismiss(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  return (
    <motion.div
      layout
      {...ANIM.toast}
      className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] shadow-xl rounded-xl p-4 min-w-[300px] pointer-events-auto"
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button 
        onClick={() => onDismiss(id)}
        className="p-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded-full hover:bg-[var(--surface-alt)]"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Simple Toast Container
export function ToastContainer({ toasts, onDismiss }: { toasts: Omit<ToastProps, "onDismiss">[], onDismiss: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
