import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";

interface EmptyStateProps {
  onCreateTask: () => void;
  isFiltered?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  onCreateTask,
  isFiltered = false,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        py: 8,
        px: 4,
        textAlign: "center",
        backgroundColor: "grey.50",
        borderRadius: 2,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        {isFiltered ? (
          <SearchIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
        ) : (
          <AddIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
        )}

        <Typography variant="h6" color="text.secondary" gutterBottom>
          {isFiltered ? "No tasks match your search" : "No tasks yet"}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 400 }}
        >
          {isFiltered
            ? "Try adjusting your search terms or filters to find what you're looking for."
            : "Get started by creating your first task. Stay organized and boost your productivity!"}
        </Typography>

        {!isFiltered && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateTask}
            size="large"
          >
            Create Your First Task
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default EmptyState;
