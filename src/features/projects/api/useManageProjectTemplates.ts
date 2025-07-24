import { useApiResource } from "@/hooks/useApiResource";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";

export function useManageProjectTemplates(
  workspaceId: string,
  projectId: string
) {
  const resource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/templates`,
    ["projectTemplates", projectId]
  );
  return resource;
}

interface CreateFromTemplateParams {
  workspaceId: string;
  templateId: string;
  name: string;
}

async function createProjectFromTemplate({
  workspaceId,
  templateId,
  name,
}: CreateFromTemplateParams): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/project-templates/${templateId}/create-project`,
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
