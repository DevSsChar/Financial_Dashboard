"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { ANIM } from "@/constants/animations";
import { Toast, ToastContainer, ToastProps } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Sun,
  Moon,
  Shield,
  ShieldCheck,
  Trash2,
  RotateCcw,
  User,
  Palette,
  Database,
  Bell,
  ChevronRight,
  Lock,
  CreditCard,
  Globe,
  Download,
} from "lucide-react";
import { format } from "date-fns";

export default function SettingsPage() {
  const { state, dispatch } = useAppContext();
  const isDark = state.theme === "dark";
  const isAdmin = state.role === "admin";

  const [toasts, setToasts] = useState<Omit<ToastProps, "onDismiss">[]>([]);
  const [showReset, setShowReset] = useState(false);

  const addToast = (message: string, type: ToastProps["type"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const txCount = state.transactions.length;
  const stats = useMemo(() => {
    const inc = state.transactions.filter((t) => t.type === "income");
    const exp = state.transactions.filter((t) => t.type === "expense");
    const cats = new Set(state.transactions.map((t) => t.category));
    return { income: inc.length, expense: exp.length, categories: cats.size };
  }, [state.transactions]);

  const handleResetAll = () => {
    setShowReset(false);
    dispatch({ type: "RESET_ALL" });
    window.localStorage.removeItem("fd_transactions");
    window.localStorage.removeItem("fd_filters");
    addToast("All data has been reset. Reload to re-seed.", "success");
  };

  const handleExportCSV = () => {
    if (state.transactions.length === 0) {
      addToast("No data to export", "error");
      return;
    }
    const headers = ["ID", "Date", "Description", "Category", "Type", "Amount"];
    const rows = state.transactions.map((tx) => [
      tx.id,
      format(new Date(tx.date), "yyyy-MM-dd"),
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.category,
      tx.type,
      tx.amount.toString(),
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `zorvyn_full_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Exported all transactions to CSV", "success");
  };

  return (
    <motion.div {...ANIM.page} className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <header>
        <h1 className="heading-section text-[2rem]">Settings</h1>
        <p className="text-[var(--muted)] mt-2 text-[15px]">
          Manage your preferences, account, and application data.
        </p>
      </header>

      {/* ─── Profile Section ─── */}
      <motion.section {...ANIM.row(0)} className="card-surface p-6">
        <div className="flex items-center gap-4 mb-6">
          <User className="w-5 h-5 text-[var(--muted)]" />
          <h2 className="heading-card text-lg">Profile</h2>
        </div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-alt)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium truncate">Felix Zorvyn</h3>
            <p className="text-sm text-[var(--muted)] truncate">
              felix@zorvyn.finance
            </p>
          </div>
          <button className="btn-pill btn-secondary text-xs !py-2.5 !px-5">
            Edit Profile
          </button>
        </div>
      </motion.section>

      {/* ─── Appearance ─── */}
      <motion.section {...ANIM.row(1)} className="card-surface p-6">
        <div className="flex items-center gap-4 mb-6">
          <Palette className="w-5 h-5 text-[var(--muted)]" />
          <h2 className="heading-card text-lg">Appearance</h2>
        </div>

        {/* Theme Switcher */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Choose between light and dark mode
            </p>
          </div>
          <div className="flex items-center bg-[var(--surface-alt)] rounded-[9999px] p-1 gap-1">
            <button
              onClick={() =>
                dispatch({ type: "SET_THEME", payload: "light" })
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-[9999px] text-xs font-medium transition-all duration-200 ${
                !isDark
                  ? "bg-[var(--surface)] text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Light
            </button>
            <button
              onClick={() =>
                dispatch({ type: "SET_THEME", payload: "dark" })
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-[9999px] text-xs font-medium transition-all duration-200 ${
                isDark
                  ? "bg-[var(--surface)] text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Dark
            </button>
          </div>
        </div>

        <div className="border-t border-[var(--border)] my-2" />

        {/* Currency */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium">Currency</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Display currency for all amounts
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-[9999px] bg-[var(--surface-alt)] text-[var(--muted)]">
            <Globe className="w-3.5 h-3.5" />
            ₹ INR
          </div>
        </div>
      </motion.section>

      {/* ─── Access Control ─── */}
      <motion.section {...ANIM.row(2)} className="card-surface p-6">
        <div className="flex items-center gap-4 mb-6">
          <Lock className="w-5 h-5 text-[var(--muted)]" />
          <h2 className="heading-card text-lg">Access & Permissions</h2>
        </div>

        {/* Role Toggle */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium">
              Current Role
            </p>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {isAdmin
                ? "Full CRUD access to all transactions"
                : "Read-only view of transactions and data"}
            </p>
          </div>
          <button
            onClick={() =>
              dispatch({
                type: "SET_ROLE",
                payload: isAdmin ? "viewer" : "admin",
              })
            }
            className={`btn-pill text-xs !py-2.5 !px-5 ${
              isAdmin
                ? "!bg-[#e23b4a]/10 text-[#e23b4a] !border-[#e23b4a]/30"
                : "btn-outlined !border-[var(--border)]"
            }`}
          >
            {isAdmin ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            {isAdmin ? "Admin" : "Viewer"}
          </button>
        </div>

        <div className="border-t border-[var(--border)] my-2" />

        {/* Placeholder rows */}
        {[
          {
            label: "Two-Factor Authentication",
            desc: "Add an extra layer of security",
            icon: <Lock className="w-4 h-4" />,
          },
          {
            label: "Connected Accounts",
            desc: "Link your bank accounts and cards",
            icon: <CreditCard className="w-4 h-4" />,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-3 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[12px] bg-[var(--surface-alt)] text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors" />
          </div>
        ))}
      </motion.section>

      {/* ─── Notifications ─── */}
      <motion.section {...ANIM.row(3)} className="card-surface p-6">
        <div className="flex items-center gap-4 mb-6">
          <Bell className="w-5 h-5 text-[var(--muted)]" />
          <h2 className="heading-card text-lg">Notifications</h2>
        </div>
        {[
          { label: "Transaction alerts", desc: "Get notified for new transactions", defaultOn: true },
          { label: "Weekly summary", desc: "Receive a weekly spending report", defaultOn: false },
          { label: "Budget warnings", desc: "Alert when nearing budget limits", defaultOn: true },
        ].map((item) => (
          <NotifToggle key={item.label} {...item} onToggle={() => addToast(`"${item.label}" preference updated.`, "success")} />
        ))}
      </motion.section>

      {/* ─── Data Management ─── */}
      <motion.section {...ANIM.row(4)} className="card-surface p-6">
        <div className="flex items-center gap-4 mb-6">
          <Database className="w-5 h-5 text-[var(--muted)]" />
          <h2 className="heading-card text-lg">Data</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: txCount },
            { label: "Income", value: stats.income },
            { label: "Expenses", value: stats.expense },
            { label: "Categories", value: stats.categories },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-[12px] bg-[var(--surface-alt)] text-center"
            >
              <div className="text-xl font-medium tabular-nums">{s.value}</div>
              <div className="text-xs text-[var(--muted)] mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border)] pt-4 flex flex-wrap gap-3">
          <button
            onClick={handleExportCSV}
            className="btn-pill text-xs !py-2.5 !px-5 bg-[#00a87e]/10 text-[#00a87e] border border-[#00a87e]/20 hover:bg-[#00a87e]/20"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => setShowReset(true)}
            className="btn-pill btn-danger text-xs !py-2.5 !px-5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset All Data
          </button>
        </div>
      </motion.section>

      {/* ─── Footer Info ─── */}
      <motion.div {...ANIM.row(5)} className="text-center text-xs text-[var(--muted)] pb-8">
        <p>Zorvyn Finance v1.0.0 · Built with Next.js & Recharts</p>
        <p className="mt-1">
          Design system inspired by{" "}
          <span className="text-[var(--foreground)] font-medium">Revolut</span>
        </p>
      </motion.div>

      {/* Reset Dialog */}
      <ConfirmDialog
        isOpen={showReset}
        title="Reset All Data"
        description="This will permanently delete all transactions, filters, and preferences. You will start fresh after reloading."
        confirmText="Reset Everything"
        cancelText="Keep Data"
        onConfirm={handleResetAll}
        onCancel={() => setShowReset(false)}
        isDestructive
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </motion.div>
  );
}

/* ─── Notification Toggle Sub-Component ─── */
function NotifToggle({
  label,
  desc,
  defaultOn,
  onToggle,
}: {
  label: string;
  desc: string;
  defaultOn: boolean;
  onToggle: () => void;
}) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-[var(--muted)] mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => {
          setOn(!on);
          onToggle();
        }}
        className={`relative w-11 h-6 rounded-[9999px] transition-colors duration-200 ${
          on ? "bg-[#00a87e]" : "bg-[var(--border)]"
        }`}
        role="switch"
        aria-checked={on}
        aria-label={label}
      >
        <motion.div
          className="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white"
          animate={{ x: on ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
