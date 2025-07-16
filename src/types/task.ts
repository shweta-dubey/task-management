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

export interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean;
  deleted?: boolean;
}

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
