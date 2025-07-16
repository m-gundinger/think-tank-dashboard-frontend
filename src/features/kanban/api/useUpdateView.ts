import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

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
  return useMutation<any, AxiosError, { viewId: string; viewData: any }>({
    mutationFn: ({ viewId, viewData }) =>
      updateView({ workspaceId, projectId, viewId, viewData }),
    onSuccess: (_, variables) => {
      toast.success("View updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["views", projectId] });
      queryClient.invalidateQueries({ queryKey: ["view", variables.viewId] });
    },
    onError: (error: any) => {
      toast.error("Failed to update view", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
