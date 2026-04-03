# PRD: Finance Dashboard UI

## Introduction

A client-side, single-page finance dashboard that lets users track personal financial activity through summary cards, charts, a transaction explorer, and auto-generated insights. The app simulates two roles — **Viewer** and **Admin** — on the frontend with no backend required. All data flows through a **mock API layer** (simulated latency + loading states) rather than being imported directly, making the codebase API-ready. State persists across page refreshes via **localStorage**. The interface supports **dark mode**, smooth **animations and transitions** throughout, **advanced filtering and grouping** in the transactions view, and **CSV + JSON export** of transaction data.

---

## Goals

- Give users a clear, scannable overview of their financial health (balance, income, expenses)
- Let users explore, filter, sort, group, and search transactions intuitively
- Visualize time-based trends and categorical spending breakdowns
- Surface automatic insights from the data (top category, monthly delta, savings rate, etc.)
- Simulate role-based UI differences (Viewer vs Admin) via a frontend dropdown
- Handle all empty, loading, and error states gracefully with useful fallback UI
- Persist all state (transactions, role, filters, theme) across page refreshes via localStorage
- Simulate async data fetching through a mock API layer with realistic loading/error states
- Deliver smooth, purposeful animations that enhance — not distract from — usability
- Support CSV and JSON export of filtered transaction data
- Be fully responsive across mobile, tablet, and desktop
- Support dark mode with system preference detection

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | File-based routing, built-in layout system, `next/font` for Inter, production-ready DX |
| Language | TypeScript | Type safety across state, API, and components |
| Styling | Tailwind CSS | Utility-first, dark mode via `class` strategy |
| Charts | Recharts | Composable, responsive, works well with React |
| Animations | Framer Motion | Declarative, performant layout + transition animations |
| State | React Context + useReducer | Sufficient for this scope; no external lib needed |
| Mock API | Custom `mockApi.ts` with `setTimeout` | Simulates real async fetch patterns |
| Persistence | localStorage (custom `useLocalStorage` hook) | Simple, reliable, no dependencies |
| Date utils | date-fns | Lightweight date formatting + grouping |
| IDs | uuid | Collision-free transaction IDs |
| Linting | ESLint + Prettier | Consistent code style |

**Next.js features used:** App Router, file-based routing, `app/layout.tsx` for shared layout, `next/font` for Inter, `next/navigation` for `usePathname`. Server Components, SSR, API routes, and Server Actions are **not used** — all pages are client-side via `"use client"`.


---

## Mock Data Specification

Seed **40–50 transactions** covering at least **4 months** of history, ensuring enough data for all charts and insights to render meaningfully.

```ts
type Transaction = {
  id: string;               // uuid v4
  date: string;             // ISO 8601 "YYYY-MM-DD"
  description: string;      // e.g. "Netflix Subscription"
  amount: number;           // always positive; type field determines sign in UI
  type: "income" | "expense";
  category: string;         // must be one of the 10 predefined categories
  tags?: string[];          // optional: ["essential", "recurring", "one-time"]
};
```

**Predefined categories (fixed list):**
`Salary`, `Freelance`, `Food`, `Transport`, `Entertainment`, `Utilities`, `Healthcare`, `Shopping`, `Rent`, `Investment`

**Seed data rules:**
- At least 2 income categories (Salary + Freelance) must appear
- All 10 categories should appear at least once across the 4 months
- Amounts should vary realistically (e.g. Rent ₹15,000, Food ₹3,000–8,000, Netflix ₹199)
- Include at least 3 months where both income and expense data exist (for monthly comparison insight)

---

## Application State Shape

```ts
type ApiStatus = "idle" | "loading" | "success" | "error";

type AppState = {
  transactions: Transaction[];
  apiStatus: ApiStatus;          // tracks mock API request lifecycle
  apiError: string | null;       // error message if apiStatus === "error"
  role: "viewer" | "admin";
  filters: {
    search: string;
    type: "all" | "income" | "expense";
    category: string;            // "" = all
    dateFrom: string;            // ISO date or ""
    dateTo: string;              // ISO date or ""
    amountMin: number | "";      // advanced filter
    amountMax: number | "";      // advanced filter
    tags: string[];              // advanced filter: multi-select tags
    sortBy: "date" | "amount" | "category";
    sortDir: "asc" | "desc";
    groupBy: "none" | "month" | "category" | "type"; // grouping
  };
  theme: "light" | "dark";
};
```

