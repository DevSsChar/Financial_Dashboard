import { Transaction } from "@/data/seedTransactions";

export type ApiStatus = "idle" | "loading" | "success" | "error";

export type AppState = {
  transactions: Transaction[];
  apiStatus: ApiStatus;
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

export const initialFilters: AppState["filters"] = {
  search: "",
  type: "all",
  category: "",
  dateFrom: "",
  dateTo: "",
  amountMin: "",
  amountMax: "",
  tags: [],
  sortBy: "date",
  sortDir: "desc",
  groupBy: "none",
};

export const initialState: AppState = {
  transactions: [],
  apiStatus: "idle",
  apiError: null,
  role: "viewer",
  filters: initialFilters,
  theme: "light",
};

export type Action =
  | { type: "SET_API_STATUS"; payload: ApiStatus }
  | { type: "SET_API_ERROR"; payload: string | null }
  | { type: "LOAD_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "ADD_TRANSACTION_ROLLBACK"; payload: string } 
  | { type: "EDIT_TRANSACTION"; payload: Transaction }
  | { type: "EDIT_TRANSACTION_ROLLBACK"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "DELETE_TRANSACTION_ROLLBACK"; payload: Transaction }
  | { type: "SET_ROLE"; payload: "viewer" | "admin" }
  | { type: "SET_FILTER"; payload: Partial<AppState["filters"]> }
  | { type: "RESET_FILTERS" }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "RESET_ALL" };

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_API_STATUS":
      return { ...state, apiStatus: action.payload };
    case "SET_API_ERROR":
      return { ...state, apiError: action.payload };
    case "LOAD_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "ADD_TRANSACTION_ROLLBACK":
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "EDIT_TRANSACTION_ROLLBACK":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "DELETE_TRANSACTION":
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case "DELETE_TRANSACTION_ROLLBACK":
      // Prepend it since order sorting happens anyway, or ideally revert to exact position, but it sorts in UI
      return { ...state, transactions: [...state.transactions, action.payload] };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "RESET_FILTERS":
      return { ...state, filters: initialFilters };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "RESET_ALL":
      return { ...initialState, theme: state.theme }; // Keep theme preference
    default:
      return state;
  }
}
