import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";
import { TasksState } from "../types/task";

export const loadState = (): { tasks: TasksState } | undefined => {
  try {
    if (typeof window === "undefined") return undefined;
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) return undefined;
    const parsedState = JSON.parse(serializedState);

    if (parsedState && parsedState.tasks) {
      return {
        tasks: {
          tasks: parsedState.tasks.tasks || [],
          filteredTasks: parsedState.tasks.filteredTasks || [],
          searchTerm: parsedState.tasks.searchTerm || "",
          filterPriority: parsedState.tasks.filterPriority || "all",
          filterStatus: parsedState.tasks.filterStatus || "all",
          sortBy: parsedState.tasks.sortBy || "priority-high-low",
          loading: false,
          searchLoading: false,
          error: null,
          lastUpdated: parsedState.tasks.lastUpdated || 0,
        },
      };
    }
    return undefined;
  } catch (err) {
    console.warn("Could not load state from localStorage:", err);
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
  // Remove preloadedState to prevent hydration mismatches
  // We'll handle initial state in the component instead
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const saveState = (state: RootState) => {
  try {
    if (typeof window === "undefined") return;
    const serializedState = JSON.stringify({
      tasks: {
        tasks: state.tasks.tasks,
        filteredTasks: state.tasks.filteredTasks,
        searchTerm: state.tasks.searchTerm,
        filterPriority: state.tasks.filterPriority,
        filterStatus: state.tasks.filterStatus,
        sortBy: state.tasks.sortBy,
        lastUpdated: state.tasks.lastUpdated,
      },
    });
    localStorage.setItem("reduxState", serializedState);
  } catch (err) {
    console.warn("Could not save state to localStorage:", err);
  }
};

store.subscribe(() => {
  saveState(store.getState());
});
