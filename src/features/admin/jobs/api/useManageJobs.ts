import { useApiResource } from "@/hooks/useApiResource";

export function useManageJobs() {
  const resource = useApiResource("admin/jobs", ["jobs"]);
  return resource;
}
