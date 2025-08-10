import { useApiResource } from "@/hooks/useApiResource";
import { Report } from "@/types";

type ListReportsQuery = {
  page?: number;
  limit?: number;
  sortBy?: "title" | "status" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string;
  workspaceId?: string;
  projectId?: string;
  taskId?: string;
};

export function useManageReports() {
  const resource = useApiResource<Report, ListReportsQuery>("reports", [
    "reports",
  ]);
  return resource;
}