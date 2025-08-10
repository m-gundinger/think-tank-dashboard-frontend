import { useApiResource } from "@/hooks/useApiResource";
import { ListTasksQuery, Activity } from "@/types";

export function useGetActivities(
  scope: {
    workspaceId?: string;
    projectId?: string;
    taskId?: string;
  },
  query: Omit<ListTasksQuery, "includeSubtasks">
) {
  const { workspaceId, projectId, taskId } = scope;
  const resourceUrl = "activities";
  const resourceKey: (string | undefined)[] = [
    "activities",
    workspaceId,
    projectId,
    taskId,
  ];

  const combinedQuery = { ...query, workspaceId, projectId, taskId };

  const resource = useApiResource<Activity, ListTasksQuery>(
    resourceUrl,
    resourceKey
  );

  return resource.useGetAll(combinedQuery);
}