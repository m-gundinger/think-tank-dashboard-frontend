import { useApiResource } from "@/hooks/useApiResource";
import { Workflow } from "@/types";

export function useManageWorkflows() {
  const resource = useApiResource<Workflow>("admin/workflows", ["workflows"]);
  return resource;
}