---

## Mock API Layer

All transaction reads and writes go through `src/services/mockApi.ts`. This keeps component code API-agnostic — swapping the mock for a real REST API later requires only changing this file.

```ts
// src/services/mockApi.ts

const SIMULATED_DELAY_MS = 600;

export const mockApi = {
  getTransactions: (): Promise<Transaction[]> => { ... },
  addTransaction: (t: Omit<Transaction, "id">): Promise<Transaction> => { ... },
  updateTransaction: (t: Transaction): Promise<Transaction> => { ... },
  deleteTransaction: (id: string): Promise<{ id: string }> => { ... },
};
```

- Each method resolves after `SIMULATED_DELAY_MS` using `setTimeout` wrapped in a `Promise`
- A `simulateError` flag (URL param `?simulateErrors=true`) makes methods randomly reject 20% of the time so error states are testable
- `useApi` custom hook wraps calls with `dispatch({ type: "SET_API_STATUS", payload: "loading" })` before and `"success"` or `"error"` after
- localStorage acts as the in-memory "database" the mock API reads from and writes to

---

## User Stories

### US-001: Summary Cards
**Description:** As a user, I want to see my total balance, total income, and total expenses at a glance so I can quickly assess my financial health.

**Acceptance Criteria:**
- [ ] Three cards rendered: Total Balance, Total Income, Total Expenses
- [ ] Balance = Σ income − Σ expenses across all transactions
- [ ] Each card: label, formatted currency value, colored icon, subtle trend indicator (↑↓ vs last month)
- [ ] Income card = green accent, Expenses = red, Balance = indigo/purple
- [ ] Cards show a skeleton loader while `apiStatus === "loading"`
- [ ] Cards recalculate immediately on add/edit/delete (optimistic update)
- [ ] Animate value changes with a count-up effect (Framer Motion or `requestAnimationFrame` counter)
- [ ] Verify in browser

---

### US-002: Balance Trend Chart (Time-based Visualization)
**Description:** As a user, I want to see how my balance has changed month over month so I can identify trends.

**Acceptance Criteria:**
- [ ] Area chart (Recharts `AreaChart`) with cumulative balance per month on y-axis, month labels on x-axis
- [ ] Chart fills container width via `ResponsiveContainer`
- [ ] Custom tooltip: month label + balance value formatted as currency
- [ ] Gradient fill under the line (top = brand color, bottom = transparent)
- [ ] Chart animates in on mount (`isAnimationActive` + `animationDuration={800}`)
- [ ] If < 2 data points, render `<EmptyState>` with message "Add more transactions to see your trend"
- [ ] Verify in browser

---

### US-003: Spending Breakdown Chart (Categorical Visualization)
**Description:** As a user, I want to see my expense distribution across categories so I can spot where my money goes.

**Acceptance Criteria:**
- [ ] Donut chart (Recharts `PieChart` with `innerRadius`) showing expense totals per category
- [ ] Each slice: unique color from a fixed 10-color palette, legend entries below chart
- [ ] Custom tooltip: category + amount + % of total expenses
- [ ] Center of donut shows total expense amount as a label
- [ ] Chart animates in on mount
- [ ] Only expense-type transactions included
- [ ] If no expenses exist, render `<EmptyState>`
- [ ] Verify in browser

---

### US-004: Transactions List — Display
**Description:** As a user, I want to see a clean, readable list of all transactions so I can review my history.

**Acceptance Criteria:**
- [ ] Table (desktop) / card list (mobile) showing: Date, Description, Category badge, Amount, Type badge
- [ ] Income amounts = green with + prefix, expense = red with − prefix
- [ ] Date formatted as `DD MMM YYYY`
- [ ] Paginated: 10 rows per page, prev/next buttons, page indicator ("Page 2 of 5")
- [ ] Default sort: newest date first
- [ ] Row hover state with subtle background highlight
- [ ] Skeleton rows (5) shown while `apiStatus === "loading"`
- [ ] Rows animate in with staggered fade-in (Framer Motion, capped at 10 rows)
- [ ] Verify in browser

---

### US-005: Transactions — Search & Basic Filters
**Description:** As a user, I want to search and filter my transactions to find what I need quickly.

