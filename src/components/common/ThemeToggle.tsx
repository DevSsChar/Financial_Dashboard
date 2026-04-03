"use client";

import { useAppContext } from "@/context/AppContext";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { state, dispatch } = useAppContext();
  const isDark = state.theme === "dark";

  const toggleTheme = () => {
    dispatch({ type: "SET_THEME", payload: isDark ? "light" : "dark" });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-[var(--surface-alt)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#494fdf]"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[var(--muted)]" />}
      </motion.div>
    </button>
  );
}
