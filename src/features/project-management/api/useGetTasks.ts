import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ListTasksQuery, Task, PaginatedResponse } from "@/types";

interface UseGetTasksParams {
  scope: "user" | "project";
  workspaceId?: string;
  projectId?: string;
  query: ListTasksQuery;
  enabled?: boolean;
}

const fetchTasks = async ({
  scope,
  workspaceId,
  projectId,
  query,
}: UseGetTasksParams): Promise<PaginatedResponse<Task>> => {
  let url: string;
  if (scope === "project") {
    if (!workspaceId || !projectId) {
      throw new Error(
        "Workspace and Project IDs are required for project scope."
      );
    }
    url = `/workspaces/${workspaceId}/projects/${projectId}/tasks`;
  } else {
    url = "/tasks/my-tasks";
  }

  const { data } = await api.get(url, { params: query });
  return data;
};

export const useGetTasks = ({
  scope,
  workspaceId,
  projectId,
  query,
  enabled = true,
}: UseGetTasksParams) => {
  const queryKey =
    scope === "project" ? ["tasks", projectId, query] : ["myTasks", query];

  return useQuery({
    queryKey,
    queryFn: () => fetchTasks({ scope, workspaceId, projectId, query }),
    enabled: enabled && (scope === "user" || (!!workspaceId && !!projectId)),
  });
};
