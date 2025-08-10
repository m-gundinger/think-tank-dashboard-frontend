import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getReportingOverview(scope?: {
  workspaceId?: string;
  projectId?: string;
}) {
  let url = "/reporting/global";
  if (scope?.projectId) {
    url = `/reporting/projects/${scope.projectId}`;
  } else if (scope?.workspaceId) {
    url = `/reporting/workspaces/${scope.workspaceId}`;
  }
  const { data } = await api.get(url);
  return data;
}

export function useGetReportingData(scope?: {
  workspaceId?: string;
  projectId?: string;
}) {
  const queryKey = [
    "reportingOverview",
    scope?.workspaceId || "global",
    scope?.projectId,
  ].filter(Boolean);

  return useQuery({
    queryKey,
    queryFn: () => getReportingOverview(scope),
  });
}