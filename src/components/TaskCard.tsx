import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Checkbox,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { Task } from "../types/task";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  loading?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  loading = false,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${
        Math.abs(diffDays) !== 1 ? "s" : ""
      }`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const isDueSoon = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  };

  const isOverdue = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    return date < now;
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          opacity: task.completed ? 0.7 : 1,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: (theme) => theme.shadows[8],
          },
          pointerEvents: loading ? "none" : undefined,
          filter: loading ? "grayscale(0.5) opacity(0.7)" : undefined,
        }}
        className="task-card"
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Typography
              variant="h6"
              component="h3"
              sx={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "text.secondary" : "text.primary",
                wordBreak: "break-word",
                flexGrow: 1,
                mr: 1,
              }}
            >
              {task.name}
            </Typography>
            <Chip
              label={
                task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
              }
              color={
                getPriorityColor(task.priority) as
                  | "error"
                  | "warning"
                  | "success"
                  | "default"
              }
              size="small"
              variant="outlined"
            />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              textDecoration: task.completed ? "line-through" : "none",
              wordBreak: "break-word",
            }}
          >
            {task.description}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            {task.completed ? (
              <>
                <CheckCircleIcon fontSize="small" color="success" />
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ fontWeight: 600 }}
                >
                  Completed
                </Typography>
              </>
            ) : (
              <>
                <ScheduleIcon fontSize="small" color="action" />
                <Typography
                  variant="body2"
                  color={
                    isOverdue(task.dueDate) && !task.completed
                      ? "error"
                      : isDueSoon(task.dueDate) && !task.completed
                      ? "warning.main"
                      : "text.secondary"
                  }
                  sx={{
                    fontWeight:
                      isDueSoon(task.dueDate) && !task.completed ? 600 : 400,
                  }}
                >
                  {formatDueDate(task.dueDate)}
                </Typography>
              </>
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={task.completed}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleComplete(task.id, e.target.checked);
              }}
              color="primary"
              disabled={loading}
            />
            <Typography variant="body2" color="text.secondary">
              {task.completed ? "Completed" : "Mark as done"}
            </Typography>
          </Box>

          <Box>
            <Tooltip title="Edit task">
              <span>
                <IconButton
                  onClick={() => onEdit(task)}
                  color="primary"
                  size="small"
                  aria-label="Edit task"
                  disabled={loading}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete task">
              <span>
                <IconButton
                  onClick={() => onDelete(task.id)}
                  color="error"
                  size="small"
                  aria-label="Delete task"
                  disabled={loading}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </CardActions>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(255,255,255,0.7)",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default TaskCard;
