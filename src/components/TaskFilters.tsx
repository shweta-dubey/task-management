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
} from "@mui/icons-material";
import { AppDispatch, RootState } from "../store";
import { setSearchTerm, setFilterPriority } from "../store/taskSlice";

interface TaskFiltersProps {
  totalTasks: number;
  completedTasks: number;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  totalTasks,
  completedTasks,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchTerm, filterPriority } = useSelector(
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
          Task Filters
        </Typography>
        <Box display="flex" gap={1}>
          <Chip
            label={`Total: ${totalTasks}`}
            color="primary"
            variant="outlined"
            size="small"
            data-testid="total-tasks"
          />
          <Chip
            label={`Completed: ${completedTasks}`}
            color="success"
            variant="outlined"
            size="small"
            data-testid="completed-tasks"
          />
          <Chip
            label={`Pending: ${pendingTasks}`}
            color="warning"
            variant="outlined"
            size="small"
            data-testid="pending-tasks"
          />
        </Box>
      </Box>

      <Box display="flex" gap={2} flexWrap="wrap">
        <TextField
          label="Search tasks..."
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
      </Box>
    </Paper>
  );
};

export default TaskFilters;
