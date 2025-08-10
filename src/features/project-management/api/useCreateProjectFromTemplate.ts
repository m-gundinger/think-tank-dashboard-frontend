import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";

interface CreateFromTemplateParams {
  templateId: string;
  name: string;
  workspaceId: string;
}

async function createProjectFromTemplate({
  templateId,
  name,
  workspaceId,
}: CreateFromTemplateParams): Promise<any> {
  const { data } = await api.post(
    `project-templates/${templateId}/create-project`,
    { name, workspaceId }
  );
  return data;
}

export function useCreateProjectFromTemplate(workspaceId: string) {
  return useApiMutation({
    mutationFn: (params: Omit<CreateFromTemplateParams, "workspaceId">) =>
      createProjectFromTemplate({ ...params, workspaceId }),
    successMessage: "Project created from template successfully!",
    invalidateQueries: [["projects", workspaceId]],
  });
}