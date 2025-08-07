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
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

export const formatDateForServer = (
  date: Date | null | undefined
): string | null => {
  if (!date) return null;
  return date.toISOString();
};

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

export function truncate(text: string, length: number): string {
  if (!text) {
    return "";
  }
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + "...";
}