import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

async function instantiateTemplate({
  templateId,
}: {
  templateId: string;
}): Promise<any> {
  const { data } = await api.post(`task-templates/${templateId}/instantiate`);
  return data;
}

export function useInstantiateTaskTemplate(projectId: string) {
  return useApiMutation({
    mutationFn: (templateId: string) => instantiateTemplate({ templateId }),
    successMessage: "Task created from template.",
    invalidateQueries: [["tasks", projectId]],
  });
}
