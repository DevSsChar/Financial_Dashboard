# Zorvyn Finance Dashboard

Zorvyn is a client-side finance dashboard built to demonstrate frontend engineering proficiency across interface design, component architecture, data handling, and user experience. The application runs entirely in the browser with no backend dependency, using mock data and simulated API interactions to replicate a production-grade financial tracking experience.

The project prioritizes visual polish, responsive layout engineering, and a maintainable codebase over feature volume. Every design decision, from the color system to the animation timing, follows a deliberate specification documented in the companion design guide.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Feature Overview](#feature-overview)
- [Project Structure](#project-structure)
- [Technical Documentation](#technical-documentation)
- [Scripts Reference](#scripts-reference)
- [Browser Compatibility](#browser-compatibility)

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9 or later

### Installation

```bash
git clone https://github.com/<your-username>/zorvyn.git
cd zorvyn
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Feature Overview

### Dashboard Overview

The main landing page presents three summary cards displaying Total Balance, Total Income, and Total Expenses. Each card includes a percentage trend indicator comparing against the prior period. Below the cards, an interactive area chart renders the balance trend over the last 30 days, and a donut chart breaks down spending by category. A recent transactions feed rounds out the overview.

### Transaction Explorer

The dedicated transactions page displays a sortable, searchable ledger of all financial records. Each entry shows the date, description, category badge, transaction type, and formatted amount. The filter bar supports:

- Full-text search across descriptions
- Type filtering (income, expense, or all)
- Category filtering across 10 predefined categories
- Advanced filters: minimum/maximum amount bounds and date range selection

### Role-Based Interface

The application simulates two user roles without backend authentication:

- **Viewer**: Read-only access to all dashboard data, charts, and transaction lists. No mutation controls are rendered.
- **Admin**: Full CRUD capabilities including the ability to add, edit, and delete transactions. The admin panel surfaces action buttons, edit icons, and the Add Transaction modal.

Role switching is available through the toggle in the Settings page and persists across sessions via localStorage.

### Insights Hub

The insights page aggregates financial data into analytical views:

- Top expense category identification with total spend
- Four-month income and expense totals
- An area chart comparing income versus expense trends over time
- A grouped bar chart visualizing monthly cash flow

### Settings and Preferences

The settings page provides controls for:

- Theme toggling between light and dark modes
- Role switching between Viewer and Admin
- Notification preferences (transaction alerts, weekly summary, budget warnings)
- Data statistics showing transaction counts by type and category
- Full dataset CSV export
- Complete data reset with confirmation dialog

### Data Export

CSV and JSON exports are available from two locations:

- **Transaction Filters**: Exports only the currently filtered dataset
- **Settings Page**: Exports the complete, unfiltered transaction dataset

### Error Simulation

Appending `?simulateErrors=true` to any URL activates deterministic API failure simulation across all mock endpoints. This allows verification of the optimistic update rollback mechanism without modifying source code.

---

## Project Structure

```
zorvyn/
  docs/                          # Technical documentation
    architecture-and-stack.md    # Technology stack and component architecture
    design.md                    # Design system specification
    state-management.md          # State management patterns
    technical-quality.md         # Code quality and responsiveness
  src/
    app/                         # Next.js App Router pages
      admin/page.tsx             # Admin CRUD interface
      insights/page.tsx          # Financial analytics and charts
      settings/page.tsx          # User preferences and data management
      transactions/page.tsx      # Transaction explorer
      page.tsx                   # Dashboard overview
      layout.tsx                 # Root layout with providers
      globals.css                # Design system tokens and utilities
    components/
      common/                    # Shared interactive elements
        RoleSwitcher.tsx         # Admin/Viewer role toggle
        ThemeToggle.tsx          # Light/dark mode switch
      dashboard/                 # Dashboard-specific components
        BalanceChart.tsx         # Area chart for balance trend
        CategoryChart.tsx        # Donut chart for spending breakdown
        RecentTransactions.tsx   # Latest transaction feed
      layout/                   # Structural layout components
        Navbar.tsx               # Top navigation bar
        Sidebar.tsx              # Desktop sidebar navigation
        MobileNav.tsx            # Bottom navigation for mobile
      transactions/             # Transaction domain components
        AddTransactionModal.tsx  # Modal for creating transactions
        EditTransactionModal.tsx # Modal for editing transactions
        TransactionFilters.tsx   # Filter bar with advanced options
        TransactionsView.tsx     # Transaction table and list view
      ui/                       # Primitive UI building blocks
        ConfirmDialog.tsx        # Destructive action confirmation
        EmptyState.tsx           # Zero-result fallback display
        SkeletonLoader.tsx       # Loading placeholder
        Toast.tsx                # Notification toast system
    constants/                  # Application-wide constants
      animations.ts             # Framer Motion preset configurations
      categories.ts             # Category definitions and types
      chartColors.ts            # Category-to-color mapping for charts
    context/                    # Global state management
      AppContext.tsx             # React Context provider
      reducer.ts                # Reducer, actions, and state types
    data/                       # Data layer
      seedTransactions.ts       # Transaction generator and type definitions
    hooks/                      # Custom React hooks
      useLocalStorage.ts        # SSR-safe localStorage persistence
    services/                   # External service abstractions
      mockApi.ts                # Simulated API with configurable failures
```

---

## Technical Documentation

Detailed documentation is organized by domain:

| Document | Description |
|----------|-------------|
| [Design System](./docs/design.md) | Color tokens, typography scale, shape language, motion specifications, and component styling conventions |
| [Architecture and Stack](./docs/architecture-and-stack.md) | Technology choices, directory organization, component patterns, and dependency rationale |
| [State Management](./docs/state-management.md) | Context and reducer architecture, action catalog, persistence strategy, and optimistic update lifecycle |
| [Technical Quality](./docs/technical-quality.md) | Responsiveness implementation, TypeScript discipline, edge case handling, accessibility, and performance considerations |

---

## Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the Next.js development server on port 3000 |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## Browser Compatibility

The application is tested and functional across:

- Chrome 120 and later
- Firefox 121 and later
- Safari 17 and later
- Edge 120 and later

The responsive layout is verified across viewport widths from 375px (mobile) through 768px (tablet) to 1440px and above (desktop).

---

## Technology Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.2 |
| Language | TypeScript | 5.x |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | 4.x |
| Charts | Recharts | 3.8.1 |
| Animation | Framer Motion | 12.38.0 |
| Icons | Lucide React | 1.7.0 |
| Date Utilities | date-fns | 4.1.0 |
| UUID Generation | uuid | 13.0.0 |
