import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UpdateParams {
  workspaceId: string;
  projectId: string;
  customFieldId: string;
  definitionData: any;
}

async function updateCustomFieldDefinition({
  workspaceId,
  projectId,
  customFieldId,
  definitionData,
}: UpdateParams): Promise<any> {
  const { data } = await api.put(
    `/workspaces/${workspaceId}/projects/${projectId}/custom-fields/${customFieldId}`,
    definitionData
  );
  return data;
}

export function useUpdateCustomFieldDefinition(
  workspaceId: string,
  projectId: string
) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, { customFieldId: string; data: any }>({
    mutationFn: ({ customFieldId, data }) =>
      updateCustomFieldDefinition({
        workspaceId,
        projectId,
        customFieldId,
        definitionData: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customFieldDefinitions", projectId],
      });
    },
  });
}
