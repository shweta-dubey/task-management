import React, { useState, useEffect, useMemo } from "react";
import { GetServerSideProps } from "next";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, Fab, Alert, Snackbar } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { AppDispatch, RootState, loadState } from "../store";
import {
  fetchTasks,
  updateTask,
  softDeleteTask,
  hardDeleteTask,
  undeleteTask,
  clearError,
  hydrateState,
} from "../store/taskSlice";
import { Task } from "../types/task";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import ConfirmDialog from "../components/ConfirmDialog";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

interface HomePageProps {
  initialTasks: Task[];
}

export default function HomePage({ initialTasks }: HomePageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    tasks,
    loading,
    error,
    searchTerm,
    filterPriority,
    filterStatus,
    sortBy,
  } = useSelector((state: RootState) => state.tasks);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [hardDeleteConfirmOpen, setHardDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [taskToHardDelete, setTaskToHardDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [hardDeletingTaskId, setHardDeletingTaskId] = useState<string | null>(
    null
  );
  const [undeletingTaskId, setUndeletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    const persistedState = loadState();
    if (persistedState) {
      dispatch(hydrateState(persistedState.tasks.tasks));
    } else if (initialTasks.length > 0) {
      dispatch(hydrateState(initialTasks));
    }
    setIsHydrated(true);
  }, [dispatch, initialTasks]);

  useEffect(() => {
    if (isHydrated && tasks.length === 0) {
      dispatch(fetchTasks());
    }
  }, [dispatch, tasks.length, isHydrated]);

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;

      let matchesStatus = true;
      switch (filterStatus) {
        case "completed":
          matchesStatus = task.completed && !task.deleted;
          break;
        case "pending":
          matchesStatus = !task.completed && !task.deleted;
          break;
        case "deleted":
          matchesStatus = task.deleted;
          break;
        case "all":
        default:
          matchesStatus = true;
          break;
      }

      return matchesSearch && matchesPriority && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority-high-low":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "priority-low-high":
          const priorityOrderLow = { high: 3, medium: 2, low: 1 };
          return priorityOrderLow[a.priority] - priorityOrderLow[b.priority];
        case "newest-first":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest-first":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          const defaultOrder = { high: 3, medium: 2, low: 1 };
          return defaultOrder[b.priority] - defaultOrder[a.priority];
      }
    });

    return filtered;
  }, [tasks, searchTerm, filterPriority, filterStatus, sortBy]);

  const completedTasks = useMemo(() => {
    return tasks.filter((task) => task.completed && !task.deleted).length;
  }, [tasks]);

  const deletedTasks = useMemo(() => {
    return tasks.filter((task) => task.deleted).length;
  }, [tasks]);

  const activeTasks = useMemo(() => {
    return tasks.filter((task) => !task.deleted).length;
  }, [tasks]);

  const handleCreateTask = () => {
    setFormMode("create");
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setFormMode("edit");
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      setDeletingTaskId(taskToDelete);
      await dispatch(softDeleteTask(taskToDelete));
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
      setDeletingTaskId(null);
    }
  };

  const handleHardDeleteTask = (taskId: string) => {
    setTaskToHardDelete(taskId);
    setHardDeleteConfirmOpen(true);
  };

  const confirmHardDeleteTask = async () => {
    if (taskToHardDelete) {
      setHardDeletingTaskId(taskToHardDelete);
      await dispatch(hardDeleteTask(taskToHardDelete));
      setHardDeleteConfirmOpen(false);
      setTaskToHardDelete(null);
      setHardDeletingTaskId(null);
    }
  };

  const handleUndeleteTask = async (taskId: string) => {
    setUndeletingTaskId(taskId);
    await dispatch(undeleteTask(taskId));
    setUndeletingTaskId(null);
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    setUpdatingTaskId(taskId);
    await dispatch(updateTask({ id: taskId, updates: { completed } }));
    setUpdatingTaskId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    dispatch(clearError());
  };

  const isFiltered =
    searchTerm.length > 0 || filterPriority !== "all" || filterStatus !== "all";

  return (
    <Layout title="Task Management - Home">
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1" color="primary">
            Tasks
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTask}
              size="large"
            >
              Add Task
            </Button>
          </Box>
        </Box>

        <TaskFilters
          totalTasks={activeTasks}
          completedTasks={completedTasks}
          deletedTasks={deletedTasks}
        />

        {(!isHydrated || (loading && tasks.length === 0)) && (
          <LoadingSpinner message="Loading tasks..." />
        )}

        {isHydrated && !loading && filteredAndSortedTasks.length === 0 && (
          <EmptyState onCreateTask={handleCreateTask} isFiltered={isFiltered} />
        )}

        {isHydrated &&
          (!loading || tasks.length > 0) &&
          filteredAndSortedTasks.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {filteredAndSortedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onHardDelete={handleHardDeleteTask}
                  onUndelete={handleUndeleteTask}
                  onToggleComplete={handleToggleComplete}
                  loading={
                    updatingTaskId === task.id ||
                    deletingTaskId === task.id ||
                    hardDeletingTaskId === task.id ||
                    undeletingTaskId === task.id
                  }
                />
              ))}
            </Box>
          )}

        <Fab
          color="primary"
          aria-label="add task"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
          onClick={handleCreateTask}
        >
          <AddIcon />
        </Fab>

        <TaskForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          task={editingTask}
          mode={formMode}
        />

        <ConfirmDialog
          open={deleteConfirmOpen}
          title="Delete Task"
          message="Are you sure you want to delete this task? This will mark it as deleted."
          onConfirm={confirmDeleteTask}
          onCancel={() => setDeleteConfirmOpen(false)}
          confirmText="Delete"
          confirmColor="error"
        />

        <ConfirmDialog
          open={hardDeleteConfirmOpen}
          title="Permanently Delete Task"
          message="Are you sure you want to permanently delete this task? This action cannot be undone and the task will be removed forever."
          onConfirm={confirmHardDeleteTask}
          onCancel={() => setHardDeleteConfirmOpen(false)}
          confirmText="Delete Forever"
          confirmColor="error"
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { loadTasksFromStorage } = await import("../utils/localStorage");

  try {
    const tasks = loadTasksFromStorage();
    return {
      props: {
        initialTasks: tasks,
      },
    };
  } catch (error) {
    console.error("Error loading tasks on server:", error);
    return {
      props: {
        initialTasks: [],
      },
    };
  }
};
