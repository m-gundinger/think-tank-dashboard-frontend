import { useApiResource } from "@/hooks/useApiResource";

export function useManageProjects(workspaceId: string) {
  const resource = useApiResource(`workspaces/${workspaceId}/projects`, [
    "projects",
    workspaceId,
  ]);
  return resource;
}