import { useApiResource } from "@/hooks/useApiResource";

export function useManageWidgets(dashboardId: string) {
  const resourceUrl = `dashboards/${dashboardId}/widgets`;
  const resourceKey = ["dashboard", dashboardId, "widgets"];
  const resource = useApiResource(resourceUrl, resourceKey);

  return {
    ...resource,
    resourceUrl,
    resourceKey,
  };
}