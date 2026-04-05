# State Management Approach

The application handles significant interactive state entirely on the client, minimizing prop-drilling without reaching for overly complex external libraries.

## Core Strategy

Zorvyn eschews heavyweight external libraries like Redux in favor of React's native `useContext` paired with `useReducer`. This approach provides a sufficient level of robust event handling while maintaining a minimal footprint.

## The AppContext

A global `AppContext` provider sits near the top level of the application tree. It encompasses:
1. **The Transaction Dataset:** The central source of truth for all chart and ledger components.
2. **Global Application State:** Managing details like the current toggled role ("Viewer" or "Admin").

## Optimistic Updates and Reducers

When an "Admin" adds a new transaction, the application must feel instantly responsive, despite the simulated integration with asynchronous APIs. 

1. **Immediate Dispatch:** The UI immediately constructs a new transaction payload and dispatches an `ADD_TRANSACTION` action to the reducer.
2. **Reducer Handling:** The reducer appends this record to the central data store, instantly causing all dependent components (charts, lists, recent summaries) to re-render.
3. **Simulated Backend Verification:** A simulated mock service (`mockApi`) intercepts the request, running a small delay to imitate network latency.
4. **Rollback Mechanisms:** If the mock API returns an error, the system relies on an `ADD_TRANSACTION_ROLLBACK` event, utilizing a snapshot of the prior state or an explicit removal of the failed transaction ID to cleanly revert the UI.

This structure guarantees the user never feels blocked by network speeds unless explicitly mandated, yielding a fluid user experience.
