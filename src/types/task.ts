export interface Task {
  id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filterPriority: "all" | "low" | "medium" | "high";
}
