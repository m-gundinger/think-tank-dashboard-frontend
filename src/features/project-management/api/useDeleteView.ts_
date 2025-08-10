import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface DeleteViewParams {
  workspaceId: string;
  projectId: string;
  viewId: string;
}

async function deleteView({
  workspaceId,
  projectId,
  viewId,
}: DeleteViewParams): Promise<void> {
  await api.delete(
    `workspaces/${workspaceId}/projects/${projectId}/views/${viewId}`
  );
}

export function useDeleteView(workspaceId: string, projectId: string) {
  return useApiMutation<void, string>({
    mutationFn: (viewId) => deleteView({ workspaceId, projectId, viewId }),
    successMessage: "View deleted successfully.",
    invalidateQueries: [["views", projectId]],
  });
}