**Acceptance Criteria:**
- [ ] Search input: filters by description (case-insensitive, debounced 300ms)
- [ ] Type filter dropdown: All | Income | Expense
- [ ] Category filter dropdown: All | [all 10 predefined categories]
- [ ] Date range: From and To date inputs (both optional, inclusive)
- [ ] All active filters compose with AND logic
- [ ] "Clear All Filters" button resets every filter field to default
- [ ] Active filter count badge on the filter panel toggle (e.g. "Filters · 3")
- [ ] "No results" empty state with "Clear Filters" shortcut when filtered list is empty
- [ ] Filter state persists in localStorage
- [ ] Verify in browser

---

### US-006: Transactions — Advanced Filters
**Description:** As a user, I want to filter by amount range and tags for more precise analysis.

**Acceptance Criteria:**
- [ ] Amount range: Min Amount and Max Amount number inputs (both optional)
- [ ] Min only = ≥ Min; Max only = ≤ Max; both = inclusive range
- [ ] Tags multi-select: chips for `essential`, `recurring`, `one-time` — selecting multiple = OR logic (show transactions matching any selected tag)
- [ ] Advanced filters grouped under a collapsible "Advanced" panel (collapsed by default)
- [ ] Panel open/close animates smoothly (Framer Motion `AnimatePresence` height expand)
- [ ] Advanced filter state persists in localStorage
- [ ] Active advanced filter count included in the total badge from US-005
- [ ] Verify in browser

---

### US-007: Transactions — Sort
**Description:** As a user, I want to sort the transaction list by different columns to find what I need.

**Acceptance Criteria:**
- [ ] Sortable columns: Date, Amount, Category
- [ ] Click column header to sort ascending; click again for descending; third click resets to default (date desc)
- [ ] Active sort column shows ↑ or ↓ icon; inactive columns show neutral icon
- [ ] Sort composes on top of all active filters
- [ ] Sort state persists in localStorage
- [ ] Verify in browser

---

### US-008: Transactions — Group By
**Description:** As a user, I want to group transactions by month, category, or type to see structured summaries.

**Acceptance Criteria:**
- [ ] "Group by" segmented control or dropdown: None | Month | Category | Type
- [ ] When grouped: transactions rendered under collapsible group headers with label + item count + subtotal
- [ ] Groups sorted logically: Month = newest first, Category = alphabetical, Type = income first
- [ ] Each group header: label + item count + subtotal formatted as currency
- [ ] Groups can be individually collapsed/expanded (Framer Motion `AnimatePresence` for row collapse)
- [ ] "Group by: None" = standard flat list (default)
- [ ] Grouping state persists in localStorage
- [ ] Verify in browser

---

### US-009: Role Switcher
**Description:** As a demo evaluator, I want to switch between Viewer and Admin roles to see how UI behavior changes.

**Acceptance Criteria:**
- [ ] Role selector (dropdown or segmented toggle) in the navbar, clearly labeled
- [ ] Switching role triggers an animated banner toast: "Switched to Admin mode" / "Switched to Viewer mode" (auto-dismisses after 2.5s)
- [ ] Role persists in localStorage
- [ ] In Viewer mode: Add/Edit/Delete buttons absent; Export button hidden
- [ ] In Admin mode: all CRUD + Export controls visible and functional
- [ ] Role switch does not reset any other state
- [ ] Verify in browser

---

### US-010: Add Transaction (Admin Only)
**Description:** As an Admin, I want to add a transaction through a form so the dashboard stays up to date.

**Acceptance Criteria:**
- [ ] "Add Transaction" button visible only in Admin role, in Transactions page header
- [ ] Clicking opens a right-side drawer or centered modal with slide/fade animation (Framer Motion)
- [ ] Form fields: Date (defaults to today), Description (max 80 chars), Amount (positive number), Type (segmented: Income / Expense), Category (select from 10 predefined), Tags (optional multi-select chips)
- [ ] All required fields validated inline on submit attempt
- [ ] On submit: calls `mockApi.addTransaction()`, button shows spinner during loading, closes on success
- [ ] On API error: inline error toast shown; form stays open with data intact
- [ ] New transaction appears immediately (optimistic update before API resolves)
- [ ] Persisted to localStorage via mock API
- [ ] Verify in browser

---

