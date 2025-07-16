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
      await new Promise((resolve) => setTimeout(resolve, 500));
      let tasks = loadTasksFromStorage();

      // Extract query parameters
      const { search, priority, status, sortBy } = req.query;

      // Apply search filter
      if (search && typeof search === "string") {
        const searchTerm = search.toLowerCase();
        tasks = tasks.filter(
          (task) =>
            task.name.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
      }

      // Apply priority filter
      if (priority && priority !== "all" && typeof priority === "string") {
        tasks = tasks.filter((task) => task.priority === priority);
      }

      // Apply status filter
      if (status && status !== "all" && typeof status === "string") {
        switch (status) {
          case "completed":
            tasks = tasks.filter((task) => task.completed && !task.deleted);
            break;
          case "pending":
            tasks = tasks.filter((task) => !task.completed && !task.deleted);
            break;
          case "deleted":
            tasks = tasks.filter((task) => task.deleted);
            break;
        }
      }

      // Apply sorting
      if (sortBy && typeof sortBy === "string") {
        tasks.sort((a, b) => {
          switch (sortBy) {
            case "priority-high-low":
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            case "priority-low-high":
              const priorityOrderLow = { high: 3, medium: 2, low: 1 };
              return (
                priorityOrderLow[a.priority] - priorityOrderLow[b.priority]
              );
            case "newest-first":
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            case "oldest-first":
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            default:
              const defaultOrder = { high: 3, medium: 2, low: 1 };
              return defaultOrder[b.priority] - defaultOrder[a.priority];
          }
        });
      }

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
