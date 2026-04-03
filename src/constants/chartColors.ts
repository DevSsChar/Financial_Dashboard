import { Category } from "./categories";

// Fixed 10-color palette mapping to categories
// Using colors somewhat inspired by the Stitch guidelines, or a generic pleasant palette for donut chart.
export const CHART_COLORS: Record<Category, string> = {
  Salary: "#00a87e", // Success Teal
  Freelance: "#007bc2", // Light Blue
  Food: "#ec7e00", // Warning Orange
  Transport: "#505a63", // Mid Slate
  Entertainment: "#494fdf", // Revolut Blue
  Utilities: "#b09000", // Yellow
  Healthcare: "#e61e49", // Deep Pink
  Shopping: "#4f55f1", // Action Blue
  Rent: "#e23b4a", // Danger Red
  Investment: "#936d62", // Brown
};
