import { NextApiRequest, NextApiResponse } from "next";
import { UpdateTaskData } from "../../../types/task";
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

      await new Promise((resolve) => setTimeout(resolve, 500));
      const tasks = loadTasksFromStorage();
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
      }

      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      saveTasksToStorage(tasks);
      return res.status(200).json(tasks[taskIndex]);
    } catch (error) {
      console.error("Error updating task:", error);
      return res.status(500).json({ error: "Failed to update task" });
    }
  } else if (req.method === "DELETE") {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const tasks = loadTasksFromStorage();
      const filteredTasks = tasks.filter((task) => task.id !== id);

      if (filteredTasks.length === tasks.length) {
        return res.status(404).json({ error: "Task not found" });
      }

      saveTasksToStorage(filteredTasks);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ error: "Failed to delete task" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