### US-011: Edit Transaction (Admin Only)
**Description:** As an Admin, I want to edit a transaction to fix mistakes.

**Acceptance Criteria:**
- [ ] Edit icon on each transaction row/card, visible only in Admin role
- [ ] Opens same drawer/modal as Add, pre-filled with existing data
- [ ] Calls `mockApi.updateTransaction()` on save
- [ ] Optimistic update: row reflects new data immediately; reverts on API error with error toast
- [ ] Verify in browser

---

### US-012: Delete Transaction (Admin Only)
**Description:** As an Admin, I want to delete a transaction to remove erroneous entries.

**Acceptance Criteria:**
- [ ] Delete icon on each row/card, visible only in Admin role
- [ ] Clicking shows a custom `<ConfirmDialog>` component (not `window.confirm`) with Framer Motion entrance animation
- [ ] On confirm: calls `mockApi.deleteTransaction()`, row animates out before DOM removal
- [ ] On cancel: dialog closes, no change
- [ ] On API error: error toast shown, row is not removed
- [ ] Verify in browser

---

### US-013: Insights Section
**Description:** As a user, I want automated insights from my data so I can understand my finances without manual analysis.

**Acceptance Criteria:**
- [ ] Dedicated Insights page/section with 4 insight cards
- [ ] Insight 1 — **Top Spending Category:** Category with highest total expense; shows name, total, % of all expenses
- [ ] Insight 2 — **Monthly Comparison:** Current month expenses vs previous month; shows absolute change + % change with colored indicator (red = spent more, green = spent less)
- [ ] Insight 3 — **Savings Rate:** `(totalIncome − totalExpenses) / totalIncome × 100`; colored health label: Excellent (>30%), Good (15–30%), Low (<15%), Negative (<0%)
- [ ] Insight 4 — **Largest Single Expense:** Highest-amount expense transaction; shows description, amount, date, category badge
- [ ] Each card: icon, title, primary value, secondary explanation sentence
- [ ] Cards animate in with staggered entrance (Framer Motion)
- [ ] "Not enough data" graceful state per card if insufficient history
- [ ] All insights computed from the full transaction dataset (not filtered view)
- [ ] Verify in browser

---

### US-014: Dark Mode
**Description:** As a user, I want to toggle dark mode so the dashboard is comfortable at night.

**Acceptance Criteria:**
- [ ] Sun/Moon icon toggle in navbar
- [ ] Dark mode applied via Tailwind `class` strategy; `<html>` gets `class="dark"` when active
- [ ] All components fully themed: backgrounds, text, cards, chart tooltips, modals, tables, badges, inputs
- [ ] Recharts chart colors adapted for dark mode (lighter strokes, darker backgrounds)
- [ ] On first load: detect `window.matchMedia("(prefers-color-scheme: dark)")` and apply
- [ ] Theme preference saved in localStorage; persists across refreshes
- [ ] Toggle transition: `transition-colors duration-300` on root elements
- [ ] Verify in browser in both light and dark modes

---

### US-015: localStorage Persistence
**Description:** As a user, I want my data and preferences to survive page refreshes.

**Acceptance Criteria:**
- [ ] Persisted keys: `fd_transactions`, `fd_role`, `fd_filters`, `fd_theme`
- [ ] Custom `useLocalStorage<T>(key, defaultValue)` hook: handles JSON serialization, parse errors fall back to default value
- [ ] Save triggered via `useEffect` on each relevant state slice change
- [ ] First load with empty `fd_transactions`: seed via mock API call with 40+ transactions
- [ ] First load with existing data: hydrate from storage; skip seeding
- [ ] "Reset to Demo Data" button (in settings or footer) clears all `fd_*` keys and re-seeds — useful for evaluators
- [ ] Verify in browser: add a transaction → refresh page → transaction still appears

---

### US-016: Mock API Integration
**Description:** As a developer/evaluator, I want to see realistic async loading patterns demonstrating API-readiness.

**Acceptance Criteria:**
- [ ] All 4 CRUD operations go through `mockApi.ts` with 400–800ms simulated delay
- [ ] `apiStatus` reflects: `idle` → `loading` → `success` / `error` per operation
- [ ] Loading state: skeleton loaders on table, spinners on submit buttons, disabled form fields during submission
- [ ] Error state: red toast notification; data remains unchanged (rollback applied)
- [ ] Success state: green toast auto-dismisses after 2.5s (Framer Motion `AnimatePresence` toast stack)
- [ ] `?simulateErrors=true` URL param causes 20% of API calls to reject for error state testing
- [ ] Verify in browser: observe loading skeletons on initial load and after CRUD operations

