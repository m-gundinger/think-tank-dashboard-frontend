import { useApiResource } from "@/hooks/useApiResource";
import { Dashboard, ListTasksQuery } from "@/types";

export function useManageDashboards(scope?: {
  workspaceId?: string;
  projectId?: string;
}) {
  let resourceUrl = "dashboards";
  let resourceKey: (string | undefined)[] = ["dashboards"];

  if (scope?.projectId && scope?.workspaceId) {
    resourceUrl = `workspaces/${scope.workspaceId}/projects/${scope.projectId}/dashboards`;
    resourceKey.push(scope.projectId);
  } else if (scope?.workspaceId) {
    resourceUrl = `workspaces/${scope.workspaceId}/dashboards`;
    resourceKey.push(scope.workspaceId);
  } else {
    // User-level or global dashboards
    resourceKey.push("user");
  }

  const resource = useApiResource<Dashboard, ListTasksQuery>(
    resourceUrl,
    resourceKey
  );

  return resource;
}
