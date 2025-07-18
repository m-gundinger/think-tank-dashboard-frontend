// FILE: src/lib/utils.ts
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
