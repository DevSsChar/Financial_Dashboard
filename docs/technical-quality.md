# Technical Quality and Responsiveness

This document covers the engineering standards applied across the Zorvyn Finance Dashboard, including the responsive layout strategy, TypeScript practices, edge case handling, accessibility considerations, performance optimizations, and code quality conventions.

---

## Table of Contents

- [Responsive Layout Strategy](#responsive-layout-strategy)
- [Breakpoint System](#breakpoint-system)
- [TypeScript Practices](#typescript-practices)
- [Edge Case Handling](#edge-case-handling)
- [Accessibility Considerations](#accessibility-considerations)
- [Performance Optimizations](#performance-optimizations)
- [Code Quality Conventions](#code-quality-conventions)
- [Error Handling Patterns](#error-handling-patterns)
- [Testing the Application](#testing-the-application)

---

## Responsive Layout Strategy

The application follows a mobile-first methodology. Base styles target the smallest supported viewport (375px, the width of an iPhone SE), with complexity added at wider breakpoints.

### Layout Tiers

The interface presents three distinct layout configurations:

**Mobile (below 768px):**
- The sidebar is hidden. Navigation is handled by a fixed bottom tab bar (`MobileNav.tsx`).
- Summary cards stack vertically in a single column.
- The transaction table collapses non-essential columns (Actions, Type), showing only Date, Description, Category, and Amount.
- Chart containers fill the full viewport width.
- Filter controls stack vertically. The category and type dropdowns occupy the full width to prevent text truncation.

**Tablet (768px to 1023px):**
- The sidebar becomes visible on the left at a fixed 256px width. The bottom tab bar is hidden.
- Summary cards remain in a single column to prevent cramping in the reduced content area.
- Charts display at full content width.
- The filter bar wraps its controls with `flex-wrap` to accommodate the reduced horizontal space without truncating dropdown text.

**Desktop (1024px and above):**
- Summary cards expand to a three-column grid.
- The dashboard page uses `lg:grid-cols-3` to place the chart panel and spending breakdown side by side.
- The transaction filter bar displays all controls in a single horizontal row.
- The insights page renders two charts side by side in a `lg:grid-cols-2` grid.

### Key Layout Decisions

**Summary cards use `lg:grid-cols-3` rather than `md:grid-cols-3`.** The `md` breakpoint (768px) coincides with the sidebar becoming visible, which reduces the available content width to approximately 500px. Forcing three columns at that width results in cards that are too narrow to display formatted currency values without wrapping. Moving the column expansion to `lg` (1024px) ensures each card has adequate width.

**Filter dropdowns use `flex-1 min-w-0` instead of fixed widths.** Earlier iterations used `sm:w-[130px]` and `sm:w-[140px]` for the type and category selects. This caused category names to truncate on tablet viewports. Switching to flexible widths with `min-w-0` (to allow shrinking below content size) provides a more robust solution across all viewport widths.

**The filter bar uses `xl:flex-row` for its outer layout.** The search input and dropdown controls stack vertically until 1280px, where they align horizontally. This prevents cramping on tablet and small laptop screens.

---

## Breakpoint System

The application uses Tailwind's default breakpoint scale:

| Breakpoint | Min Width | Primary Layout Change |
|------------|-----------|----------------------|
| `sm` | 640px | Filter controls use row layout within their group |
| `md` | 768px | Sidebar appears, mobile nav hides |
| `lg` | 1024px | Summary cards go to 3 columns, charts go side by side |
| `xl` | 1280px | Filter bar uses single-row layout |

All breakpoints are applied via Tailwind's responsive prefix system (for example, `lg:grid-cols-3`). No custom media queries or JavaScript-based responsive logic is used.

---

## TypeScript Practices

### Strict Typing

The project uses TypeScript with strict mode enabled. Key practices include:

**Discriminated union for actions.** The `Action` type in `reducer.ts` is a union of 13 members, each with a unique `type` field and a type-specific `payload`. This eliminates the possibility of dispatching an action with the wrong payload shape:

```typescript
type Action =
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "ADD_TRANSACTION_ROLLBACK"; payload: string }
  | { type: "SET_FILTER"; payload: Partial<AppState["filters"]> }
  // ... 10 more action types
```

**Derived types from constants.** The `Category` type is derived from the `CATEGORIES` constant using `typeof CATEGORIES[number]`. This ensures the type and the runtime data stay synchronized without manual duplication.

**Readonly assertions.** The category list uses `as const` to produce a readonly tuple type, preventing accidental mutations and enabling precise type inference.

**Generic hooks.** The `useLocalStorage<T>` hook is fully generic, inferring its stored value type from the provided initial value. This eliminates the need for manual type annotations at call sites.

### Type-Safe Context

The `useAppContext()` hook throws an error if called outside of an `AppProvider`, rather than returning `undefined`. This transforms a silent runtime bug (accessing properties on `undefined`) into an explicit, early failure with a descriptive message.

---

## Edge Case Handling

### Empty States

When a filter combination returns zero results, the transaction view renders a dedicated `EmptyState` component with a placeholder icon and descriptive text rather than showing an empty table or blank area.

### Form Validation

The Add and Edit Transaction modals enforce the following validation rules before dispatch:

- Description must not be empty or whitespace-only.
- Amount must be a positive number.
- Category must be selected (no default "choose" option accepted).
- Date must be a valid, non-future date.

Validation errors are displayed inline below the affected field.

### Data Reset Safety

The Settings page data reset operates behind a `ConfirmDialog` component that requires explicit confirmation. The dialog uses the destructive variant styling (red accent) and describes the consequence of the action in plain language.

### Storage Errors

All localStorage operations are wrapped in try/catch blocks. If storage is unavailable (private browsing, quota exceeded), the application continues to function using in-memory state without persisting changes.

### Missing Seed Data

On first load (or after a data reset), the `AppProvider` detects an empty transaction array and generates seed data via `generateSeedTransactions()`. This ensures the dashboard is never blank on first visit.

---

## Accessibility Considerations

### Keyboard Navigation

- All interactive elements (buttons, links, inputs, selects) are reachable via Tab navigation.
- Buttons use `focus-visible` styling with a double-ring indicator for keyboard focus.
- Modal dialogs trap focus and can be dismissed with the Escape key.

### ARIA Attributes

- Toggle switches in the Settings page include `role="switch"` and `aria-checked` attributes.
- Notification toggles include `aria-label` for screen reader identification.
- The mobile navigation bar uses semantic `<nav>` elements.

### Color Contrast

- Primary text (`--foreground`) against the background meets WCAG AA contrast requirements in both themes.
- Semantic colors (success green, danger red) maintain sufficient contrast against their surrounding surfaces.
- Muted text (`--muted`) is used only for supplementary information, never for actionable content.

### Semantic HTML

- Page sections use `<header>`, `<nav>`, `<main>`, and `<aside>` elements.
- Headings follow a sequential hierarchy without skipping levels.
- Tables in the transaction view use proper `<thead>`, `<tbody>`, `<th>`, and `<td>` elements with scope attributes.

---

## Performance Optimizations

### Code Splitting

Chart components (`BalanceChart`, `CategoryChart`, `RecentTransactions`) are loaded via `next/dynamic` with `ssr: false`. This serves two purposes:

1. Recharts relies on browser APIs that are unavailable during server-side rendering.
2. Chart code is only loaded when the user navigates to a page that uses it, reducing the initial bundle size.

Each dynamic import provides a `loading` callback that renders a `SkeletonLoader`, maintaining visual layout stability while the chunk loads.

### Memoized Computations

Expensive data transformations are wrapped in `useMemo`:

- Transaction filtering in `TransactionsView.tsx` processes the full dataset through search, type, category, amount, and date filters on every render. Memoization ensures this computation only runs when the transaction array or filter state changes.
- Financial aggregations in `page.tsx` (dashboard) compute totals via `reduce`. Memoization prevents recalculation during unrelated re-renders (such as theme changes).
- Insight computations in `insights/page.tsx` aggregate monthly data and identify top categories. These are memoized against the transaction array.

### Callback Stability

Event handlers passed to child components (toast management in the admin page, localStorage setters in the context) are wrapped in `useCallback` to maintain referential stability and prevent unnecessary child re-renders.

### Animation Performance

Framer Motion animations use `opacity` and `transform` properties exclusively (no layout-triggering properties like `width`, `height` in pixel values, or `top`/`left`). The `height: "auto"` animation for collapsible sections is the one exception, used because CSS cannot transition to an unknown height value.

---

## Code Quality Conventions

### File Organization

- One component per file. Each file exports a single named component (or a default export for page components).
- Files are named using PascalCase matching the exported component name.
- Constants, types, and utilities are separated into dedicated directories rather than co-located with components.

### Naming Conventions

- Components: PascalCase (`TransactionFilters`, `BalanceChart`).
- Hooks: camelCase with `use` prefix (`useLocalStorage`, `useAppContext`).
- Constants: UPPER_CASE for atomic values (`SIMULATED_DELAY_MS`), PascalCase for compound objects (`ANIM`, `CATEGORIES`).
- CSS classes: kebab-case following Tailwind conventions (`card-surface`, `btn-pill`, `heading-card`).
- Action types: UPPER_SNAKE_CASE strings (`ADD_TRANSACTION`, `SET_FILTER`).

### Import Organization

Imports are ordered by convention:

1. React and framework imports.
2. Third-party library imports.
3. Internal aliases (`@/context`, `@/components`, `@/constants`).
4. Relative imports.

### No Inline Styles (Exception: Charts)

All styling uses Tailwind utility classes or the CSS design system classes defined in `globals.css`. The only exception is Recharts, which requires inline style objects for tooltip components because its rendering pipeline does not support className-based styling.

---

## Error Handling Patterns

### API Errors

Mock API errors are caught at the call site (within async event handlers in modal components). The error handling sequence:

1. Catch the thrown error.
2. Dispatch a rollback action to revert the optimistic state change.
3. Display a toast notification with the error message.

This pattern ensures no failed mutation silently corrupts the application state.

### Context Access Errors

The `useAppContext()` hook includes a guard clause:

```typescript
if (context === undefined) {
  throw new Error("useAppContext must be used within an AppProvider");
}
```

This produces a clear, actionable error message rather than the cryptic `TypeError: Cannot read properties of undefined` that would result from accessing `context.state` or `context.dispatch` when the provider is missing.

### Storage Errors

All localStorage read and write operations include try/catch blocks. Failures are logged to the console via `console.warn` but do not interrupt the application. The state continues to function in memory, and the user experience is unaffected.

---

## Testing the Application

### Manual Testing Scenarios

| Scenario | Steps | Expected Behavior |
|----------|-------|-------------------|
| Role switching | Settings page, toggle Admin/Viewer | Admin controls appear/disappear; CRUD buttons hidden in Viewer mode |
| Theme switching | Settings page or navbar toggle | All surfaces, text, borders, and charts update to the selected theme |
| Transaction creation | Admin page, click Add Transaction, fill form, submit | New record appears at the top of the list; charts update immediately |
| Transaction editing | Admin page, click edit icon on any row, modify fields, submit | Record updates in place; charts recalculate with updated values |
| Transaction deletion | Admin page, click delete icon, confirm in dialog | Record removed from list; charts update; deletion is reversible on API failure |
| Error simulation | Append `?simulateErrors=true` to URL, then perform any CRUD operation | Operation appears to succeed momentarily, then rolls back; error toast appears |
| Filter combinations | Apply search, type, category, amount, and date filters simultaneously | Table shows only matching records; empty state shown if no matches |
| Data export | Click CSV or JSON export in filter bar | Browser downloads a file containing the currently filtered dataset |
| Data reset | Settings page, click Reset All Data, confirm | All transactions cleared; page reloads with fresh seed data |
| Persistence | Make changes, refresh the page | Transactions, role, filters, and theme survive the reload |
| Empty state | Clear all transactions, then reset filters | Dashboard shows zero values; transaction view shows empty state component |
| Responsive layout | Resize browser from 375px to 1440px | Layout transitions smoothly between mobile, tablet, and desktop configurations |
