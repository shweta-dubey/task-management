import { NextApiRequest, NextApiResponse } from "next";
import { Task, UpdateTaskData } from "../../../types/task";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
} from "../../../utils/localStorage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  if (req.method === "PUT") {
    try {
      const updates: UpdateTaskData = req.body;

      // Add small delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 500));
      const tasks = loadTasksFromStorage();
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
      }

      const updatedTask: Task = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      tasks[taskIndex] = updatedTask;
      saveTasksToStorage(tasks);
      return res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      return res.status(500).json({ error: "Failed to update task" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Add small delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 500));
      const tasks = loadTasksFromStorage();
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
      }

      tasks.splice(taskIndex, 1);
      saveTasksToStorage(tasks);
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ error: "Failed to delete task" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
