import { useApiResource } from "@/hooks/useApiResource";
import { Job } from "@/types";

export function useManageJobs() {
  return useApiResource<Job>("admin/jobs", ["jobs"]);
}