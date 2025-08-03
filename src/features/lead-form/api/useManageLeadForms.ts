import { useApiResource } from "@/hooks/useApiResource";

export function useManageLeadForms(workspaceId: string, projectId: string) {
  const resource = useApiResource(
    `workspaces/${workspaceId}/projects/${projectId}/lead-forms`,
    ["leadForms", projectId]
  );
  return resource;
}
