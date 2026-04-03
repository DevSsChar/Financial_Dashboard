"use client";

import { useAppContext } from "@/context/AppContext";
import { Shield, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RoleSwitcher() {
  const { state, dispatch } = useAppContext();
  const isAdmin = state.role === "admin";

  const toggleRole = () => {
    dispatch({ type: "SET_ROLE", payload: isAdmin ? "viewer" : "admin" });
  };

  return (
    <button
      onClick={toggleRole}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-[9999px] transition-all duration-200 border ${
        isAdmin 
          ? "bg-[#e23b4a]/10 text-[#e23b4a] border-[#e23b4a]/30 hover:bg-[#e23b4a]/20" 
          : "bg-[var(--surface-alt)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/20"
      }`}
      aria-label={isAdmin ? "Switch to viewer mode" : "Switch to admin mode"}
    >
      {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
      {isAdmin ? "Admin" : "Viewer"}
    </button>
  );
}
