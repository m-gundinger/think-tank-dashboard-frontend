import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
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
    `workspaces/${workspaceId}/projects/${projectId}/views`,
    payload
  );

  return data;
}

export function useCreateView(workspaceId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<any, { projectId: string; viewData: any }>({
    mutationFn: ({ projectId, viewData }) =>
      createView({ workspaceId, projectId, viewData }),
    successMessage: "New view created successfully.",
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["views", variables.projectId],
      });
    },
  });
}