import { useApiResource } from "@/hooks/useApiResource";
import { Job } from "@/types";

export function useManageJobs() {
  const resource = useApiResource<Job>("admin/jobs", ["jobs"]);
  return resource;
}