import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, View } from "@/types";

interface UseGetViewsParams {
  scope: "user" | "project";
  workspaceId?: string;
  projectId?: string;
  enabled?: boolean;
}

const fetchViews = async ({
  scope,
  workspaceId,
  projectId,
}: UseGetViewsParams): Promise<PaginatedResponse<View>> => {
  let url: string;
  if (scope === "project") {
    if (!workspaceId || !projectId) {
      throw new Error("Workspace and Project IDs are required for project scope.");
    }
    url = `/workspaces/${workspaceId}/projects/${projectId}/views`;
  } else {
    url = "/views";
  }

  const { data } = await api.get(url);
  return data;
};

export const useGetViews = ({
  scope,
  workspaceId,
  projectId,
  enabled = true,
}: UseGetViewsParams) => {
  const queryKey =
    scope === "project" ? ["views", projectId] : ["myViews"];

  return useQuery({
    queryKey,
    queryFn: () => fetchViews({ scope, workspaceId, projectId }),
    enabled: enabled && (scope === "user" || (!!workspaceId && !!projectId)),
  });
};