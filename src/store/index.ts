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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const saveState = (state: RootState) => {
  try {
    if (typeof window === "undefined") return;
    const serializedState = JSON.stringify({
      tasks: {
        tasks: state.tasks.tasks,
        searchTerm: state.tasks.searchTerm,
        filterPriority: state.tasks.filterPriority,
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
