import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateViewParams {
  workspaceId: string;
  projectId: string;
  viewId: string;
  viewData: any;
}

async function updateView({
  workspaceId,
  projectId,
  viewId,
  viewData,
}: UpdateViewParams): Promise<any> {
  const { data } = await api.put(
    `/workspaces/${workspaceId}/projects/${projectId}/views/${viewId}`,
    viewData
  );
  return data;
}

export function useUpdateView(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<any, { viewId: string; viewData: any }>({
    mutationFn: ({ viewId, viewData }) =>
      updateView({ workspaceId, projectId, viewId, viewData }),
    successMessage: "View updated successfully.",
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["views", projectId] });
      queryClient.invalidateQueries({ queryKey: ["view", variables.viewId] });
    },
  });
}