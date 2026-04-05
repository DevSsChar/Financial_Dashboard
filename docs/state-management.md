# State Management

This document describes how the Zorvyn Finance Dashboard manages application state, including the context architecture, reducer logic, action catalog, persistence strategy, and the optimistic update lifecycle used for CRUD operations.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [State Shape](#state-shape)
- [Action Catalog](#action-catalog)
- [Reducer Implementation](#reducer-implementation)
- [Context Provider](#context-provider)
- [Persistence Layer](#persistence-layer)
- [Hydration Strategy](#hydration-strategy)
- [Optimistic Update Lifecycle](#optimistic-update-lifecycle)
- [Filter State Management](#filter-state-management)
- [Theme State Management](#theme-state-management)
- [State Flow Diagrams](#state-flow-diagrams)

---

## Architecture Overview

The application uses React's built-in `useReducer` combined with `useContext` to manage all global state. This approach was chosen deliberately over external libraries (Redux, Zustand, Jotai) for three reasons:

1. The state surface area is bounded and predictable. There are fewer than 15 distinct actions.
2. The reducer pattern provides the same guarantees as Redux (pure state transitions, action traceability) without additional dependencies.
3. The total state management code (context + reducer) is under 200 lines, making it easy to audit and modify.

The state management layer consists of two files:

- `src/context/reducer.ts` -- State type definitions, action types, initial state, and the reducer function.
- `src/context/AppContext.tsx` -- React Context creation, provider component, localStorage integration, and the `useAppContext` consumer hook.

---

## State Shape

The complete application state is defined by the `AppState` type:

```typescript
type AppState = {
  transactions: Transaction[];
  apiStatus: "idle" | "loading" | "success" | "error";
  apiError: string | null;
  role: "viewer" | "admin";
  filters: {
    search: string;
    type: "all" | "income" | "expense";
    category: string;
    dateFrom: string;
    dateTo: string;
    amountMin: number | "";
    amountMax: number | "";
    tags: string[];
    sortBy: "date" | "amount" | "category";
    sortDir: "asc" | "desc";
    groupBy: "none" | "month" | "category" | "type";
  };
  theme: "light" | "dark";
};
```

### Field Descriptions

| Field | Type | Purpose |
|-------|------|---------|
| `transactions` | `Transaction[]` | The central dataset consumed by all views, charts, and exports |
| `apiStatus` | `ApiStatus` | Tracks the current state of mock API interactions |
| `apiError` | `string or null` | Holds error messages from failed API calls |
| `role` | `"viewer" or "admin"` | Controls visibility of CRUD controls across the interface |
| `filters` | `object` | Active filter configuration applied to the transaction list |
| `theme` | `"light" or "dark"` | Current visual theme, reflected via the `.dark` class on `<html>` |

### Transaction Type

Each transaction record conforms to the following interface:

```typescript
type Transaction = {
  id: string;           // UUID v4 identifier
  date: string;         // ISO 8601 date string (YYYY-MM-DD)
  description: string;  // Human-readable label
  amount: number;       // Value in base currency units
  type: "income" | "expense";
  category: Category;   // One of 10 predefined categories
  tags?: string[];      // Optional metadata tags
};
```

---

## Action Catalog

The reducer handles 13 distinct action types, each defined as a member of a discriminated union:

### Data Actions

| Action | Payload | Effect |
|--------|---------|--------|
| `LOAD_TRANSACTIONS` | `Transaction[]` | Replaces the entire transaction array. Used during initial hydration from localStorage or seed data. |
| `ADD_TRANSACTION` | `Transaction` | Prepends a new transaction to the array. Used for optimistic insertion. |
| `ADD_TRANSACTION_ROLLBACK` | `string` (transaction ID) | Removes a transaction by ID. Used when the mock API rejects an addition. |
| `EDIT_TRANSACTION` | `Transaction` | Replaces a transaction by matching ID. Used for optimistic updates. |
| `EDIT_TRANSACTION_ROLLBACK` | `Transaction` (original) | Restores the original transaction data by matching ID. Used when the mock API rejects an edit. |
| `DELETE_TRANSACTION` | `string` (transaction ID) | Removes a transaction by ID. Used for optimistic deletion. |
| `DELETE_TRANSACTION_ROLLBACK` | `Transaction` (original) | Re-inserts a previously deleted transaction. Used when the mock API rejects a deletion. |

### UI State Actions

| Action | Payload | Effect |
|--------|---------|--------|
| `SET_ROLE` | `"viewer" or "admin"` | Changes the active role, triggering conditional rendering across the interface. |
| `SET_THEME` | `"light" or "dark"` | Changes the visual theme. |
| `SET_FILTER` | `Partial<AppState["filters"]>` | Merges partial filter updates into the current filter state. Supports updating any subset of filter fields in a single dispatch. |
| `RESET_FILTERS` | None | Restores all filter fields to their default values. |
| `SET_API_STATUS` | `ApiStatus` | Updates the API loading state indicator. |
| `SET_API_ERROR` | `string or null` | Sets or clears the API error message. |

### System Actions

| Action | Payload | Effect |
|--------|---------|--------|
| `RESET_ALL` | None | Restores the entire state to initial defaults, preserving only the current theme preference. Used by the Settings page reset function. |

---

## Reducer Implementation

The reducer is a pure function that returns a new state object for every action. No mutations occur on the existing state reference. Key implementation details:

**Immutable array operations.** Transaction additions use array spread (`[newItem, ...existing]`). Edits and rollbacks use `Array.map()` to replace matching records. Deletions use `Array.filter()` to exclude matching IDs.

**Partial filter merging.** The `SET_FILTER` action spreads the payload over the existing filter state, allowing callers to update a single field (such as the search query) without needing to pass the complete filter object.

**Theme preservation during reset.** The `RESET_ALL` action replaces the state with `initialState` but explicitly retains `state.theme`. This prevents the theme from flashing back to light mode when the user resets their transaction data.

---

## Context Provider

The `AppProvider` component initializes the reducer, connects it to localStorage, and manages the hydration lifecycle.

### Initialization Sequence

1. Three `useLocalStorage` hooks read stored values for transactions, role, and filters.
2. The `getInitialTheme()` function reads the theme synchronously from localStorage (bypassing the hook to prevent flash).
3. `useReducer` is initialized with a composite initial state built from stored values plus the synchronous theme.
4. A mount-time `useEffect` checks if stored transactions are empty and, if so, generates seed data via `generateSeedTransactions()`.

### Synchronization

Three separate `useEffect` hooks monitor changes to `state.transactions`, `state.role`, and `state.filters`, writing updated values to localStorage whenever they change. This ensures all user modifications survive page refreshes.

A fourth `useEffect` monitors `state.theme` and performs two operations:
- Toggles the `.dark` class on `document.documentElement`.
- Persists the theme value to localStorage.

### Consumer Hook

The `useAppContext()` hook provides type-safe access to the global state:

```typescript
function useAppContext(): {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}
```

If called outside of an `AppProvider`, it throws a descriptive error rather than returning `undefined`.

---

## Persistence Layer

The application persists four state slices to localStorage under the following keys:

| Key | Contents | Hook |
|-----|----------|------|
| `fd_transactions` | `Transaction[]` | `useLocalStorage` |
| `fd_role` | `"viewer" or "admin"` | `useLocalStorage` |
| `fd_filters` | Filter state object | `useLocalStorage` |
| `fd_theme` | `"light" or "dark"` | Direct `localStorage` access |

Theme persistence uses direct `localStorage` access (rather than the hook) to enable synchronous initialization. The other slices use the `useLocalStorage` hook, which initializes with a server-safe fallback and reads from storage after mount.

---

## Hydration Strategy

Server-side rendering introduces a challenge: localStorage is not available on the server, but the server must produce HTML that matches the client's initial render. The application handles this through a two-phase approach:

**Phase 1 (Server Render):** The `useLocalStorage` hook returns the provided `initialValue` during rendering. This produces a deterministic HTML output regardless of what the client has stored.

**Phase 2 (Client Mount):** A `useEffect` in `useLocalStorage` reads the actual stored value and updates the React state. If the stored value differs from the initial value, React reconciles the difference during the first client render cycle.

**Theme Exception:** Theme is read synchronously via `getInitialTheme()` to prevent a flash of the wrong theme. This function checks `typeof window` before accessing localStorage, returning `"light"` during server rendering. The resulting mismatch is minor (a class attribute on `<html>`) and does not cause visible layout shifts.

---

## Optimistic Update Lifecycle

CRUD operations follow a three-step lifecycle to provide instant feedback while maintaining data integrity:

### Step 1: Optimistic Dispatch

The component constructs a complete `Transaction` object (including a locally generated UUID) and dispatches it to the reducer immediately. The UI updates in the same render cycle.

### Step 2: API Verification

The component calls the corresponding `mockApi` method (which introduces 600ms of simulated latency). During this period, the user sees the updated UI as if the operation succeeded.

### Step 3a: Success

If the mock API resolves successfully, no further action is needed. The optimistic state is already correct.

### Step 3b: Failure and Rollback

If the mock API throws an error:

1. A rollback action is dispatched with the appropriate payload:
   - **Add rollback:** Dispatches `ADD_TRANSACTION_ROLLBACK` with the transaction ID to remove it.
   - **Edit rollback:** Dispatches `EDIT_TRANSACTION_ROLLBACK` with the original (pre-edit) transaction to restore it.
   - **Delete rollback:** Dispatches `DELETE_TRANSACTION_ROLLBACK` with the original transaction to re-insert it.
2. A toast notification informs the user that the operation failed.
3. The UI reverts to its pre-operation state.

### Error Simulation

To test rollback behavior, append `?simulateErrors=true` to any URL. This causes all mock API methods to throw errors deterministically, allowing controlled verification of the rollback mechanism without code changes.

---

## Filter State Management

Filter state is managed as a nested object within `AppState`. The `SET_FILTER` action accepts a `Partial<AppState["filters"]>` payload, enabling granular updates:

```typescript
// Update only the search field
dispatch({ type: "SET_FILTER", payload: { search: "groceries" } });

// Update multiple fields simultaneously
dispatch({
  type: "SET_FILTER",
  payload: { type: "expense", category: "Food" },
});
```

Filter application happens in the consuming component (`TransactionsView.tsx`) via a `useMemo` hook that processes the transaction array through each active filter sequentially. This keeps the reducer free of filtering logic and allows different views to apply different filter combinations from the same state.

---

## Theme State Management

Theme switching follows a specific sequence to prevent visual artifacts:

1. User triggers `SET_THEME` action.
2. Reducer produces new state with updated `theme` field.
3. `useEffect` in `AppProvider` detects the change and:
   a. Adds or removes the `.dark` class on `document.documentElement`.
   b. Writes the new value to `localStorage` under `fd_theme`.
4. CSS custom properties in `globals.css` respond to the `.dark` class, updating all color tokens.
5. Tailwind's `dark:` variant utilities activate or deactivate.

The class toggle and localStorage write happen in the same effect callback, ensuring they remain synchronized.

---

## State Flow Diagrams

### Read Path

```
Component renders
      |
      v
useAppContext() returns current state
      |
      v
Component selects relevant slice (state.transactions, state.filters, etc.)
      |
      v
useMemo applies derived computations (filtering, aggregation)
      |
      v
JSX renders with computed data
```

### Write Path

```
User interaction (click, form submit, toggle)
      |
      v
Component calls dispatch({ type, payload })
      |
      v
appReducer computes new state (pure function)
      |
      v
React triggers re-render of all consumers
      |
      v
useEffect persists changed slices to localStorage
```

### CRUD Write Path (with optimistic update)

```
User submits mutation
      |
      +---> dispatch optimistic action (immediate UI update)
      |
      +---> await mockApi call (600ms delay)
              |
              +---> Success: done
              |
              +---> Error: dispatch rollback action
                           display error toast
```
