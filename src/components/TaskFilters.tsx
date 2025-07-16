import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "../store";
import {
  setSearchTerm,
  setFilterPriority,
  setFilterStatus,
  setSortBy,
} from "../store/taskSlice";

interface TaskFiltersProps {
  totalTasks: number;
  completedTasks: number;
  deletedTasks: number;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  totalTasks,
  completedTasks,
  deletedTasks,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchTerm, filterPriority, filterStatus, sortBy } = useSelector(
    (state: RootState) => state.tasks
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handlePriorityFilterChange = (event: { target: { value: string } }) => {
    dispatch(
      setFilterPriority(event.target.value as "all" | "low" | "medium" | "high")
    );
  };

  const handleStatusFilterChange = (event: { target: { value: string } }) => {
    dispatch(
      setFilterStatus(
        event.target.value as "all" | "completed" | "pending" | "deleted"
      )
    );
  };

  const handleSortChange = (event: { target: { value: string } }) => {
    dispatch(
      setSortBy(
        event.target.value as
          | "priority-high-low"
          | "priority-low-high"
          | "newest-first"
          | "oldest-first"
      )
    );
  };

  const handleStatusChipClick = (
    status: "all" | "completed" | "pending" | "deleted"
  ) => {
    dispatch(setFilterStatus(status));
  };

  const pendingTasks = totalTasks - completedTasks;

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" component="h2">
          Status
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip
            label={`Total: ${totalTasks}`}
            color={filterStatus === "all" ? "primary" : "default"}
            variant={filterStatus === "all" ? "filled" : "outlined"}
            size="small"
            data-testid="total-tasks"
            onClick={() => handleStatusChipClick("all")}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label={`Completed: ${completedTasks}`}
            color={filterStatus === "completed" ? "success" : "default"}
            variant={filterStatus === "completed" ? "filled" : "outlined"}
            size="small"
            data-testid="completed-tasks"
            onClick={() => handleStatusChipClick("completed")}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label={`Pending: ${pendingTasks}`}
            color={filterStatus === "pending" ? "warning" : "default"}
            variant={filterStatus === "pending" ? "filled" : "outlined"}
            size="small"
            data-testid="pending-tasks"
            onClick={() => handleStatusChipClick("pending")}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label={`Deleted: ${deletedTasks}`}
            color={filterStatus === "deleted" ? "error" : "default"}
            variant={filterStatus === "deleted" ? "filled" : "outlined"}
            size="small"
            data-testid="deleted-tasks"
            onClick={() => handleStatusChipClick("deleted")}
            sx={{ cursor: "pointer" }}
          />
        </Box>
      </Box>

      <Box display="flex" gap={2} flexWrap="wrap">
        <TextField
          label="Search tasks"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            flexGrow: 1,
            minWidth: 250,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Priority Filter</InputLabel>
          <Select
            value={filterPriority}
            onChange={handlePriorityFilterChange}
            label="Priority Filter"
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="all">All Priorities</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By"
            startAdornment={
              <InputAdornment position="start">
                <SortIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="priority-high-low">Priority: High to Low</MenuItem>
            <MenuItem value="priority-low-high">Priority: Low to High</MenuItem>
            <MenuItem value="newest-first">Newest First</MenuItem>
            <MenuItem value="oldest-first">Oldest First</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default TaskFilters;
