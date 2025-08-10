import { useApiResource } from "@/hooks/useApiResource";
import { Dashboard } from "@/types";

export function useManageDashboards(scope?: {
  workspaceId?: string;
  projectId?: string;
}) {
  const { resourceUrl, resourceKey } = useApiResource.constructUrlAndKey({
    scope: "dashboards",
    workspaceId: scope?.workspaceId,
    projectId: scope?.projectId,
  });

  return useApiResource<Dashboard>(resourceUrl, resourceKey);
}