---

### US-017: Animations & Transitions
**Description:** As a user, I want smooth, purposeful animations so the interface feels polished.

**Acceptance Criteria:**
- [ ] **Page transitions:** Fade + slight Y-translate between Dashboard / Transactions / Insights pages (Framer Motion `AnimatePresence`)
- [ ] **Modal/Drawer:** Slides in from right (drawer) or scales from center (modal) on open; reverses on close
- [ ] **Toast notifications:** Slide in from top-right; fade out on auto-dismiss
- [ ] **Transaction rows:** Staggered fade-in on initial list render (0ms, 50ms, 100ms… per row, capped at 10)
- [ ] **Row removal:** Height collapse + opacity fade before DOM removal on delete
- [ ] **Summary cards:** Count-up animation on value change
- [ ] **Charts:** Recharts `isAnimationActive` enabled on mount
- [ ] **Advanced filter panel:** Smooth height expand/collapse (`AnimatePresence` + `height: auto`)
- [ ] **Group collapse:** Group body collapses smoothly when header clicked
- [ ] **Reduced motion:** All animations gated on `useReducedMotion()` — skip enter/exit animations if true
- [ ] Verify in browser: all listed animations visible; verify no janky layout shifts

---

### US-018: Export — CSV and JSON
**Description:** As an Admin, I want to export my transaction data in CSV or JSON format for use in other tools.

**Acceptance Criteria:**
- [ ] "Export" dropdown button (Admin only) in Transactions page header with two options: "Export as CSV" and "Export as JSON"
- [ ] Exports the **currently filtered and sorted** transaction list (not all data)
- [ ] **CSV:** Columns: `Date, Description, Category, Type, Amount, Tags`; dates as `YYYY-MM-DD`; values with commas wrapped in quotes; filename: `transactions_export_YYYY-MM-DD.csv`
- [ ] **JSON:** Pretty-printed array; filename: `transactions_export_YYYY-MM-DD.json`
- [ ] Both trigger browser download via `URL.createObjectURL(Blob)`
- [ ] If filtered list is empty: export button disabled with tooltip "No transactions to export"
- [ ] Successful export shows green toast: "Exported N transactions as CSV/JSON"
- [ ] Verify in browser: download files and confirm content matches visible filtered data

---

### US-019: Responsive Layout
**Description:** As a user on any device, I want the dashboard to work well on my screen size.

**Acceptance Criteria:**
- [ ] Mobile (< 640px): single column, stacked cards, transaction table becomes card list, sidebar = hamburger menu
- [ ] Tablet (640–1024px): 2-column card grid, charts stacked, sidebar icon-only collapsed
- [ ] Desktop (> 1024px): full sidebar with labels, 3-column card grid, charts side by side
- [ ] No horizontal overflow at any breakpoint
- [ ] Drawers/modals: full-screen on mobile, right-panel or centered on desktop
- [ ] Verify in browser at 375px, 768px, and 1280px via Chrome DevTools

---

## Functional Requirements

- **FR-1:** All CRUD operations must go through `mockApi.ts` — no direct state mutations from UI components
- **FR-2:** All shared state mutations go through `useReducer` dispatch — no ad-hoc `useState` for data read by multiple components
- **FR-3:** `useFilteredTransactions` hook derives filtered + sorted + grouped list from `state.transactions + state.filters` via `useMemo` — recalculates only on those dependencies
- **FR-4:** Charts use the **unfiltered** full transaction list; Transactions section table uses the filtered list
- **FR-5:** All monetary values formatted as `₹X,XX,XXX.XX` (Indian locale) everywhere — no mixing of formats
- **FR-6:** The 10 predefined categories declared once in `constants/categories.ts` and imported everywhere — never hardcoded per component
- **FR-7:** Role switch must not reset any other state (transactions, filters, theme unchanged)
- **FR-8:** localStorage save: separate `useEffect` per state slice; reads happen only at initial app load
- **FR-9:** First load with no `fd_transactions` key triggers `mockApi.getTransactions()` with seeded data; if key exists, hydrate without API call
- **FR-10:** `<EmptyState icon title message action?>` is the single reusable component for all no-data cases
- **FR-11:** `<SkeletonLoader rows count />` is the single reusable skeleton component used across table and cards
- **FR-12:** Optimistic updates: UI reflects changes immediately; on API failure, action rolled back and error toast shown
- **FR-13:** All animations gated on `useReducedMotion()` — if true, skip enter/exit animations, use instant transitions
- **FR-14:** Advanced filters (amount range, tags) compose with AND logic against basic filters; multiple tags within themselves use OR logic
- **FR-15:** Export must include exactly the filtered + sorted array currently rendered in the table — same reference
- **FR-16:** All user-facing error messages must be human-readable strings, not raw JS error object messages

