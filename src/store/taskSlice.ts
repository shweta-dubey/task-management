import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task, CreateTaskData, UpdateTaskData } from "../types/task";
import { saveState } from "./index";

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filterPriority: "all" | "low" | "medium" | "high";
  filterStatus: "all" | "completed" | "pending" | "deleted";
  sortBy:
    | "priority-high-low"
    | "priority-low-high"
    | "newest-first"
    | "oldest-first";
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  searchTerm: "",
  filterPriority: "all",
  filterStatus: "all",
  sortBy: "priority-high-low",
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const tasks = await response.json();
      return tasks;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch tasks"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: CreateTaskData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      const task = await response.json();
      return task;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    { id, updates }: { id: string; updates: UpdateTaskData },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      const task = await response.json();
      return task;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update task"
      );
    }
  }
);

export const softDeleteTask = createAsyncThunk(
  "tasks/softDeleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleted: true }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      const task = await response.json();
      return task;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete task"
      );
    }
  }
);

export const undeleteTask = createAsyncThunk(
  "tasks/undeleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleted: false }),
      });
      if (!response.ok) {
        throw new Error("Failed to restore task");
      }
      const task = await response.json();
      return task;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to restore task"
      );
    }
  }
);

export const hardDeleteTask = createAsyncThunk(
  "tasks/hardDeleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to permanently delete task");
      }
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to permanently delete task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete task"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterPriority: (
      state,
      action: PayloadAction<"all" | "low" | "medium" | "high">
    ) => {
      state.filterPriority = action.payload;
    },
    setFilterStatus: (
      state,
      action: PayloadAction<"all" | "completed" | "pending" | "deleted">
    ) => {
      state.filterStatus = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<
        | "priority-high-low"
        | "priority-low-high"
        | "newest-first"
        | "oldest-first"
      >
    ) => {
      state.sortBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    hydrateState: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        saveState({ tasks: state });
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        saveState({ tasks: state });
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(softDeleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(softDeleteTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        saveState({ tasks: state });
      })
      .addCase(softDeleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(undeleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(undeleteTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        saveState({ tasks: state });
      })
      .addCase(undeleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(hardDeleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hardDeleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        saveState({ tasks: state });
      })
      .addCase(hardDeleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        saveState({ tasks: state });
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchTerm,
  setFilterPriority,
  setFilterStatus,
  setSortBy,
  clearError,
  hydrateState,
} = taskSlice.actions;
export default taskSlice.reducer;
