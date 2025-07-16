import React, { useState, useEffect, useMemo } from "react";
import { GetServerSideProps } from "next";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, Alert, Snackbar } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { AppDispatch, RootState, loadState } from "../store";
import {
  fetchTasks,
  searchTasks,
  updateTask,
  softDeleteTask,
  hardDeleteTask,
  undeleteTask,
  clearError,
  hydrateState,
  setSearchTerm,
  setFilterPriority,
  setFilterStatus,
  setSortBy,
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
    filteredTasks,
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
  const [isMounted, setIsMounted] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [hardDeletingTaskId, setHardDeletingTaskId] = useState<string | null>(
    null
  );
  const [undeletingTaskId, setUndeletingTaskId] = useState<string | null>(null);

  // Calculate active operations early and consistently
  const hasActiveTaskOperations = useMemo(() => {
    return (
      updatingTaskId !== null ||
      deletingTaskId !== null ||
      hardDeletingTaskId !== null ||
      undeletingTaskId !== null
    );
  }, [updatingTaskId, deletingTaskId, hardDeletingTaskId, undeletingTaskId]);

  useEffect(() => {
    setIsMounted(true);

    const persistedState = loadState();
    if (persistedState && persistedState.tasks.tasks.length > 0) {
      dispatch(hydrateState(persistedState.tasks.tasks));
      dispatch(setSearchTerm(persistedState.tasks.searchTerm));
      dispatch(setFilterPriority(persistedState.tasks.filterPriority));
      dispatch(setFilterStatus(persistedState.tasks.filterStatus));
      dispatch(setSortBy(persistedState.tasks.sortBy));
    } else if (initialTasks.length > 0) {
      dispatch(hydrateState(initialTasks));
    }
  }, [dispatch, initialTasks]);

  useEffect(() => {
    if (isMounted && tasks.length === 0) {
      dispatch(fetchTasks());
    }
  }, [dispatch, tasks.length, isMounted]);

  useEffect(() => {
    if (isMounted && tasks.length > 0 && !hasActiveTaskOperations) {
      dispatch(
        searchTasks({
          searchTerm,
          filterPriority,
          filterStatus,
          sortBy,
          silent: false,
        })
      );
    }
  }, [
    dispatch,
    searchTerm,
    filterPriority,
    filterStatus,
    sortBy,
    isMounted,
    tasks.length,
    hasActiveTaskOperations,
  ]);

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

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

  const refreshSearch = () => {
    dispatch(
      searchTasks({
        searchTerm,
        filterPriority,
        filterStatus,
        sortBy,
        silent: true,
      })
    );
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      setDeletingTaskId(taskToDelete);
      await dispatch(softDeleteTask(taskToDelete));
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
      setDeletingTaskId(null);
      refreshSearch();
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
      refreshSearch();
    }
  };

  const handleUndeleteTask = async (taskId: string) => {
    setUndeletingTaskId(taskId);
    await dispatch(undeleteTask(taskId));
    setUndeletingTaskId(null);
    refreshSearch();
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    setUpdatingTaskId(taskId);
    await dispatch(updateTask({ id: taskId, updates: { completed } }));
    setUpdatingTaskId(null);
    refreshSearch();
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    dispatch(clearError());
  };

  const isFiltered =
    searchTerm.length > 0 || filterPriority !== "all" || filterStatus !== "all";

  const displayTasks = !isMounted
    ? initialTasks
    : isFiltered && filteredTasks.length >= 0
    ? filteredTasks
    : tasks;

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

        {(!isMounted || (loading && tasks.length === 0)) && (
          <LoadingSpinner message="Loading tasks..." />
        )}

        {/* {searchLoading &&
          !loading &&
          !hasActiveTaskOperations &&
          updatingTaskId === null &&
          deletingTaskId === null &&
          hardDeletingTaskId === null &&
          undeletingTaskId === null && (
            <LoadingSpinner message="Searching tasks..." />
          )} */}

        {isMounted && !loading && displayTasks.length === 0 && (
          <EmptyState onCreateTask={handleCreateTask} isFiltered={isFiltered} />
        )}

        {isMounted &&
          (!loading || tasks.length > 0) &&
          displayTasks.length > 0 && (
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
              {displayTasks.map((task) => (
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
