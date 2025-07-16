import dayjs from "dayjs";

// Safe date formatting that prevents hydration errors
export const formatDate = (
  date: string | Date,
  format: string = "MMM DD, YYYY"
): string => {
  if (typeof window === "undefined") {
    // On server, return a consistent format
    return dayjs(date).format(format);
  }

  // On client, use the actual date
  return dayjs(date).format(format);
};

// Check if date is overdue
export const isOverdue = (dueDate: string): boolean => {
  return dayjs(dueDate).isBefore(dayjs(), "day");
};

// Check if date is due soon (within 3 days)
export const isDueSoon = (dueDate: string): boolean => {
  return dayjs(dueDate).isBefore(dayjs().add(3, "day"), "day");
};
