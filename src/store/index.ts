import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";
import { TasksState } from "../types/task";

// Load state from localStorage with proper typing
export const loadState = (): { tasks: TasksState } | undefined => {
  try {
    if (typeof window === "undefined") return undefined;
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) return undefined;
    const parsedState = JSON.parse(serializedState);

    // Ensure the state structure matches what we expect
    if (parsedState && parsedState.tasks) {
      return {
        tasks: {
          tasks: parsedState.tasks.tasks || [],
          searchTerm: parsedState.tasks.searchTerm || "",
          filterPriority: parsedState.tasks.filterPriority || "all",
          loading: false,
          error: null,
        },
      };
    }
    return undefined;
  } catch (err) {
    console.warn("Could not load state from localStorage:", err);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
  // Remove preloadedState to prevent hydration mismatch
  // preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Save state to localStorage
export const saveState = (state: RootState) => {
  try {
    if (typeof window === "undefined") return;
    const serializedState = JSON.stringify({
      tasks: {
        tasks: state.tasks.tasks,
        searchTerm: state.tasks.searchTerm,
        filterPriority: state.tasks.filterPriority,
        // Don't persist loading and error states
      },
    });
    localStorage.setItem("reduxState", serializedState);
  } catch (err) {
    console.warn("Could not save state to localStorage:", err);
  }
};

// Subscribe to store updates and save to localStorage
store.subscribe(() => {
  saveState(store.getState());
});