---

## Non-Goals (Out of Scope)

- No real authentication, JWT, or session management — role is frontend simulation only
- No actual backend, REST API, or database
- No multi-currency support or conversion
- No recurring/scheduled transaction automation
- No user profile or account settings page
- No data import (CSV upload, bank statement parsing)
- No sub-categories or nested category hierarchy
- No push notifications or email alerts
- No drag-and-drop row reordering
- No undo/redo history beyond the optimistic-rollback pattern

---

## Component Architecture

```
├── app/                                    # Next.js App Router root
│   ├── layout.tsx                          # Root layout: AppProvider + Sidebar + Navbar + ToastContainer
│   ├── page.tsx                            # Redirects to /dashboard (redirect() from next/navigation)
│   ├── dashboard/
│   │   └── page.tsx                        # "use client" — Dashboard page
│   ├── transactions/
│   │   └── page.tsx                        # "use client" — Transactions page
│   └── insights/
│       └── page.tsx                        # "use client" — Insights page
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx                     # "use client" — active link via usePathname()
│   │   ├── MobileNav.tsx                   # "use client" — hamburger + bottom sheet
│   │   └── Navbar.tsx                      # "use client" — role switcher, dark mode toggle
│   ├── dashboard/
│   │   ├── SummaryCards.tsx                # "use client"
│   │   ├── BalanceTrendChart.tsx           # "use client" — Recharts (browser-only)
│   │   └── SpendingBreakdownChart.tsx      # "use client" — Recharts (browser-only)
│   ├── transactions/
│   │   ├── TransactionTable.tsx            # "use client"
│   │   ├── TransactionRow.tsx              # "use client"
│   │   ├── TransactionCard.tsx             # "use client"
│   │   ├── TransactionFilters.tsx          # "use client"
│   │   ├── TransactionGroupHeader.tsx      # "use client"
│   │   ├── TransactionModal.tsx            # "use client"
│   │   └── ExportMenu.tsx                  # "use client"
│   ├── insights/
│   │   └── InsightCards.tsx                # "use client"
│   └── shared/
│       ├── EmptyState.tsx
│       ├── SkeletonLoader.tsx
│       ├── ConfirmDialog.tsx               # "use client"
│       ├── Toast.tsx                       # "use client"
│       ├── ToastContainer.tsx              # "use client"
│       ├── Badge.tsx
│       └── ThemeToggle.tsx                 # "use client"
│
├── context/
│   ├── AppContext.tsx                      # "use client" — Context + useReducer + localStorage sync
│   └── reducer.ts                          # Pure reducer (no directive needed)
│
├── services/
│   └── mockApi.ts                          # Simulated async CRUD with delay + error toggle
│
├── data/
│   └── seedTransactions.ts                 # 40+ seeded transactions
│
├── hooks/
│   ├── useApi.ts                           # Wraps mockApi calls with loading/error dispatch
│   ├── useFilteredTransactions.ts          # Memoized filter + sort + group derivation
│   ├── useInsights.ts                      # Derives 4 insight values from full dataset
│   ├── useLocalStorage.ts                  # Generic typed localStorage hook
│   └── useToast.ts                         # Toast queue management
│
├── constants/
│   ├── categories.ts                       # 10 predefined categories — single source of truth
│   ├── chartColors.ts                      # Fixed 10-color palette keyed by category
│   └── animations.ts                       # ANIM token object (page, drawer, toast, row, collapse)
│
└── utils/
    ├── formatCurrency.ts                   # ₹ with Indian locale
    ├── formatDate.ts                       # "DD MMM YYYY"
    ├── groupTransactions.ts                # Groups array → { key, label, items, subtotal }[]
    ├── exportCsv.ts                        # Blob + download trigger for CSV
    └── exportJson.ts                       # Blob + download trigger for JSON
```

