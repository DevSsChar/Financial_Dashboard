export const CATEGORIES = [
  "Salary",
  "Freelance",
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Rent",
  "Investment",
] as const;

export type Category = (typeof CATEGORIES)[number];
