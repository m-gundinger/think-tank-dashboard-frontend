import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface InstantiateParams {
  workspaceId: string;
  projectId: string;
  templateId: string;
}

async function instantiateTemplate({
  workspaceId,
  projectId,
  templateId,
}: InstantiateParams): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/task-templates/${templateId}/instantiate`
  );
  return data;
}

export function useInstantiateTaskTemplate(
  workspaceId: string,
  projectId: string
) {
  return useApiMutation({
    mutationFn: (templateId: string) =>
      instantiateTemplate({ workspaceId, projectId, templateId }),
    successMessage: "Task created from template.",
    invalidateQueries: [["tasks", projectId]],
  });
}