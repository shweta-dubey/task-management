export interface Task {
  id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed?: boolean;
}

export interface UpdateTaskData {
  id: string;
  updates: Partial<Omit<Task, "id" | "createdAt">>;
}

export interface TasksState {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
  searchTerm: string;
  filterPriority: "all" | "low" | "medium" | "high";
  filterStatus: "all" | "completed" | "pending" | "deleted";
  sortBy:
    | "priority-high-low"
    | "priority-low-high"
    | "newest-first"
    | "oldest-first";
  lastUpdated: number;
}
