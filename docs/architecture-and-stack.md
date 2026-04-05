# Component Architecture and Technology Stack

This document describes the technology choices, project structure, component organization, and architectural patterns used across the Zorvyn Finance Dashboard.

---

## Table of Contents

- [Technology Stack](#technology-stack)
- [Dependency Rationale](#dependency-rationale)
- [Directory Structure](#directory-structure)
- [Component Architecture](#component-architecture)
- [Page Composition](#page-composition)
- [Data Flow](#data-flow)
- [Mock API Layer](#mock-api-layer)
- [Custom Hooks](#custom-hooks)
- [Constants and Configuration](#constants-and-configuration)

---

## Technology Stack

| Layer | Technology | Version | Role |
|-------|-----------|---------|------|
| Framework | Next.js (App Router) | 16.2.2 | File-based routing, server-side rendering shell, layout composition |
| Language | TypeScript | 5.x | Static type safety across all source files |
| UI Library | React | 19.2.4 | Component model and rendering engine |
| Styling | Tailwind CSS | 4.x | Utility-first styling with CSS-first configuration via `@theme` |
| Charts | Recharts | 3.8.1 | Declarative SVG-based charting (area, bar, pie) |
| Animation | Framer Motion | 12.38.0 | Layout animations, page transitions, and micro-interactions |
| Icons | Lucide React | 1.7.0 | Tree-shakeable SVG icon library |
| Date Utilities | date-fns | 4.1.0 | Date formatting, parsing, and arithmetic |
| UUID | uuid | 13.0.0 | Unique identifier generation for transaction records |
| Class Utilities | clsx | 2.1.1 | Conditional class name composition |
| Class Merging | tailwind-merge | 3.5.0 | Conflict-free Tailwind class concatenation |

---

## Dependency Rationale

### Why Next.js App Router

The App Router provides file-system-based routing with built-in layout nesting. While Zorvyn is a fully client-side application, the App Router structure enables clean code splitting per route and offers a straightforward path to server-side rendering if a backend is introduced later. All page components are marked `"use client"` since they depend on browser-only APIs (localStorage, window, crypto).

### Why Tailwind CSS v4

Tailwind v4 introduces CSS-first configuration via `@theme` blocks, eliminating the `tailwind.config.js` file. Design tokens (colors, fonts, radii) are defined directly in `globals.css`, keeping the design system in a single source of truth. The `@custom-variant` directive enables class-based dark mode toggling.

### Why Recharts Over D3

Recharts provides a declarative, React-native API for common chart types. Since Zorvyn requires standard financial visualizations (area charts, bar charts, pie charts) rather than novel or highly customized graphics, Recharts reduces implementation complexity while still allowing custom tooltip components for design system compliance.

### Why Framer Motion

Framer Motion integrates naturally with React's component lifecycle. The `AnimatePresence` component handles enter/exit animations for conditionally rendered elements (modals, toasts, collapsible filters), which is difficult to achieve with CSS transitions alone.

### Why Not Redux or Zustand

The application's state surface is small enough that React's native `useReducer` and `useContext` provide all necessary capabilities without adding a dependency. The reducer pattern gives the same action-based state transitions that Redux provides, with the benefit of zero additional bundle weight.

---

## Directory Structure

The source code is organized into seven top-level directories under `src/`, each with a single responsibility:

### `src/app/` -- Page Routes

Each route maps to a single page component. The root `layout.tsx` wraps all pages with the `AppProvider` context, the `Sidebar`, `Navbar`, and `MobileNav` layout components.

| File | Route | Purpose |
|------|-------|---------|
| `page.tsx` | `/` | Dashboard overview with summary cards, charts, and recent transactions |
| `transactions/page.tsx` | `/transactions` | Full transaction list with filter bar |
| `insights/page.tsx` | `/insights` | Financial analytics with comparative charts |
| `admin/page.tsx` | `/admin` | Admin CRUD interface with add/edit/delete capabilities |
| `settings/page.tsx` | `/settings` | Preferences, data management, and export |
| `globals.css` | -- | Design system tokens, utility classes, and global overrides |

### `src/components/` -- UI Components

Components are organized by domain rather than by type. This keeps related files close together and makes feature-level reasoning straightforward.

#### `components/layout/`

Structural components that define the application shell:

| Component | Responsibility |
|-----------|---------------|
| `Sidebar.tsx` | Desktop sidebar navigation (hidden below `md` breakpoint). Contains primary nav links, admin section (conditionally rendered based on role), and a pinned Settings link. |
| `Navbar.tsx` | Top navigation bar with the Zorvyn logo, role badge, and theme toggle. Visible across all viewport sizes. |
| `MobileNav.tsx` | Bottom tab navigation for mobile viewports (visible below `md` breakpoint). Mirrors the sidebar navigation items. |

#### `components/common/`

Shared interactive controls used across multiple pages:

| Component | Responsibility |
|-----------|---------------|
| `RoleSwitcher.tsx` | Toggle between Viewer and Admin roles. Dispatches `SET_ROLE` to the global reducer. |
| `ThemeToggle.tsx` | Toggle between light and dark themes. Dispatches `SET_THEME` to the global reducer. |

#### `components/dashboard/`

Components specific to the main dashboard page:

| Component | Responsibility |
|-----------|---------------|
| `BalanceChart.tsx` | Recharts `AreaChart` that computes a running balance from transaction data and renders a 30-day trend line with gradient fill. |
| `CategoryChart.tsx` | Recharts `PieChart` configured as a donut chart. Aggregates transaction amounts by category using the fixed color palette from `chartColors.ts`. |
| `RecentTransactions.tsx` | Renders the five most recent transactions with category badges, formatted dates, and color-coded amounts. |

#### `components/transactions/`

Components for the transaction explorer and admin CRUD interface:

| Component | Responsibility |
|-----------|---------------|
| `TransactionsView.tsx` | The primary transaction table/list. Consumes the global state, applies all active filters via `useMemo`, handles sorting, and conditionally renders edit/delete controls based on role. Also implements CSV and JSON export logic. |
| `TransactionFilters.tsx` | The filter bar containing search input, type dropdown, category dropdown, advanced filter toggle (amount bounds, date range), and export buttons. Uses `AnimatePresence` for the collapsible advanced section. |
| `AddTransactionModal.tsx` | Form modal for creating new transactions. Implements client-side validation, optimistic dispatch, simulated API call, and rollback on failure. |
| `EditTransactionModal.tsx` | Form modal for modifying existing transactions. Pre-populates fields from the selected record, performs optimistic updates, and handles rollback. |

#### `components/ui/`

Primitive, reusable building blocks with no business logic:

| Component | Responsibility |
|-----------|---------------|
| `Toast.tsx` | Notification system with auto-dismiss. Exports both `Toast` (individual notification) and `ToastContainer` (positioned stack). Supports `success`, `error`, and `info` variants. |
| `ConfirmDialog.tsx` | Modal dialog for destructive action confirmation. Used before data reset and transaction deletion. |
| `EmptyState.tsx` | Fallback display when filters return no results. Shows a centered icon and descriptive message. |
| `SkeletonLoader.tsx` | Loading placeholder rendered during dynamic imports of chart components. Provides visual continuity during code splitting. |

### `src/context/` -- State Management

| File | Purpose |
|------|---------|
| `AppContext.tsx` | Creates the React Context, initializes state from localStorage, manages hydration seeding, and syncs state changes back to localStorage. |
| `reducer.ts` | Defines the `AppState` type, the `Action` discriminated union, `initialState`, `initialFilters`, and the `appReducer` function. |

### `src/data/` -- Data Layer

| File | Purpose |
|------|---------|
| `seedTransactions.ts` | Generates 56 realistic transactions spanning 4 months. Defines the `Transaction` type interface. Uses date-fns for date arithmetic and uuid for identifier generation. |

### `src/hooks/` -- Custom Hooks

| File | Purpose |
|------|---------|
| `useLocalStorage.ts` | Generic localStorage hook with SSR safety. Initializes with a fallback value during server rendering, then synchronizes from localStorage in a `useEffect` to avoid hydration mismatches. |

### `src/services/` -- Service Abstractions

| File | Purpose |
|------|---------|
| `mockApi.ts` | Simulated REST API with four endpoints (`getTransactions`, `addTransaction`, `updateTransaction`, `deleteTransaction`). Introduces 600ms latency and supports deterministic error injection via URL query parameter. |

### `src/constants/` -- Configuration Constants

| File | Purpose |
|------|---------|
| `animations.ts` | Centralized Framer Motion preset objects (`page`, `drawer`, `toast`, `row`, `collapse`). |
| `categories.ts` | Readonly tuple of 10 category names with a derived `Category` type. |
| `chartColors.ts` | Maps each `Category` to a fixed hex color for chart consistency. |

---

## Component Architecture

### Design Patterns

The codebase follows several structural patterns:

**Separation of data and presentation.** Page components (`app/*/page.tsx`) own data fetching, state composition, and business logic. Child components receive props or consume context and focus purely on rendering.

**Typed component interfaces.** All component props are defined using TypeScript `type` declarations. This replaces runtime `PropTypes` validation with compile-time checking and enables IDE autocompletion.

**Dynamic imports for heavy dependencies.** Chart components (`BalanceChart`, `CategoryChart`, `RecentTransactions`) are loaded via `next/dynamic` with `ssr: false` to prevent Recharts from executing during server-side rendering. Each dynamic import provides a `loading` fallback via `SkeletonLoader`.

**Centralized animation configuration.** Rather than scattering Framer Motion props across components, the `ANIM` constant provides reusable preset objects. Components apply these via spread syntax (`{...ANIM.page}`, `{...ANIM.row(i)}`).

---

## Data Flow

```
User Interaction
      |
      v
Component dispatches Action
      |
      v
appReducer produces new AppState
      |
      v
React re-renders affected components
      |
      v
useEffect syncs state to localStorage
```

For mutations (add, edit, delete):

```
User submits form
      |
      v
Optimistic dispatch (immediate UI update)
      |
      v
mockApi call (600ms simulated latency)
      |
      +---> Success: No further action needed
      |
      +---> Failure: Rollback dispatch reverts state
                      Toast notification informs user
```

---

## Mock API Layer

The `mockApi` service provides four asynchronous methods that mirror a standard REST contract:

| Method | Signature | Simulates |
|--------|-----------|-----------|
| `getTransactions` | `() => Promise<Transaction[]>` | `GET /api/transactions` |
| `addTransaction` | `(t: Omit<Transaction, "id">) => Promise<Transaction>` | `POST /api/transactions` |
| `updateTransaction` | `(t: Transaction) => Promise<Transaction>` | `PUT /api/transactions/:id` |
| `deleteTransaction` | `(id: string) => Promise<{id: string}>` | `DELETE /api/transactions/:id` |

Each method introduces a `600ms` delay to simulate network latency. When `?simulateErrors=true` is present in the URL, all methods throw deterministic errors, enabling controlled testing of the rollback mechanism.

---

## Custom Hooks

### `useLocalStorage<T>(key: string, initialValue: T)`

A generic hook for persisting state to `localStorage`:

- Returns `[storedValue, setValue]` with the same API as `useState`.
- Initializes with `initialValue` during server rendering to produce deterministic HTML.
- Reads from `localStorage` in a `useEffect` after mount, avoiding hydration mismatches.
- The setter function writes to both React state and `localStorage` simultaneously.
- All read/write operations are wrapped in try/catch blocks to handle storage quota errors and private browsing restrictions.

---

## Constants and Configuration

### Animation Presets (`animations.ts`)

Standardized motion configurations prevent inconsistent animation behavior:

- `ANIM.page`: Entry animation for page-level content (fade + 8px vertical slide, 250ms).
- `ANIM.row(i)`: Staggered fade-in for list items. Delay is capped at 500ms to prevent long waits on large lists.
- `ANIM.drawer`: Spring-based horizontal slide for side panels. Uses high damping (30) for a controlled, non-bouncy feel.
- `ANIM.toast`: Drop-in animation from above for notifications.
- `ANIM.collapse`: Height auto-animation for expandable filter sections.

### Categories (`categories.ts`)

The category list is defined as a `readonly` tuple (`as const`), producing a union type `Category` that is used for type checking across transaction creation, filtering, and chart rendering. The 10 categories are: Salary, Freelance, Food, Transport, Entertainment, Utilities, Healthcare, Shopping, Rent, and Investment.

### Chart Colors (`chartColors.ts`)

A `Record<Category, string>` mapping ensures every category renders with the same color regardless of which chart component displays it. Colors are selected to be distinguishable from each other while remaining harmonious within the broader design palette.
