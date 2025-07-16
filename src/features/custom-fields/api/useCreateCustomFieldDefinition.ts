import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface CreateParams {
  workspaceId: string;
  projectId: string;
  definitionData: any;
}

async function createCustomFieldDefinition({
  workspaceId,
  projectId,
  definitionData,
}: CreateParams): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/custom-fields`,
    definitionData
  );
  return data;
}

export function useCreateCustomFieldDefinition(
  workspaceId: string,
  projectId: string
) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: (definitionData) =>
      createCustomFieldDefinition({ workspaceId, projectId, definitionData }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customFieldDefinitions", projectId],
      });
    },
  });
}
