import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AppDispatch, RootState } from "../store";
import { createTask, updateTask } from "../store/taskSlice";
import { Task, CreateTaskData, UpdateTaskData } from "../types/task";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .nonempty("Task name is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .nonempty("Description is required"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z
    .custom<Dayjs>(
      (value) =>
        dayjs.isDayjs(value) &&
        (value.isAfter(dayjs(), "day") || value.isSame(dayjs(), "day")),
      {
        message: "Due date must be in the future",
      }
    )
    .refine(
      (value) =>
        dayjs.isDayjs(value) &&
        (value.isBefore(dayjs().add(2, "year"), "day") ||
          value.isSame(dayjs().add(2, "year"), "day")),
      {
        message: "Due date must be within 2 years from today",
      }
    ),
  completed: z.boolean(),
});

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task;
  mode: "create" | "edit";
}

interface FormData {
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: Dayjs;
  completed: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, task, mode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.tasks);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      priority: "medium",
      dueDate: dayjs().add(1, "day"),
      completed: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && task) {
        reset({
          name: task.name,
          description: task.description,
          priority: task.priority,
          dueDate: dayjs(task.dueDate),
          completed: task.completed,
        });
      } else {
        reset({
          name: "",
          description: "",
          priority: "medium",
          dueDate: dayjs().add(1, "day"),
          completed: false,
        });
      }
    }
  }, [open, mode, task, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === "create") {
        const createData: CreateTaskData = {
          name: data.name,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate.toISOString(),
          completed: data.completed,
        };
        await dispatch(createTask(createData)).unwrap();
      } else if (mode === "edit" && task) {
        const hasChanged =
          data.name !== task.name ||
          data.description !== task.description ||
          data.priority !== task.priority ||
          !data.dueDate.isSame(dayjs(task.dueDate), "day") ||
          data.completed !== task.completed;
        if (!hasChanged) {
          onClose();
          return;
        }
        const updateData: UpdateTaskData = {
          name: data.name,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate.toISOString(),
          completed: data.completed,
        };
        await dispatch(
          updateTask({ id: task.id, updates: updateData })
        ).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="h2">
          {mode === "create" ? "Create New Task" : "Edit Task"}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={loading}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={loading}
                />
              )}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Priority"
                  fullWidth
                  error={!!errors.priority}
                  helperText={errors.priority?.message}
                  disabled={loading}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Due Date"
                  minDate={dayjs()}
                  maxDate={dayjs().add(2, "year")}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dueDate,
                      helperText: errors.dueDate?.message,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="completed"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      disabled={loading}
                      color="primary"
                    />
                  }
                  label="Mark as complete"
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {mode === "create" ? "Create Task" : "Update Task"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
