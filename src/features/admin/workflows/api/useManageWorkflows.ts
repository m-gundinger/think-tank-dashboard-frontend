import { useApiResource } from "@/hooks/useApiResource";
import { Workflow } from "@/types";

export function useManageWorkflows() {
  return useApiResource<Workflow>("admin/workflows", ["workflows"]);
}