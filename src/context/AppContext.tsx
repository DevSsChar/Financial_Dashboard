"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from "react";
import { AppState, Action, appReducer, initialState } from "./reducer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { generateSeedTransactions } from "@/data/seedTransactions";

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Get initial theme from localStorage synchronously to avoid flash
function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem("fd_theme");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed === "dark" || parsed === "light") return parsed;
    }
    // Fall back to system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch {
    // ignore
  }
  return "light";
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Use local storage for all persistent states
  const [storedTransactions, setStoredTransactions] = useLocalStorage("fd_transactions", initialState.transactions);
  const [storedRole, setStoredRole] = useLocalStorage("fd_role", initialState.role);
  const [storedFilters, setStoredFilters] = useLocalStorage("fd_filters", initialState.filters);

  // Get initial theme synchronously to prevent flash
  const initTheme = getInitialTheme();

  // Initialize reducer with stored values
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    transactions: storedTransactions,
    role: storedRole as "viewer" | "admin",
    filters: storedFilters,
    theme: initTheme,
  });

  // Apply dark class immediately on mount and whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Persist theme to localStorage
    try {
      window.localStorage.setItem("fd_theme", JSON.stringify(state.theme));
    } catch {
      // ignore
    }
  }, [state.theme]);

  // Hydration sync: on init, if transactions are empty, seed them.
  useEffect(() => {
    if (storedTransactions.length === 0) {
      const seed = generateSeedTransactions();
      dispatch({ type: "LOAD_TRANSACTIONS", payload: seed });
    }
  }, []);

  // Save changes back to localStorage
  useEffect(() => {
    setStoredTransactions(state.transactions);
  }, [state.transactions, setStoredTransactions]);

  useEffect(() => {
    setStoredRole(state.role);
  }, [state.role, setStoredRole]);

  useEffect(() => {
    setStoredFilters(state.filters);
  }, [state.filters, setStoredFilters]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

