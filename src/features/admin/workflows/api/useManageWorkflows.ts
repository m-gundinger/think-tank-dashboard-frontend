import { useApiResource } from "@/hooks/useApiResource";

export function useManageWorkflows() {
  const resource = useApiResource("admin/workflows", ["workflows"]);
  return resource;
}
