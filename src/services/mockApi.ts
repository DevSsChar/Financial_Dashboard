import { Transaction } from "@/data/seedTransactions";

const SIMULATED_DELAY_MS = 600;

// Helper to determine if we should simulate an error (20% chance if ?simulateErrors=true)
const shouldThrowError = () => {
  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("simulateErrors") === "true") {
      return true; // 100% chance to simulate failure for testing
    }
  }
  return false;
};

// Helper to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  getTransactions: async (): Promise<Transaction[]> => {
    await delay(SIMULATED_DELAY_MS);
    if (shouldThrowError()) throw new Error("Failed to fetch transactions");
    
    // In a real app we'd fetch. For this mock, the initial seed happens in the provider,
    // so we just return empty array if asked to fetch without local storage context.
    return [];
  },

  addTransaction: async (t: Omit<Transaction, "id">): Promise<Transaction> => {
    await delay(SIMULATED_DELAY_MS);
    if (shouldThrowError()) throw new Error("Failed to add transaction. Please try again.");
    return { ...t, id: crypto.randomUUID() };
  },

  updateTransaction: async (t: Transaction): Promise<Transaction> => {
    await delay(SIMULATED_DELAY_MS);
    if (shouldThrowError()) throw new Error("Failed to update transaction.");
    return t;
  },

  deleteTransaction: async (id: string): Promise<{ id: string }> => {
    await delay(SIMULATED_DELAY_MS);
    if (shouldThrowError()) throw new Error("Failed to delete transaction.");
    return { id };
  },
};
