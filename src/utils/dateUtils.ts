import dayjs from "dayjs";

export const formatDate = (
  date: string | Date,
  format: string = "MMM DD, YYYY"
): string => {
  if (typeof window === "undefined") {
    return dayjs(date).format(format);
  }

  return dayjs(date).format(format);
};

export const isOverdue = (date: string | Date): boolean => {
  return dayjs(date).isBefore(dayjs(), "day");
};

export const isDueSoon = (date: string | Date): boolean => {
  return dayjs(date).isBetween(dayjs(), dayjs().add(3, "day"), "day", "[]");
};
