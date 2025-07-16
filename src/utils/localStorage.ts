import { Task } from "../types/task";
import fs from "fs";
import path from "path";

const STORAGE_KEY = "tasks";
const FILE_PATH = path.join(process.cwd(), "tasks.json");

export const loadTasksFromStorage = (): Task[] => {
  if (typeof window === "undefined") {
    // Server-side: use file system
    try {
      if (fs.existsSync(FILE_PATH)) {
        const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
        return JSON.parse(fileContent);
      }
      return [];
    } catch (error) {
      console.error("Error loading tasks from file:", error);
      return [];
    }
  } else {
    // Client-side: use localStorage
    try {
      const serializedTasks = localStorage.getItem(STORAGE_KEY);
      if (serializedTasks === null) return [];
      return JSON.parse(serializedTasks);
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      return [];
    }
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  if (typeof window === "undefined") {
    // Server-side: use file system
    try {
      fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
    } catch (error) {
      console.error("Error saving tasks to file:", error);
    }
  } else {
    // Client-side: use localStorage
    try {
      const serializedTasks = JSON.stringify(tasks);
      localStorage.setItem(STORAGE_KEY, serializedTasks);
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};
