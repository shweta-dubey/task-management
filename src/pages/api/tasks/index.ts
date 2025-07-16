import { NextApiRequest, NextApiResponse } from "next";
import { Task, CreateTaskData } from "../../../types/task";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  generateId,
} from "../../../utils/localStorage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Add small delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 500));
      const tasks = loadTasksFromStorage();
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      return res.status(500).json({ error: "Failed to load tasks" });
    }
  } else if (req.method === "POST") {
    try {
      const taskData: CreateTaskData = req.body;

      if (
        !taskData.name ||
        !taskData.description ||
        !taskData.priority ||
        !taskData.dueDate
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newTask: Task = {
        id: generateId(),
        name: taskData.name,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        completed: taskData.completed || false,
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add small delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 500));
      const tasks = loadTasksFromStorage();
      tasks.push(newTask);
      saveTasksToStorage(tasks);
      return res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({ error: "Failed to create task" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
