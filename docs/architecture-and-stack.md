# Component Architecture and Technology Stack

Zorvyn is constructed using a modern, scalable frontend stack, taking advantage of recent framework advancements while maintaining tight control over the final bundle.

## Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS combined with native CSS variables for theme management.
- **Visualizations:** Recharts, customized with bespoke tooltip components to adhere to the design system constraints.
- **Animations:** Framer Motion for declarative layout animations and micro-interactions.
- **Icons:** Lucide React for consistent, lightweight vector iconography.

## Directory Structure

The repository is structured to separate concerns and maximize reusability across pages:

- `/src/app/`
  Contains the application routing structure. Each primary feature (Dashboard, Transactions, Insights, Admin) has its own dedicated page component, keeping business logic isolated per route.
- `/src/components/common/`
  Holds universally used interactive elements. This includes navigation bars, sidebars, top-level layouts, and role toggle switches.
- `/src/components/ui/`
  Houses the purest, lowest-level building blocks. These components typically wrap standard HTML elements (buttons, inputs) with standardized design system classes.
- `/src/components/dashboard/` & `/src/components/transactions/`
  Feature-bound components holding layout compositions and complex interactive charts specific to those business domains.
- `/src/context/`
  Holds the global application state handlers, providing context boundaries for the deeply nested UI trees.
- `/src/services/`
  Stores the mock API service abstractions, ensuring that if and when a real backend is attached, the component layer remains unaffected.

## Design Patterns

Components follow an atomic-like design approach:
- Props are cleanly typed using TypeScript interfaces.
- Component definitions are localized, avoiding enormous "kitchen sink" files.
- Separation of Data and Presentation: Visual components remain relatively "dumb", receiving their data via the Context providers or upper-level page routing.
