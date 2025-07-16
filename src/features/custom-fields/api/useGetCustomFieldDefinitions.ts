import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getCustomFieldDefinitions(
  workspaceId: string,
  projectId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/custom-fields`
  );
  return data;
}

export function useGetCustomFieldDefinitions(
  workspaceId: string,
  projectId: string
) {
  return useQuery({
    queryKey: ["customFieldDefinitions", projectId],
    queryFn: () => getCustomFieldDefinitions(workspaceId, projectId),
    enabled: !!workspaceId && !!projectId,
  });
}

async function getCustomFieldDefinition(
  workspaceId: string,
  projectId: string,
  customFieldId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/custom-fields/${customFieldId}`
  );
  return data;
}

export function useGetCustomFieldDefinition(
  workspaceId: string,
  projectId: string,
  customFieldId: string | null
) {
  return useQuery({
    queryKey: ["customFieldDefinition", customFieldId],
    queryFn: () =>
      getCustomFieldDefinition(workspaceId, projectId, customFieldId!),
    enabled: !!workspaceId && !!projectId && !!customFieldId,
  });
}
