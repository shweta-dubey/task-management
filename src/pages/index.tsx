import React, { useState, useEffect, useMemo } from "react";
import { GetServerSideProps } from "next";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, Fab, Alert, Snackbar } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { AppDispatch, RootState, loadState } from "../store";
import {
  fetchTasks,
  updateTask,
  deleteTask,
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

export default function HomePage({}: HomePageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error, searchTerm, filterPriority } = useSelector(
    (state: RootState) => state.tasks
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    const persistedState = loadState();
    if (persistedState) {
      dispatch(hydrateState(persistedState.tasks.tasks));
    }
    setIsHydrated(true);
  }, [dispatch]);

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

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchTerm, filterPriority]);

  const completedTasks = useMemo(() => {
    return tasks.filter((task) => task.completed).length;
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
      await dispatch(deleteTask(taskToDelete));
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
      setDeletingTaskId(null);
    }
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

  const isFiltered = searchTerm.length > 0 || filterPriority !== "all";

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
            Task Management
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
          totalTasks={tasks.length}
          completedTasks={completedTasks}
        />

        {(!isHydrated || (loading && tasks.length === 0)) && (
          <LoadingSpinner message="Loading tasks..." />
        )}

        {isHydrated && !loading && filteredTasks.length === 0 && (
          <EmptyState onCreateTask={handleCreateTask} isFiltered={isFiltered} />
        )}

        {isHydrated &&
          (!loading || tasks.length > 0) &&
          filteredTasks.length > 0 && (
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
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                  loading={
                    updatingTaskId === task.id || deletingTaskId === task.id
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
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={confirmDeleteTask}
          onCancel={() => setDeleteConfirmOpen(false)}
          confirmText="Delete"
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
  return {
    props: {
      initialTasks: [],
    },
  };
};
