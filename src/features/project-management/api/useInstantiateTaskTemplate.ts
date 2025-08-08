import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface InstantiateTemplateParams {
  templateId: string;
  workspaceId?: string;
  projectId?: string;
}

async function instantiateTemplate({
  templateId,
  workspaceId,
  projectId,
}: InstantiateTemplateParams): Promise<any> {
  const { data } = await api.post(`task-templates/${templateId}/instantiate`, {
    workspaceId,
    projectId,
  });
  return data;
}

export function useInstantiateTaskTemplate(
  workspaceId?: string,
  projectId?: string
) {
  const invalidateKeys = projectId ? [["tasks", projectId]] : [["myTasks"]];

  return useApiMutation<any, { templateId: string }>({
    mutationFn: ({ templateId }) =>
      instantiateTemplate({ templateId, workspaceId, projectId }),
    successMessage: "Task created from template.",
    invalidateQueries: invalidateKeys,
  });
}