**Key Next.js-specific notes:**
- `app/layout.tsx` is a Server Component but wraps `<AppProvider>` (a Client Component) — this is the standard Next.js pattern for injecting client context at the root
- All components using hooks, browser APIs, Framer Motion, or Recharts must have `"use client"` at the top
- Active nav link highlighting uses `usePathname()` from `next/navigation` instead of React Router's `useLocation`
- Inter font loaded via `next/font/google` in `layout.tsx` — no external `<link>` tag needed
- Dark mode class toggled on `<html>` element via `document.documentElement.classList` since Next.js App Router manages the `<html>` tag in `layout.tsx`
- Page transitions with Framer Motion `AnimatePresence` must be handled in a `"use client"` wrapper component that wraps `{children}` inside `layout.tsx`, since the layout itself can be a Server Component

---

## Animation Token Reference

Define once in `constants/animations.ts` and import everywhere:

```ts
export const ANIM = {
  page: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
  },
  drawer: {
    initial: { x: "100%" },
    animate: { x: 0, transition: { type: "spring", damping: 30, stiffness: 300 } },
    exit:    { x: "100%", transition: { duration: 0.2 } },
  },
  toast: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit:    { opacity: 0, y: -20 },
  },
  row: (i: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: Math.min(i * 0.05, 0.5) } },
  }),
  collapse: {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit:    { height: 0, opacity: 0 },
  },
};
```

---

## State Management — Reducer Action Union

```ts
type Action =
  | { type: "SET_API_STATUS"; payload: ApiStatus }
  | { type: "SET_API_ERROR"; payload: string | null }
  | { type: "LOAD_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "ADD_TRANSACTION_ROLLBACK"; payload: string }        // id to remove
  | { type: "EDIT_TRANSACTION"; payload: Transaction }
  | { type: "EDIT_TRANSACTION_ROLLBACK"; payload: Transaction }  // restore original
  | { type: "DELETE_TRANSACTION"; payload: string }              // id
  | { type: "DELETE_TRANSACTION_ROLLBACK"; payload: Transaction }// re-insert
  | { type: "SET_ROLE"; payload: "viewer" | "admin" }
  | { type: "SET_FILTER"; payload: Partial<AppState["filters"]> }
  | { type: "RESET_FILTERS" }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "RESET_ALL" };
```

### Optimistic Update + Rollback Flow (Add example)

```
User submits Add Transaction form
  → Validation passes
  → dispatch ADD_TRANSACTION (optimistic — UI updates immediately)
  → mockApi.addTransaction() called concurrently
  → Button spinner shown; form fields disabled
  → [Success] → dispatch SET_API_STATUS "success" → success toast → drawer closes
  → [Error]   → dispatch ADD_TRANSACTION_ROLLBACK(id) → error toast → drawer stays open
```

---

## Design Considerations

**Color System**
- Primary / Balance: Indigo-600
- Income: Emerald-500
- Expense: Rose-500
- Backgrounds: Gray-50 (light) / Gray-950 (dark)
- Card surface: White / Gray-900
- Border: Gray-200 / Gray-800

**Typography** — Inter font
- Page title: 24px semibold
- Section heading: 18px semibold
- Card value: 28px bold
- Body / table: 14px regular
- Badges / labels: 12px medium

**Dark Mode**
- `tailwind.config.js`: `darkMode: "class"`
- Toggle sets/removes `"dark"` on `<html>` via `document.documentElement.classList` (since `<html>` lives in `app/layout.tsx`)
- Recharts tooltips: `contentStyle` and `itemStyle` derived from active theme

**Chart Colors** — 10 fixed colors in `chartColors.ts`, keyed by category name so slice colors are stable across data changes.

---

## Technical Considerations

