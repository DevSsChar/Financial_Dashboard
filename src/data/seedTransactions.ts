import { v4 as uuidv4 } from "uuid";
import { subDays, format } from "date-fns";
import { Category } from "@/constants/categories";

export type Transaction = {
  id: string; // uuid v4
  date: string; // ISO 8601 "YYYY-MM-DD"
  description: string;
  amount: number;
  type: "income" | "expense";
  category: Category;
  tags?: string[];
};

export const generateSeedTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();

  // Pattern data to generate 40-50 transactions over 4-6 months
  const pattern = [
    // Monthly recurring
    { desc: "Salary", amount: 150000, type: "income", category: "Salary", tag: "recurring", daysBack: 0 },
    { desc: "Freelance UI", amount: 45000, type: "income", category: "Freelance", tag: "one-time", daysBack: 5 },
    { desc: "Rent", amount: 35000, type: "expense", category: "Rent", tag: "essential", daysBack: 2 },
    { desc: "Electricity Bill", amount: 4500, type: "expense", category: "Utilities", tag: "essential", daysBack: 3 },
    { desc: "Internet Broadband", amount: 1500, type: "expense", category: "Utilities", tag: "recurring", daysBack: 4 },
    { desc: "Netflix Subscription", amount: 649, type: "expense", category: "Entertainment", tag: "recurring", daysBack: 5 },
    { desc: "Gym Membership", amount: 2000, type: "expense", category: "Healthcare", tag: "recurring", daysBack: 6 },
    { desc: "Mutual Fund SIP", amount: 20000, type: "expense", category: "Investment", tag: "recurring", daysBack: 10 },
    // Varying monthly
    { desc: "Grocery Store", amount: 8400, type: "expense", category: "Food", tag: "essential", daysBack: 1 },
    { desc: "Uber/Ola", amount: 800, type: "expense", category: "Transport", tag: "essential", daysBack: 8 },
    { desc: "Zomato/Swiggy", amount: 1200, type: "expense", category: "Food", tag: "one-time", daysBack: 12 },
    { desc: "Amazon Shopping", amount: 4500, type: "expense", category: "Shopping", tag: "one-time", daysBack: 15 },
    { desc: "Pharmacy", amount: 850, type: "expense", category: "Healthcare", tag: "essential", daysBack: 20 },
    { desc: "Weekend Diner", amount: 3500, type: "expense", category: "Entertainment", tag: "one-time", daysBack: 22 },
  ] as const;

  for (let month = 0; month < 4; month++) {
    const daysOffset = month * 30; // approx
    
    for (const p of pattern) {
      // Add a bit of randomness so numbers aren't exactly the same every month.
      const variance = p.type === "expense" && !p.tag.includes("recurring") && !p.tag.includes("essential") 
        ? Math.floor(Math.random() * 500) 
        : 0;

      // Ensure some income vs expense
      transactions.push({
        id: uuidv4(),
        date: format(subDays(now, daysOffset + p.daysBack + Math.floor(Math.random() * 3)), "yyyy-MM-dd"),
        description: p.desc,
        amount: p.amount + variance,
        type: p.type as "income" | "expense",
        category: p.category as Category,
        tags: [p.tag],
      });
    }
  }

  // Ensure descending date sorting
  return transactions.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
};
