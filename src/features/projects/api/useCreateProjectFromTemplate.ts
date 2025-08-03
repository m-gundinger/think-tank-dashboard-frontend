import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";

interface CreateFromTemplateParams {
  workspaceId: string;
  templateId: string;
  name: string;
}

async function createProjectFromTemplate({
  templateId,
  name,
}: CreateFromTemplateParams): Promise<any> {
  const { data } = await api.post(
    `admin/project-templates/${templateId}/create-project`,
    { name }
  );
  return data;
}

export function useCreateProjectFromTemplate(workspaceId: string) {
  return useApiMutation({
    mutationFn: (params: Omit<CreateFromTemplateParams, "workspaceId">) =>
      createProjectFromTemplate({ workspaceId, ...params }),
    successMessage: "Project created from template successfully!",
    invalidateQueries: [["projects", workspaceId]],
  });
}