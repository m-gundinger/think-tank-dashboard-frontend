import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import config from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAbsoluteUrl(
  relativePath?: string | null
): string | undefined {
  if (!relativePath) {
    return undefined;
  }
  if (
    relativePath.startsWith("http://") ||
    relativePath.startsWith("https://")
  ) {
    return relativePath;
  }
  const backendUrl = new URL(config.apiBaseUrl).origin;
  return `${backendUrl}${relativePath}`;
}

export const parseServerDate = (
  dateString: string | null | undefined
): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const formatDateForServer = (
  date: Date | null | undefined
): string | null => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T00:00:00.000Z`;
};
