import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface CreateViewParams {
  workspaceId: string;
  projectId: string;
  viewData: any;
}

async function createView({
  workspaceId,
  projectId,
  viewData,
}: CreateViewParams): Promise<any> {
  const payload = {
    ...viewData,
    projectId: projectId,
  };
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/views`,
    payload
  );

  return data;
}

export function useCreateView(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, { projectId: string; viewData: any }>({
    mutationFn: ({ projectId, viewData }) =>
      createView({ workspaceId, projectId, viewData }),
    onSuccess: (_, variables) => {
      toast.success("New view created successfully.");
      queryClient.invalidateQueries({
        queryKey: ["views", variables.projectId],
      });
    },
    onError: (error: any) => {
      toast.error("Failed to create view", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