- `useFilteredTransactions` runs inside `useMemo([transactions, filters])` — never call in render path directly
- `groupTransactions` returns `{ key, label, items: Transaction[], subtotal: number }[]`; when `groupBy === "none"` returns a single group wrapping all items — table maps over this uniformly
- CSV: headers + data rows joined with `\n`; values containing commas wrapped in `"..."`; Blob type `text/csv;charset=utf-8;`
- JSON: `JSON.stringify(transactions, null, 2)`; Blob type `application/json`
- Filename date: `format(new Date(), "yyyy-MM-dd")` from date-fns
- `simulateErrors`: `new URLSearchParams(window.location.search).get("simulateErrors") === "true"` — use `useSearchParams()` from `next/navigation` inside client components instead of `window.location.search` directly
- Framer Motion `AnimatePresence` must wrap conditional renders needing exit animations; child `key` prop must be stable
- `useReducedMotion()` from Framer Motion: if true, pass `duration: 0` or skip motion components entirely
- **Page transitions in Next.js App Router:** Create a `"use client"` `<PageTransitionWrapper>` component that wraps `{children}` with `AnimatePresence` + `motion.div`, then use it inside `app/layout.tsx` — this is the standard pattern since `layout.tsx` itself cannot use hooks
- **Recharts SSR:** Recharts is browser-only; wrap chart components with `dynamic(() => import(...), { ssr: false })` from `next/dynamic` to prevent hydration errors, or ensure they are only rendered inside `"use client"` components (which is sufficient in App Router)

---

## Success Metrics

- All 4 core sections + all 6 optional enhancements functional and polished
- Zero console errors on load, CRUD, role switch, theme toggle, and export
- Dashboard renders correctly at 375px, 768px, 1280px with no overflow
- Filters, sort, grouping all compose correctly with no stale state
- Adding 10 rapid transactions does not desync summary cards or charts
- Exported CSV and JSON files are valid and match exactly the filtered visible list
- All animations visible in normal mode; disabled when `prefers-reduced-motion: reduce`
- `?simulateErrors=true` triggers rollback with error toast and no data corruption
- Lighthouse Performance ≥ 85, Accessibility ≥ 90

---

## Open Questions

1. **Summary card scope:** Reflect full dataset or filtered subset? **Recommendation:** Full dataset always — they represent overall health, not a filtered view.
2. **Insights scope:** All-time data or current date filter? **Recommendation:** All-time — date-filtered insights would break the Monthly Comparison logic.
3. **Currency:** ₹ INR with Indian formatting (`1,23,456.78`) or $ USD? **Recommendation:** ₹ INR for an Indian-market submission.
4. **Pagination vs infinite scroll:** **Recommendation:** Page-based (10/page) — easier to test, works cleanly with grouping.
5. **Toast placement:** Top-right or bottom-center? **Recommendation:** Top-right on desktop, bottom-center on mobile via responsive class.
6. **Add/Edit: Drawer vs Modal:** **Recommendation:** Right-side drawer on desktop (keeps context visible), full-screen sheet on mobile.

---

## Milestones / Build Order

| # | Milestone | US / FR Covered |
|---|---|---|
| 1 | Project scaffold: `create-next-app` + TS + Tailwind + ESLint + folder structure + `next/font` Inter | — |
| 2 | Constants, seed data, `mockApi.ts`, Context + Reducer + all action types | FR-1, FR-2, US-016 |
| 3 | `useLocalStorage` hook, persistence wiring, "Reset to Demo Data" | US-015, FR-8, FR-9 |
| 4 | Layout: `app/layout.tsx` + Sidebar + Navbar + MobileNav + `usePathname` active links + dark mode toggle | US-014, US-019 |
| 5 | Animation tokens, `PageTransitionWrapper`, page transitions, toast system (Framer Motion) | US-017 |
| 6 | Dashboard: Summary cards (skeleton + count-up) + both charts (with `next/dynamic` SSR guard) | US-001, US-002, US-003 |
| 7 | Transactions: Table + Row/Card + pagination + skeleton rows | US-004 |
| 8 | Filters: search, type, category, date range + advanced (amount, tags) + group by + sort | US-005, US-006, US-007, US-008 |
| 9 | RBAC: Role switcher + Add/Edit drawer + Delete dialog + optimistic updates + rollback | US-009, US-010, US-011, US-012 |
| 10 | Insights: 4 insight cards with staggered animation | US-013 |
| 11 | Export: CSV + JSON with filtered data + disabled state + toast feedback | US-018 |
| 12 | Polish: empty states, reduced-motion gate, responsive QA, error simulation | FR-10–16, US-019 |
| 13 | README: setup instructions, architecture overview, feature walkthrough, screenshots | — |
